"use client"

import React, { useEffect, useState } from "react"

interface RobotMascotProps {
  isPasswordHidden?: boolean
  focusedField?: string | null
}

export function RobotMascot({ isPasswordHidden = true, focusedField = null }: RobotMascotProps) {
  const [eyeAnimation, setEyeAnimation] = useState<"normal" | "closed" | "looking">(() => {
    if (isPasswordHidden) return "closed"
    return "normal"
  })
  const [handAnimation, setHandAnimation] = useState<"wave" | "cover">(() => {
    if (focusedField === "password") return "cover"
    return "wave"
  })
  const [showCard, setShowCard] = useState(focusedField === "email")

  useEffect(() => {
    if (isPasswordHidden) {
      setEyeAnimation("closed")
    } else {
      setEyeAnimation("normal")
    }
  }, [isPasswordHidden])

  useEffect(() => {
    if (focusedField === "password") {
      if (!isPasswordHidden) {
        setEyeAnimation("normal")
        setHandAnimation("wave")
      } else {
        setEyeAnimation("closed")
        setHandAnimation("cover")
      }
    } else if (focusedField === "email") {
      setEyeAnimation("looking")
      setHandAnimation("wave")
      setShowCard(true)
    } else if (focusedField) {
      setEyeAnimation("looking")
      setHandAnimation("wave")
      setShowCard(false)
    } else if (isPasswordHidden) {
      setEyeAnimation("closed")
      setHandAnimation("wave")
      setShowCard(false)
    } else {
      setEyeAnimation("normal")
      setHandAnimation("wave")
      setShowCard(false)
    }
  }, [focusedField, isPasswordHidden])

  const getEyeStyle = () => {
    if (eyeAnimation === "closed") {
      return { scaleY: 0.15, opacity: 0.6, transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" }
    }
    return { scaleY: 1, opacity: 1, transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" }
  }

  const getPupilStyle = () => {
    if (eyeAnimation === "closed") {
      return { transform: "translateY(18px)", transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" }
    } else if (eyeAnimation === "looking") {
      return { animation: "lookAround 1.5s ease-in-out infinite" }
    }
    return { transform: "translate(0, 0)", transition: "all 0.5s ease-in-out" }
  }

  const getMouthPath = () => {
    return eyeAnimation === "normal" ? "M 118 72 Q 140 82 162 72" : "M 120 75 Q 140 73 160 75"
  }

  return (
    <div className="flex justify-center items-center" style={{ animation: "float 4s ease-in-out infinite", perspective: "1000px" }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes headBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes armWaveLeft {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(15deg); }
        }
        
        @keyframes armWaveRight {
          0%, 100% { transform: rotate(5deg); }
          50% { transform: rotate(-15deg); }
        }
        
        @keyframes leftHandCover {
          0% { transform: translateY(0px) translateX(0px); }
          100% { transform: translateY(-45px) translateX(-15px); }
        }
        
        @keyframes rightHandCover {
          0% { transform: translateY(0px) translateX(0px); }
          100% { transform: translateY(-45px) translateX(15px); }
        }
        
        @keyframes antennaRotate {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }
        
        @keyframes lookAround {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(8px, -5px); }
          75% { transform: translate(-8px, -5px); }
        }
        
        @keyframes cardFloat {
          0%, 100% { transform: translateX(0px) translateY(0px) rotate(-8deg); }
          50% { transform: translateX(8px) translateY(-8px) rotate(-8deg); }
        }
        
        .robot-head {
          animation: headBob 2s ease-in-out infinite;
        }
        
        .robot-left-arm {
          transform-origin: 75px 220px;
          animation: armWaveLeft 1.5s ease-in-out infinite;
          transition: animation 0.3s ease-out;
        }
        
        .robot-left-arm.cover {
          animation: leftHandCover 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .robot-right-arm {
          transform-origin: 205px 220px;
          animation: armWaveRight 1.5s ease-in-out infinite;
          transition: animation 0.3s ease-out;
        }
        
        .robot-right-arm.cover {
          animation: rightHandCover 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .robot-antenna {
          animation: antennaRotate 2.5s ease-in-out infinite;
          transform-origin: 140px 20px;
        }
        
        .robot-card {
          animation: cardFloat 2s ease-in-out infinite;
        }
        
        .eye-left, .eye-right {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      <svg viewBox="0 0 280 400" width={200} height={286} style={{ filter: "drop-shadow(0 0 40px rgba(0, 212, 255, 0.3))" }}>
        {/* Antenna */}
        <g className="robot-antenna">
          <line x1="140" y1="0" x2="140" y2="20" stroke="#ff6b35" strokeWidth="3" strokeLinecap="round" />
          <circle cx="140" cy="0" r="6" fill="#ff6b35" stroke="#00d4ff" strokeWidth="1" />
        </g>

        {/* Head - Large Circle */}
        <g className="robot-head">
          {/* Head Glow */}
          <circle cx="140" cy="60" r="50" fill="none" stroke="#ff6b35" strokeWidth="2" opacity="0.4" />
          
          {/* Head Body */}
          <circle cx="140" cy="60" r="48" fill="#0a0a0f" stroke="#ff6b35" strokeWidth="3" />

          {/* Left Eye */}
          <ellipse 
            className="eye-left"
            cx="118" 
            cy="55" 
            rx="16" 
            ry="18" 
            fill="#00d4ff"
            style={{ ...getEyeStyle() }}
          />

          {/* Right Eye */}
          <ellipse 
            className="eye-right"
            cx="162" 
            cy="55" 
            rx="16" 
            ry="18" 
            fill="#00d4ff"
            style={{ ...getEyeStyle() }}
          />

          {/* Left Pupil */}
          <circle 
            cx="118" 
            cy="55" 
            r="6" 
            fill="#1a1a2e"
            style={getPupilStyle()}
          />

          {/* Right Pupil */}
          <circle 
            cx="162" 
            cy="55" 
            r="6" 
            fill="#1a1a2e"
            style={getPupilStyle()}
          />

          {/* Mouth */}
          <path
            d={getMouthPath()}
            stroke="#ff6b35"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            style={{ transition: "d 0.3s ease-in-out" }}
          />
        </g>

        {/* Body - Large Rectangle */}
        <g>
          {/* Outer Body Frame */}
          <rect x="60" y="110" width="160" height="150" rx="12" fill="none" stroke="#ff6b35" strokeWidth="3" />
          
          {/* Inner Body */}
          <rect x="65" y="115" width="150" height="140" rx="10" fill="#0a0a0f" stroke="#00d4ff" strokeWidth="2" opacity="0.7" />

          {/* Chest Light */}
          <circle cx="140" cy="185" r="12" fill="#ff6b35" opacity="0.8" />
          <circle cx="140" cy="185" r="8" fill="#ff6b35" opacity="1" />

          {/* Left Arm */}
          <g className={`robot-left-arm ${handAnimation === "cover" ? "cover" : ""}`}>
            {/* Upper Arm */}
            <rect x="40" y="195" width="50" height="32" rx="10" fill="#1a1a2e" stroke="#00d4ff" strokeWidth="2.5" />
            
            {/* Forearm/Hand */}
            <rect x="25" y="220" width="38" height="40" rx="8" fill="#0d0d15" stroke="#00d4ff" strokeWidth="2" />
            
            {/* Fingers */}
            <rect x="20" y="215" width="8" height="14" rx="2" fill="#1a1a2e" stroke="#00d4ff" strokeWidth="1.5" />
            <rect x="32" y="212" width="8" height="17" rx="2" fill="#1a1a2e" stroke="#00d4ff" strokeWidth="1.5" />
            <rect x="44" y="214" width="8" height="15" rx="2" fill="#1a1a2e" stroke="#00d4ff" strokeWidth="1.5" />
            <rect x="54" y="218" width="8" height="12" rx="2" fill="#1a1a2e" stroke="#00d4ff" strokeWidth="1.5" />
          </g>

          {/* Right Arm */}
          <g className={`robot-right-arm ${handAnimation === "cover" ? "cover" : ""}`}>
            {/* Upper Arm */}
            <rect x="190" y="195" width="50" height="32" rx="10" fill="#1a1a2e" stroke="#00d4ff" strokeWidth="2.5" />
            
            {/* Forearm/Hand */}
            <rect x="217" y="220" width="38" height="40" rx="8" fill="#0d0d15" stroke="#00d4ff" strokeWidth="2" />
            
            {/* Fingers */}
            <rect x="252" y="215" width="8" height="14" rx="2" fill="#1a1a2e" stroke="#00d4ff" strokeWidth="1.5" />
            <rect x="240" y="212" width="8" height="17" rx="2" fill="#1a1a2e" stroke="#00d4ff" strokeWidth="1.5" />
            <rect x="228" y="214" width="8" height="15" rx="2" fill="#1a1a2e" stroke="#00d4ff" strokeWidth="1.5" />
            <rect x="218" y="218" width="8" height="12" rx="2" fill="#1a1a2e" stroke="#00d4ff" strokeWidth="1.5" />
          </g>
        </g>

        {/* Legs */}
        <g>
          {/* Left Leg */}
          <rect x="85" y="265" width="24" height="55" rx="8" fill="#0a0a0f" stroke="#00d4ff" strokeWidth="2.5" />

          {/* Right Leg */}
          <rect x="171" y="265" width="24" height="55" rx="8" fill="#0a0a0f" stroke="#00d4ff" strokeWidth="2.5" />

          {/* Left Foot */}
          <rect x="75" y="320" width="44" height="24" rx="6" fill="none" stroke="#00d4ff" strokeWidth="2" />
          <rect x="82" y="327" width="10" height="12" rx="2" fill="#00d4ff" opacity="0.4" />
          <rect x="104" y="327" width="10" height="12" rx="2" fill="#00d4ff" opacity="0.4" />

          {/* Right Foot */}
          <rect x="161" y="320" width="44" height="24" rx="6" fill="none" stroke="#00d4ff" strokeWidth="2" />
          <rect x="168" y="327" width="10" height="12" rx="2" fill="#00d4ff" opacity="0.4" />
          <rect x="190" y="327" width="10" height="12" rx="2" fill="#00d4ff" opacity="0.4" />
        </g>

        {/* Email Card */}
        {showCard && (
          <g className="robot-card" style={{ transform: "translate(210px, 35px)" }}>
            <rect x="0" y="0" width="60" height="50" rx="6" fill="#ff6b35" stroke="#00d4ff" strokeWidth="2" />
            <rect x="6" y="10" width="48" height="32" rx="3" fill="none" stroke="#1a1a2e" strokeWidth="2" />
            <path d="M 6 10 L 30 26 L 54 10" fill="none" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* Glow Filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  )
}
