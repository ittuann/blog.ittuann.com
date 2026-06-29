---
title: Ubuntu 的 SSH 安全配置
description: 查看 SSH 登录日志文件，修改默认端口，UFW 配置防火墙，禁止 root 用户登录，禁用密码登陆，使用 RSA 私钥登录，使用 Fail2ban 工具，使用两步验证 (2FA)
pubDate: 2022-11-16
tags: ["Linux"]
category: ["Tech"]
---

环境是 Ubuntu 22.04 LTS

# 查看登录日志文件

```shell
sudo cat /var/log/auth.log
```

不出意外会看到很多类似如下的日志

```
Failed password for root from 183.146.30.163 port 22537 ssh2
Failed password for invalid user admin from 183.146.30.163 port 22545 ssh2
Invalid user tester from 101.254.217.219 port 56540
pam_unix(sshd:auth): check pass; user unknown
pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=103.61.8.34
```

然后可以统计有多少人在暴力破解 root 密码错误登录，展示错误次数和 ip

```shell
sudo grep "Failed password for root" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -nr | more
```

因为腾讯云还有个默认用户 Ubuntu，也可以一起看看，或是查看一下自己其他用户的错误登录

```shell
sudo grep "Failed password for ubuntu" /var/log/auth.log | awk '{print $11}' | sort | uniq -c  | sort -nr | more
```

统计有多少暴力猜用户名的

```shell
sudo grep "Failed password for invalid user" /var/log/auth.log | awk '{print $13}' | sort | uniq -c | sort -nr | more
```

这台才买回来 3 天就被扫了 500 多次，东西都还都没上线就被扫了这么多次 emmm

# 修改 SSH 的默认端口

在 ECS 上修改的时候要多留意一下，小心没改好再把自己拒绝在外面。

修改后不要退出当前的 ssh 链接，大多数 Linux 发行版重启 ssh 服务并不会中断当前已经建立的 ssh 连接。另外开个窗口去重新连接 ssh 服务，如果遇到问题，还可以在原来的 ssh 连接下修改和恢复。

也可以让 SSH 同时工作在 22 和新设定的端口下，等测试能连接到新端口后再将 22 端口注释掉。

如果操作不慎丢失了 ssh 连接，可以尝试使用云平台提供的控制台登录

## 修改 SSH 的默认端口

首先创建一下文件的备份

```shell
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
```

- 编辑配置文件：

```shell
sudoedit /etc/ssh/sshd_config
# 使用 sudoedit 前要提前指定自己喜欢的编辑器 sudo update-alternatives --config editor
```

修改配置：

```
Port 22
Port 3322
```

配置多个 `Port` 可以让 SSH 服务监听多个端口。先保留初始的`22`端口，避免修改有问题后无法连接服务器。测试新的端口成功后再删除默认端口即可。

新的 ssh 端口最好使用 1024 到 65535 之间的，一个别人猜不到的端口号。

- 新的 ssh 端口可以提前检查下有没有被占用。

```shell
sudo netstat -tunlp | grep 3322
# 或 sudo ss -tulpn | grep 3322
```

- 修改后重启 ssh 服务：

```shell
sudo systemctl restart sshd
# sshd / sshd.service / ssh 指向的都是同一个服务
```

然后查看 SSH 侦听 (监听) 端口：

```shell
sudo netstat -tunlp | grep ssh
```

## 禁止 SSH 的 root 用户登录

在禁用 root 用户登录前，要先确保已经配置好了一个拥有使用 sudo 权限的普通用户。

修改 `/etc/ssh/sshd_config` 文件。禁止以 root 用户身份通过 SSH 登录：

```shell
PermitRootLogin no
```

## 禁用密码登陆，使用密钥对登录

- 将公钥添加至服务端：

```shell
ssh-copy-id myserver1 #在客户端执行命令
```

也可手动将公钥中的内容，复制到 myserver 服务器中的 `~/.ssh/authorized_keys` 文件内即可。有多个公钥则需要用回车隔开，一行一个。

- 然后需要配置服务端：

```shell
PubkeyAuthentication yes

PasswordAuthentication no #禁止密码认证
PermitEmptyPasswords no   #禁止空密码用户登录
```

- 此外，还要注意检查`/etc/config/sshd_config.d/`文件夹。

  查看该文件夹内的第一个文件 (例如`50-cloud-init.conf`)，此文件是云服务商配置的。

  如果其中依旧包含`PasswordAuthentication yes`，则是在创建云服务器时设置了用密码进行连接，这里也要改掉。

## 设置 SSH 单次登录限制

修改如下配置：

```shell
LogLevel INFO		#将 LogLevel 设置为 INFO，记录登录和注销活动
MaxAuthTries 3    	#限制单次登录会话的最大身份验证尝试次数
LoginGraceTime 20	#缩短单次的登录宽限期，即 ssh 登录必须完成身份验证的时间 单位是秒
```

完成配置的修改后，重新加载 ssh 服务配置文件。

```shell
sudo systemctl reload sshd
```

## 禁止其他认证方法

在大多数情况，SSH 将配置为仅使用公钥认证作为唯一的认证方法。然而 OpenSSH 服务器还支持许多其他认证方法，如果不需要这些功能，可以将其禁用，以进一步减少 SSH 服务器的攻击面：

```
ChallengeResponseAuthentication no
KerberosAuthentication no
GSSAPIAuthentication no
```

## 锁定 root 用户

```shell
sudo passwd -l root
```

上面这条命令会锁定 root 用户。此后，即使输入了正确的用户密码，也无法登陆 root 账户。

如果之后有什么特殊情况真的需要登陆 root 账户，也只需要运行：

```shell
sudo passwd -u root
```

即可解锁 root 账户。

## UFW 防火墙设置

在完成 SSH 默认端口的修改和测试之后，最好再启用 UFW 防火墙。

Ubuntu 系统上默认装有了 UFW(Uncomplicated Firewall) 来配置防火墙。它们之间的关系是 `netfilter-->iptables-->[ ufw / firewall ]` 。ufw / firewall 是用人性化的语言配置规则并转化为 iptables 的规则语法。iptables 是一个通过控制 Linux 内核的 Netfilter 模块来管理网络数据包的流动与转送的应用软件，其功能包括不仅仅包括防火墙的控制出入流量，还有端口转发等等。

检查 UFW 状态

```shell
sudo ufw status verbose
```

`verbose`为可选参数。当防火墙处于关闭状态时只会显示`inactive`

UFW 默认情况下允许所有的出站连接，拒绝所有的入站连接。

开启 UFW：

```shell
sudo ufw enable
```

启用 UFW 防火墙日志：

```shell
sudo ufw logging on
sudo ufw logging low 	# low|medium|high
```

日志文件在`/var/log/ufw.log`

在防火墙开放 SSH 端口：

```shell
sudo ufw allow 3322/tcp
# 一般还会添加网页服务端口
sudo ufw allow 443  # 同时允许 TCP 和 UDP 协议
```

UFW 删除规则：

```shell
sudo ufw status numbered 	# 查看所有规则的规则号
sudo ufw delete 2 			# 直接删除规则号对应的单条规则即可
```

UFW 有两种方式删除防火墙规则，既可以通过规则号删除，也可以通过实际规则删除，通过规则号删除更容易。因为 UFW 默认会管理 IPV6 所以会既有 ipv6 又有 ipv4，需要删除 2 个。

在系统修改后，也要去 ECS 控制台（比如这台是腾讯云）防火墙里面开放想要设置的端口，以及关闭默认的`22`端口。

注意，用了 UFW 这种类似于前端的工具后，在不是非常清楚每条命令都是在做什么以及有什么效果那就不要乱改 iptables，尤其是不要随意 iptables -F 清除全部规则。如果用 iptables 那在每次修改前最好都要保存下当前规则，万一改挂了，以好从 iptables-flush 和 iptables-restore 恢复。直接使用 iptables 配置防火墙的方法（不推荐）：`iptables -A INPUT -p tcp -m tcp --dport 2233 -j ACCEPT` 然后保存和重启 iptables 防火墙 `service iptables save` 和 `service iptables restart`

# 其他 SSH 配置

可以参考 DigitalOcean 的这篇教程来按自己的实际需求修改。 <https://www.digitalocean.com/community/tutorials/how-to-harden-openssh-on-ubuntu-20-04>

# 使用 Fail2ban

Ubuntu 16.04 系统源里带有 `denyhosts` ，到了 Ubuntu 20.04 默认不再包含。`DenyHosts`现在几乎不再更新了，所以使用`Fail2ban` 工具来缓解暴力密码攻击

检查是否安装了特定软件包

```shell
dpkg -l denyhosts # 或 apt list --installed | grep denyhosts
dpkg -l fail2ban  # 或 apt list --installed | grep fail2ban
```

使用 `sudo apt list --installed | grep denyhosts` 来进行搜索会有警告 apt does not have a stable CLI interface. 因为 apt 的输出是为用户 (人) 设计的，并非总能被其它命令行工具解析，比如它会有进度条和颜色等交互界面，而这个进度条会影响其它命令行工具解析它的输出。因此对于脚本而言，不要在脚本中使用 apt 命令，应该用 apt-get、apt-cache 等命令进行替换。

## 安装 fail2ban

```shell
sudo apt-get update
sudo apt-get install fail2ban
```

## 配置 fail2ban

配置文件在 `/etc/fail2ban/jail.conf` 。在配置文件的`[DEFAULT]`区，可以在此定义所有受监控的服务的默认参数

```shell
[DEFAULT]
# 以空格分隔的列表，可以是 IP 地址、CIDR 前缀或者 DNS 主机名
# 用于指定哪些地址可以忽略 fail2ban 防御
ignoreip =  127.0.0.1/8 ::1

# 客户端主机被禁止的时长
bantime = 60m

# 查找失败次数的时长
findtime = 3m

# 客户端主机被禁止前允许失败的次数
maxretry = 4
```

根据上述配置，fail2ban 会自动禁止在最近 3 分钟内有超过 4 次访问尝试失败的任意 IP 地址。一旦被禁，这个 IP 地址将会在 1 小时内一直被禁止访问 SSH 服务。

保存配置后重启服务：

```shell
sudo service fail2ban restart
```

## 查看 fail2ban 运行状态

验证 fail2ban 成功运行：

```shell
$ sudo fail2ban-client ping
Server replied: pong
```

查看日志文件

```shell
sudo vim /var/log/fail2ban.log
```

检验 fail2ban 状态

```shell
$ sudo fail2ban-client status
Status
|- Number of jail:      1
`- Jail list:   sshd
```

检验一个特定监狱的状态

```shell
sudo fail2ban-client status sshd
```

上面的命令会显示出当前被禁止 IP 地址列表

解锁特定的 IP 地址

```shell
sudo fail2ban-client set sshd unbanip 192.168.1.8
```

# 使用两步验证 (2FA)

https://www.gingerdoc.com/tutorials/how-to-set-up-multi-factor-authentication-for-ssh-on-ubuntu-20-04

参考链接：

> [ubuntu 16.04 防止 SSH 暴力登录攻击](https://www.mobibrw.com/2018/11231)
>
> [Linux 实用工具总结之 UFW](https://notes.maxwi.com/2017/01/19/linux-command-tools-ufw/)
>
> [UFW Essentials: Common Firewall Rules and Commands - DigitalOcean](https://www.digitalocean.com/community/tutorials/ufw-essentials-common-firewall-rules-and-commands)
>
> [如何使用 fail2ban 防御 SSH 服务器的暴力破解攻击](https://linux.cn/article-5067-1.html)
>
> [How To Harden OpenSSH on Ubuntu 20.04 - DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-harden-openssh-on-ubuntu-20-04)
>
> [How To Harden OpenSSH Client on Ubuntu 20.04 - DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-harden-openssh-client-on-ubuntu-20-04)
