"use client";

const PARTICLES = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  duration: `${10 + Math.random() * 15}s`,
  delay: `${Math.random() * 10}s`,
  opacity: 0.15 + Math.random() * 0.25,
}));

export default function ParticlesBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Clean Dark Background */}
      <div className="absolute inset-0 bg-[#0B1020]" />

      {/* Soft Top Glow */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[180px]" />

      {/* Soft Bottom Glow */}
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-cyan-500/8 blur-[180px]" />

      {/* Tiny Particles */}
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            opacity: p.opacity,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}