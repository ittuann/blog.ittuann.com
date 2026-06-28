---
title: Keil 的一些使用技巧
description: 在开发中 Keil 的一点使用技巧：使用 ARM V6 编译器和 gun11 标准；查找导致进入 HardFault_Handler 的函数；SAVE 命令将数据导出到文件；开启 FPU 硬件浮点数和添加 DSP 库
pubDate: 2021-12-25
tags: ["STM32", "RoboMaster"]
category: ["Tech"]
---

# 使用 ARM V6 编译器和 gun11 标准

ARM V5 编译器已经停止开发了，是时候换到 V6 编译器了。

- 工具栏 `Options for Target - Target - Code Generation - ARM Compiler`

  这里可以选择指定版本的 V6 编译器，或是 Use default compiler version 6

- 在切换至 ARM V6 编译器后，Options for Target 设置栏里面的`C/C++`会变成`C/C++(AC6)`。这时切换至`C/C++(AC6)`选项卡即可在`Language C`处选根据需要择使用`c11` / `gun11`

- `Optimization`可以调整优化等级。如果不想要编译器优化可以设置成`Level0 (-O0)`

- 另外注意一下 CUBEMX 默认生成 FreeRTOS 函数使用的是 V5 编译器的标准（至少在我当前使用的版本 STM32F4 Package 1.26.2 是这样的）切换成 V6 后编译会报错。解决方法只需要替换一下 CUBEMX 包的文件就好。

  进入芯片软件包的安装目录`...\STM32Cube_FW_F4_V1.26.2\Middlewares\Third_Party\FreeRTOS\Source\portable` 将 RVDS 文件夹里的 ARM_CM4F 文件夹，替换为 GCC 里的 ARM_CM4F 文件夹即可。再重新用 CUBEMX 生成工程，FreeRTOS 就可以通过 ARMV6 编译了。另外软件包升级之后也要重新替换一下。

# 查找导致进入 HardFault_Handler 的函数

致使程序进入 HardFault_Handler 硬件错误中断函数的原因有很多。可以调试打断点然后跳转到出问题的函数

首先在 HardFault_Handler 的 while(1) 前打调试断点

当程序执行到断点后，在 Keil 菜单栏点击 `View - Call Stack Window` ，会弹出 `Call Stack + Locals` 对话框

右键单机 HardFault_Handler，然后选择 `Show Caller Code`

之后就会跳转到出错之前的函数处。 `Disassembly` 窗口也会用黄色高亮显示来源。

之后就是改 Bug 了 多查一查这部分函数调用情况，另外多注意下数组是否可能会出问题

# SAVE 命令将数据导出到文件

调试时，打开 Command 窗口（如果没有的话就在系统菜单 `View - Command Window` 启用）

在窗口的下方有一个输入框，在其中输入 SAVE 命令，回车执行

```
SAVE D:\test.txt  0x20000100,0x2000200
```

参数的涵义也不难理解：

`D:\test.txt` 是文件路径和文件名；

`0x20000100` 是待存储的起始地址；

`0x20000200` 是待存储的终止地址；

`,accSize` 为可选项，代表读取目标内存的字节大小。

不过最终输出的是 txt 文件和 HEX 格式的数据，后期处理和使用起来也确实稍有些麻烦。

> 官方 SAVE 命令文档 https://www.keil.com/support/man/docs/uv4/uv4_cm_save.htm
>
> https://developer.arm.com/documentation/ka002842/latest

# 开启 FPU 硬件浮点数和添加 DSP 库

工具栏 Manage Run - Time Environment - CMSIS - DSP 勾选，即可完成添加 DSP。不过建议用 CubeMX 软件包的方式添加

详细的写在另一篇博客了 https://ittuann.github.io/2021/12/25/DSP

# 杂项

不太好归类但是也想要说一下。

- 修改 ROM 起始地址

  Options for Target - Target - IROM1 下修改

# 更新

Keil 现在已经默认不在安装包里包含 Arm Compiler v5 了

如果还是想用回旧版 可以参照官方的文章来额外安装

https://developer.arm.com/documentation/107778/5-38a/MDK-Version-5-38a

https://developer.arm.com/downloads/view/ACOMP5

https://developer.arm.com/documentation/101407/0538/Creating-Applications/Tips-and-Tricks/Manage-Arm-Compiler-Versions
