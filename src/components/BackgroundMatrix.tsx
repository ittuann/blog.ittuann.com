import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

// 定义元素接口
interface BaseElement {
  id: string;
  x: number; // %
  y: number; // %
  size: number; // px
  delay: number; // seconds
  duration: number; // seconds
}

// 共享相同的结构
type AnimatedElement = BaseElement;

// 生成随机属性的辅助函数
const generateRandomElements = (
  count: number,
  minSize: number,
  maxSize: number,
  maxDuration: number,
): AnimatedElement[] => {
  return Array.from({ length: count }).map(() => ({
    id: Math.random().toString(36).substring(2, 9),
    x: Math.random() * 100, // 随机 X 坐标 (%)
    y: Math.random() * 100, // 随机 Y 坐标 (%)
    size: Math.random() * (maxSize - minSize) + minSize, // 随机尺寸
    delay: Math.random() * 5, // 随机延迟，错开动画时间
    duration: Math.random() * maxDuration + 3, // 随机动画周期
  }));
};

const CrossPattern = () => (
  <div
    className="absolute inset-0 opacity-60"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpath d='M40 36 V 44 M 36 40 H 44' stroke='%23cbd5e1' stroke-width='1' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
      backgroundSize: "80px 80px",
      backgroundPosition: "center center",
    }}
  />
);

// 纯十字点阵背景
export const BackgroundCross: React.FC = () => (
  <div className="bg-background pointer-events-none fixed inset-0 z-[-1] overflow-hidden select-none">
    <CrossPattern />
  </div>
);

export const BackgroundMatrix: React.FC = () => {
  // 使用接口定义状态类型
  const [squares, setSquares] = useState<AnimatedElement[]>([]);
  const [diamonds, setDiamonds] = useState<AnimatedElement[]>([]);
  const [crosses, setCrosses] = useState<AnimatedElement[]>([]);
  const [circles, setCircles] = useState<AnimatedElement[]>([]);
  const [waves, setWaves] = useState<AnimatedElement[]>([]);
  const [triangles, setTriangles] = useState<AnimatedElement[]>([]);

  useEffect(() => {
    setSquares(generateRandomElements(6, 10, 40, 5));
    setDiamonds(generateRandomElements(8, 12, 30, 6));
    setCrosses(generateRandomElements(15, 10, 25, 4));
    setCircles(generateRandomElements(12, 40, 100, 6));
    setTriangles(generateRandomElements(6, 15, 35, 6));
    setWaves(generateRandomElements(3, 30, 80, 8));
  }, []);

  return (
    <div className="bg-background pointer-events-none fixed inset-0 z-[-1] overflow-hidden select-none">
      {/* 十字点阵背景 */}
      <CrossPattern />

      {/* 1. 方块淡出 */}
      {squares.map((sq) => (
        <motion.div
          key={sq.id}
          className="absolute border border-slate-300/50 bg-slate-200/40"
          style={{
            width: sq.size,
            height: sq.size,
            top: `${sq.y}%`,
            left: `${sq.x}%`,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: sq.duration,
            repeat: Infinity,
            delay: sq.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 2. 菱形 — 方块旋转 45° */}
      {diamonds.map((dm) => (
        <motion.div
          key={dm.id}
          className="absolute border border-slate-400/50"
          style={{
            width: dm.size,
            height: dm.size,
            top: `${dm.y}%`,
            left: `${dm.x}%`,
            rotate: 45,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0.7, 1.1, 0.7],
            rotate: [45, 90, 45],
          }}
          transition={{
            duration: dm.duration,
            repeat: Infinity,
            delay: dm.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 3. 旋转十字星标 */}
      {crosses.map((cr) => (
        <motion.div
          key={cr.id}
          className="absolute flex items-center justify-center"
          style={{
            top: `${cr.y}%`,
            left: `${cr.x}%`,
            width: cr.size,
            height: cr.size,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.7, 0],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: cr.duration,
            repeat: Infinity,
            delay: cr.delay,
            ease: "easeInOut",
          }}
        >
          <div className="relative h-full w-full">
            <div className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-slate-400" />
            <div className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-slate-400" />
          </div>
        </motion.div>
      ))}

      {/* 4. 虚线圆圈 */}
      {circles.map((ci) => (
        <motion.div
          key={ci.id}
          className="absolute rounded-full border border-dashed border-slate-400"
          style={{
            width: ci.size,
            height: ci.size,
            top: `${ci.y}%`,
            left: `${ci.x}%`,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.4, 0],
            rotate: [0, 180],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: ci.duration,
            repeat: Infinity,
            delay: ci.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* 5. 三角形 旋转 */}
      {triangles.map((tr) => (
        <motion.svg
          key={tr.id}
          className="absolute overflow-visible"
          style={{
            top: `${tr.y}%`,
            left: `${tr.x}%`,
            width: tr.size,
            height: tr.size,
          }}
          viewBox="0 0 100 100"
          initial={{ opacity: 0, rotate: 0 }}
          animate={{
            opacity: [0, 0.7, 0],
            scale: [0.8, 1.1, 0.8],
            rotate: [0, 120, 240],
          }}
          transition={{
            duration: tr.duration,
            repeat: Infinity,
            delay: tr.delay,
            ease: "easeInOut",
          }}
        >
          <polygon
            points="50,6 94,90 6,90"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </motion.svg>
      ))}

      {/* 6. 波浪线 */}
      {waves.map((wv) => (
        <motion.svg
          key={wv.id}
          className="absolute overflow-visible"
          style={{
            top: `${wv.y}%`,
            left: `${wv.x}%`,
            width: wv.size * 2.5,
            height: wv.size * 0.5,
          }}
          viewBox="0 0 100 30"
        >
          <motion.path
            d="M 0 15 Q 12.5 0, 25 15 T 50 15 T 75 15 T 100 15"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{
              pathLength: [0, 1, 1, 1],
              opacity: [0, 0.65, 0.65, 0],
            }}
            transition={{
              duration: wv.duration,
              repeat: Infinity,
              delay: wv.delay,
              ease: "easeInOut",
              times: [0, 0.5, 0.8, 1],
            }}
          />
        </motion.svg>
      ))}
    </div>
  );
};
