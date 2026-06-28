import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconMoon, IconSun } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

/** Reads the theme with the no-FOUC script already applied. */
function getInitialDark() {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

/**
 * Light/dark toggle
 */
export function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(getInitialDark);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle color theme"
      onClick={() => setIsDark((v) => !v)}
      className="text-primary hover:bg-secondary"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.2 }}
          className="flex"
        >
          {isDark ? <IconMoon size={20} /> : <IconSun size={20} />}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}

export default ThemeToggle;
