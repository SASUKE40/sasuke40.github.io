---
title: Play Framework項目初始化
date: 2015-05-23
slug: play-framework
author: Edward Elric
image: play.jpg
tags:
  - Play Framework
categories:
  - Backend
---

## 安裝 Activator

先下載[Activator](http://www.typesafe.com/community/core-tools/activator-and-sbt)
解壓到`D:\Program Files\activator-1.3.2`
將`D:\Program Files\activator-1.3.2`加到環境變量 Path 中
在你的項目目錄中執行以下命令，驗證是否安裝成功

```bash
activator -help
```

## 創建 Play 項目

```bash
activator new demo play-java
cd demo
activator
```

## 安裝 Eclipse 插件

[Scala IDE](http://scala-ide.org/download/current.html)
在 Eclipse 中 Install New Software 增加宰割 Update Site，記得安裝 Play Support

## 創建 Eclipse 項目

```bash
eclipse with-source=true
```

## 跑起來看看

```bash
run
```

在瀏覽器中打開[http://localhost:9000](http://localhost:9000)，項目就跑起來了 ╰(￣ ▽ ￣)╮
