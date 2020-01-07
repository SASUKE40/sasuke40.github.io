---
title: 尝试用 Rust + Yew 写高性能前端页面
tags:
  - Rust
  - Yew
  - Frontend
date: 2020-01-05
---

# 前言

看到这篇文章，可能很多人会有个疑问：“已经有 React + TypeScript 这么好的组合，为什么还想着使用 Rust 来写前端页面，不折腾吗？”
首先值得讨论的一点，接下来几年的前端方向有哪些？
个人的愚见，在全栈领域必然是 serverless，我在业务开发中已经尝到甜头，高效、简便、心智负担很低了；而在 Web 领域，由于 2019 年 12 月 5 日— 万维网联盟（W3C）宣布 WebAssembly 核心规范成为正式标准，WASM 势必它的影响力会逐步提升。
WASM 的框架 / 库的选择已经比较丰富了，如：C# + Blazor、Go + Vugu、Rust + Yew 等等。
可能有人会问，为什么不能使用 TypeScript / JavaScript 来编译到 WASM，归根结底是因为 WASM 要求语言必须是静态强类型。当然可以魔改 TypeScript / JavaScript 做到这一点，例如 AssemblyScript / TurboScript 就是如此在 TypeScript / JavaScript 上做静态规范的。与其如此魔改，我个人觉得倒不如大大方方的使用静态强类型语言来编译到 WASM，反正魔改后也无法共享原有的生态。
那么为什么选择 Rust 而不是其他的诸如 Go、C#、C / C++ 呢？这个确实没有很有说服力的理由，只是出于个人的技术偏好，或者说是受到 RY 使用 Rust 实现 Deno 的鼓舞吧。

# 准备

## 环境陈述

我使用的是 macOS，很多人自然会想到使用 homebrew 来完成 Rust 环境 setup。一开始我也是这么做的，不过会遇到下面问题：

```
error[E0463]: can't find crate for `std` | = note: the `wasm32-unknown-unknown` target may not be installed
```

最后还是走官方推荐的方式解决的。

## Rust Installation

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## Yew Installation

```
cargo install wasm-pack
cargo install cargo-web
```

<img width="850" alt="Screen Shot 2020-01-04 at 10 39 02 PM" src="https://user-images.githubusercontent.com/3114495/71768267-99f34400-2f4f-11ea-927f-9f919876c04f.png">
<img width="850" alt="Screen Shot 2020-01-04 at 10 39 16 PM" src="https://user-images.githubusercontent.com/3114495/71768269-9a8bda80-2f4f-11ea-8e2f-4fba76bfd7fd.png">

# 上手

## 一些说明

Rust 本身就能实现编译到 WASM，使用 Yew 框架的原因就如其官网宣传：只是为了方便前端组件整合，以及对 JavaScript 互通性的考量。

## 项目初始化

这里不采用官网提供的参考，因为示例过于简单，有些脱离真正应用场景。下面的步骤是我个人认为比较接近真实开发的状态，相关源码我也放到 GitHub 供大家玩耍 ➡️https://github.com/SASUKE40/yew-starter

```
git clone --depth=1 https://github.com/SASUKE40/yew-starter.git <project_name>
```

## 目录结构

```
.
├── Cargo.lock
├── Cargo.toml
├── LICENSE
├── README.md
├── index.html
├── index.js
├── package-lock.json
├── package.json
└── src
    ├── app.rs
    └── lib.rs
```

这里面最重要的就是 `Cargo.toml` 了，其中最关键的依赖如下：

```toml
[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
yew = "0.10.0"
```

`cdylib`  是用于配置构建 C interoperability(C FFI)，`wasm-bindgen` 依赖是用于 WASM 模块和 JavaScript 之间的交互粘合。

## 加载 WASM 以及 bind 的过程

```rust
mod app;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn run_app() -> Result<(), JsValue> {
  yew::start_app::<app::App>();
  Ok(())
}
```

在需要导出 Rust 函数到 JavaScript 中，只需要在函数方法上注释 `#[wasm_bindgen]` 即可，接着在 js 文件中导入使用

```js
import { run_app } from './lib'
run_app()
```

## 构建套件

使用 Parcel 是最方便的，开箱即用。既可以直接 import rs，也可以 import wasm。
![image](https://user-images.githubusercontent.com/3114495/71775834-453ce100-2fc2-11ea-8c66-27f19c0b8c98.png)
我这里用了 `parcel-plugin-wasm.rs` 插件完成 Cargo loader 的工作，和上述 import rs 的方式不同：

```js
import { run_app } from './Cargo.toml'
run_app()
```

## Yew 组件编写体验

Yew 框架使用 `html!` macro 来生成 HTML

```rust
impl Component for App {
    type Message = Msg;
    type Properties = ();

    fn create(_: Self::Properties, _: ComponentLink<Self>) -> Self {
        App {}
    }

    fn update(&mut self, _msg: Self::Message) -> ShouldRender {
        true
    }
    fn view(&self) -> Html<Self> {
        html! {
            <p>{ "Hello world!" }</p>
        }
    }
}
```

模板中可以使用 `html! { "Hello, World" }` 这样的方式包裹文本或变量，这和 jsx 比较类似。
事件绑定、条件、循环也都是类似的，大同小异：

```rust
// 点击事件
html!{
    <button onclick=|_| Msg::Click>{ "Click Me!" }</button>
}

// 条件渲染
html! {
  <div>
    {
      if show_link {
        html! {
          <a href="https://example.com">{"Link"}</a>
        }
      } else {
        html! {}
      }
    }
  </div>
}

// 迭代渲染
html! {
    <ul class="item-list">
        { for self.props.items.iter().map(renderItem) }
    </ul>
}
```

# 效果

Navigate to https://yew-starter.netlify.com/
![image](https://user-images.githubusercontent.com/3114495/71775897-ffcce380-2fc2-11ea-85f8-c3fbae3099e2.png)
实际上 WASM 没有大家相信的那么“便携小巧”，WASM 吃掉的体积有 50kb。

# 总结

其优势：

- WebAssembly 在桌面客户端移植到 Web 不可或缺
- 作为胶水包存在，如某面包姐姐最近就在尝试 Rust 2 WASM(CPP) 2 Node.js
  其疑点：
- 高性能，感觉没有很突出到必须得这么做
- 可移植性，要做 Web 的 JVM？

WASM 的生态日趋丰富完善，未来 WASM 在前端必然会大放异彩。不过也无需夸大其地位，可以参考 [WebAssembly 的出现是否会取代 JavaScript？](https://www.zhihu.com/question/322007706/answer/741764049)这个知乎回答。摘抄官方对其定位的[一个回答](https://webassembly.org/docs/faq/)：WebAssembly 旨在作为 JavaScript 的补充而不是替代。
![image](https://user-images.githubusercontent.com/3114495/71776039-49b6c900-2fc5-11ea-9bab-23f88030bfa8.png)
通宵写文，求 🌟🌟 求关注，不胜感激 ⬇️
https://github.com/SASUKE40/yew-starter
