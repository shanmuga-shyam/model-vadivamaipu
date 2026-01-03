"use client"

import React, { useEffect, useState } from "react"

export function LoadingScreen() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center z-50 overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-2xl px-4">
        {/* Robot sitting on chair working */}
        <div className="relative w-full max-w-[420px] h-[480px] flex items-center justify-center">
          <svg viewBox="0 0 420 520" className="w-full h-full">
            <defs>
              <linearGradient id="loadChairWood" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b6f47" />
                <stop offset="50%" stopColor="#a07856" />
                <stop offset="100%" stopColor="#6d5d4b" />
              </linearGradient>
              <linearGradient id="loadRobotBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f5f5f5" />
                <stop offset="100%" stopColor="#e8e8e8" />
              </linearGradient>
              <linearGradient id="loadRobotShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d4c5b9" />
                <stop offset="100%" stopColor="#b8a99c" />
              </linearGradient>
              <linearGradient id="loadVisor" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1a1f2e" />
                <stop offset="100%" stopColor="#0f1419" />
              </linearGradient>
              <linearGradient id="loadAccent" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff9a3c" />
                <stop offset="100%" stopColor="#ff7a2a" />
              </linearGradient>
            </defs>

            {/* Chair */}
            <g className="chair-group">
              {/* Chair legs */}
              <line x1="160" y1="380" x2="150" y2="490" stroke="url(#loadChairWood)" strokeWidth="20" strokeLinecap="round" />
              <line x1="260" y1="380" x2="270" y2="490" stroke="url(#loadChairWood)" strokeWidth="20" strokeLinecap="round" />
              
              {/* Chair feet */}
              <ellipse cx="150" cy="495" rx="18" ry="8" fill="#333" />
              <ellipse cx="270" cy="495" rx="18" ry="8" fill="#333" />
              
              {/* Chair seat */}
              <ellipse cx="210" cy="350" rx="80" ry="35" fill="url(#loadRobotShadow)" />
              <rect x="140" y="325" width="140" height="30" rx="15" fill="url(#loadChairWood)" />
              <ellipse cx="210" cy="325" rx="70" ry="30" fill="url(#loadChairWood)" />
              
              {/* Backrest */}
              <rect x="140" y="160" width="140" height="170" rx="35" fill="url(#loadChairWood)" />
            </g>

            {/* Robot Body */}
            <g className="robot-body-load">
              {/* Lower body/legs sitting */}
              <g className="legs">
                <rect x="165" y="330" width="38" height="60" rx="18" fill="url(#loadRobotBody)" stroke="#ccc" strokeWidth="2" />
                <rect x="217" y="330" width="38" height="60" rx="18" fill="url(#loadRobotBody)" stroke="#ccc" strokeWidth="2" />
                
                {/* Feet */}
                <ellipse cx="184" cy="395" rx="22" ry="12" fill="url(#loadRobotBody)" stroke="#ccc" strokeWidth="2" />
                <ellipse cx="236" cy="395" rx="22" ry="12" fill="url(#loadRobotBody)" stroke="#ccc" strokeWidth="2" />
              </g>

              {/* Main body */}
              <rect x="150" y="200" width="120" height="135" rx="35" fill="url(#loadRobotBody)" stroke="#ccc" strokeWidth="3" />
              
              {/* Chest screen/panel */}
              <rect x="170" y="230" width="80" height="65" rx="12" fill="url(#loadVisor)" stroke="url(#loadAccent)" strokeWidth="3" />
              
              {/* Typing dots on chest */}
              <circle className="load-dot-1" cx="190" cy="260" r="4" fill="#00ff00" opacity="0.9" />
              <circle className="load-dot-2" cx="210" cy="260" r="4" fill="#00ff00" opacity="0.9" />
              <circle className="load-dot-3" cx="230" cy="260" r="4" fill="#00ff00" opacity="0.9" />
              
              {/* Center indicator */}
              <circle cx="210" cy="275" r="6" fill="url(#loadAccent)" className="load-core-pulse" />

              {/* Arms hanging */}
              <g className="arms-load">
                <line x1="150" y1="240" x2="100" y2="310" stroke="#ccc" strokeWidth="14" strokeLinecap="round" />
                <circle cx="98" cy="315" r="12" fill="url(#loadRobotBody)" stroke="#ccc" strokeWidth="2" />
                <ellipse cx="95" cy="330" rx="14" ry="18" fill="#555" stroke="#ccc" strokeWidth="2" />
                
                <line x1="270" y1="240" x2="320" y2="310" stroke="#ccc" strokeWidth="14" strokeLinecap="round" />
                <circle cx="322" cy="315" r="12" fill="url(#loadRobotBody)" stroke="#ccc" strokeWidth="2" />
                <ellipse cx="325" cy="330" rx="14" ry="18" fill="#555" stroke="#ccc" strokeWidth="2" />
              </g>

              {/* Head */}
              <g className="head-load">
                <rect x="160" y="100" width="100" height="110" rx="35" fill="url(#loadRobotBody)" stroke="#ccc" strokeWidth="3" />
                
                {/* Visor/Face screen */}
                <rect x="175" y="125" width="70" height="60" rx="18" fill="url(#loadVisor)" stroke="#333" strokeWidth="2" />
                
                {/* Eyes */}
                <circle cx="192" cy="145" r="9" fill="url(#loadAccent)" className="load-eye-blink" />
                <circle cx="228" cy="145" r="9" fill="url(#loadAccent)" className="load-eye-blink" />
                
                {/* Smile */}
                <path d="M185 165 Q210 175 235 165" stroke="url(#loadAccent)" strokeWidth="4" strokeLinecap="round" fill="none" />
                
                {/* Antennas */}
                <line x1="180" y1="98" x2="165" y2="65" stroke="#999" strokeWidth="5" strokeLinecap="round" className="antenna-wobble-1" />
                <circle cx="165" cy="60" r="9" fill="url(#loadAccent)" className="load-antenna-pulse-1" />
                
                <line x1="240" y1="98" x2="255" y2="65" stroke="#999" strokeWidth="5" strokeLinecap="round" className="antenna-wobble-2" />
                <circle cx="255" cy="60" r="9" fill="url(#loadAccent)" className="load-antenna-pulse-2" />
              </g>
            </g>

            {/* Code snippets floating */}
            <text x="25" y="95" fontSize="14" fill="#ff9a3c" opacity="0.6" className="code-float">
              {'<AI>'}
            </text>
            <text x="350" y="135" fontSize="14" fill="#00c9ff" opacity="0.6" className="code-float" style={{ animationDelay: '0.5s' }}>
              {'</AI>'}
            </text>
            <text x="15" y="220" fontSize="13" fill="#ff7a2a" opacity="0.5" className="code-float" style={{ animationDelay: '1s' }}>
              const model = train()
            </text>
            <text x="330" y="275" fontSize="14" fill="#00ff00" opacity="0.6" className="code-float" style={{ animationDelay: '1.5s' }}>
              ✓ 92%
            </text>
          </svg>
        </div>

        {/* Loading Text & Progress */}
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">
              <span className="text-orange-500">Training</span>{" "}
              <span className="text-cyan-400">AI Model</span>
            </h2>
            <p className="text-gray-400 text-sm">Preparing machine learning engine...</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 via-cyan-400 to-purple-500 rounded-full animate-progress-load" />
          </div>

          {/* Loading dots */}
          <div className="flex gap-2 items-center justify-center">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce-load" />
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce-load" style={{ animationDelay: "0.15s" }} />
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce-load" style={{ animationDelay: "0.3s" }} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loadAntennaPulse {
          0%, 100% { r: 9; opacity: 1; }
          50% { r: 11; opacity: 0.7; }
        }

        @keyframes loadCorePulse {
          0%, 100% { r: 6; opacity: 1; }
          50% { r: 8; opacity: 0.7; }
        }

        @keyframes loadTypingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-5px); opacity: 1; }
        }

        @keyframes loadEyeBlink {
          0%, 90%, 100% { opacity: 1; }
          95% { opacity: 0.2; }
        }

        @keyframes antennaWobble {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }

        @keyframes codeFloat {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 0.7; transform: translateY(-8px); }
        }

        @keyframes progressLoad {
          0% { width: 0%; transform: translateX(0); }
          50% { width: 70%; }
          100% { width: 100%; }
        }

        @keyframes bounceLoad {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
        }

        .load-antenna-pulse-1,
        .load-antenna-pulse-2 {
          animation: loadAntennaPulse 1.5s ease-in-out infinite;
        }

        .load-antenna-pulse-2 {
          animation-delay: 0.3s;
        }

        .load-core-pulse {
          animation: loadCorePulse 1.2s ease-in-out infinite;
        }

        .load-dot-1,
        .load-dot-2,
        .load-dot-3 {
          animation: loadTypingDot 1.4s ease-in-out infinite;
        }

        .load-dot-2 {
          animation-delay: 0.15s;
        }

        .load-dot-3 {
          animation-delay: 0.3s;
        }

        .load-eye-blink {
          animation: loadEyeBlink 4s ease-in-out infinite;
        }

        .antenna-wobble-1,
        .antenna-wobble-2 {
          animation: antennaWobble 2s ease-in-out infinite;
          transform-origin: 50% 100%;
        }

        .antenna-wobble-2 {
          animation-delay: 0.5s;
        }

        .code-float {
          animation: codeFloat 3s ease-in-out infinite;
        }

        .animate-progress-load {
          animation: progressLoad 2.5s ease-in-out infinite;
        }

        .animate-bounce-load {
          animation: bounceLoad 1.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
