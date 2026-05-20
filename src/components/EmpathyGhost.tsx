"use client";

import React from "react";
import { motion } from "framer-motion";

interface EmpathyGhostProps {
  state?: "idle" | "wave" | "listening" | "happy" | "sleepy";
  width?: number;
  height?: number;
  className?: string;
}

export default function EmpathyGhost({
  state = "idle",
  width = 120,
  height = 120,
  className = "",
}: EmpathyGhostProps) {
  // Floating animation for the ghost body
  const bodyFloating = {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Shadow shrinking/growing with the float
  const shadowAnim = {
    animate: {
      scale: [1, 0.85, 1],
      opacity: [0.3, 0.15, 0.3],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Eyes animations based on state
  const getEyes = () => {
    switch (state) {
      case "listening":
        // Curved happy closed eyes (supportive, calm listener)
        return (
          <>
            {/* Left closed eye */}
            <path
              d="M38 52 C38 48, 46 48, 46 52"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right closed eye */}
            <path
              d="M74 52 C74 48, 82 48, 82 52"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        );
      case "happy":
        // Arch smiling eyes
        return (
          <>
            <path
              d="M36 54 C36 46, 46 46, 46 54"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M74 54 C74 46, 84 46, 84 54"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </>
        );
      case "sleepy":
        // Straight sleeping/relaxed eyes
        return (
          <>
            <line x1="36" y1="52" x2="48" y2="52" stroke="#A3A3A3" strokeWidth="4" strokeLinecap="round" />
            <line x1="72" y1="52" x2="84" y2="52" stroke="#A3A3A3" strokeWidth="4" strokeLinecap="round" />
          </>
        );
      case "wave":
      case "idle":
      default:
        // Wide cute eyes
        return (
          <>
            {/* Left Eye */}
            <motion.ellipse
              cx="42"
              cy="52"
              rx="5.5"
              ry="7.5"
              fill="#FFFFFF"
              animate={{
                scaleY: [1, 0.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatDelay: 3,
                times: [0, 0.05, 0.1],
              }}
            />
            {/* Right Eye */}
            <motion.ellipse
              cx="78"
              cy="52"
              rx="5.5"
              ry="7.5"
              fill="#FFFFFF"
              animate={{
                scaleY: [1, 0.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatDelay: 3,
                times: [0, 0.05, 0.1],
              }}
            />
          </>
        );
    }
  };

  // Mouth animation
  const getMouth = () => {
    switch (state) {
      case "happy":
        // Big open smile
        return (
          <path
            d="M54 62 Q60 70 66 62"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        );
      case "listening":
        // Little gentle curved smile
        return (
          <path
            d="M57 60 Q60 64 63 60"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        );
      case "sleepy":
        // O-shaped tiny mouth yawning
        return <circle cx="60" cy="62" r="3.5" fill="#A3A3A3" />;
      case "wave":
      case "idle":
      default:
        // Small curved smile
        return (
          <path
            d="M56 61 Q60 66 64 61"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        );
    }
  };

  // Left arm animation
  const leftArmRotation = state === "listening" ? 25 : 0;

  // Right arm animation
  const getRightArmAnimation = () => {
    if (state === "wave") {
      return {
        rotate: [0, -35, 0, -35, 0],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
      };
    }
    if (state === "listening") {
      return { rotate: -25 };
    }
    return { rotate: 0 };
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Listening stars or sleeping Zzzs */}
      <div className="h-6 relative w-full flex justify-center">
        {state === "listening" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0, 1, 0],
              y: [-5, -20, -30],
              x: [-10, 10, -5],
              scale: [0.6, 1.1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute text-accent text-sm font-bold"
          >
            ✨👂✨
          </motion.div>
        )}
        {state === "sleepy" && (
          <motion.div
            animate={{
              opacity: [0, 1, 0],
              y: [5, -15, -30],
              x: [5, 15, 25],
              scale: [0.7, 1.2, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute text-text-muted text-xs font-bold font-mono"
            style={{ left: "60%" }}
          >
            Zzz...
          </motion.div>
        )}
      </div>

      <motion.svg
        width={width}
        height={height}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        variants={bodyFloating}
        animate="animate"
        className="drop-shadow-[0_10px_15px_rgba(168,85,247,0.15)]"
      >
        {/* Soft purple body gradient */}
        <defs>
          <linearGradient id="ghostGradient" x1="60" y1="20" x2="60" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <filter id="cheekGlow" x="0" y="0" width="20" height="20">
            <feGaussianBlur stdDeviation="3" result="blur" />
          </filter>
        </defs>

        {/* Left Arm */}
        <motion.path
          d="M25 65 C15 65, 10 72, 16 78 C22 84, 28 78, 28 70"
          fill="#A855F7"
          animate={{ rotate: leftArmRotation }}
          style={{ originX: "28px", originY: "70px" }}
        />

        {/* Right Arm */}
        <motion.path
          d="M95 65 C105 65, 110 72, 104 78 C98 84, 92 78, 92 70"
          fill="#8B5CF6"
          animate={getRightArmAnimation()}
          style={{ originX: "92px", originY: "70px" }}
        />

        {/* Ghost Main Body */}
        <path
          d="M60 20 
             C35 20, 26 40, 26 65 
             C26 80, 24 95, 30 102 
             C35 106, 42 98, 48 102
             C54 106, 60 98, 66 102
             C72 106, 78 98, 84 102
             C90 106, 95 101, 94 92
             C93 80, 94 65, 94 65
             C94 40, 85 20, 60 20 Z"
          fill="url(#ghostGradient)"
        />

        {/* Blushing cheeks */}
        <circle cx="34" cy="62" r="5" fill="#EC4899" fillOpacity="0.5" filter="url(#cheekGlow)" />
        <circle cx="86" cy="62" r="5" fill="#EC4899" fillOpacity="0.5" filter="url(#cheekGlow)" />

        {/* Dynamic Eyes */}
        {getEyes()}

        {/* Dynamic Mouth */}
        {getMouth()}
      </motion.svg>

      {/* Floating shadow beneath the ghost */}
      <motion.div
        variants={shadowAnim}
        animate="animate"
        className="w-16 h-2 bg-black/40 rounded-full blur-[2px] mt-1"
      />
    </div>
  );
}
