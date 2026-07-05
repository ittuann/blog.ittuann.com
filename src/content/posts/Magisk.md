---
title: 记录下 Android 手机用 Magisk 解锁 root 和安装 LSPosed
description: 记录下 Android 手机通过 fastboot 用 Magisk 解锁 root 和安装 LSPosed(xposed)
pubDate: 2022-11-20
tags: ["Other"]
category: ["Tech"]
---

设备有两台，一台主力机和一台备用机都刷成功了。

一加 OnePlus 7 Pro 系统是欧洲版 OxygenOS GM1910_11_H.30 Android12

红米 Redmi K50 Ultra / 小米 Xiaomi 12T Pro (DITING) 系统是 MIUI.EU V13.0.7.0.SLFCNXM Android12

# 和以往的刷机的区别

Google 在 Android 7.0 引入新的 OTA 升级机制 A/B System Updates。把`Boot`和`System`分区变为了两套，分别是`Slot A`和`Slot B`即 A/B 分区。同时没有了独立的 `Recovery` 分区而是把`Recovery` 和 `boot` 分区做在了一起。

后来这套机制在 Android 12 进行了升级有了 Virtual A/B System Updates，也就是 VAB 分区或是又叫虚拟 AB 分区。现在 2022 年出厂安卓 11 及以上的手机基本都是 VAB 分区机制了。

也可以在 GooglePlay 上下载 `Treble Check` 软件来检查自己的手机是否存在 A/B 系统分区。

关于分区感兴趣可以看看极客湾这期视频 <https://www.bilibili.com/video/BV1BY4y1H7Mc/>

# 安装 ADB 工具包

如果你的电脑上还没有 ADB / Fastboot 工具包（Google SDK Platform），那么需要前往 [Google Developer](https://developer.android.com/studio/releases/platform-tools) 下载

# fastboot 刷机

因为`Recovery`分区的合并，如果只是想要用 TWRP 来刷机而用不到 TWRP 的其他功能，那单从刷机来讲更方便的选择其实是用 fastboot 直接来操作。TWRP 还有的备份功能我个人用的也不是很多。

1. 用手机上的 Magisk Manager app 给当前版本的系统包里提取出来的 boot.img 手动打补丁（`Install -> Select and Patch a File`）

   ```shell
   adb shell 								#打开 adb shell 并进入到根目录
   ls										#查看当前位置下所有目录
   cd /sdcard/Download						#找到想要存放的位置
   exit									#退出 adb shell
   adb push D:\boot.img /sdcard/Download/	#把boot.img传给手机 传输过程没有进度条反馈需要等待
   adb pull /sdcard/Download/magisk_patched-25200_gOYbu.img D:\	#传回打完补丁的 boot 镜像
   ```

1. 使用命令进入 fastboot 模式

   ```
   adb reboot bootloader
   ```

1. 在 Bootloader 中输入命令

   ```
   fastboot boot magisk_patched.img
   ```

   - 注意！这里请最好**不要**使用命令直接刷入（`fastboot flash boot magisk_patched.img`）Magisk，避免造成 Magisk 无法备份原版 `boot.img`，在日后的更新中出问题。`fastboot boot` 指令提供了临时从某个镜像文件启动的方式，大大降低了 debug 的难度。

1. 刷完后会自动开机会进入 Magisk 临时拥有权限的系统。

   此时 Magisk Manager 暂时有了 Root 权限，即可以在 Magisk Manager 中正式安装 Magisk（`Install -> Direct Install`）安装好 Magisk 后重启即可拥有 root

# 传统 Recovery 刷机方式：

还是记录下用 TWRP 在 Rec 下刷机的方式吧。TWRP 刷机的方式依旧可以用，只不过会有些麻烦。

1. 在官网找到设备支持列表

   下载对应适配的.img 镜像文件，和.zip 安装文件

   TWRP 官网：<https://terp.me/>

2. 然后进入 fastboot 模式下输入

   ```
   fastboot boot twrp.img
   ```

   依旧不推荐直接使用 flash 刷入`fastboot flash recovery twrp.img`

3. 刷好后正常情况手机会临时进入一次 TWRP。（或是通过组合按键开机进入 Recovery 模式进入 TWRP，另外在开机时使用 `adb reboot recovery` 也可）

   1. 是否持久化 (固化)TWRP 是可选的。首先说使用固化 TWRP 的方法

      1. 在 TWRP 中刷入 twrp-installer.zip 使 TWRP 持久化。这个安装包会在 AB 两个分区中都安装一次 TWRP，这样无论手机从哪个分区启动都可以进入 TWRP。
      2. 直接刷入 Magisk.zip

   2. 使用临时 TWRP 的方法

      1. TWRP 中输入正确密码解密分区（如果设置了密码），并选择 `Advanced -> ADB Sideload`，确认进入 Sideload 模式。

      2. 执行 `adb sideload Magisk-vX.X.zip`

      3. 关闭并重新启动手机，若 TWRP 提示安装其官方应用，无需安装。开机后安装 Magisk Manager 的 apk，确认 Magisk 已成功激活。

# OTA 时的操作

这里只写到了 Magisk 没有 TWRP

系统更新时，默认会用全量包刷回未 Root 的状态。如果此时想保留 Magisk，建议先备份下数据，然后按以下流程操作：

1. 等待系统更新进度条走到 100%，即更新完成，此时不要重启。

2. 打开 Magisk（怕翻车那就停用所有使用中的模块。

3. 打开 Magisk，将 Magisk 安装到第二分区
   （`Install -> Install to Inactive Slot(After OTA)`）。

4. 自动重启进入新系统。然后去确认下系统版本号是否更新、Magisk 是否正常激活。

5. 如果之前怕翻车手动停用了模块，那就打开 Magisk，在 Downloads 页面下载、覆盖安装所有 Magisk 模块后再重新启用模块，再次重启，检查自己用的模块是否正常工作。

   - 步骤 2、步骤 5 可忽略，但有无法进入系统的风险。

     如果忽略这两个步骤后无法进入新系统，可以回到原系统重新执行以上步骤。
     手动切回原系统方式：进入 Bootloader，使用 `fastboot getvar current-slot` 获取当前分区，并使用 `fastboot --set-active=a` **或** `fastboot --set-active=b` 切换回原来的分区。

# fastboot 升级系统时的操作

MIUI.EU 对于有些手机只提供了 fastboot 线刷包。升级也只能用电脑链接进入 fastboot 模式下的手机来线刷。

这个情况其实我也不是很清楚正规一些的操作要怎么做，要怎么才既能升级又能保留 root，如果有人知道的话可以邮箱告诉我一下麻烦惹。

不过我也测试出来了一种方法。

1. 在升级前先把最新版系统线刷包里的 boot.img 传到手机里
2. 在手机上用 magisk 修补最新版系统的 boot.img，并将修补后的镜像传给手机
3. 备份并替换掉线刷包内的 boot.img
4. 手机进入 fastboot 然后在电脑上执行 `windows_fastboot_update_rom.bat`
5. 升级完成重启后进入 magisk，在安装中选择直接安装。再次重启完成后即可完成升级。

# Magisk 模块

- 救砖模块

  <https://www.coolapk.com/feed/33911784?shareKey=ZGY1YTc2Mjk4NTM1NjI0ZTc0YzQ~>

  在开机失败后救砖模块会依次尝试禁用单个模块->全部模块。防止 magisk 自带的开机失败禁用模块抽风。此外 magisk 在手机系统进入安全模式后会禁用所有模块。

- LSPosed

  <https://github.com/LSPosed/LSPosed>

- Shamiko

  <https://github.com/LSPosed/LSPosed.github.io/releases>

  隐藏 Root 避免一些应用的 root 检测，由 LSPosed Group 开发。

  - 在 magisk 设置中开启`Zygisk`、安装模块、重启后关闭 magisk 设置里的`遵守排除列表`、进入`配置排除列表`勾选想要隐藏 root 的应用
  - 隐藏还需要 LSPosed 寄生，即将 LSPosed 自身寄生到系统应用下。新版本已经会自动寄生。拨号盘输入 `*#*#57776733#*#*`也可以进入 LSPosed。
  - 随机包名隐藏 Magisk。在`设置-隐藏Magisk应用`，输入名称，添加完成后会被包名替代。
  - Momo 环境检测。用来检测是否 root 和安装 magisk。<https://t.me/s/magiskalpha/517>

- JamesDSP Manager

  <https://github.com/Zackptg5/JamesDSPManager>

  音效自定义修改类模块。替代曾经的蝰蛇音效，也继承了其核心功能 Viper-DDC。

- UPerf

  <https://github.com/yc9559/uperf>

  yc9559 大佬的调度。

- MIU.EU 本地化模块

  <https://blog.minamigo.moe/archives/184>

# LSPosed 模块

哔哩漫游

Duolingo 时区修复

锤锤

钉钉反撤回神器

格言锁屏 X

杜比大喇叭β

非残！

微 X 模块

QNotified

Pixelify GPhotos

知了

强制截图

MiuiMediaEditor

WooBox For MIUI

MaxFreeForm

MiuiHome

# 需要 Root 的应用

App Ops

冰箱 / 小黑屋

Scene

黑阈

MT 文件管理器

参考链接

> [OnePlus 7 Pro Magisk(Root) 教程](https://dev.moe/1144)
>
> [一加 OnePlus 7 刷入氧 OS、TWRP、Magisk (Root)](https://blog.skk.moe/post/op7-oos-twrp-magisk/)
>
> [谷歌 SLOT A/B 机制下安卓刷入 TWRP 和 Magisk 以及 OTA 的一些方法](https://www.elietio.xyz/posts/d1df635e.html)
>
> [HowTo Install Recovery image - MIUI.EU](https://xiaomi.eu/community/threads/howto-install-recovery-image.66211/)
