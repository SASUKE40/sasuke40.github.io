---
title: 尝试一下 VSCode Remote 开发 Node 应用
slug: try-vscode-remote
author: Edward Elric
hero: ./vscode.jpg
tags:
  - VSCode
excerpt: VSCode 的 Remote SSH 插件完美击中运维痛点，以后可以抛弃 Vim 直接在 VSCode 里面改东西，非常方便。
date: 2019-05-17
---

## 第一步 安装 VSCode Insiders

![VSCode Insiders 官网](https://cdn.nlark.com/yuque/0/2020/png/99653/1578405743917-54d5a517-841b-43ea-a993-df3f3b38f763.png#align=left&display=inline&height=559&originHeight=559&originWidth=720&size=0&status=done&style=none&width=720)

https://code.visualstudio.com/insiders/code.visualstudio.com

目前只能在 VSCode Insiders 版本体验 Remote Development

## 第二步 安装 Remote Development 插件

![Remote Development 插件](https://cdn.nlark.com/yuque/0/2020/png/99653/1578405743932-53418a7d-b276-4d95-8633-661c4b392296.png#align=left&display=inline&height=558&originHeight=558&originWidth=720&size=0&status=done&style=none&width=720)

https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpackmarketplace.visualstudio.com

## 第三步 配置 SSH Config

![SSH 配置文件](https://cdn.nlark.com/yuque/0/2020/png/99653/1578405743885-aff00c17-7d47-4e5f-aa2c-0611357ee7b5.png#align=left&display=inline&height=558&originHeight=558&originWidth=720&size=0&status=done&style=none&width=720)

SSH 配置文件

```shell script
Host ubuntu
HostName <your-remote-host>
User ubuntu
```

这里需要准备一个远端的机器，这样可以直接访问到服务器的文件。

![远端文件管理](https://cdn.nlark.com/yuque/0/2020/png/99653/1578405743887-f9d7a7df-f9f5-4599-952a-7a658117c13d.png#align=left&display=inline&height=558&originHeight=558&originWidth=720&size=0&status=done&style=none&width=720)

## 第四步 编写 Node 应用

![一个简单的 node 应用](https://cdn.nlark.com/yuque/0/2020/png/99653/1578405743913-8e957743-919c-4cde-8d25-1c936268274a.png#align=left&display=inline&height=558&originHeight=558&originWidth=720&size=0&status=done&style=none&width=720)

基本就 4 个文件，已经放到 github 上：
https://github.com/SASUKE40/docker_web_appgithub.com

## 第五步 构建推送 docker 镜像

![Docker Hub](https://cdn.nlark.com/yuque/0/2020/png/99653/1578405743894-a5a67fa5-9c6f-4714-9bff-11cc6a3f1228.png#align=left&display=inline&height=395&originHeight=395&originWidth=720&size=0&status=done&style=none&width=720)

https://hub.docker.com/hub.docker.com

在应用项目目录下执行镜像构建

docker build -t edward40/node-web-app .

查看构建的镜像

docker images

![构建查看 Docker 镜像](https://cdn.nlark.com/yuque/0/2020/png/99653/1578405743906-f9d99e10-71b5-4d15-86a1-f57560ed8092.png#align=left&display=inline&height=486&originHeight=486&originWidth=720&size=0&status=done&style=none&width=720)

本地试跑镜像

```shell script
docker run -p 3000:8080 -d edward40/node-web-app
```

访问 [http://localhost:3000](http://localhost:3000/)

![本地查看效果](https://cdn.nlark.com/yuque/0/2020/png/99653/1578405743937-838f6346-89c3-48fb-ac35-3373fd56c6b3.png#align=left&display=inline&height=456&originHeight=456&originWidth=720&size=0&status=done&style=none&width=720)

推送 Docker 镜像可以在终端执行

```shell script
docker push edward40/docker_web_app:tagname
```

不过这里我用官方的自动化构建

![配置自动化构建镜像](https://cdn.nlark.com/yuque/0/2020/png/99653/1578405743885-3f850c63-2cb3-41d9-81ca-1211546b3026.png#align=left&display=inline&height=456&originHeight=456&originWidth=720&size=0&status=done&style=none&width=720)

只要推送代码就会 build 出镜像

![自动化构建流程](https://cdn.nlark.com/yuque/0/2020/png/99653/1578405743912-cfe78e3f-c1be-4f98-83b0-e235daa56acf.png#align=left&display=inline&height=456&originHeight=456&originWidth=720&size=0&status=done&style=none&width=720)

## 第六步 服务器上跑镜像

在 SSH 终端中拉取 Node 应用镜像

```shell script
sudo docker pull edward40/docker_web_app
```

![服务端拉取镜像](https://cdn.nlark.com/yuque/0/2020/png/99653/1578405744425-4a2520a6-6740-42f6-8d93-a4f4c42fd3c9.png#align=left&display=inline&height=558&originHeight=558&originWidth=720&size=0&status=done&style=none&width=720)

服务端启动 Container

```shell scriptell script
sudo docker run -p 80:8080 -d edward40/docker_web_app
```

## 第七步 本地开发 Docker Container

安装 Docker 插件

https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-dockermarketplace.visualstudio.com

项目目录创建配置文件

![创建 Container 配置文件](https://cdn.nlark.com/yuque/0/2020/png/99653/1578405743908-75e153f8-5f30-44ff-b834-03f1c1af31c9.png#align=left&display=inline&height=558&originHeight=558&originWidth=720&size=0&status=done&style=none&width=720)

创建 Container 配置文件

不过因为使用 Alipine 导致无法打开

![12](https://cdn.nlark.com/yuque/0/2020/png/99653/1578405743920-7b386948-9bb9-4b72-962f-df34bd871658.png#align=left&display=inline&height=558&originHeight=558&originWidth=720&size=0&status=done&style=none&width=720)

需要切换别的 Linux 系统，并增加 .devcontainer.json 文件

```json
{
  "name": "Node.js Sample",
  "dockerFile": "Dockerfile",
  "appPort": 3000,
  "extensions": []
}
```

Dockerfile 的 alpine 换成 lts 版本

```dockerfile
FROM node:lts

# Create app directory

WORKDIR /usr/src/app

# Install app dependencies

# A wildcard is used to ensure both package.json AND package-lock.json are copied

# where available (npm@5+)

COPY package\*.json ./

RUN npm install

# If you are building your code for production

# RUN npm ci --only=production

# Bundle app source

COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]
```

![点击右下在容器中打开](https://cdn.nlark.com/yuque/0/2020/png/99653/1578405743946-1675fb65-b892-49ae-aca4-7fab222b3909.png#align=left&display=inline&height=558&originHeight=558&originWidth=720&size=0&status=done&style=none&width=720)

点击右下在容器中打开

打开 Shell

![最终可以在容器中方便用终端](https://cdn.nlark.com/yuque/0/2020/png/99653/1578405743964-e306f894-05c6-4119-8c0f-e38f76faaf6d.png#align=left&display=inline&height=510&originHeight=510&originWidth=720&size=0&status=done&style=none&width=720)

最终可以在容器中方便用终端

![使用容器终端](https://cdn.nlark.com/yuque/0/2020/png/99653/1578405743934-6f5c8340-3a92-4f55-a40b-e503dbde9afd.png#align=left&display=inline&height=558&originHeight=558&originWidth=720&size=0&status=done&style=none&width=720)

使用容器终端

## 使用总结

VSCode 的 Remote SSH 插件完美击中运维痛点，以后可以抛弃 Vim 直接在 VSCode 里面改东西，非常方便。
而 Remote Containers 插件就有点鸡肋，连到 Docker 容器中好像也没什么大的意义。个人更倾向代码提交触发 Docker Hub 的自动构建能力，并服务器上更新 Docker 镜像容器这样的工作流。如果有小伙伴发现这个插件更好的用法务必留言。
最后，VSCode Remote Development 快快 Release 吧！
