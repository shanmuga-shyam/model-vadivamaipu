"use client";

import React, { useEffect, useMemo, useState } from "react";

type Mode = "walk" | "fly";

const MODES: Mode[] = ["walk", "fly"];

const STATUS_LINES = [
  "Hauling crates across the line",
  "Routing cranes and calibrating optics",
  "Scanning microchips for anomalies",
  "Syncing telemetry across micro-factories",
];

export function LoadingScreen() {
  const [mode, setMode] = useState<Mode>("walk");
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = MODES[Math.floor(Math.random() * MODES.length)];
      setMode(next);
      setStatusIndex((prev) => (prev + 1) % STATUS_LINES.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const headline = useMemo(
    () => (mode === "fly" ? "Robots are spinning up" : "Robots are rolling out"),
    [mode]
  );

  return (
    <div className="relative isolate min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <div className="absolute inset-0 opacity-40" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,212,255,0.15),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,107,53,0.15),transparent_30%),radial-gradient(circle_at_70%_60%,rgba(168,85,247,0.12),transparent_35%)]" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Autonomous factory grid</p>
            <h1 className="mt-2 text-3xl font-semibold text-white/90 sm:text-4xl">{headline}</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              Multiple crews are online—hauling crates, welding frames, scanning chips, and syncing metrics while your workspace boots.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
            Live plant mode
          </div>
        </div>

        {/* Full-width robot runner: moves across the entire viewport left -> right */}
        <FullWidthRunner mode={mode} />

        <div className="grid gap-6 md:grid-cols-2">
          <Tile title="Inbound Cargo Line" metric="72 crates/min" accent="text-amber-400">
            <RobotTrack mode={mode} variant="cargo" />
            <p className="mt-3 text-sm text-slate-400">Crate haulers move supplies onto the main conveyor and sort by priority lanes.</p>
          </Tile>

          <Tile title="Assembly Bay" metric="98% uptime" accent="text-cyan-300">
            <RobotTrack mode={mode} variant="assembly" />
            <p className="mt-3 text-sm text-slate-400">Dual weld arms fuse panels while a rover brings new parts into position.</p>
          </Tile>

          <Tile title="Vision QA Rail" metric="0.3% defect" accent="text-purple-300">
            <RobotTrack mode={mode} variant="vision" />
            <p className="mt-3 text-sm text-slate-400">Optical bots scan microchips and mark anomalies before packaging.</p>
          </Tile>

          <Tile title="Control Nerve Center" metric="Orchestrator live" accent="text-emerald-300">
            <RobotTrack mode={mode} variant="control" />
            <p className="mt-3 text-sm text-slate-400">Telemetry drones sync metrics, reroute jobs, and keep the plant balanced.</p>
          </Tile>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-slate-800/70 via-slate-900/70 to-slate-950/80 p-4">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Industrial load plan</span>
            <span className="text-emerald-300">Synchronizing 4 micro-factories</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
            <div className="loading-gradient h-full w-[72%]" aria-hidden />
          </div>
          <p className="mt-2 text-xs text-slate-500">{STATUS_LINES[statusIndex]}</p>
        </div>
      </div>

      <style jsx>{`
        .loading-gradient {
          background: linear-gradient(90deg, #10b981, #22d3ee, #f59e0b, #10b981);
          background-size: 200% 100%;
          animation: slide 1.2s ease-in-out infinite;
          box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
        }

        @keyframes slide {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .rail {
          background: linear-gradient(to right, rgba(226, 232, 240, 0.08) 20%, rgba(59, 130, 246, 0.12), rgba(226, 232, 240, 0.08));
        }

        .robot-shell {
          box-shadow:
            0 0 0 1px rgba(15, 23, 42, 0.5),
            0 6px 20px rgba(0, 0, 0, 0.35),
            0 0 25px rgba(16, 185, 129, 0.25);
        }

        .walk-cycle {
          animation: walk 1.6s ease-in-out infinite;
        }

        .fly-cycle {
          animation: fly 1.6s ease-in-out infinite;
        }

        .crate {
          animation: crate 1.6s ease-in-out infinite;
        }

        @keyframes walk {
          0% { transform: translateX(-80%) translateY(0px); }
          25% { transform: translateX(-30%) translateY(0px); }
          50% { transform: translateX(10%) translateY(-4px); }
          75% { transform: translateX(50%) translateY(0px); }
          100% { transform: translateX(90%) translateY(0px); }
        }

        @keyframes fly {
          0% { transform: translateX(-85%) translateY(0px) scale(1); }
          25% { transform: translateX(-30%) translateY(-14px) scale(1.02); }
          50% { transform: translateX(5%) translateY(-22px) scale(1.05); }
          75% { transform: translateX(50%) translateY(-12px) scale(1.03); }
          100% { transform: translateX(95%) translateY(0px) scale(1); }
        }

        @keyframes crate {
          0% { transform: translateX(-70%); opacity: 0.9; }
          25% { transform: translateX(-25%); opacity: 1; }
          50% { transform: translateX(15%); opacity: 1; }
          75% { transform: translateX(55%); opacity: 1; }
          100% { transform: translateX(95%); opacity: 0.95; }
        }

        .thruster::after {
          content: "";
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 18px;
          background: radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.95), rgba(59, 130, 246, 0));
          filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.8));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .fly-cycle .thruster::after {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

type TileProps = {
  title: string;
  metric: string;
  accent?: string;
  children: React.ReactNode;
};

function Tile({ title, metric, accent = "text-cyan-300", children }: TileProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/4 via-transparent to-white/0" aria-hidden />
      <div className="relative flex items-center justify-between text-sm text-slate-200">
        <span className="font-medium text-white">{title}</span>
        <span className={accent}>{metric}</span>
      </div>
      <div className="relative mt-4">
        {children}
      </div>
    </div>
  );
}

type TrackProps = {
  mode: Mode;
  variant: "cargo" | "assembly" | "vision" | "control";
};

function RobotTrack({ mode, variant }: TrackProps) {
  const palette = {
    cargo: { shell: "bg-slate-800", glow: "from-amber-400 to-cyan-300", accent: "bg-amber-400" },
    assembly: { shell: "bg-slate-800", glow: "from-cyan-300 to-blue-500", accent: "bg-cyan-300" },
    vision: { shell: "bg-slate-800", glow: "from-purple-400 to-indigo-400", accent: "bg-purple-400" },
    control: { shell: "bg-slate-800", glow: "from-emerald-300 to-cyan-400", accent: "bg-emerald-300" },
  }[variant];

  const motionClass = mode === "fly" ? "fly-cycle" : "walk-cycle";

  return (
    <div className="relative h-40 overflow-hidden rounded-xl bg-slate-950/60">
      <div className="absolute inset-x-4 bottom-10 h-2 rounded-full rail" aria-hidden />
      <div className="absolute inset-x-10 bottom-7 h-1 rounded-full bg-slate-800/60" aria-hidden />

      <div className={`crate absolute bottom-14 left-1/2 h-10 w-14 -translate-x-1/2 rounded-md bg-slate-800/80 backdrop-blur`}>
        <div className="flex h-full items-center justify-center gap-1">
          <span className="h-6 w-2 rounded-sm bg-amber-400/80" />
          <span className="h-6 w-2 rounded-sm bg-amber-500/80" />
          <span className="h-6 w-2 rounded-sm bg-amber-400/80" />
        </div>
      </div>

      <div className={`robot-shell ${motionClass} absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-2xl ${palette.shell} px-3 py-2`}>
        <div className="relative flex h-12 w-16 items-center justify-center rounded-xl bg-slate-900">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/6 to-white/0" aria-hidden />
          <div className="flex items-center gap-1">
            <span className={`${palette.accent} block h-3 w-3 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.8)]`} />
            <span className="block h-2 w-3 rounded-sm bg-slate-200" />
            <span className={`${palette.accent} block h-3 w-3 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.8)]`} />
          </div>
          <div className="thruster absolute -bottom-2 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-slate-700/70" aria-hidden />
        </div>

        <div className="flex flex-col gap-1">
          <div className={`h-2 w-10 rounded-full bg-gradient-to-r ${palette.glow} opacity-80`} />
          <div className="flex gap-1">
            <span className="h-3 w-3 rounded-full bg-slate-600" />
            <span className="h-3 w-3 rounded-full bg-slate-600" />
          </div>
        </div>
      </div>

      {mode === "fly" ? (
        <div className="absolute inset-0 blur-3xl">
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/15" />
        </div>
      ) : (
        <div className="absolute inset-x-4 bottom-6 flex justify-between opacity-60" aria-hidden>
          <span className="h-1 w-16 rounded-full bg-slate-700" />
          <span className="h-1 w-16 rounded-full bg-slate-700" />
          <span className="h-1 w-16 rounded-full bg-slate-700" />
        </div>
      )}
    </div>
  );
}

export default LoadingScreen;

function FullWidthRunner({ mode }: { mode: Mode }) {
  const isFly = mode === "fly";

  return (
    <div className={`pointer-events-none absolute left-0 top-28 w-full overflow-visible`}> 
      <div className={`full-run ${isFly ? "fly" : "walk"}`} aria-hidden>
        <div className={`runner-crate`} />
        <div className={`runner-robot`}>
          <div className="robot-body" />
        </div>
      </div>

      <style jsx>{`
        .full-run {
          position: relative;
          height: 120px;
          width: 100%;
        }

        .full-run .runner-robot,
        .full-run .runner-crate {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          will-change: transform, opacity;
        }

        .runner-robot {
          left: -120px;
          width: 96px;
          height: 64px;
          border-radius: 12px;
          background: linear-gradient(180deg,#0f1724,#0b1220);
          box-shadow: 0 8px 30px rgba(2,6,23,0.6), 0 0 30px rgba(34,211,238,0.06) inset;
        }

        .robot-body {
          width:100%; height:100%; border-radius:inherit; background:linear-gradient(90deg,#0b1220,#0f1724);
        }

        .runner-crate {
          left: -200px;
          width: 56px;
          height: 48px;
          border-radius:6px;
          background: linear-gradient(180deg,#1f2937,#111827);
          box-shadow: 0 6px 18px rgba(2,6,23,0.6);
          border: 2px solid rgba(255,255,255,0.03);
        }

        .full-run.walk .runner-robot { animation: run-walk 1.8s linear infinite; }
        .full-run.walk .runner-crate { animation: run-crate 1.8s linear infinite; }

        .full-run.fly .runner-robot { animation: run-fly 1.8s linear infinite; }
        .full-run.fly .runner-crate { animation: run-crate 1.8s linear infinite; }

        @keyframes run-walk {
          0% { transform: translateX(-120px) translateY(0); }
          20% { transform: translateX(calc(10vw)) translateY(-4px); }
          50% { transform: translateX(45vw) translateY(-6px); }
          80% { transform: translateX(80vw) translateY(-2px); }
          100% { transform: translateX(110vw) translateY(0); }
        }

        @keyframes run-fly {
          0% { transform: translateX(-140px) translateY(0) scale(1); }
          20% { transform: translateX(calc(15vw)) translateY(-40px) scale(1.02); }
          50% { transform: translateX(50vw) translateY(-68px) scale(1.06); }
          80% { transform: translateX(85vw) translateY(-34px) scale(1.03); }
          100% { transform: translateX(120vw) translateY(0) scale(1); }
        }

        @keyframes run-crate {
          0% { transform: translateX(-200px); opacity: 0.95 }
          20% { transform: translateX(calc(8vw)); opacity: 1 }
          50% { transform: translateX(44vw); opacity: 1 }
          80% { transform: translateX(82vw); opacity: 1 }
          100% { transform: translateX(118vw); opacity: 0.95 }
        }
      `}</style>
    </div>
  );
}
