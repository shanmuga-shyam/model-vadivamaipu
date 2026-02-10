"use client"

import React, { useState, useEffect, useLayoutEffect, useRef } from "react"
import { 
  createGrid, 
  findClosestGridPoint, 
  generateFlowingPath, 
  smoothPath,
  getGridPointNearElement,
  type GridPoint 
} from "@/lib/grid-pathfinding"

type RobotAnimation = "idle" | "flying" | "landing" | "waving" | "thumbsup" | "pointing" | "holding"

interface RobotMascotProps {
  variant?: RobotAnimation
  targetCard?: HTMLElement | null
  position?: "top-right" | "bottom-right" | "card-edge"
  clickable?: boolean
  onClick?: (() => void) | undefined
  onAnimationComplete?: () => void
}

export function RobotMascot({ 
  variant = "idle", 
  targetCard = null,
  position = "top-right",
  clickable = false,
  onClick,
  onAnimationComplete 
}: RobotMascotProps) {
  const [currentVariant, setCurrentVariant] = useState<RobotAnimation>(variant)
  const [isMounted, setIsMounted] = useState(false)
  const [hasInitialPosition, setHasInitialPosition] = useState(false)
  // Center-based coordinate system: (0,0) is center of page
  // Bottom-left: negative X (left), positive Y (bottom)
  // Use fixed initial values to avoid hydration mismatch - will be updated in useEffect
  const [robotPosition, setRobotPosition] = useState({ x: -400, y: 200 })
  const [isFlying, setIsFlying] = useState(false)

  
  const [flightPath, setFlightPath] = useState<Array<{x: number, y: number}>>([])
  const [gridPoints, setGridPoints] = useState<GridPoint[]>([])
  const [showGrid, setShowGrid] = useState(true)
  const robotRef = useRef<HTMLDivElement>(null)
  const homePosition = useRef({ x: -400, y: 200 })
  const holdingPosition = useRef<{ x: number, y: number } | null>(null)
  const animationRef = useRef<number | undefined>(undefined)

  // Set initial position SYNCHRONOUSLY before paint using useLayoutEffect
  useLayoutEffect(() => {
    // Calculate bottom-left position immediately
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    
    const initPos = {
      x: -centerX + 80,   // Left side: negative from center + small padding
      y: centerY - 200    // Bottom: positive from center - padding from edge
    }
    homePosition.current = initPos
    setRobotPosition(initPos)
    setIsMounted(true)
    
    // Enable transitions after a short delay (after first paint)
    requestAnimationFrame(() => {
      setHasInitialPosition(true)
    })
    
    console.log('🏠 Robot initial position (bottom-left, center-based):', initPos)
    console.log('📐 Screen position:', { x: centerX + initPos.x, y: centerY + initPos.y })
  }, [])

  // Create grid on mount (can be async)
  useEffect(() => {
    const gridConfig = createGrid(100)
    const allPoints = [];
    
    for (let row = 0; row < gridConfig.rows; row++) {
      for (let col = 0; col < gridConfig.cols; col++) {
        allPoints.push({
          x: col * gridConfig.cellSize + gridConfig.cellSize / 2,
          y: row * gridConfig.cellSize + gridConfig.cellSize / 2,
          row,
          col
        })
      }
    }
    
    setGridPoints(allPoints)
    console.log('📊 Grid created:', gridConfig.rows, 'x', gridConfig.cols, '=', allPoints.length, 'points')
    
    // Hide grid after 3 seconds
    setTimeout(() => setShowGrid(false), 3000)
  }, [])

  // Handle flying animation with grid-based flowing path
  useEffect(() => {
    if (variant === "flying" && targetCard) {
      const gridConfig = createGrid(100)
      
      // Get viewport center for coordinate conversion
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      
      // Determine starting position
      let screenX: number, screenY: number
      
      if (holdingPosition.current) {
        // Flying from a card position (center-based coords)
        const currentPos = holdingPosition.current
        screenX = centerX + currentPos.x + 60
        screenY = centerY + currentPos.y + 70
      } else {
        // Flying from resting position (fixed bottom-left: left: 200px, bottom: 50px)
        screenX = 200 + 60  // left position + robot center offset
        screenY = window.innerHeight - 50 - 70  // bottom position converted to top-based
        
        // IMPORTANT: Set the center-based position to match the resting position
        // BEFORE we switch to flying mode, to avoid the jump to center
        const startCenterX = screenX - centerX - 60
        const startCenterY = screenY - centerY - 70
        setRobotPosition({ x: startCenterX, y: startCenterY })
      }
      
      // Now enable flying mode after position is set
      setIsFlying(true)
      setCurrentVariant("flying")
      
      console.log('📍 Starting from screen position:', { screenX, screenY })
      console.log('📐 Window size:', { width: window.innerWidth, height: window.innerHeight })
      
      const startPoint = findClosestGridPoint(
        screenX,
        screenY,
        gridConfig
      )
      
      // Get end grid point (near card)
      const endPoint = getGridPointNearElement(targetCard, gridConfig, { x: -150, y: 0 })
      
      console.log('🚀 Flying through grid')
      console.log('Start grid point:', startPoint)
      console.log('End grid point:', endPoint)
      
      // Generate flowing path with random intermediate points
      const gridPath = generateFlowingPath(startPoint, endPoint, gridConfig, 4)
      console.log('🌊 Flow path points:', gridPath.length)
      
      // Smooth the path
      const smoothedPath = smoothPath(gridPath, 40)
      console.log('✨ Smoothed to', smoothedPath.length, 'points')
      
      setFlightPath(smoothedPath)
      
      // Animate through path
      let pathIndex = 0
      const totalPoints = smoothedPath.length
      const speed = 0.4 // Points per frame (slower movement)
      
      const animate = () => {
        if (pathIndex < totalPoints) {
          const point = smoothedPath[Math.floor(pathIndex)]
          // Convert screen coordinates back to center-based coordinates
          const centerX = window.innerWidth / 2
          const centerY = window.innerHeight / 2
          setRobotPosition({ 
            x: point.x - centerX - 60, 
            y: point.y - centerY - 70 
          })
          pathIndex += speed
          animationRef.current = requestAnimationFrame(animate)
        } else {
          // Reached near card, now position robot at card edge
          const cardRect = targetCard.getBoundingClientRect()
          
          // Position robot at left edge of card, vertically centered (screen coords)
          const cardEdgeX = cardRect.left - 160
          const cardEdgeY = cardRect.top + (cardRect.height / 2) - 70
          
          // Convert to center-based coordinates
          const centerX = window.innerWidth / 2
          const centerY = window.innerHeight / 2
          
          // SWAP: Update the global static position to this new endpoint
          const newStaticPos = { 
            x: cardEdgeX - centerX, 
            y: cardEdgeY - centerY 
          }
          holdingPosition.current = newStaticPos // This becomes the new starting point
          setRobotPosition(newStaticPos)
          setFlightPath([])
          setIsFlying(false)
          
          console.log('🔄 Position swapped - new static position (center-based):', holdingPosition.current)
          
          setTimeout(() => {
            setCurrentVariant("holding")
            console.log('✋ Robot holding at:', holdingPosition.current)
            onAnimationComplete?.()
          }, 100)
        }
      }
      
      animationRef.current = requestAnimationFrame(animate)
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
      
    } else if (variant === "idle") {
      console.log('🏠 Returning to bottom-left home position')
      setCurrentVariant("idle")
      holdingPosition.current = null
      
      // Recalculate bottom-left position to ensure accuracy
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const bottomLeftPos = {
        x: -centerX + 80,
        y: centerY - 200
      }
      homePosition.current = bottomLeftPos
      setRobotPosition(bottomLeftPos)
      setFlightPath([])
      setIsFlying(false)
      
      console.log('📍 Home position set to bottom-left:', bottomLeftPos)
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    } else if (variant === "holding" && holdingPosition.current) {
      // Lock robot at current holding position - don't allow any movement
      const lockedPos = holdingPosition.current
      setRobotPosition(lockedPos)
      console.log('🔒 Position locked at:', lockedPos)
    }
  }, [variant, targetCard])
  const variantClass = {
    idle: "robot-idle",
    flying: "robot-flying",
    landing: "robot-landing",
    waving: "robot-waving",
    thumbsup: "robot-thumbsup",
    pointing: "robot-pointing",
    holding: "robot-holding",
  }[currentVariant]

  // Don't render until mounted to avoid hydration mismatch flash
  if (!isMounted) {
    return null
  }

  // Use simple left/bottom positioning for idle state, center-based for flying/holding
  const isAtRest = currentVariant === 'idle' && !isFlying
  
  const positionStyle = isAtRest 
    ? {
        left: '24px',      // Fixed position from left (bottom-left)
        bottom: '50px',     // Fixed position from bottom
        top: 'auto',
        transform: 'none',
      }
    : {
        left: '50%',
        top: '50%',
        bottom: 'auto',
        transform: `translate(calc(-50% + ${robotPosition.x}px), calc(-50% + ${robotPosition.y}px))`,
      }

  return (
    <div
      ref={robotRef}
      className={`fixed z-50 w-[120px] h-[140px] ${variantClass}`}
      onClick={() => {
        if (clickable && onClick) onClick()
      }}
      style={{
        ...positionStyle,
        transition: hasInitialPosition && isAtRest ? 'left 2s ease-in-out, bottom 2s ease-in-out' : 'none',
        pointerEvents: clickable ? 'auto' : 'none',
        cursor: clickable ? 'pointer' : 'default',
        willChange: 'transform, left, bottom'
      }}
    >
      {/* Grid Overlay */}
      {showGrid && gridPoints.length > 0 && (
        <svg
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 0.15
          }}
        >
          {gridPoints.map((point, idx) => (
            <circle
              key={idx}
              cx={point.x}
              cy={point.y}
              r="2"
              fill="#ff9a3c"
            />
          ))}
        </svg>
      )}
      
      {/* Flight Path Visualization */}
      {flightPath.length > 0 && isFlying && (
        <svg
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 45
          }}
        >
          <path
            d={`M ${flightPath.map((p, i) => `${i === 0 ? '' : 'L '}${p.x} ${p.y}`).join(' ')}`}
            stroke="rgba(255, 154, 60, 0.5)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="8,4"
          />
          {flightPath.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r="3"
              fill="#ff6b35"
              opacity={0.6}
            />
          ))}
        </svg>
      )}
      
      <div className="relative w-full h-full">
        <div className="particles-container absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`particle particle-${i}`} />
          ))}
        </div>

        {/* Jet boosters */}
        <div className="booster-container absolute bottom-0 left-1/2 -translate-x-1/2" style={{ zIndex: 2 }}>
          <div className="booster booster-left" />
          <div className="booster booster-right" />
        </div>

        <svg viewBox="0 0 280 320" className="robot-svg w-full h-full relative drop-shadow-2xl" style={{ zIndex: 5 }}>
          <defs>
            <linearGradient id="bodyShell" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a8d5ff" stopOpacity="1" />
              <stop offset="50%" stopColor="#89c4f4" stopOpacity="1" />
              <stop offset="100%" stopColor="#6eb5f0" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="visor" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
            <linearGradient id="accentBlue" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#ff9a3c" floodOpacity="0.4" />
              <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="#00d4ff" floodOpacity="0.3" />
            </filter>
            <radialGradient id="ledGlow">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="1" />
              <stop offset="50%" stopColor="#c4b5fd" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ddd6fe" stopOpacity="0.3" />
            </radialGradient>
          </defs>

          <g filter="url(#softGlow)" className="robot-body">
            {/* Head */}
            <g className="head-group">
              <rect x="82" y="30" width="116" height="96" rx="38" fill="url(#bodyShell)" stroke="#e2e8f0" strokeWidth="2.5" />
              <rect x="94" y="44" width="92" height="68" rx="24" fill="url(#visor)" stroke="#334155" strokeWidth="2" />

              {/* LED Eyes with glow */}
              <g className="eyes">
                <g className="eye eye-left">
                  <ellipse cx="120" cy="78" rx="14" ry="16" fill="#0f172a" />
                  <circle className="pupil" cx="120" cy="78" r="9" fill="url(#ledGlow)" filter="url(#glow)" />
                  <circle cx="117" cy="75" r="3.5" fill="#fff" opacity="0.8" />
                  <ellipse className="led-ring" cx="120" cy="78" rx="11" ry="13" fill="none" stroke="#c4b5fd" strokeWidth="0.5" opacity="0.6" />
                </g>
                <g className="eye eye-right">
                  <ellipse cx="160" cy="78" rx="14" ry="16" fill="#0f172a" />
                  <circle className="pupil" cx="160" cy="78" r="9" fill="url(#ledGlow)" filter="url(#glow)" />
                  <circle cx="157" cy="75" r="3.5" fill="#fff" opacity="0.8" />
                  <ellipse className="led-ring" cx="160" cy="78" rx="11" ry="13" fill="none" stroke="#c4b5fd" strokeWidth="0.5" opacity="0.6" />
                </g>
              </g>

              {/* Cheerful smile */}
              <path
                className="smile"
                d="M110 104 Q140 120 170 104"
                stroke="url(#accent)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
                opacity="0.95" />

              {/* Antennas */}
              <g className="antenna antenna-left">
                <line x1="108" y1="28" x2="100" y2="12" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="98" cy="10" r="7" fill="url(#accent)" filter="url(#glow)" />
                <circle cx="98" cy="10" r="4" fill="#fff" opacity="0.4" />
              </g>
              <g className="antenna antenna-right">
                <line x1="172" y1="28" x2="180" y2="12" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="182" cy="10" r="7" fill="url(#accentBlue)" filter="url(#glow)" />
                <circle cx="182" cy="10" r="4" fill="#fff" opacity="0.4" />
              </g>
            </g>

            {/* Body */}
            <g className="body-group">
              <rect x="78" y="120" width="124" height="110" rx="40" fill="url(#bodyShell)" stroke="#e2e8f0" strokeWidth="2.5" />
              <rect x="98" y="136" width="84" height="58" rx="16" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />

              {/* Central core light */}
              <circle cx="140" cy="165" r="10" fill="#1e293b" opacity="0.2" />
              <circle cx="140" cy="165" r="6" fill="url(#accent)" filter="url(#glow)" />
              <circle cx="138" cy="163" r="2" fill="#fff" opacity="0.6" />

              {/* Status bar */}
              <rect x="116" y="200" width="48" height="10" rx="5" fill="#fff3e6" stroke="url(#accent)" strokeWidth="1.5" />
              <rect x="118" y="202" width="20" height="6" rx="3" fill="url(#accent)" />
            </g>

            {/* Arms */}
            <g className="arms" strokeWidth="3" strokeLinecap="round">
              <g className="arm-left">
                <line className="arm-upper" x1="84" y1="160" x2="56" y2="186" stroke="#e2e8f0" strokeWidth="3" />
                <line className="arm-lower" x1="56" y1="186" x2="54" y2="214" stroke="#e2e8f0" strokeWidth="3" />
                <circle cx="54" cy="216" r="11" fill="#1e293b" stroke="#e2e8f0" strokeWidth="2" />

                {/* Hand */}
                <g className="hand-left">
                  <ellipse cx="54" cy="227" rx="14" ry="18" fill="#334155" stroke="#e2e8f0" strokeWidth="2" />
                  <path d="M44 221 L44 239" stroke="#1e293b" strokeWidth="2.5" />
                  <path d="M48 219 L48 241" stroke="#1e293b" strokeWidth="2.5" />
                  <path d="M54 217 L54 243" stroke="#1e293b" strokeWidth="2.5" />
                  <path d="M60 219 L60 241" stroke="#1e293b" strokeWidth="2.5" />
                  <path d="M64 221 L64 239" stroke="#1e293b" strokeWidth="2.5" />
                </g>
              </g>

              <g className="arm-right">
                <line className="arm-upper" x1="196" y1="160" x2="224" y2="186" stroke="#e2e8f0" strokeWidth="3" />
                <line className="arm-lower" x1="224" y1="186" x2="226" y2="214" stroke="#e2e8f0" strokeWidth="3" />
                <circle cx="226" cy="216" r="11" fill="#1e293b" stroke="#e2e8f0" strokeWidth="2" />

                {/* Hand */}
                <g className="hand-right">
                  <ellipse cx="226" cy="227" rx="14" ry="18" fill="#334155" stroke="#e2e8f0" strokeWidth="2" />
                  <path d="M216 221 L216 239" stroke="#1e293b" strokeWidth="2.5" />
                  <path d="M220 219 L220 241" stroke="#1e293b" strokeWidth="2.5" />
                  <path d="M226 217 L226 243" stroke="#1e293b" strokeWidth="2.5" />
                  <path d="M232 219 L232 241" stroke="#1e293b" strokeWidth="2.5" />
                  <path d="M236 221 L236 239" stroke="#1e293b" strokeWidth="2.5" />
                </g>
              </g>
            </g>

            {/* Legs */}
            <g className="legs">
              <g className="leg-left">
                <rect x="104" y="230" width="26" height="44" rx="12" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2.5" />
                <rect x="96" y="274" width="42" height="16" rx="8" fill="url(#accent)" />
                <ellipse cx="117" cy="282" rx="8" ry="3" fill="#ff8c5a" opacity="0.5" />
              </g>
              <g className="leg-right">
                <rect x="150" y="230" width="26" height="44" rx="12" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2.5" />
                <rect x="142" y="274" width="42" height="16" rx="8" fill="url(#accentBlue)" />
                <ellipse cx="163" cy="282" rx="8" ry="3" fill="#0ea5e9" opacity="0.5" />
              </g>
            </g>
          </g>
        </svg>
      </div>

      <style jsx>{`
        /* Particle effects */
        .particles-container {
          width: 100%;
          height: 100%;
        }

        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: radial-gradient(circle, #ff9a3c 0%, #ff6b35 50%, transparent 100%);
          opacity: 0;
          animation: particleFloat 2s ease-in-out infinite;
        }

        .particle-0 { left: 30%; top: 20%; animation-delay: 0s; }
        .particle-1 { left: 70%; top: 25%; animation-delay: 0.3s; background: radial-gradient(circle, #00d4ff 0%, #0ea5e9 50%, transparent 100%); }
        .particle-2 { left: 45%; top: 15%; animation-delay: 0.6s; }
        .particle-3 { left: 60%; top: 30%; animation-delay: 0.9s; background: radial-gradient(circle, #00d4ff 0%, #0ea5e9 50%, transparent 100%); }
        .particle-4 { left: 25%; top: 35%; animation-delay: 1.2s; }
        .particle-5 { left: 75%; top: 40%; animation-delay: 1.5s; background: radial-gradient(circle, #00d4ff 0%, #0ea5e9 50%, transparent 100%); }
        .particle-6 { left: 40%; top: 45%; animation-delay: 1.8s; }
        .particle-7 { left: 55%; top: 35%; animation-delay: 2.1s; background: radial-gradient(circle, #00d4ff 0%, #0ea5e9 50%, transparent 100%); }

        @keyframes particleFloat {
          0%, 100% {
            opacity: 0;
            transform: translateY(0) scale(0);
          }
          10% {
            opacity: 0.8;
            transform: translateY(-10px) scale(1);
          }
          50% {
            opacity: 0.6;
            transform: translateY(-25px) scale(1.2);
          }
          90% {
            opacity: 0.2;
            transform: translateY(-40px) scale(0.8);
          }
        }

        /* Jet boosters */
        .booster-container {
          width: 100px;
          height: 60px;
          display: flex;
          gap: 20px;
          justify-content: center;
          opacity: 0;
        }

        .booster {
          width: 30px;
          height: 50px;
          background: linear-gradient(to bottom, #ff9a3c 0%, #ff6b35 30%, transparent 100%);
          border-radius: 0% 50% 50% / 40% 40% 60% 60%;
          filter: blur(8px);
          animation: boosterFlame 0.15s ease-in-out infinite;
          opacity: 0.9;
        }

        .booster-left {
          transform: translateX(-15px);
          animation-delay: 0.05s;
        }

        .booster-right {
          transform: translateX(15px);
          background: linear-gradient(to bottom, #00d4ff 0%, #0ea5e9 30%, transparent 100%);
        }

        @keyframes boosterFlame {
          0%, 100% {
            transform: scaleY(1) translateY(0);
            opacity: 0.9;
          }
          50% {
            transform: scaleY(1.3) translateY(5px);
            opacity: 0.7;
          }
        }

        /* Idle state - floating with subtle animations */
        .robot-idle {
          animation: floatGentle 4s ease-in-out infinite;
        }

        .robot-idle .booster-container {
          opacity: 0.6;
        }

        .robot-idle .particle {
          animation: particleFloat 3s ease-in-out infinite;
        }

        .robot-idle .head-group {
          animation: headBobSubtle 3s ease-in-out infinite;
          transform-origin: center;
        }

        .robot-idle .body-group {
          animation: bodyTiltSubtle 5s ease-in-out infinite;
          transform-origin: center;
        }

        .robot-idle .hand-left {
          animation: handWaveSubtle 2.5s ease-in-out infinite;
          transform-origin: center;
        }

        .robot-idle .hand-right {
          animation: handWaveSubtle 2.5s ease-in-out infinite 1.25s;
          transform-origin: center;
        }

        .robot-idle .antenna-left,
        .robot-idle .antenna-right {
          animation: antennaWiggle 2s ease-in-out infinite;
          transform-origin: 50% 100%;
        }

        .robot-idle .antenna-right {
          animation-delay: 0.4s;
        }

        @keyframes floatGentle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(-1deg); }
          50% { transform: translateY(-5px) rotate(0deg); }
          75% { transform: translateY(-8px) rotate(1deg); }
        }

        @keyframes headBobSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        @keyframes bodyTiltSubtle {
          0%, 100% { transform: rotate(0deg); }
          33% { transform: rotate(2deg); }
          66% { transform: rotate(-2deg); }
        }

        @keyframes handWaveSubtle {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }

        @keyframes antennaWiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }

        /* Flying state - motion blur and trail effect */
        .robot-flying {
          filter: blur(1px) brightness(1.1);
          animation: flyingTilt 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .robot-flying .booster-container {
          opacity: 1;
        }

        .robot-flying .booster {
          height: 80px;
          animation: boosterFlameIntense 0.1s ease-in-out infinite;
        }

        .robot-flying .particle {
          animation: particleTrail 0.6s ease-out infinite;
        }

        .robot-flying .arms {
          animation: armsBack 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes flyingTilt {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(-15deg) scale(1.05); }
          100% { transform: rotate(-5deg) scale(1); }
        }

        @keyframes boosterFlameIntense {
          0%, 100% {
            transform: scaleY(1.5) translateY(0);
            opacity: 1;
          }
          50% {
            transform: scaleY(2) translateY(8px);
            opacity: 0.8;
          }
        }

        @keyframes particleTrail {
          0% {
            opacity: 1;
            transform: translateX(0) translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(-30px) translateY(10px) scale(0.3);
          }
        }

        @keyframes armsBack {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-20deg); }
        }

        /* Landing state - gentle touchdown */
        .robot-landing {
          animation: landingBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .robot-landing .booster-container {
          opacity: 0.3;
          animation: boosterFadeOut 0.6s ease-out forwards;
        }

        .robot-landing .legs {
          animation: legsSquash 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes landingBounce {
          0% { transform: translateY(-20px) scale(1); }
          40% { transform: translateY(5px) scale(0.95, 1.05); }
          70% { transform: translateY(-3px) scale(1.02, 0.98); }
          100% { transform: translateY(0) scale(1); }
        }

        @keyframes boosterFadeOut {
          0% { opacity: 0.8; }
          100% { opacity: 0; }
        }

        @keyframes legsSquash {
          0% { transform: scaleY(1); }
          40% { transform: scaleY(0.85); }
          100% { transform: scaleY(1); }
        }

        /* Waving state - friendly greeting */
        .robot-waving {
          animation: waveBody 0.8s ease-in-out infinite;
        }

        .robot-waving .hand-right {
          animation: waveHand 0.5s ease-in-out infinite;
          transform-origin: center;
        }

        .robot-waving .arm-right {
          animation: waveArm 0.5s ease-in-out infinite;
          transform-origin: 50% 0%;
        }

        .robot-waving .head-group {
          animation: headNod 0.8s ease-in-out infinite;
          transform-origin: center;
        }

        .robot-waving .smile {
          animation: smileExpand 0.8s ease-in-out infinite;
        }

        @keyframes waveBody {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(3deg); }
        }

        @keyframes waveHand {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-30deg); }
          75% { transform: rotate(30deg); }
        }

        @keyframes waveArm {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-25deg); }
        }

        @keyframes headNod {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(3px) rotate(-2deg); }
        }

        @keyframes smileExpand {
          0%, 100% { stroke-width: 5; }
          50% { stroke-width: 6; }
        }

        /* Thumbs up state - approval gesture */
        .robot-thumbsup {
          animation: thumbsBounce 0.6s ease-in-out;
        }

        .robot-thumbsup .hand-left {
          animation: thumbsUpGesture 0.8s ease-in-out infinite;
          transform-origin: center;
        }

        .robot-thumbsup .arm-left {
          animation: thumbsUpArm 0.8s ease-in-out infinite;
          transform-origin: 50% 0%;
        }

        .robot-thumbsup .eyes .pupil {
          animation: eyesSparkle 0.8s ease-in-out infinite;
        }

        @keyframes thumbsBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes thumbsUpGesture {
          0%, 100% { transform: rotate(-90deg) translateX(-5px); }
          50% { transform: rotate(-90deg) translateX(-8px) scale(1.1); }
        }

        @keyframes thumbsUpArm {
          0%, 100% { transform: rotate(-45deg); }
          50% { transform: rotate(-40deg); }
        }

        @keyframes eyesSparkle {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.5); }
        }

        /* Pointing state - directing attention */
        .robot-pointing {
          animation: pointingLean 1.5s ease-in-out infinite;
        }

        .robot-pointing .hand-right {
          animation: pointingFinger 1.5s ease-in-out infinite;
          transform-origin: center;
        }

        .robot-pointing .arm-right {
          animation: pointingArm 1.5s ease-in-out infinite;
          transform-origin: 50% 0%;
        }

        .robot-pointing .head-group {
          animation: lookAtCard 1.5s ease-in-out infinite;
          transform-origin: center;
        }

        .robot-pointing .eyes .pupil {
          animation: pupilLookDown 1.5s ease-in-out infinite;
        }

        @keyframes pointingLean {
          0%, 100% { transform: rotate(0deg) translateX(0); }
          50% { transform: rotate(-5deg) translateX(-5px); }
        }

        @keyframes pointingFinger {
          0%, 100% { 
            transform: rotate(45deg) translateY(-10px); 
          }
          50% { 
            transform: rotate(45deg) translateY(-15px) scale(1.05); 
          }
        }

        @keyframes pointingArm {
          0%, 100% { transform: rotate(45deg); }
          50% { transform: rotate(50deg); }
        }

        @keyframes lookAtCard {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(-5deg); }
        }

        @keyframes pupilLookDown {
          0%, 100% { transform: translate(2px, 3px); }
          50% { transform: translate(3px, 4px); }
        }

        /* Holding state - robot holds and looks at card */
        .robot-holding {
          animation: holdingLean 2s ease-in-out infinite;
        }

        .robot-holding .body-group {
          animation: bodyPeek 2s ease-in-out infinite;
          transform-origin: center;
        }

        .robot-holding .head-group {
          animation: headPeek 2s ease-in-out infinite;
          transform-origin: center;
        }

        .robot-holding .arm-left {
          animation: holdingArmLeft 2s ease-in-out infinite;
          transform-origin: 50% 0%;
        }

        .robot-holding .arm-right {
          animation: holdingArmRight 2s ease-in-out infinite;
          transform-origin: 50% 0%;
        }

        .robot-holding .eyes .pupil {
          animation: lookAtCardContent 2s ease-in-out infinite;
        }

        @keyframes holdingLean {
          0%, 100% { transform: rotate(-8deg) translateX(-5px); }
          50% { transform: rotate(-10deg) translateX(-8px); }
        }

        @keyframes bodyPeek {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(-7deg); }
        }

        @keyframes headPeek {
          0%, 100% { transform: rotate(-3deg) translateX(-2px); }
          50% { transform: rotate(-5deg) translateX(-4px); }
        }

        @keyframes holdingArmLeft {
          0%, 100% { transform: rotate(-30deg); }
          50% { transform: rotate(-35deg); }
        }

        @keyframes holdingArmRight {
          0%, 100% { transform: rotate(20deg); }
          50% { transform: rotate(25deg); }
        }

        @keyframes lookAtCardContent {
          0%, 100% { transform: translate(-3px, 2px); }
          50% { transform: translate(-5px, 4px); }
        }

        /* Eye animations - always active */
        .eyes .eye {
          animation: blink 5s ease-in-out infinite;
          transform-origin: center;
        }

        .eyes .eye:last-child {
          animation-delay: 0.2s;
        }

        .eyes .led-ring {
          animation: ledPulse 2s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          93%, 96% { transform: scaleY(0.1); }
        }

        @keyframes ledPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        /* Smile animation */
        .smile {
          animation: smilePulse 3s ease-in-out infinite;
        }

        @keyframes smilePulse {
          0%, 100% { opacity: 0.95; }
          50% { opacity: 1; }
        }

        /* Antenna always wiggling slightly */
        .antenna {
          animation: antennaIdleWiggle 3s ease-in-out infinite;
          transform-origin: 50% 100%;
        }

        @keyframes antennaIdleWiggle {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }
      `}</style>
    </div>
  )
}