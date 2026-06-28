---
title: CAN 通信配置过滤器和使用三个邮箱发送
description: 配置 CAN 筛选器，接收以及发送的代码。
pubDate: 2021-12-26
tags: ["STM32", "RoboMaster"]
category: ["Tech"]
---

RM 比赛用的电机基本都使用 CAN 通信，但是一条 CAN 线上只用一个发送邮箱在挂在设备多的情况可能会导致发送不完，但其实完全可以把三个发送邮箱都用上。这里记录下自己的 CAN 筛选器，接收以及发送的代码。

```c
/**
  * @brief          CAN 筛选器
  */
void Can_Filter_Init(void)
{
	/***	CAN1	***/
    CAN_FilterTypeDef sFilterConfig;
	sFilterConfig.FilterActivation = ENABLE;			// 激活过滤器
	sFilterConfig.FilterBank = 0;						// 配置主 CAN 筛选器组编号
	sFilterConfig.FilterMode = CAN_FILTERMODE_IDMASK;	// 配置工作模式为列表模式
	sFilterConfig.FilterScale = CAN_FILTERSCALE_16BIT;	// 配置筛选器的尺度为 16 位长
	sFilterConfig.FilterIdHigh = 0x0000;				// CAN_FxR1 寄存器
	sFilterConfig.FilterIdLow = 0x0000;
	sFilterConfig.FilterMaskIdHigh = 0x0000;			// CAN_FxR2 寄存器
	sFilterConfig.FilterMaskIdLow = 0x0000;
	sFilterConfig.FilterFIFOAssignment = CAN_RX_FIFO0;	// 筛选器接筛选报文关联到 FIFO0

	if (HAL_CAN_ConfigFilter(&hcan1, &sFilterConfig) != HAL_OK) {						// 配置 CAN1 接收筛选过滤器
		Error_Handler();
	}
	if (HAL_CAN_Start(&hcan1) != HAL_OK) {												// 开启 CAN1
		Error_Handler();
	}
	if (HAL_CAN_ActivateNotification(&hcan1, CAN_IT_RX_FIFO0_MSG_PENDING) != HAL_OK) {	// 开启 CAN1 的 FIFO0 接收中断
		Error_Handler();
	}
}
```

- 过滤的方法分为以下两种模式：
  - 标识符列表模式 (`CAN_FILTERMODE_IDLIST`)：它把要接收报文的 ID 列成一个表，要求报文 ID 与列表中的某一个标识符完全相同才可以接收，可以理解为白名单管理。
  - 掩码模式 (`CAN_FILTERMODE_IDMASK`)：它把可接收报文 ID 的某几位作为列表，这几位被称为掩码，可以把它理解成关键字搜索，只要掩码 (关键字) 相同，就符合要求，报文就会被保存到接收 FIFO。
- `CAN_FilterNumber` 用于设置筛选器的编号，即本过滤器结构体配置的是哪一组筛选器，CAN 一共有 28 个筛选器，所以它的可输入参数范围为 0-27。如果是双 CAN 的情况，一般 CAN1 为 0-13，CAN2 为 14-27。
- `CAN_FilterFIFOAssignment` 用于设置当报文通过筛选器的匹配后，该报文会被存储到哪一个接收 FIFO

- 每组筛选器包含 2 个 32 位的寄存器，分别为`CAN_FxR1`和`CAN_FxR2`，它们用来存储要筛选的 ID 或掩码

| 模式       | CAN FilterldHigh | CAN FilterldLow | CAN FilterMaskIdHigh | CAN FilterMaskIdLow |
| ---------- | ---------------- | --------------- | -------------------- | ------------------- |
| 32 位列表   | ID1 的高 16 位     | ID1 的低 16 位    | ID2 的高 16 位         | ID2 的低 16 位        |
| 16 位列表   | ID1 的完整数值   | ID2 的完整数值  | ID3 的完整数值       | ID4 的完整数值      |
| 32 位掩码   | ID1 的高 16 位     | ID1 的低 16 位    | ID1 掩码的高 16 位     | ID1 掩码的低 16 位    |
| 16 位掩码模 | ID1 的完整数值   | ID2 的完整数值  | ID1 掩码的完整数值   | ID2 掩码完整数值    |

CAN 通信的发送函数如下，以 RM 比赛用的 M3508 无刷电机使用的 C620 电调的通信协议为例

```c
#include <stdbool.h>

/**
  * @brief          发送 C620 电调控制电流
  * @param[in]		motorID 对应的电机控制电流，范围 [-16384, 16384]，对应电调输出的转矩电流范围 [-20A, 20A]
  * @param[in]      etcID: 控制报文标识符 (电调 ID) 为 1-4 还是 5-8
  */
void CAN_Cmd_C620(CAN_HandleTypeDef *hcan, int16_t motor1, int16_t motor2, int16_t motor3, int16_t motor4, bool_t etcID)
{
	CAN_TxHeaderTypeDef TxHeader;						// CAN 通信协议头
	uint8_t TxData[8] = {0};							// 发送电机指令缓存
	uint32_t TxMailboxX = CAN_TX_MAILBOX0;				// CAN 发送邮箱

	if (etcID == false) {
		TxHeader.StdId = CAN_3508_ALL_ID;				// 标准格式标识符 ID
	} else {
		TxHeader.StdId = CAN_3508_ETC_ID;
	}
	TxHeader.ExtId = 0;
	TxHeader.IDE = CAN_ID_STD;							// 标准帧
	TxHeader.RTR = CAN_RTR_DATA;						// 传送帧类型为数据帧
	TxHeader.DLC = 0x08;								// 数据长度码
	TxData[0] = (uint8_t)(motor1 >> 8);
	TxData[1] = (uint8_t)motor1;
	TxData[2] = (uint8_t)(motor2 >> 8);
	TxData[3] = (uint8_t)motor2;
	TxData[4] = (uint8_t)(motor3 >> 8);
	TxData[5] = (uint8_t)motor3;
	TxData[6] = (uint8_t)(motor4 >> 8);
	TxData[7] = (uint8_t)motor4;

	//找到空的发送邮箱 把数据发送出去
	while (HAL_CAN_GetTxMailboxesFreeLevel(hcan) == 0);	// 如果三个发送邮箱都阻塞了就等待直到其中某个邮箱空闲
	if ((hcan->Instance->TSR & CAN_TSR_TME0) != RESET) {
		// 检查发送邮箱 0 状态 如果邮箱 0 空闲就将待发送数据放入 FIFO0
		TxMailboxX = CAN_TX_MAILBOX0;
	} else if ((hcan->Instance->TSR & CAN_TSR_TME1) != RESET) {
		TxMailboxX = CAN_TX_MAILBOX1;
	} else if ((hcan->Instance->TSR & CAN_TSR_TME2) != RESET) {
		TxMailboxX = CAN_TX_MAILBOX2;
	}
	// 将数据通过 CAN 总线发送
	#if DEBUGMODE
		if (HAL_CAN_AddTxMessage(hcan, &TxHeader, TxData, (uint32_t *)TxMailboxX) != HAL_OK) {
			Error_Handler();
		}
	#else
		HAL_CAN_AddTxMessage(hcan, &TxHeader, TxData, (uint32_t *)TxMailboxX);
	#endif
}
```

- `IDE`存储的是扩展标志。当它的值为宏`CAN_ID_STD`时表示本报文是标准帧，使用`StdId`成员存储报文 ID；当它的值为宏`CAN_ID_EXT`时表示本报文是扩展帧，使用`ExtId`成员存储报文 ID。`ExtId`与`StdId`这两个成员根据 IDE 位配置，只有一个是有效的。

- `RTR`是报文类型标志。当它的值为宏`CAN_RTR_Data`时表示本报文是数据帧；当它的值为宏`CAN_RTR_Remote`时表示本报文是遥控帧。由于遥控帧没有数据段，所以当报文是遥控帧时，下面的 Data[8]是无效的。
- 可以加上判断状态是否为`HAL_OK`，如果 CAN 信息发送失败则进入`Error_Handler()`死循环。测试时可以打断点判断问题所在，但正式版本时不想给运行着的程序增加可能卡死循环的风险所以会关掉判断。`while`循环等待空邮箱也可以关掉。

```c
/**
  * @brief			HAL 库 CAN FIFO0 接受邮箱中断（Rx0）回调函数
  * @param			hcan : CAN 句柄指针
  */
void HAL_CAN_RxFifo0MsgPendingCallback(CAN_HandleTypeDef *hcan)
{
    static BaseType_t xHigherPriorityTaskWoken = pdFALSE;	// 不请求上下文切换
	CAN_RxHeaderTypeDef RxHeader;							// CAN 通信协议头
	uint8_t rx_data[8] = {0};								// 暂存 CAN 接收数据
	motor_measure_t motorDataTmp;							// 电机数据
	uint8_t i = 0;

	if (hcan == &hcan1)
	{
		if (HAL_CAN_GetRxMessage(hcan, CAN_RX_FIFO0, &RxHeader, rx_data) == HAL_OK)	// 接收 CAN 总线上发送来的数据
		{
			// 对应电机向总线上发送的反馈的标识符和程序电机序号
            switch (RxHeader.StdId) {
                case CAN_PITCH_MOTOR_ID : i = MotorID_GimbalPitch; break;
                case CAN_YAW_MOTOR_ID : i = MotorID_GimbalYaw; break;
				#if DEBUGMODE
                	default : i = RxHeader.StdId - CAN_3508_M1_ID; break;
				#endif
            }
            // 电机返回数据协议解析
            get_motor_measure(&motorDataTmp, rx_data);
            // 向消息队列中填充数据
            if (messageQueueCreateFlag) {
                xQueueOverwriteFromISR(messageQueue[i], (void *)&motorDataTmp, &xHigherPriorityTaskWoken);
                portYIELD_FROM_ISR(xHigherPriorityTaskWoken);
            }
		}
	}
}
```

完整的工程可以看我开源的 [飞机云台程序](https://github.com/ittuann/RoboMaster_UAV-Gimbal_Ares2022) <https://github.com/ittuann/RoboMaster_UAV-Gimbal_Ares2022>
