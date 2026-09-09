import React, { useEffect, useState } from "react";
import GradientWaves from "@/components/ui/GradientWaves";

/** Fixed wave palettes for light and dark themes. */
const PALETTES = {
  light: { horizon: "#d5e4f8", wave: "#0058be", crest: "#ffffff" },
  dark: { horizon: "#243044", wave: "#adc6ff", crest: "#cfe0ff" },
} as const;

const FooterWaves: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => setIsDark(root.classList.contains("dark"));
    syncTheme();
  }, []);

  const palette = isDark ? PALETTES.dark : PALETTES.light;

  return (
    <div className="h-full w-full">
      {
        <GradientWaves
          horizonColor={palette.horizon}
          waveColor={palette.wave}
          crestColor={palette.crest}
          speed={0.25}
          amplitude={3}
          waveScale={0.6}
          waveRatio={0.9}
          height={2.5}
          fogDepth={30}
          detail="low"
          brightness={isDark ? 0.95 : 1}
          opacity={isDark ? 0.9 : 1}
          mouseInteraction={true}
          parallaxStrength={0.4}
          grain={true}
          grainIntensity={0.04}
        />
      }
    </div>
  );
};

export default FooterWaves;
