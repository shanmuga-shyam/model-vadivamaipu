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
        {/* Robot Using Computer - Loading Animation */}
        <div className="relative w-full max-w-[600px] h-[480px] flex items-center justify-center">
          <svg viewBox="0 0 600 480" className="w-full h-full">
            <defs>
              {/* Gradients */}
              <linearGradient id="robotMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e8e8e8" />
                <stop offset="50%" stopColor="#d0d0d0" />
                <stop offset="100%" stopColor="#b8b8b8" />
              </linearGradient>
              <linearGradient id="robotHead" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0f0f0" />
                <stop offset="100%" stopColor="#c0c0c0" />
              </linearGradient>
              <linearGradient id="screenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1a1f2e" />
                <stop offset="100%" stopColor="#0a0f18" />
              </linearGradient>
              <linearGradient id="accentOrange" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff9a3c" />
                <stop offset="100%" stopColor="#ff6a2a" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Desk */}
            <g className="desk">
              {/* Desk surface */}
              <rect x="80" y="320" width="440" height="25" fill="#5a4a3a" rx="4" />
              {/* Desk front */}
              <rect x="80" y="345" width="440" height="75" fill="#6d5d4d" />
              {/* Desk legs */}
              <rect x="110" y="420" width="22" height="60" fill="#4a3a2a" rx="2" />
              <rect x="468" y="420" width="22" height="60" fill="#4a3a2a" rx="2" />
            </g>

            {/* Monitor */}
            <g className="monitor" filter="url(#glow)">
              {/* Monitor base */}
              <rect x="380" y="270" width="160" height="50" fill="#5a4a3a" rx="4" />
              <ellipse cx="460" cy="320" rx="60" ry="10" fill="#4a3a2a" />
              
              {/* Monitor stand */}
              <rect x="450" y="320" width="20" height="50" fill="#5a4a3a" />
              
              {/* Monitor frame */}
              <rect x="385" y="80" width="150" height="190" fill="#2a2a2a" rx="8" strokeWidth="4" stroke="#555" />
              
              {/* Screen */}
              <rect x="400" y="100" width="120" height="150" fill="url(#screenGradient)" rx="4" />
              
              {/* Screen content - animated */}
              <g className="screen-content">
                {/* Code lines */}
                <line x1="415" y1="120" x2="500" y2="120" stroke="#00ff00" strokeWidth="2" opacity="0.8" className="code-line" />
                <line x1="415" y1="140" x2="495" y2="140" stroke="#00ff00" strokeWidth="2" opacity="0.8" className="code-line" style={{ animationDelay: "0.1s" }} />
                <line x1="415" y1="160" x2="490" y2="160" stroke="#00ff00" strokeWidth="2" opacity="0.8" className="code-line" style={{ animationDelay: "0.2s" }} />
                <line x1="415" y1="180" x2="485" y2="180" stroke="#00ff00" strokeWidth="2" opacity="0.8" className="code-line" style={{ animationDelay: "0.3s" }} />
                <line x1="415" y1="200" x2="498" y2="200" stroke="#00ff00" strokeWidth="2" opacity="0.8" className="code-line" style={{ animationDelay: "0.4s" }} />
                <line x1="415" y1="220" x2="492" y2="220" stroke="#00ff00" strokeWidth="2" opacity="0.8" className="code-line" style={{ animationDelay: "0.5s" }} />
                <line x1="415" y1="235" x2="488" y2="235" stroke="#ff9a3c" strokeWidth="2" opacity="0.9" className="cursor-line" />
              </g>
            </g>

            {/* Keyboard */}
            <g className="keyboard">
              {/* Keyboard base */}
              <rect x="230" y="335" width="200" height="35" fill="#3a3a3a" rx="4" stroke="#555" strokeWidth="2" />
              
              {/* Keys - animated typing */}
              <g className="key-group">
                <rect x="245" y="345" width="7" height="7" fill="#555" rx="1" className="key-press" />
                <rect x="260" y="345" width="7" height="7" fill="#555" rx="1" className="key-press" style={{ animationDelay: "0.05s" }} />
                <rect x="275" y="345" width="7" height="7" fill="#555" rx="1" className="key-press" style={{ animationDelay: "0.1s" }} />
                <rect x="290" y="345" width="7" height="7" fill="#555" rx="1" className="key-press" style={{ animationDelay: "0.15s" }} />
                <rect x="305" y="345" width="7" height="7" fill="#555" rx="1" className="key-press" style={{ animationDelay: "0.2s" }} />
              </g>
              
              {/* More keys */}
              <g className="key-group">
                <rect x="252" y="357" width="7" height="7" fill="#444" rx="1" className="key-press" style={{ animationDelay: "0.25s" }} />
                <rect x="270" y="357" width="7" height="7" fill="#444" rx="1" className="key-press" style={{ animationDelay: "0.3s" }} />
                <rect x="288" y="357" width="7" height="7" fill="#444" rx="1" className="key-press" style={{ animationDelay: "0.35s" }} />
              </g>
            </g>

            {/* Robot - Detailed Design */}
            <g className="robot-at-computer">
              {/* Base/Feet */}
              <ellipse cx="180" cy="380" rx="40" ry="10" fill="#2a2a2a" opacity="0.6" />
              
              {/* Legs */}
              <g className="legs">
                <rect x="160" y="330" width="16" height="50" rx="8" stroke="#555" strokeWidth="1" fill="#3d3d3d" />
                <rect x="193" y="330" width="16" height="50" rx="8" stroke="#555" strokeWidth="1" fill="#3d3d3d" />
                {/* Feet */}
                <rect x="155" y="378" width="28" height="10" fill="#1a1a1a" rx="2" />
                <rect x="188" y="378" width="28" height="10" fill="#1a1a1a" rx="2" />
              </g>

              {/* Torso/Body */}
              <g className="torso">
                <rect x="145" y="245" width="85" height="100" fill="url(#robotMetal)" rx="15" stroke="#777" strokeWidth="2" />
                
                {/* Central Panel */}
                <rect x="158" y="260" width="60" height="75" fill="#0f1b28" rx="8" stroke="#ff9a3c" strokeWidth="2" />
                
                {/* Panel Details */}
                <circle cx="170" cy="276" r="3" fill="#00ff88" className="pulse-light" />
                <circle cx="188" cy="276" r="3" fill="#00ff88" className="pulse-light" style={{ animationDelay: "0.2s" }} />
                <circle cx="206" cy="276" r="3" fill="#00ff88" className="pulse-light" style={{ animationDelay: "0.4s" }} />
                
                {/* Middle indicator */}
                <rect x="161" y="288" width="40" height="3" fill="#00ff88" opacity="0.6" rx="2" />
                <rect x="161" y="296" width="40" height="3" fill="#ff9a3c" opacity="0.5" rx="2" />
                <rect x="161" y="304" width="40" height="3" fill="#00c9ff" opacity="0.5" rx="2" />
                
                {/* Power core */}
                <circle cx="188" cy="325" r="10" fill="#0f1b28" stroke="#ff9a3c" strokeWidth="2" />
                <circle cx="188" cy="325" r="6" fill="url(#accentOrange)" className="pulse-light" />
              </g>
              
              {/* Neck */}
              <rect x="175" y="235" width="25" height="20" fill="#4a4a4a" rx="3" stroke="#666" strokeWidth="1" />
              <g className="head">
                {/* Main head structure */}
                <rect x="140" y="145" width="100" height="90" fill="url(#robotHead)" rx="18" stroke="#888" strokeWidth="2" />
                
                {/* Top panel */}
                <rect x="147" y="152" width="85" height="15" fill="#5a5a5a" rx="7" stroke="#777" strokeWidth="1" />
                
                {/* Display/Visor */}
                <rect x="160" y="175" width="60" height="42" fill="url(#screenGradient)" rx="6" stroke="#666" strokeWidth="2" />
                
                {/* Eyes - Detailed */}
                <g className="eyes">
                  {/* Left eye */}
                  <circle cx="172" cy="190" r="8" fill="#1a1a2e" stroke="#555" strokeWidth="1" />
                  <circle cx="172" cy="190" r="6" fill="#0a0a0a" />
                  <circle className="eye-glow" cx="172" cy="188" r="3" fill="url(#accentOrange)" />
                  <circle cx="170" cy="187" r="1.5" fill="#fff" opacity="0.8" />
                  
                  {/* Right eye */}
                  <circle cx="200" cy="190" r="8" fill="#1a1a2e" stroke="#555" strokeWidth="1" />
                  <circle cx="200" cy="190" r="6" fill="#0a0a0a" />
                  <circle className="eye-glow" cx="200" cy="188" r="3" fill="url(#accentOrange)" />
                  <circle cx="198" cy="187" r="1.5" fill="#fff" opacity="0.8" />
                </g>
                
                {/* Mouth - Digital smile */}
                <path d="M170 205 Q186 212 202 205" stroke="#ff9a3c" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
                
                {/* Antenna - Left */}
                <g className="antenna-left">
                  <line x1="160" y1="145" x2="140" y2="100" stroke="#666" strokeWidth="3" strokeLinecap="round" className="antenna-wobble" />
                  <circle cx="140" cy="97" r="7" fill="url(#accentOrange)" className="antenna-tip-glow" />
                </g>
                
                {/* Antenna - Right */}
                <g className="antenna-right">
                  <line x1="220" y1="145" x2="240" y2="100" stroke="#666" strokeWidth="3" strokeLinecap="round" className="antenna-wobble" style={{ animationDelay: "0.3s" }} />
                  <circle cx="240" cy="97" r="7" fill="url(#accentOrange)" className="antenna-tip-glow" style={{ animationDelay: "0.3s" }} />
                </g>
              </g>

              {/* Left Arm - Typing Motion */}
              <g className="left-arm">
                {/* Shoulder joint */}
                <circle cx="148" cy="280" r="6" fill="#555" stroke="#777" strokeWidth="1" />
                
                {/* Upper arm */}
                <line x1="148" y1="280" x2="110" y2="320" stroke="#5a5a5a" strokeWidth="12" strokeLinecap="round" />
                
                {/* Elbow joint */}
                <circle cx="110" cy="320" r="7" fill="#555" stroke="#777" strokeWidth="1" />
                
                {/* Forearm - animated */}
                <line x1="110" y1="320" x2="260" y2="350" stroke="#4a4a4a" strokeWidth="11" strokeLinecap="round" className="arm-bend" />
                
                {/* Wrist joint */}
                <circle cx="260" cy="350" r="6" fill="#555" stroke="#777" strokeWidth="1" />
                
                {/* Hand/Fingers */}
                <g className="hand-left">
                  <ellipse cx="260" cy="357" rx="10" ry="7" fill="#666" stroke="#777" strokeWidth="1" />
                  <line x1="252" y1="350" x2="252" y2="362" stroke="#4a4a4a" strokeWidth="2" />
                  <line x1="260" y1="348" x2="260" y2="365" stroke="#4a4a4a" strokeWidth="2" />
                  <line x1="268" y1="350" x2="268" y2="362" stroke="#4a4a4a" strokeWidth="2" />
                </g>
              </g>

              {/* Right Arm - Typing Motion */}
              <g className="right-arm">
                {/* Shoulder joint */}
                <circle cx="228" cy="280" r="6" fill="#555" stroke="#777" strokeWidth="1" />
                
                {/* Upper arm */}
                <line x1="228" y1="280" x2="270" y2="320" stroke="#5a5a5a" strokeWidth="12" strokeLinecap="round" />
                
                {/* Elbow joint */}
                <circle cx="270" cy="320" r="7" fill="#555" stroke="#777" strokeWidth="1" />
                
                {/* Forearm - animated */}
                <line x1="270" y1="320" x2="310" y2="350" stroke="#4a4a4a" strokeWidth="11" strokeLinecap="round" className="arm-bend" style={{ animationDelay: "0.15s" }} />
                
                {/* Wrist joint */}
                <circle cx="310" cy="350" r="6" fill="#555" stroke="#777" strokeWidth="1" />
                
                {/* Hand/Fingers */}
                <g className="hand-right">
                  <ellipse cx="310" cy="357" rx="10" ry="7" fill="#666" stroke="#777" strokeWidth="1" />
                  <line x1="302" y1="350" x2="302" y2="362" stroke="#4a4a4a" strokeWidth="2" />
                  <line x1="310" y1="348" x2="310" y2="365" stroke="#4a4a4a" strokeWidth="2" />
                  <line x1="318" y1="350" x2="318" y2="362" stroke="#4a4a4a" strokeWidth="2" />
                </g>
              </g>
            </g>

            {/* Data flow indicators */}
            <g className="data-flow" opacity="0.5">
              <text x="50" y="110" fontSize="13" fill="#ff9a3c" className="code-float">
                {'<AI>'}
              </text>
              <text x="520" y="110" fontSize="13" fill="#00c9ff" className="code-float" style={{ animationDelay: "0.5s" }}>
                {'</AI>'}
              </text>
              <text x="40" y="300" fontSize="12" fill="#ff7a2a" className="code-float" style={{ animationDelay: "1s" }}>
                training...
              </text>
              <text x="510" y="340" fontSize="12" fill="#00ff00" className="code-float" style={{ animationDelay: "1.5s" }}>
                ✓ Active
              </text>
            </g>
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
        @keyframes keyPress {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(2px); }
        }

        @keyframes codeLineAppear {
          0% { strokeDasharray: 100; strokeDashoffset: 100; opacity: 0; }
          100% { strokeDasharray: 100; strokeDashoffset: 0; opacity: 0.8; }
        }

        @keyframes armBend {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-5deg); }
        }

        @keyframes armType {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(3px); }
        }

        @keyframes eyeGlow {
          0%, 100% { r: 6; opacity: 1; }
          50% { r: 7; opacity: 0.8; }
        }

        @keyframes antennaTip {
          0%, 100% { r: 5; opacity: 1; }
          50% { r: 6; opacity: 0.7; }
        }

        @keyframes pulseLight {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        @keyframes codeFloat {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 0.7; transform: translateY(-8px); }
        }

        @keyframes wobbleAntenna {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(2deg); }
          75% { transform: rotate(-2deg); }
        }

        @keyframes progressLoad {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }

        @keyframes bounceLoad {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }

        /* Robot using computer animations */
        .key-press {
          animation: keyPress 0.6s ease-in-out infinite;
        }

        .code-line {
          animation: codeLineAppear 1.5s ease-in-out infinite;
        }

        .cursor-line {
          animation: cursorBlink 1s ease-in-out infinite;
        }

        .left-arm {
          transform-origin: 115px 230px;
          animation: armType 0.8s ease-in-out infinite;
        }

        .right-arm {
          transform-origin: 165px 230px;
          animation: armType 0.8s ease-in-out infinite;
          animation-delay: 0.15s;
        }

        .arm-bend {
          transform-origin: 95px 260px;
          animation: armBend 0.8s ease-in-out infinite;
        }

        .eye-glow {
          animation: eyeGlow 2s ease-in-out infinite;
        }

        .antenna-wobble {
          transform-origin: 140px 110px;
          animation: wobbleAntenna 2s ease-in-out infinite;
        }

        .antenna-tip-glow {
          animation: antennaTip 1.5s ease-in-out infinite;
        }

        .pulse-light {
          animation: pulseLight 1.4s ease-in-out infinite;
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
