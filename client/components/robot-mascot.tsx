"use client"

import React from "react"

type RobotAnimation = "idle" | "grabbing" | "hiding" | "peeking"

interface RobotMascotProps {
  variant?: RobotAnimation
}

export function RobotMascot({ variant = "idle" }: RobotMascotProps) {
  const variantClass = {
    idle: "robot-idle",
    grabbing: "robot-grabbing",
    hiding: "robot-hiding",
    peeking: "robot-peeking",
  }[variant]

  return (
    <div className={`relative w-full max-w-[320px] mx-auto h-[360px] ${variantClass}`} style={{ overflow: 'visible' }}>
      <div className="relative w-full h-full" style={{ position: 'relative' }}>
        <svg viewBox="0 0 320 360" className="robot-svg w-full h-full absolute top-0 left-0" style={{ zIndex: 5 }}>
          <defs>
            <linearGradient id="bodyShell" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.96" />
              <stop offset="100%" stopColor="#f2f4f7" stopOpacity="0.96" />
            </linearGradient>
            <linearGradient id="visor" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0d1b2a" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0b1220" stopOpacity="0.98" />
            </linearGradient>
            <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff9a3c" />
              <stop offset="100%" stopColor="#ff6a3a" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#ff9a3c" floodOpacity="0.18" />
              <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#00c9ff" floodOpacity="0.14" />
            </filter>
          </defs>

          <g filter="url(#glow)">
            <g className="head-group">
              <rect x="92" y="34" width="136" height="112" rx="40" fill="url(#bodyShell)" stroke="#cfd6de" strokeWidth="3" />
              <rect x="108" y="52" width="104" height="76" rx="26" fill="url(#visor)" stroke="#222a35" strokeWidth="2" />
              <g className="eyes">
                <g className="eye">
                  <ellipse cx="136" cy="90" rx="16" ry="18" fill="#0b1220" />
                  <circle className="pupil" cx="136" cy="90" r="10" fill="#ff7b35" />
                  <circle cx="132" cy="86" r="4" fill="#fff" opacity="0.7" />
                </g>
                <g className="eye">
                  <ellipse cx="184" cy="90" rx="16" ry="18" fill="#0b1220" />
                  <circle className="pupil" cx="184" cy="90" r="10" fill="#ff7b35" />
                  <circle cx="180" cy="86" r="4" fill="#fff" opacity="0.7" />
                </g>
              </g>
              <path
                d="M132 118 Q160 134 188 118"
                stroke="#ff7b35"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                opacity="0.9"
              />
              <g className="antenna-left">
                <line x1="124" y1="32" x2="116" y2="14" stroke="#737f8c" strokeWidth="4" strokeLinecap="round" />
                <circle cx="114" cy="12" r="8" fill="url(#accent)" />
              </g>
              <g className="antenna-right">
                <line x1="196" y1="32" x2="206" y2="12" stroke="#737f8c" strokeWidth="4" strokeLinecap="round" />
                <circle cx="208" cy="10" r="8" fill="url(#accent)" />
              </g>
            </g>

            <g className="body-group">
              <rect x="88" y="140" width="144" height="128" rx="44" fill="url(#bodyShell)" stroke="#cfd6de" strokeWidth="3" />
              <rect x="112" y="160" width="96" height="68" rx="18" fill="#f8fafc" stroke="#d7dde3" strokeWidth="2" />
              <circle cx="160" cy="194" r="12" fill="#0d1b2a" opacity="0.3" />
              <circle cx="160" cy="194" r="7" fill="url(#accent)" />
              <rect x="136" y="236" width="48" height="12" rx="6" fill="#ffefe3" stroke="#ff9a3c" strokeWidth="2" />
            </g>

            <g className="arms" strokeWidth="3" strokeLinecap="round">
              <g className="arm-left">
                <line className="arm-upper" x1="94" y1="182" x2="62" y2="212" stroke="#cfd6de" />
                <line className="arm-lower" x1="62" y1="212" x2="60" y2="244" stroke="#cfd6de" />
                <circle cx="60" cy="246" r="13" fill="#0b1220" stroke="#cfd6de" />
                <g className="hand-left">
                  <ellipse cx="60" cy="258" rx="16" ry="20" fill="#2d3748" stroke="#cfd6de" strokeWidth="2" />
                  <path d="M50 252 L50 272" stroke="#0b1220" strokeWidth="3" />
                  <path d="M54 250 L54 274" stroke="#0b1220" strokeWidth="3" />
                  <path d="M60 248 L60 276" stroke="#0b1220" strokeWidth="3" />
                  <path d="M66 250 L66 274" stroke="#0b1220" strokeWidth="3" />
                  <path d="M70 252 L70 272" stroke="#0b1220" strokeWidth="3" />
                </g>
              </g>
              <g className="arm-right">
                <line className="arm-upper" x1="226" y1="182" x2="258" y2="212" stroke="#cfd6de" />
                <line className="arm-lower" x1="258" y1="212" x2="260" y2="244" stroke="#cfd6de" />
                <circle cx="260" cy="246" r="13" fill="#0b1220" stroke="#cfd6de" />
                <g className="hand-right">
                  <ellipse cx="260" cy="258" rx="16" ry="20" fill="#2d3748" stroke="#cfd6de" strokeWidth="2" />
                  <path d="M250 252 L250 272" stroke="#0b1220" strokeWidth="3" />
                  <path d="M254 250 L254 274" stroke="#0b1220" strokeWidth="3" />
                  <path d="M260 248 L260 276" stroke="#0b1220" strokeWidth="3" />
                  <path d="M266 250 L266 274" stroke="#0b1220" strokeWidth="3" />
                  <path d="M270 252 L270 272" stroke="#0b1220" strokeWidth="3" />
                </g>
              </g>
            </g>

            {/* Hands covering eyes for hiding state */}
            <g className="covering-hands" opacity="0">
              <g className="cover-left">
                <ellipse cx="130" cy="75" rx="20" ry="26" fill="#2d3748" stroke="#cfd6de" strokeWidth="2" />
                <path d="M115 68 L115 88" stroke="#0b1220" strokeWidth="2" />
                <path d="M120 66 L120 90" stroke="#0b1220" strokeWidth="2" />
                <path d="M126 64 L126 92" stroke="#0b1220" strokeWidth="2" />
                <path d="M132 64 L132 92" stroke="#0b1220" strokeWidth="2" />
                <path d="M138 66 L138 90" stroke="#0b1220" strokeWidth="2" />
              </g>
              <g className="cover-right">
                <ellipse cx="190" cy="75" rx="20" ry="26" fill="#2d3748" stroke="#cfd6de" strokeWidth="2" />
                <path d="M175 68 L175 88" stroke="#0b1220" strokeWidth="2" />
                <path d="M181 66 L181 90" stroke="#0b1220" strokeWidth="2" />
                <path d="M187 64 L187 92" stroke="#0b1220" strokeWidth="2" />
                <path d="M193 64 L193 92" stroke="#0b1220" strokeWidth="2" />
                <path d="M199 66 L199 90" stroke="#0b1220" strokeWidth="2" />
              </g>
            </g>

            <g className="legs">
              <g>
                <rect x="122" y="268" width="30" height="50" rx="14" fill="#e9edf2" stroke="#cfd6de" strokeWidth="3" />
                <rect x="112" y="318" width="50" height="18" rx="10" fill="url(#accent)" />
              </g>
              <g>
                <rect x="168" y="268" width="30" height="50" rx="14" fill="#e9edf2" stroke="#cfd6de" strokeWidth="3" />
                <rect x="158" y="318" width="50" height="18" rx="10" fill="url(#accent)" />
              </g>
            </g>
          </g>
        </svg>

        {/* Wall for hiding/peeking states */}
        <div className="wall-overlay absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 15 }}>
          <svg viewBox="0 0 320 360" className="w-full h-full">
            <defs>
              <linearGradient id="brickGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b7355" />
                <stop offset="50%" stopColor="#a0826d" />
                <stop offset="100%" stopColor="#6d5d4b" />
              </linearGradient>
              <linearGradient id="mortarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d4c5b9" />
                <stop offset="100%" stopColor="#b8a99c" />
              </linearGradient>
              <filter id="brickShadow">
                <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3" />
              </filter>
            </defs>
            
            {/* Mortar background */}
            <rect x="0" y="0" width="320" height="360" fill="url(#mortarGrad)" />
            
            {/* Brick rows */}
            <g filter="url(#brickShadow)">
              {/* Row 1 */}
              <rect x="2" y="2" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="82" y="2" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="162" y="2" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="242" y="2" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              
              {/* Row 2 - offset */}
              <rect x="-18" y="34" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="62" y="34" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="142" y="34" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="222" y="34" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="302" y="34" width="36" height="28" rx="2" fill="url(#brickGrad)" />
              
              {/* Row 3 */}
              <rect x="2" y="66" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="82" y="66" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="162" y="66" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="242" y="66" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              
              {/* Row 4 - offset */}
              <rect x="-18" y="98" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="62" y="98" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="142" y="98" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="222" y="98" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="302" y="98" width="36" height="28" rx="2" fill="url(#brickGrad)" />
              
              {/* Row 5 */}
              <rect x="2" y="130" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="82" y="130" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="162" y="130" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="242" y="130" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              
              {/* Row 6 - offset */}
              <rect x="-18" y="162" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="62" y="162" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="142" y="162" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="222" y="162" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="302" y="162" width="36" height="28" rx="2" fill="url(#brickGrad)" />
              
              {/* Continue pattern for remaining rows */}
              <rect x="2" y="194" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="82" y="194" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="162" y="194" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="242" y="194" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              
              <rect x="-18" y="226" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="62" y="226" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="142" y="226" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="222" y="226" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="302" y="226" width="36" height="28" rx="2" fill="url(#brickGrad)" />
              
              <rect x="2" y="258" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="82" y="258" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="162" y="258" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="242" y="258" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              
              <rect x="-18" y="290" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="62" y="290" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="142" y="290" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="222" y="290" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="302" y="290" width="36" height="28" rx="2" fill="url(#brickGrad)" />
              
              <rect x="2" y="322" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="82" y="322" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="162" y="322" width="76" height="28" rx="2" fill="url(#brickGrad)" />
              <rect x="242" y="322" width="76" height="28" rx="2" fill="url(#brickGrad)" />
            </g>
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes floatSoft {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-12px) rotate(-2deg); }
          50% { transform: translateY(-8px) rotate(0deg); }
          75% { transform: translateY(-12px) rotate(2deg); }
        }

        @keyframes excitedBounce {
          0%, 100% { transform: translateY(0px) scale(1); }
          15% { transform: translateY(-35px) scale(1.05); }
          30% { transform: translateY(-15px) scale(0.98); }
          45% { transform: translateY(-30px) scale(1.03); }
          60% { transform: translateY(-10px) scale(0.99); }
          75% { transform: translateY(-25px) scale(1.02); }
        }

        @keyframes armReachExcited {
          0% { transform: rotate(0deg) translateY(0); }
          20% { transform: rotate(-50deg) translateY(-40px); }
          40% { transform: rotate(-45deg) translateY(-35px); }
          60% { transform: rotate(-55deg) translateY(-45px); }
          80% { transform: rotate(-50deg) translateY(-40px); }
          100% { transform: rotate(-48deg) translateY(-38px); }
        }

        @keyframes hideSlideDown {
          0% { transform: translateY(0); }
          50% { transform: translateY(160px); }
          100% { transform: translateY(320px); }
        }

        @keyframes peekSneaky {
          0%, 100% { transform: translate(200px, 0) scale(0.9) rotate(10deg); }
          25% { transform: translate(210px, -8px) scale(0.92) rotate(12deg); }
          50% { transform: translate(195px, -5px) scale(0.88) rotate(8deg); }
          75% { transform: translate(205px, -10px) scale(0.91) rotate(11deg); }
        }

        @keyframes wallSlideIn {
          0% { opacity: 0; transform: translateX(-100%); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @keyframes antennaWiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(15deg); }
        }

        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          92%, 94% { transform: scaleY(0.1); }
        }

        @keyframes pupilLookAround {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-4px, -3px); }
          40% { transform: translate(4px, 0); }
          60% { transform: translate(3px, 3px); }
          80% { transform: translate(-3px, 2px); }
        }

        @keyframes waveEnthusiastic {
          0%, 100% { transform: rotate(0deg) translateX(0); }
          15% { transform: rotate(-25deg) translateX(-3px); }
          30% { transform: rotate(20deg) translateX(2px); }
          45% { transform: rotate(-18deg) translateX(-2px); }
          60% { transform: rotate(15deg) translateX(1px); }
          75% { transform: rotate(-10deg) translateX(-1px); }
        }

        @keyframes bodyTilt {
          0%, 100% { transform: rotate(0deg); }
          33% { transform: rotate(3deg); }
          66% { transform: rotate(-3deg); }
        }

        @keyframes headBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        /* Wall is hidden by default */
        .wall-overlay {
          opacity: 0;
          transition: opacity 0.1s ease-out;
        }

        /* Idle state - playful and fun */
        .robot-idle {
          animation: floatSoft 5s ease-in-out infinite;
        }

        .robot-idle .head-group {
          animation: headBob 3s ease-in-out infinite;
          transform-origin: center;
        }

        .robot-idle .body-group {
          animation: bodyTilt 6s ease-in-out infinite;
          transform-origin: center;
        }

        .robot-idle .hand-left,
        .robot-idle .hand-right { 
          animation: waveEnthusiastic 1.8s ease-in-out infinite;
          transform-origin: center;
        }

        .robot-idle .antenna-left,
        .robot-idle .antenna-right {
          animation: antennaWiggle 2.5s ease-in-out infinite;
          transform-origin: 50% 100%;
        }

        .robot-idle .antenna-right {
          animation-delay: 0.3s;
        }

        /* Grabbing state - excited reaching */
        .robot-grabbing {
          animation: excitedBounce 1.5s ease-in-out infinite;
        }

        .robot-grabbing .arm-left,
        .robot-grabbing .arm-right {
          animation: armReachExcited 1.5s ease-in-out infinite;
          transform-origin: 50% 100%;
        }

        .robot-grabbing .antenna-left,
        .robot-grabbing .antenna-right {
          animation: antennaWiggle 0.8s ease-in-out infinite;
          transform-origin: 50% 100%;
        }

        .robot-grabbing .head-group {
          animation: headBob 1.5s ease-in-out infinite;
          transform-origin: center;
        }- eyes are alive */
        .eyes .eye { 
          animation: blink 4s ease-in-out infinite; 
          transform-origin: center; 
        }
        
        .eyes .pupil { 
          animation: pupilLookAround 4s ease-in-out infinite; 
        }

        /* Delay second eye blink for natural look */
        .eye:last-child {
          animation-delay: 0.1s;
          opacity: 1 !important;
          animation: wallSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Peeking state - sneaky peek with personality */
        .robot-peeking .robot-svg {
          animation: peekSneaky 2.5s ease-in-out infinite;
        }

        .robot-peeking .wall-overlay {
          opacity: 1 !important;
        }

        .robot-peeking .head-group {
          animation: headBob 1.2s ease-in-out infinite;
          transform-origin: center;
        }

        .robot-peeking .antenna-left {
          animation: antennaWiggle 1s ease-in-out infinite;
          transform-origin: 50% 100%;
        }

        .robot-peeking .body-group,
        .robot-peeking .arms,
        .robot-peeking .legs {
          opacity: 0.2;
        }

        .robot-peeking .eye:first-child {
          opacity: 0.2;
        }

        /* Default animations */
        .eyes .eye { 
          animation: blink 6s ease-in-out infinite; 
          transform-origin: center; 
        }
        
        .eyes .pupil { 
          animation: pupilShift 3.4s ease-in-out infinite; 
        }

        /* Hide covering hands */
        .covering-hands {
          display: none;
        }
      `}</style>
    </div>
  )
}
