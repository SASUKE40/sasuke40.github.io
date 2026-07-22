---
title: "深入 Pi Agent"
description: "从 Agent 循环、上下文构建、工具与会话，到扩展、终端 UI、压缩和 Skills，全面解析 Pi 的内部架构。"
slug: pi-agent-internal
date: 2026-07-21T00:00:00-07:00
author: Edward Elric
tags:
  - AI Agent
  - Pi
  - TypeScript
  - LLM
categories:
  - AI
  - 工程
---

Pi 是一个极简的编程 Agent，但“极简”并不意味着简单。它默认只提供少量工具，背后却包含了一套很值得研究的架构，可以帮助我们理解一个生产级终端 Agent 是如何工作的。

本文将从内到外拆解 Pi：核心循环、发送给模型的上下文、会话持久化、工具执行、扩展、提示词组装、终端界面、上下文压缩以及 Skills。目的不仅是理解 Pi，也是提炼出能够复用到其他 Agent 中的设计模式。

## Pi 的两个主要层次

理解 Pi 最简单的方法，是先把它划分为两个概念层。

第一层是 **Agent Core**。它负责面向模型的运行时，包括对话状态、模型流式输出、工具调用、工具结果、取消操作，以及持续执行直到模型完成任务的循环。

第二层是 **Pi Interactive**，也就是构建在核心之上的用户侧编程环境。它增加了终端 UI、持久化会话、上下文压缩、项目指令、扩展、Skills、命令以及多种运行模式。

在这两个概念层之下，Pi 的 TypeScript Monorepo 又通过四个包划分职责：

| 包 | 职责 |
| --- | --- |
| `pi-ai` | 为多个 LLM Provider 提供统一的流式接口 |
| `pi-agent-core` | 有状态的 Agent 与工具调用循环 |
| `pi-tui` | 终端组件与差量渲染 |
| `pi-coding-agent` | 会话、提示词、Skills、扩展、工具与用户侧运行模式 |

这种拆分很重要，因为 TUI 并不等于 Agent。相同的核心可以嵌入其他程序、通过 RPC 暴露，或者配合完全不同的界面使用。Provider 特有的行为也被限制在循环下层，因此切换模型不需要重写会话或 UI 逻辑。

## Agent 核心循环

Pi 的中心，是大多数工具型 Agent 都会使用的反馈循环：

1. 准备当前上下文。
2. 将上下文流式发送给模型。
3. 收集 Assistant 回复。
4. 执行模型请求的工具。
5. 把工具结果追加到对话。
6. 再次调用模型。
7. 当模型给出最终答案或运行被终止时停止。

简化后的伪代码如下：

```ts
while (true) {
  const assistantMessage = await streamModel(context)
  const toolCalls = findToolCalls(assistantMessage)

  if (toolCalls.length === 0) break

  const results = await executeTools(toolCalls)
  context.messages.push(...results)
}
```

生产实现可以通过强类型事件被完整观察。事件流描述了 Agent、Turn、Message 和 Tool 的生命周期：

```text
agent_start
  turn_start
    message_start -> message_update* -> message_end
    tool_execution_start -> tool_execution_update* -> tool_execution_end
  turn_end
agent_end
```

循环只负责发出“发生了什么”，而不决定“如何展示”。终端可以渲染事件，JSON 客户端可以序列化事件，会话管理器可以持久化事件，测试也可以验证它们的顺序。

这个看似简单的循环背后还隐藏着几个重要细节：

- **执行前检查：** Pi 会解析工具、验证参数，并在执行前运行相关 Hook。
- **并行执行：** 相互独立的工具调用可以并发运行，例如同时读取或搜索多个文件，从而降低延迟。
- **有序结果：** 即使工具完成顺序不同，写入对话前也会恢复为模型最初的调用顺序。
- **统一取消：** 同一个 Abort Signal 协调模型流、工具和更高层的会话操作。
- **显式终止：** 工具可以声明无需再次调用模型。

Pi 还区分 **Steering** 和 **Follow-up** 输入。Steering 会在下一个安全边界改变当前运行方向；Follow-up 则等待当前运行稳定结束，再开启新的 Turn。两个独立队列让交互式输入的顺序更加可预测。

## 上下文初始化

模型无法直接看到代码仓库或会话。每次请求前，Pi 都必须构建一份代表当前相关状态的上下文。

上下文可能包括：

- 基础 System Prompt；
- 全局和项目级指令；
- 工具名称、描述与参数 Schema；
- 会话历史中的当前活动路径；
- 当前用户消息及附件；
- 相关 Skill 指令；
- 扩展提供或转换后的上下文。

Pi 刻意保持基础提示词精简。专门行为通过环境逐层加入，而不是永久写进一个巨大的提示词中。这样更容易追踪规则来自哪里，也能让同一个 Agent 适配不同的仓库。

在内部，Pi 可以保留 UI 通知、摘要和扩展数据等应用专用消息类型。向 Provider 发出请求前，`convertToLlm` 管线才会把这些丰富消息投影成模型接受的 User、Assistant 和 Tool Result Schema。

这个边界避免了把外部 API 格式变成整个应用的数据结构：

```text
应用消息
  -> 上下文转换
  -> convertToLlm
  -> Provider 兼容上下文
```

## 记忆：会话与对话状态

Session 为 Agent 提供连续性。编程任务很少在一次回复后结束：Agent 需要读取文件、形成假设、修改代码、执行命令、检查错误并继续迭代。每一步都依赖之前发生的事情。

Pi 使用 JSON Lines 存储会话。它便于追加和检查，而父节点引用则把对话变成一棵树，而不是扁平的聊天记录。

树结构支持非常符合实际工程过程的工作方式：

- 返回之前的决策点，同时保留后续消息；
- 从同一点尝试另一种实现；
- 总结不再活动的分支；
- 沿父节点链接重建当前对话。

### 使用 `/tree` 浏览记忆

`/tree` 命令会打开当前会话的树形导航器。我们可以选择任何较早的记录并从那里继续。Pi 不会删除它后面的消息；下一条消息只会从选中的记录创建另一个子节点，于是新旧后续内容会成为同一个会话中的兄弟分支。

![输入 Pi 的 tree 命令以浏览和切换会话分支](pi-tree-command.png)

*输入 `/tree` 会打开会话树导航器；连续按两次 Escape 也可以快速进入同一个界面。*

每条存储记录都有 `id` 和 `parentId`。当前对话就是从根节点到所选叶节点之间的路径。当我们跳到旧记录并继续时，新记录会指向这个旧节点，而不是之前的叶节点：

```text
会话根节点
└── 用户：实现功能
    └── Assistant：方案 A
        ├── 用户：继续方案 A       <- 原分支
        └── 用户：尝试方案 B       <- 使用 /tree 后创建的分支
```

由于两条路径都保存在同一个文件中，`/tree` 很适合在不丢失早期工作的情况下探索不同方案。离开一个分支时，Pi 还可以总结该路径，并把摘要附加到目标位置。如果多个方案仍属于同一个会话，应使用 `/tree`；如果新路径需要独立的会话文件，则更适合使用 `/fork` 或 `/clone`。

### JSONL 记忆存储在哪里

Pi 会自动把会话保存到：

```text
~/.pi/agent/sessions/--<working-directory>--/<timestamp>_<uuid>.jsonl
```

工作目录会被编码为目录名。例如，在 `/Users/edward` 启动的会话会出现在 `~/.pi/agent/sessions/--Users-edward--/` 下，如图所示。

![Pi 的 JSONL 会话文件以及它在按工作目录划分的 sessions 目录中的位置](pi-jsonl-session.png)

*JSONL 文件适合追加：每一行都是一条会话记录，其中可以包含模型切换、Thinking Level 变化、用户消息、Assistant 消息和用量元数据。*

截图也展示了树的编码方式。每一行都有自己的 `id`，大部分行还包含当前分支中前一个节点的 `parentId`。沿着父节点链接即可重建活动历史；拥有相同祖先的记录则代表不同分支。这就是 Pi 能在单个 JSONL 文件中保留全部历史，同时浏览对话树的原因。

持久化 Session 和模型 Context 是两个刻意分离的对象。Session 回答“发生过什么”，Context 回答“模型下一步决策需要看到什么”。分离之后，Pi 可以保留完整记录，同时只向模型展示活动分支以及理解它所需的摘要。

## 工具：Agent 如何作用于外部世界

模型可以生成文本和结构化请求，但不能直接读取文件、搜索仓库或执行测试。Tool 是模型与环境之间的桥梁。

Pi 默认使用一组刻意保持精简的编程工具：Read、Write、Edit 和 Bash。其他能力可以通过扩展添加。每个工具都会暴露名称、描述、参数 Schema 和执行函数。Schema 会进入模型上下文，让模型知道有哪些操作以及应如何请求它们。

### 源码中的基础工具

Pi 在 [`tools/index.ts`](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/src/core/tools/index.ts) 中组装默认工具。去掉外围细节后，工厂函数非常直接：

```ts
export function createCodingTools(cwd: string): AgentTool[] {
  return [
    createReadTool(cwd),
    createBashTool(cwd),
    createEditTool(cwd),
    createWriteTool(cwd),
  ]
}
```

每个工厂都返回同样的 `AgentTool` Contract，因此核心循环不需要为文件操作或 Shell 命令编写特殊逻辑。[`read` 工具](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/src/core/tools/read.ts) 是一个很好的例子。下面的改写版本去掉图片处理、截断和 TUI 渲染，只保留最核心的结构：

```ts
const readSchema = Type.Object({
  path: Type.String({ description: "File path, relative or absolute" }),
  offset: Type.Optional(Type.Number({ description: "First line, starting at 1" })),
  limit: Type.Optional(Type.Number({ description: "Maximum lines to return" })),
})

function createReadToolDefinition(cwd: string): ToolDefinition {
  return {
    name: "read",
    label: "read",
    description: "Read text files or images, with bounded output.",
    parameters: readSchema,

    async execute(_id, { path, offset, limit }, signal) {
      if (signal?.aborted) throw new Error("Operation aborted")

      const absolutePath = await resolveReadPathAsync(path, cwd)
      const text = await fs.readFile(absolutePath, "utf8")
      const lines = text.split("\n")
      const start = Math.max(0, (offset ?? 1) - 1)
      const selected = lines.slice(start, limit ? start + limit : undefined)

      return {
        content: [{ type: "text", text: selected.join("\n") }],
        details: { totalLines: lines.length },
      }
    },
  }
}

export function createReadTool(cwd: string): AgentTool {
  return wrapToolDefinition(createReadToolDefinition(cwd))
}
```

这个例子包含两个层次。`ToolDefinition` 包含面向模型的 Schema，以及提示词引导和 Renderer 等 Coding Agent 元数据。`wrapToolDefinition` 再把它投影成核心运行时所需的精简 `AgentTool` 接口：`name`、`description`、`parameters` 和 `execute`。

生产实现还包含真实工具所需的细节：可读路径检查、I/O 期间的 Abort Listener、图片检测与缩放、行数和字节截断、可替换的文件系统操作，以及自定义终端渲染。不过这些细节不会改变核心 Contract：输入经过验证，输出则是强类型文本或图片内容。

工具的生命周期也远不止调用一个 JavaScript 函数：

1. 模型流式生成工具调用及参数。
2. Pi 验证并准备调用。
3. 扩展可以检查、阻止或修改调用。
4. 工具接收 Abort Signal 执行，并可以流式报告进度。
5. Pi 将输出标准化成 Tool Result 消息。
6. 结果被加入上下文，供模型下一次调用使用。

安全策略也适合放在这个边界中。权限扩展可以在 Shell 命令执行前检查它；路径保护扩展可以拒绝修改 Secret 或生成文件。Agent 循环保持通用，而环境负责决定哪些操作被允许。

## 扩展

扩展可以添加行为，同时避免核心膨胀成一个固定的全能框架。扩展可以注册：

- 自定义工具和命令；
- 快捷键；
- 模型 Provider；
- 消息 Renderer 和 UI 组件；
- 事件处理器和工作流策略；
- 自定义压缩或会话行为。

扩展还能观察 Input、Context、模型请求、Session 和 Tool 周围的生命周期事件。例如，`before_agent_start` Hook 可以在循环开始前注入消息或修改已经组装好的提示词。Tool Hook 则可以实现审批、沙箱、审计或结果转换。

一个最小的工具扩展大致如下：

```ts
export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "deploy_preview",
    description: "Deploy the current branch to a preview environment",
    parameters: schema,
    async execute(toolCallId, params, signal, onUpdate) {
      // 执行工作，并可选择通过 onUpdate 发布进度。
      return { content: [{ type: "text", text: "Preview ready" }] }
    },
  })
}
```

这就是为什么 Pi 可以被称为一个 **反框架（Anti-Framework）**。它仍然有结构，但结构止于稳定的基础组件和生命周期边界。Pi 不会强制 Plan Mode、Sub-agent、权限或某一种项目工作流必须以唯一规定的方式实现。

这种灵活性也把责任转移给了用户。扩展运行在能够执行命令和修改文件的 Agent 内部，因此第三方代码仍然需要经过审查、版本固定和谨慎更新。

## System Prompt 与项目指令

System Prompt 定义 Agent 的基础行为：如何沟通、拥有哪些工具，以及应如何处理编程任务。Pi 再在其上逐层加入更具体的指令。

可以把它理解为：

1. Agent 基础行为
2. 全局用户与环境指令
3. `AGENTS.md` 等仓库指令
4. Skill 或扩展提供的指令
5. 当前用户请求

一个仓库可能要求使用 `uv` 管理 Python 依赖，另一个使用 `pnpm`，第三个还可能规定发布或测试清单。项目指令让相同的 Agent 运行时可以正确适应每个环境，而无需把这些约定全局硬编码。

组装过程也让定制行为变得可追踪。与其猜测一个黑盒产品为什么这样行动，开发者可以直接检查基础提示词、项目文件、已加载 Skills，以及共同组成最终上下文的扩展 Hook。

## Pi Interactive：终端 UI 层

Pi Interactive 是用户直接看到的层。它负责聊天输入、流式输出、工具进度、会话选择、命令、模型切换和中断。

流式终端界面比看起来更难实现。文本逐 Token 到达，工具同时更新进度，用户也可能仍在输入。每个事件都重绘整个屏幕会很慢，并造成明显闪烁。

Pi 的 TUI 使用差量渲染。它构建下一帧，与上一帧比较，再选择更新策略：追加新行、只替换发生变化的尾部，或者在必要时执行更大范围的重绘。这样既减少终端写入，也不牺牲正确性。

界面只是 Harness 周围的一个 Adapter。Pi 可以通过四种模式暴露相同的运行时：

- 供用户直接操作的交互式终端模式；
- 用于一次性命令和 Shell 脚本的 Print 模式；
- 用于消费事件流的 JSON 模式；
- 用于嵌入其他应用的 RPC 模式。

四种模式共享同一个 Harness，因此自动化场景不需要维护另一套功能缩水的 Agent 实现。

## 上下文压缩

长时间运行的会话最终会接近模型上下文上限。编程 Agent 尤其容易遇到这个问题，因为文件内容、命令输出、工具 Schema、系统指令、图片和生成 Token 都会占用空间。

默认情况下，Pi 会为模型的下一次回复保留 **16,384 个 Token**。[`shouldCompact`](https://github.com/earendil-works/pi/blob/main/packages/agent/src/harness/compaction/compaction.ts#L251) 会在估算上下文超过剩余预算时触发自动压缩：

```ts
const DEFAULT_COMPACTION_SETTINGS = {
  enabled: true,
  reserveTokens: 16384,
}

function shouldCompact(contextTokens: number, contextWindow: number) {
  return contextTokens > contextWindow - DEFAULT_COMPACTION_SETTINGS.reserveTokens
}
```

公式如下：

```text
触发压缩：
contextTokens > contextWindow - reserveTokens
```

对于上下文窗口为 128,000 Token 的模型，默认阈值就是 **111,616 个上下文 Token**。当估算值高于这个数字时，Pi 会进行压缩，把最后 16,384 个 Token 留给模型输出，而不是让输入占满整个窗口。`reserveTokens` 可以在 `~/.pi/agent/settings.json` 或项目的 `.pi/settings.json` 中配置：

```json
{
  "compaction": {
    "reserveTokens": 16384
  }
}
```

### Pi 如何估算 Token

Pi 不会在每次检查前，针对每条消息运行 Provider 专用 Tokenizer。[`estimateTokens`](https://github.com/earendil-works/pi/blob/main/packages/agent/src/harness/compaction/compaction.ts#L275) 使用一种保守的字符估算法：

```ts
function estimateTokens(message: AgentMessage): number {
  const chars = countMessageCharacters(message)
  return Math.ceil(chars / 4)
}
```

也就是说，Pi 按照大约 **每四个字符一个 Token** 进行估算。具体字符数取决于消息类型：

- User 和 Tool Result 消息计算文本内容；
- Assistant 消息计算文本、Thinking、工具名称和序列化后的工具参数；
- Bash 记录计算命令和输出；
- Branch 和 Compaction 记录计算摘要文本；
- 每张图片固定按 4,800 个字符估算，也就是大约 1,200 个 Token。

完整的 [`estimateContextTokens`](https://github.com/earendil-works/pi/blob/main/packages/agent/src/harness/compaction/compaction.ts#L220) 会优先使用最近一条 Assistant 消息中 Provider 报告的真实用量。然后只对该用量快照之后新增的消息使用 `字符数 / 4` 估算：

```text
上下文估算值 = Provider 最近一次报告的用量
             + ceil(后续消息字符数 / 4)
```

如果当前还没有 Provider 用量记录，则所有消息都使用 `ceil(字符数 / 4)` 估算。这种混合方法可以频繁运行，成本很低，同时又能在有真实数据时以 Provider 计数为基准。最终得到的 `contextTokens` 会与 `contextWindow - 16384` 比较。

Pi 会在下一次请求可能溢出上下文窗口之前进行压缩。较旧的活动被总结成更小的表示，同时保留继续工作所需的信息：

- 用户目标；
- 决策与约束；
- 相关文件和修改；
- 已完成的工作；
- 尚未解决的错误和阻塞项；
- 下一步计划。

摘要 Contract 定义在 [`compaction.ts`](https://github.com/earendil-works/pi/blob/main/packages/agent/src/harness/compaction/compaction.ts#L434) 中。Pi 使用两个职责不同的 Prompt。下面的精简版本保留了结构，也更容易看清它们的分工：

```ts
export const SUMMARIZATION_SYSTEM_PROMPT = `
Act only as a conversation summarizer.
Return a structured checkpoint; never continue or answer the conversation.
`

const SUMMARIZATION_PROMPT = `
Summarize the preceding conversation so another model can resume the work.

## Goal
## Constraints & Preferences
## Progress
### Done
### In Progress
### Blocked
## Key Decisions
## Next Steps
## Critical Context

Keep the checkpoint concise and retain precise technical identifiers.
`
```

`SUMMARIZATION_SYSTEM_PROMPT` 限定摘要模型的角色。这很重要，因为输入中包含真实对话、问题和指令，摘要模型只能描述它们，而不能执行它们。`SUMMARIZATION_PROMPT` 定义交接 Schema：目标、约束、已完成和进行中的工作、阻塞项、决策、下一步，以及安全恢复工作所需的详细信息。[完整源码 Prompt](https://github.com/earendil-works/pi/blob/main/packages/agent/src/harness/compaction/compaction.ts#L434) 还明确要求保留精确的文件路径、函数名和错误消息，避免它们在摘要过程中变得模糊。

在 `generateSummaryWithUsage` 内部，对话和 Prompt 大致按以下方式组装：

```ts
const messages = convertToLlm(currentMessages)
const history = serializeConversation(messages)
const userPrompt = `<conversation>\n${history}\n</conversation>\n\n${SUMMARIZATION_PROMPT}`

const summary = await completeSimpleWithRetries(models, model, {
  systemPrompt: SUMMARIZATION_SYSTEM_PROMPT,
  messages: [{ role: "user", content: [{ type: "text", text: userPrompt }] }],
})
```

如果已经存在之前的 Checkpoint，Pi 会改用更新 Prompt，把旧 Checkpoint 放进 `<previous-summary>` 标签，再要求模型把新进度合并进去。自定义压缩指令也可以作为额外关注点追加。完整流程如下：

```text
会话分支
  -> 选择旧消息和最近消息尾部
  -> 转换并序列化旧消息
  -> 生成或更新结构化 Checkpoint
  -> 存储 Checkpoint + 保留的消息尾部
  -> 使用 Checkpoint + 最近消息构建未来上下文
```

压缩并不需要破坏原始历史。Pi 可以追加一条摘要记录，并且只在构建未来模型上下文时，用它替代一段旧消息：

```text
持久化 Session：完整、只追加的历史
模型 Context：活动分支 + 压缩摘要 + 最近细节
```

这种区别让压缩更安全，也更容易推理。它改变的是模型看到的内容，而不是实际发生过的事情。

## Skills

Skill 是以 `SKILL.md` 文件为中心的可复用操作指令。它不仅提供背景知识，还可以规定要查看哪些文件、执行哪些命令、如何验证结果，以及在哪些位置需要获得批准。

与其让模型在每次会话中重新发现复杂流程，Skill 可以把流程变成可重复执行的能力。例如：准备发布、诊断 CI、生成文档，或遵守团队的 Review 清单。

Skill 也有助于控制提示词大小。Agent 启动时只需要一个紧凑目录，只有当某个 Skill 与任务相关时才加载完整指令。这样既能保持默认上下文精简，也不会向 Agent 隐藏专门工作流。

具体实现在 [`system-prompt.ts`](https://github.com/earendil-works/pi/blob/main/packages/agent/src/harness/system-prompt.ts) 中。下面是 `formatSkillsForSystemPrompt` 的简化版本，重点展示 Skill 被插入的位置：

```ts
export function formatSkillsForSystemPrompt(skills: Skill[]): string {
  const visible = skills.filter((skill) => !skill.disableModelInvocation)
  if (visible.length === 0) return ""

  return renderXml("available_skills", visible.map((skill) => ({
    name: skill.name,
    description: skill.description,
    location: skill.filePath,
  })))
}
```

真实函数会先输出相关指令，然后生成如下形式的 XML 目录：

```xml
<available_skills>
  <skill>
    <name>release</name>
    <description>Prepare and validate a project release</description>
    <location>/path/to/release/SKILL.md</location>
  </skill>
</available_skills>
```

需要注意，Pi **不会** 把每个 `SKILL.md` 的正文全部插入 System Prompt。它只插入允许模型调用的 Skill 的名称、描述和文件位置。外围提示词会告诉模型：当前任务与描述匹配时，再读取完整 Skill 文件。因此，Skill 加载分为两个阶段：

```text
启动阶段：发现 Skills -> 插入紧凑的元数据目录
运行阶段：匹配请求 -> 读取相关 SKILL.md -> 遵循其中指令
```

这种渐进加载设计可以节省上下文 Token。大型 Skill 库只会在 System Prompt 中增加一个很小的路由索引；只有 Agent 真正需要某个详细流程时，才会付出对应的上下文成本。标记了 `disableModelInvocation` 的 Skill 不会出现在索引中，因此它仍可被显式调用，但不会由模型自动选择。

扩展和 Skill 的区别也很有用：

| 机制 | 更适合的场景 |
| --- | --- |
| Extension | 新的可执行能力、Hook、集成或 UI 行为 |
| Skill | 教 Agent 如何使用已有能力的可重复指令 |

Extension 改变运行时“能做什么”，Skill 则告诉模型“何时以及如何去做”。

## 为什么这种架构有效

Pi 的架构之所以有效，是因为每项职责都有清晰可见的边界：

- Provider 层标准化模型流；
- Agent 循环协调推理与操作；
- Context Builder 决定模型应看到什么；
- Tool 把模型请求连接到外部环境；
- Session 保存完整的对话树；
- Extension 添加可选运行时行为；
- TUI 展示事件，但不拥有 Agent；
- Compaction 让长会话保持可用；
- Skill 封装可重复工作流。

这些概念单独看都不是 Pi 独有的。真正的价值来自把它们组合起来，同时不隐藏彼此之间的边界。

如果要从零构建一个编程 Agent，我会遵循同样的顺序：先实现强类型模型流，再构建最小且正确的工具循环；让每个生命周期转换都可被观察；将会话持久化与模型上下文分离；最后再增加提示词、扩展、压缩、Skills 和用户界面。

最核心的结论是：一个生产级 Agent 并不只是包裹在 LLM 外面的 System Prompt。它同时是并发运行时、工具调度器、上下文投影系统、持久化层和用户界面。Pi 容易理解，是因为它让每一个组成部分都保持足够小。

## 参考资料

- [视频：PI Agent Internals—Architecture, Loops, and the Anti-Framework](https://www.youtube.com/watch?v=llN-fnfwM9A)
- [Pi 源码](https://github.com/badlogic/pi-mono)
- [Pi Coding Agent 文档](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent/docs)
- [Pi 扩展示例](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent/examples/extensions)
- [参考文章：How Pi Works](https://alejandro-ao.com/pi-architecture/)
