---
title: 工作心得
date: 2015-05-23
tags:
  - 工作
  - 心得
  - 荔枝FM
---

# 寫這篇文章的初衷

想想在荔枝 FM 工作接近 2 個月了，一直沒能好好總結是一個很大的問題，因此今天就來寫一些東西來回顧一下過去的工作。

### 工作列表

- 荔枝達人 HTML5 遊戲
- 運營後臺·標記播客庫
- 微信錄音
- 錄音指南 HTML5
- 程壁線下文藝店 HTML5
- 主播資料收集頁 HTML5
- Young 榜 HTML5
- 推廣後臺

# 工作中用到的東西

### 荔枝達人

HTML5 遊戲使用 egret（白鷺）引擎，這個引擎是使用`TypeScript`來寫。TypeScript 感覺挺好的，顯式類型並且接近 ES6 規範，但是有一點比較坑的是，對於第三方庫的引入不是很理想，表面而言就是引用的第三方庫後綴為`d.ts`。

有時間就謝謝`TypeScript`的一些東西和大家分享。

### 運營後臺

運營後臺使用的是公司自己編寫的 Java 後端框架，一開始我一直在熟悉這個框架，覺得很不適用，但是當我仔仔細細的看過後又挺欽佩前人的智慧。在熟悉完項目之後就開始編寫自己的功能模塊了。這個項目是使用自己定義的 MVC 框架，定義了一些 Controller 規範，已經對應 View 的規則，使用的持久化框架是`MyBatis`。Model 對 MyBatis 進行封裝，可在選擇在自動事務和自行事務處理，默認為自動事務。總體而言，在寫完一個功能模塊並使之上線算是一次完整的框架“遊覽”。

順便提一個，部署這一塊也是挺有趣的。公司在安全方面挺注重的，因此每個人要將項目部署上去都必須經過跳板機。感謝公司“萬能”的運維大大，在跳板機上有對應掛載的目錄，因此部署也不是太麻煩。我使用的是 XShell，對應的上傳下載命令也就是`rz`和`sz`。

po 一下最近學習的運維知識（果然 Linux 課都白上了，只學到 ls 和 sudo）
以下出於安全考慮，全部 command 都隱去敏感字符

```bash
ssh -p port host@192.168.1.1
```

```bash
mysql -uname -p -h 192.168.1.1 -P port database_name
```

順便 po 一下最近自學的 mysql 權限處理

```bash
service mysql stop
/usr/bin/mysqld_safe --skip-grant-tables &
```

```sql
use mysql;

INSERT INTO user VALUES ('localhost','root',password(''),'Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','','','','','0','0','0','0','','');

INSERT INTO user VALUES ('127.0.0.1','root',password(''),'Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','','','','','0','0','0','0','','');

INSERT INTO user VALUES ('::1','root',password(''),'Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','','','','','0','0','0','0','','');

INSERT INTO user VALUES ('%','root',password(''),'Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','','','','','0','0','0','0','','');

flush privileges;
```

---

```bash
ps aux | grep 'mysql'
kill -9 mysqld-pid
service mysql start
vim /etc/mysql/my.cnf
bind-address = 127.0.0.1
```

上面這些有的是為了遠程訪問`Mysql`，看不懂就算了，關於運維以後再補。

### 微信錄音

做微信录音讓我知道了 Redis 可以用來做服務，這種方式真的很“潮”，這個項目是使用`Play Framework`作為後端的。
下面講講這個`Play Framework`

`Play Framework`和`Ruby on Rails`非常相似，算是 Java 的 Rails，編寫東西相當敏捷，配置很靈活，缺點也有，模版引擎略坑。這個框架有很多配套的組件，Eclipse 的 Scala IDE，Play Support，sbt，`activator`，等等。一些實踐，怎麼編寫 Annotation 實現簡單權限，怎麼用 less，怎麼打包部署，編寫 reload 腳本等等。發現好多東西要補，5555……

### 錄音指南

這是一個翻頁 HTML5，因為是一個靜態的項目，而且比較獨立，所以這個項目用了很多前端的東西，列表如下：

- yeoman
- glup
- webstorm
- bower
- browser-sync（這是個非常好的東西）
- n 多的 gulp 插件

項目部署在`nginx`下。

關於移動端 head 的較好處理

```html
<head>
  <meta charset="utf-8" />
  <title>Title</title>
  <meta name="description" content="description" />
  <meta
    name="viewport"
    content="target-densitydpi=device-dpi, width=640px, user-scalable=no"
  />
  <!-- 删除苹果默认的工具栏和菜单栏 -->
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <!-- 设置苹果工具栏颜色 -->
  <meta name="apple-mobile-web-app-status-bar-style" content="black" />
  <!-- 忽略页面中的数字识别为电话，忽略email识别 -->
  <meta name="format-detection" content="telephone=no, email=no" />
  <!-- 启用360浏览器的极速模式(webkit) -->
  <meta name="renderer" content="webkit" />
  <!-- 避免IE使用兼容模式 -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <!-- 针对手持设备优化，主要是针对一些老的不识别viewport的浏览器，比如黑莓 -->
  <meta name="HandheldFriendly" content="true" />
  <!-- 微软的老式浏览器 -->
  <meta name="MobileOptimized" content="320" />
  <!-- uc强制竖屏 -->
  <meta name="screen-orientation" content="portrait" />
  <!-- QQ强制竖屏 -->
  <meta name="x5-orientation" content="portrait" />
  <!-- windows phone 点击无高光 -->
  <meta name="msapplication-tap-highlight" content="no" />
  <!-- UC强制全屏 -->
  <meta name="full-screen" content="yes" />
  <!-- QQ强制全屏 -->
  <meta name="x5-fullscreen" content="true" />
  <!-- 360强制全屏 -->
  <meta name="360-fullscreen" content="true" />
  <!-- UC应用模式 -->
  <meta name="browsermode" content="application" />
  <!-- QQ应用模式 -->
  <meta name="x5-page-mode" content="app" />
  <!-- 适应移动端end -->
  <!-- Place favicon.ico in the root directory -->
  <link rel="shortcut icon" type="image/png" href="/assets/favicon.ico" />
</head>
```

鎖定在 640px 就不用擔心什麼了，話說那些這麼寫的是要做什麼

```html
<meta
  name="viewport"
  content="width=device-width,target-densitydpi=high-dpi,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>
```

### 程壁線下文藝店 & 主播資料收集頁

這兩個差不多，都是 HTML5 表單，後端也是`Play Framework`（真的挺好用的框架），用了一下百度統計和騰訊分析，感覺不錯。

### Young 榜 HTML5

這個任務拖了我一個多星期，本來預計兩三天結果，結果設計師和市場一直在糾結設計需求，不過要不是這樣也不會有一個好用的推廣後臺 ╮(╯▽╰)╭，
這個東西用了`Swiper`，很贊的觸摸滑動插件，對移動端支持很棒。

這個 HTML5 是可以配置修改的，只要在後臺設置好就能生成新的一期了，總體來說還 ok。

### 推廣後臺

這個也能講一大堆，暫時不講了，休息休息~~
