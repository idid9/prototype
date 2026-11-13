import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
  forceDark?: boolean;
  delay?: number;
  hoverLift?: boolean;
}

/**
 * Reusable frosted glass surface powered by CSS variables & ThemeContext.
 * Supports smooth Framer Motion entrance animations and dynamic backdrop-blur/opacity.
 */
export const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  className = '',
  forceDark,
  delay = 0,
  hoverLift = false,
}) => {
  const { getGlassyCardStyle } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hoverLift ? { y: -2 } : undefined}
      style={getGlassyCardStyle(forceDark)}
      className={`rounded-2xl transition-colors duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};
