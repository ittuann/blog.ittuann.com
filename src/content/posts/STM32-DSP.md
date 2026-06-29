---
title: 添加 DSP 库以添加 arm_math.h
description: 开启 STM32 的 FPU 硬件单精度浮点数计算单元，并启用 CMSIS 封装的 STM32 的 DSP 静态库。
pubDate: 2021-12-27
tags: ["STM32"]
category: ["Tech"]
---

例如卡尔曼滤波的矩阵运算，FIR 和 IIR 滤波还有很多高级数学功能有了 DSP 库都会很方便和快速。

# FPU 硬件浮点数

FPU：Float Point Unit。全称是浮点计算单元，用于浮点计算的协处理器。

一般单片机带有硬件 FPU 并且支持浮点指令集时，工程会默认开启了 FPU 功能。STM32F4 就带有 32 位单精度硬件 FPU，支持浮点指令集。

- 在头文件中 `stm32f767xx.h`中定义了`__FPU_PRESENT`。其值为`1`时可用。

- 在头文件中 `core_cm7.h` 中定义了`__FPU_USED`。其值为`1`时可用。

- 在`system_stm32f4xx.c`中初始化函数`SystemInit()`会根据上面两个 define 的数值用预编译来自动判断是否启用硬件浮点数。
- 还需要在预编译符号添加`ARM_MATH_CM4`和`__TARGET_FPU_VFP`。分别是 FPU 的条件编译配置宏和使用的单片机的架构（需要根据使用的单片机来确定 这里以 F407 为例）

  - keil：Options for Target - C/C++(AC6) - Preprocessor Symbols - Define
  - CubeIDE：Properties - C/C++ General - Paths and Symbols - Symbols

- 在 IDE 中设置开启 FPU。但最终 FPU 启用与否也是根据上面两个 define 的数值来判断。

  - keil：Options for Target - Target - Floating Point Hardware 设置为 Single Precision 或 USEFPU
  - CubeIDE：Properties - C/C++ Bulid - Settings - MCU Settings。Floating-point unit 设置为 FPv4-SP-D16；Floating-point ABI 设置为 Hardware implementation (-mfloat-abi=hard)

- arm_math.h 也需要根据`__FPU_USED`的数值来判断是否启用。但是因为上面两个定义的文件和导入的 DSP 库文件可能没有联系，所以为了避免出问题可以在编译器的预编译符号设置`__FPU_USED=1`和`__FPU_PRESENT=1`。编译时会报重定义的错需要把原本的定义注释掉

# 添加 DSP 库

有三种方法，可以通过 CubeMX 软件包添加；Keil 设置运行环境添加；以及手动添加。任选其一即可，推荐使用 CubeMX 添加。

## CubeMX 软件包

方法同样适用于在 CubeIDE 内使用。

1. 在 CubeMX 上方蓝色条中选择 Software Packs - Select Components

2. 点击左上角第一个长得像设置一样的图标（Show or hide the filter panel）

3. 然后在右侧 Software Component Class 中选择 DSP Library，右侧展开后勾选的 Selection 即可

4. 回到 CubeMX 控制界面会发现左侧最下面多出了 Software Packs 栏目。在下拉列表中选择 STMicroelectronics.X-CUBE-ALGOBUILD.1.2.1 并勾选右侧 DSP Library Library 即可生成代码

5. 生成代码后还需要在预编译符号中添加 D`ARM_MATH_CM4`，用于表示架构。上面开启 FPU 时添加过 define 的话就不用再添加了。

6. 生成代码后工程的根目录下会自动新建一个 Library 文件夹。在这里添加 arm_math.h 中需要用到的.c 文件即可。

   需要的.c 文件可以在 CubeMX 芯片固件库的安装目录下找到。...\Repository\STM32Cube_FW_F4_V1.26.2\Drivers\CMSIS\DSP\Source

7. 之后就完成 DSP 库的添加。此时程序中可以#include "arm_math.h"进行运算。

使用 CubeMX 软件包添加非常方便，并且会自动配置好 IDE 的设置（包括 CubeIDE）

.lib 文件的文件名中 bf 是大端，lf 是小端。F4 的内核 CortexM4F 采用小端模式。不过这些 CubeMX 在生成时都会自动选择无需额外关心

DSP 库主要包含以下几个分库。根据工程需要添加至 Library 文件夹即可。

    BasicMathFunctions – 基本数学函数：提供浮点数的各种基本运算函数，如向量加减乘除等运算。
    CommonTables –arm_common_tables.c文件提供位翻转或相关参数表。
    ComplexMathFunctions –复杂数学功能，如向量处理，求模运算的。
    ControllerFunctions –控制功能函数。包括正弦余弦，PID电机控制，矢量Clarke变换，矢量Clarke逆变换等。
    astMathFunctions –快速数学功能函数。提供了一种快速的近似正弦，余弦和平方根等相比CMSIS计算库要快的数学函数。
    ilteringFunctions –滤波函数功能，主要为FIR和LMS（最小均方根）等滤波函数。
    MatrixFunctions –矩阵处理函数。包括矩阵加法、矩阵初始化、矩阵反、矩阵乘法、矩阵规模、矩阵减法、矩阵转置等函数。
    StatisticsFunctions –统计功能函数。如求平均值、最大值、最小值、计算均方根RMS、计算方差/标准差等。
    SupportFunctions –支持功能函数，如数据拷贝，Q格式和浮点格式相互转换，Q任意格式相互转换。
    TransformFunctions –变换功能。包括复数FFT（CFFT）/复数FFT逆运算（CIFFT）、实数FFT（RFFT）/实数FFT逆运算（RIFFT）、和DCT（离散余弦变换）和配套的初始化函数。

## 通过 Keil 添加

工具栏 Manage Run - Time Environment - CMSIS - DSP 勾选

还需要在预编译符号中添加 ARM_MATH_CM4。添加完成。

Keil 想要忽略添加后可能产生的特定警告，可以在 Options for Target - C/C++(AC6) - Preprocessor Symbols - MiscControls 添加 `--diag_suppress=2803,1,1035`

---

参考链接

> [STM32CubeIDE 添加 DSP 库](https://blog.csdn.net/mutulu7la/article/details/121056881)
>
> [STM32 DSP 库的快速添加](https://blog.csdn.net/qq_34022877/article/details/117855263)
