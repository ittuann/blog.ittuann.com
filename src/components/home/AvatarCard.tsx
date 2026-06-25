import { motion } from "motion/react";

export function AvatarCard({ className }: { className?: string }) {
  return (
    <motion.div
      className={`flex items-center justify-center ${className ?? ""}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative">
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [-5, 5, -5] }}
          transition={{
            repeat: Infinity,
            duration: 3.5,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute -top-5 left-5 z-1 text-5xl text-purple-400 opacity-70"
        >
          ✦
        </motion.div>
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 45, 0] }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-5 right-2 z-1 text-4xl font-bold text-blue-400 opacity-80"
        >
          +
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
          transition={{
            repeat: Infinity,
            duration: 4.5,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="absolute right-5 -bottom-2 z-1 text-2xl font-bold text-gray-400 opacity-60"
        >
          #
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-5 left-5 z-1 h-3 w-3 rounded-full bg-blue-300"
        />

        <motion.div
          className="relative z-10 overflow-hidden rounded-full shadow-xl select-none"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img
            src="/avatar.webp"
            alt="air wish avatar"
            width={320}
            height={320}
            className="block max-w-full"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default AvatarCard;
