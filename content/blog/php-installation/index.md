---
title: Ubuntu 安裝 php
date: 2016-02-06 18:00:36
tags:
  - php
  - Ubuntu
---

1. 安装 apt 源管理工具、添加 nginx 和 php 的安装源

```bash
apt-get install python-software-properties
add-apt-repository ppa:nginx/stable
add-apt-repository ppa:ondrej/php5
```

2. 更新系统软件

```bash
apt-get update
```

3. 安装 mysql

```bash
apt-get install mysql-server mysql-client
```

4. 安装 php 及对 mysql 的支持

```bash
apt-get install php5-fpm php5-mysql
```

5. 根据实际需要，选择性的安装 php 的各类功能模块

```bash
apt-get install php-pear php5-dev php5-curl
apt-get install php5-gd php5-intl php5-imagick
apt-get install php5-imap php5-mcrypt php5-memcache
apt-get install php5-ming php5-ps php5-pspell
apt-get install php5-recode php5-snmp php5-sqlite
apt-get install php5-tidy php5-xmlrpc php5-xsl
```

6. 安装 nginx

```bash
apt-get install nginx
```

7. 修改 nginx 默认站点配置文件

```bash
vim /etc/nginx/sites-available/default

server {
    listen 80 default_server;
    listen [::]:80 default_server ipv6only=on;

    root /usr/share/nginx/html;
    index index.php index.html index.htm;

    server_name server_domain_name_or_IP;

    location / {
        try_files $uri $uri/ =404;
    }

    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/var/run/php5-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```
