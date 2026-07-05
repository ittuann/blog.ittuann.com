---
title: 为 Docker 下的 qBittorrent 配置更合理的权限
description: 为 Docker 下的 qBittorrent 配置更合理的权限，并在环境中配置对应独立的 UID 和 GID
pubDate: 2022-11-17
tags: ["Linux"]
category: ["Tech"]
---

环境是群晖 DSM 7.1.1-42962 Update2 套件 Docker 版本是 20.10.3-1308

起初是想要在群晖上装 qBittorrent 来挂 PT，用第三方套件感觉不是很靠谱的样子也不方便迁移数据，所以还是准备用 Docker 来安装。

网上的那种教程有很多都是给容器 root 权限，或是给文件夹 Everyone 全部权限的，但这样就很不安全。最好的方法应该是在 Docker 容器的环境中填写对应的 UID 和 GID

# 创建独立的群组和用户

qBittorrent 的 Docker 是给了`PUID`和`PGID`的环境变量可以设置

首先在 `控制面板-用户与群组`新建一个用户群组。比如就叫`ptdownloader`

在权限选项卡内，配置 docker 目录夹和下载文件夹目录为可读写，其他文件夹目录均为禁止访问。应用程序那里也全选择拒绝

然后在用户账号设置里，新建一个`ptbox`的用户，权限继承自刚刚创建的群组。

# 查看用户和用户组 id

Linux 正常情况可以使用`id`命令来查看。群晖比较奇怪 id 命令返回的结果不对可能是因为魔改系统的原因。

查看当前用户组 ID：

```
id -g
```

查看当前用户 ID：

```
id -u
```

查看指定用户 ID 信息：

```
id ptdownloader
```

在 Docker 内使用`PGID=$(id -g)` 和 `PUID=$(id -u)`，就会使用启用 Docker 容器的那个用户的 ID 信息。

至于群晖，首先 SSH 进入群晖

查看用户组 ID：

```shell
vim /etc/group
```

vim 内可以使用`/word`，在光标之下寻找第一个值为 word 的字符串，区分大小写。

我这里是`ptdownloader:x:65537:ptbox` ，那么用户组 ID 就是 65537

查看用户 ID：

```shell
vim /etc/group
```

我这里是 `ptbox:x:1029:100:pt download box:/var/services/homes/ptbox:/sbin/nologin` ，那么用户 ID 就是 1029

于是只要在 docker 容器中添加环境变量 `PGID=65537` 和 `PUID=1029` 即可 ~

也可以在环境变量里面修改下默认网页端口 `WEBUI_PORT=8780` 以及 `TZ=Asia/Shanghai`

同理也可以用来管理 transmission 的权限，或是管理个人媒体服务器 jellyfin/emby 的权限。
