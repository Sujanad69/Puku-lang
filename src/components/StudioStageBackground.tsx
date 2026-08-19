import React from 'react';

interface StudioStageBackgroundProps {
  isDark?: boolean;
  compact?: boolean;
}

export const StudioStageBackground: React.FC<StudioStageBackgroundProps> = ({
  isDark = true,
  compact = false,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* 1. Avaturn Infinite 3D Studio Backdrop */}
      <div 
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 90% 70% at 50% 38%, #171d26 0%, #0d1117 45%, #05070a 100%)'
            : 'radial-gradient(ellipse 90% 70% at 50% 38%, #ffffff 0%, #e8ebee 50%, #d5d9e0 100%)',
        }}
      />

      {/* 2. Overhead Volumetric Studio Softbox Glow */}
      <div 
        className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[110%] h-[65%] pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 60% 50% at 50% 15%, rgba(56, 189, 248, 0.15) 0%, rgba(14, 165, 233, 0.05) 50%, transparent 80%)'
            : 'radial-gradient(ellipse 60% 50% at 50% 15%, rgba(0, 122, 255, 0.12) 0%, rgba(0, 122, 255, 0.03) 50%, transparent 80%)',
          mixBlendMode: isDark ? 'screen' : 'normal',
        }}
      />

      {/* 3. Subtle Receding 3D Floor Perspective Grid (Avaturn Studio Floor) */}
      <div 
        className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none opacity-40"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(to right, rgba(56, 189, 248, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.12) 1px, transparent 1px)'
            : 'linear-gradient(to right, rgba(0, 122, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 122, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 65%, black 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 65%, black 20%, transparent 75%)',
          transform: 'perspective(500px) rotateX(68deg)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* 4. Avaturn 3D Circular Stage Pedestal (Turntable Platform) */}
      <div 
        className={`absolute left-1/2 -translate-x-1/2 w-full flex items-center justify-center pointer-events-none ${
          compact 
            ? 'bottom-[-15px] h-[130px] max-w-[340px]' 
            : 'bottom-[95px] sm:bottom-[115px] h-[190px] max-w-[500px]'
        }`}
        style={{
          perspective: '650px',
        }}
      >
        <div 
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transform: 'rotateX(74deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Deep Ambient Ground Occlusion Shadow (Under Avatar Shoes) */}
          <div 
            className="absolute rounded-full"
            style={{
              width: '52%',
              height: '52%',
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 0.45)',
              filter: 'blur(14px)',
            }}
          />

          {/* Diffused Outer Shadow */}
          <div 
            className="absolute rounded-full"
            style={{
              width: '84%',
              height: '84%',
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.25)',
              filter: 'blur(28px)',
            }}
          />

          {/* Outer Cyan/Ice Blue Stage Halo Glow */}
          <div 
            className="absolute rounded-full transition-all duration-500"
            style={{
              width: '92%',
              height: '92%',
              background: isDark
                ? 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(14, 165, 233, 0.12) 55%, transparent 75%)'
                : 'radial-gradient(circle, rgba(0, 122, 255, 0.25) 0%, rgba(0, 122, 255, 0.08) 55%, transparent 75%)',
              filter: 'blur(16px)',
            }}
          />

          {/* Outer Stage Rim Disc (Metallic Beveled Edge) */}
          <div 
            className="absolute rounded-full border transition-all duration-500"
            style={{
              width: '90%',
              height: '90%',
              borderColor: isDark ? 'rgba(56, 189, 248, 0.55)' : 'rgba(0, 122, 255, 0.4)',
              backgroundColor: isDark ? 'rgba(18, 24, 34, 0.75)' : 'rgba(255, 255, 255, 0.85)',
              boxShadow: isDark
                ? '0 0 30px rgba(56, 189, 248, 0.35), inset 0 0 25px rgba(56, 189, 248, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.25)'
                : '0 0 24px rgba(0, 122, 255, 0.2), inset 0 0 20px rgba(0, 122, 255, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.9)',
            }}
          />

          {/* Mid Stage Ring with Avaturn Calibrated Ticks */}
          <div 
            className="absolute rounded-full border border-dashed transition-all duration-500 opacity-60"
            style={{
              width: '74%',
              height: '74%',
              borderColor: isDark ? 'rgba(147, 197, 253, 0.45)' : 'rgba(0, 122, 255, 0.35)',
            }}
          />

          {/* Inner Stage Disc (Glossy Turntable Center) */}
          <div 
            className="absolute rounded-full border transition-all duration-500 flex items-center justify-center"
            style={{
              width: '56%',
              height: '56%',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.12)',
              backgroundColor: isDark ? 'rgba(28, 36, 48, 0.65)' : 'rgba(240, 244, 250, 0.75)',
              boxShadow: isDark
                ? 'inset 0 0 16px rgba(56, 189, 248, 0.2)'
                : 'inset 0 0 12px rgba(0, 122, 255, 0.1)',
            }}
          >
            {/* Center Stage Crosshair Target (Avaturn Signature) */}
            <div className="relative w-6 h-6 flex items-center justify-center">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: isDark ? '#38bdf8' : '#007aff' }}
              />
              <div 
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(0, 122, 255, 0.3)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Cinematic Vignette (Edge Falloff) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 50% 45%, transparent 45%, rgba(3, 5, 8, 0.85) 100%)'
            : 'radial-gradient(circle at 50% 45%, transparent 55%, rgba(0, 0, 0, 0.15) 100%)',
        }}
      />
    </div>
  );
};
