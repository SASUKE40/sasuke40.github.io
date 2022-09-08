---
title: Ubuntu安裝java8
slug: java8-installation
date: 2015-05-23
image: java8.jpg
author: Edward Elric
tags:
  - java
  - Ubuntu
---

1. 添加 ppa

```bash
sudo add-apt-repository ppa:webupd8team/java
```

2. 更新系統

```bash
sudo apt-get update
```

3. 安裝 java8

```bash
sudo apt-get install oracle-java8-installer
```

4. 檢測是否成功

```bash
java -version
```

結果如下

```bash
java version "1.8.0_45"
Java(TM) SE Runtime Environment (build 1.8.0_45-b14)
Java HotSpot(TM) 64-Bit Server VM (build 25.45-b02, mixed mode)
```

5. 設置環境變量

```bash
sudo apt-get install oracle-java8-set-default
```

6. 版本切換

```bash
sudo update-java-alternatives -s java-8-oracle
```
