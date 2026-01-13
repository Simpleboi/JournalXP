/**
 * Dot Component
 *
 * Renders an individual tap-able dot with animations and lifecycle management.
 */

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DotProps } from './types';
import { getColorById, getDotLifePercentage } from './utils/dotGenerator';

export const Dot = ({ dot, targetColorId, onTap, disabled = false }: DotProps) => {
  const [lifePercentage, setLifePercentage] = useState(1);
  const shouldReduceMotion = useReducedMotion();

  const color = getColorById(dot.colorId);
  const isTarget = dot.colorId === targetColorId;

  // Update life percentage for fade-out animation
  useEffect(() => {
    const interval = setInterval(() => {
      const percentage = getDotLifePercentage(dot);
      setLifePercentage(percentage);

      if (percentage <= 0) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [dot]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      onTap(dot.id, dot.colorId);
    }
  };

  if (!color) {
    return null; // Invalid color ID
  }

  // Opacity fades in last 20% of lifespan
  const opacity = lifePercentage < 0.2 ? lifePercentage * 5 : 1;

  return (
    <motion.button
      className={`absolute rounded-full ${color.bg} shadow-lg hover:shadow-xl
                  transition-shadow cursor-pointer select-none
                  focus:outline-none focus:ring-4 focus:ring-offset-2
                  ${isTarget ? 'focus:ring-yellow-400' : 'focus:ring-gray-300'}
                  disabled:cursor-not-allowed disabled:opacity-50`}
      style={{
        left: `${dot.x}%`,
        top: `${dot.y}%`,
        width: `${dot.size}px`,
        height: `${dot.size}px`,
        transform: 'translate(-50%, -50%)', // Center on position
        opacity,
        zIndex: 10,
      }}
      onClick={handleClick}
      disabled={disabled}
      aria-label={`${isTarget ? 'Target' : 'Distractor'} ${color.name} dot`}
      // Animations
      initial={
        shouldReduceMotion
          ? { scale: 1 }
          : {
              scale: 0,
              rotate: -180,
            }
      }
      animate={
        shouldReduceMotion
          ? { scale: 1 }
          : {
              scale: 1,
              rotate: 0,
            }
      }
      exit={
        shouldReduceMotion
          ? { scale: 0.8 }
          : {
              scale: 0,
              rotate: 180,
            }
      }
      whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
    >
      {/* Accessibility: Screen reader hint */}
      <span className="sr-only">
        {isTarget ? `Tap this ${color.name} dot` : `Don't tap this ${color.name} dot`}
      </span>
    </motion.button>
  );
};
