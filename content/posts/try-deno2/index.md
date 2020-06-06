---
title: 试玩 deno2
slug: try-deno2
author: Edward Elric
hero: ./deno.png
tags:
  - deno
date: 2018-06-28
---

# <a name="c2pnvr"></a>前言

ry 近期把 <span data-type="color" style="color:rgb(26, 26, 26)"><span data-type="background" style="background-color:rgb(255, 255, 255)">deno 的第二版原型从 deno2 文件夹中转移到 src 上了，并初步完成之前定下针对 </span></span><span data-type="color" style="color:rgb(36, 41, 46)"><span data-type="background" style="background-color:rgb(255, 255, 255)">unprivileged 部分的改造目标：</span></span>

- Use the gn build system for fast builds, sane configuration, and easy linking into Chrome.
- Use V8 snapshots to improve startup time.
- Remove Golang. Although it has been working nicely, I am concerned the double GC will become a problem sometime down the road.
- Distribute a C++ library called libdeno, containing the snapshotted typescript runtime.
- Test the message passing and other functionality at that layer before involving higher level languages.
  翻译：
- 使用 [GN](https://link.zhihu.com/?target=https%3A//chromium.googlesource.com/chromium/src/%2B/master/tools/gn/docs/quick_start.md) 这个构建工具，这是 chromium 团队使用的构建工具
- 使用 V8 Snapshots 提升启动速度（已完成）
- **移除 Golang，**因为不想同时存在两个 GC（Go 和 TS）
- 弄了一个 C++ 库叫 libdeno，负责 TS 的运行时环境

# <a name="higrue"></a>试玩

## <a name="gkewza"></a>克隆 [Depot Tools](http://commondatastorage.googleapis.com/chrome-infra-docs/flat/depot_tools/docs/html/depot_tools_tutorial.html#_setting_up)

```bash
git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
```

## <a name="63qecv"></a>配置环境变量

这里我是把配置到 `.zshrc` 文件中

```bash
export PATH=$PATH:/path/to/depot_tools
```

## <a name="vxbdkn"></a>克隆仓库

```bash
git clone git@github.com:ry/deno.git
```

## <a name="tgyeyg"></a>进入到 src 文件夹

```bash
cd deno/src
```

## <a name="fnbzgv"></a>获取包和 v8

```bash
gclient sync --no-history
```

然后你就会在 `src` 下看到一堆三方包和 `v8` 被下载下来

![image.png | left | 747x538](https://cdn.yuque.com/yuque/0/2018/png/99653/1529995554027-c933cf86-d4df-4399-a4e2-eb1a7a5a9e31.png)

## <a name="pznmvu"></a>安装 js 依赖

```bash
cd js
yarn install
gn gen out/Debug --args='cc_wrapper="ccache" is_debug=true '
```

## <a name="3aomhk"></a>使用 <span data-type="color" style="color:rgb(36, 41, 46)"><span data-type="background" style="background-color:rgb(255, 255, 255)">ninja </span></span>编译

mac 上得先安装 `ccache` 不然会报 `subcommand failed` 错误

![image.png | left | 747x342](https://cdn.yuque.com/yuque/0/2018/png/99653/1529995488649-004e99f7-50ff-4456-b394-15c20a1ec5ff.png)

```bash
brew install ccache
```

在 `src` 下进行编译

```bash
ninja -C out/Debug/ deno
```

![image.png | left | 747x491](https://cdn.yuque.com/yuque/0/2018/png/99653/1529995461197-704e52ca-67a1-4682-a8fd-7060b393d590.png)

## <a name="y4gdma"></a>试着执行

这样 deno 的执行文件就产生了

![image.png | left | 747x423](https://cdn.yuque.com/yuque/0/2018/png/99653/1529996003157-e93454bd-02ab-4daf-9cdb-f617221510c1.png)

接着运行看看

![image.png | left | 747x170](https://cdn.yuque.com/yuque/0/2018/png/99653/1529996089799-7ddd86b3-9b2b-421d-abf1-e8044df6c462.png)

打印出了 v8 的版本 <span data-type="color" style="color:rgb(36, 41, 46)"><span data-type="background" style="background-color:rgb(255, 255, 255)"><code>V8 6.8.275.14</code></span></span><span data-type="color" style="color:rgb(36, 41, 46)"><span data-type="background" style="background-color:rgb(255, 255, 255)"> </span></span>
