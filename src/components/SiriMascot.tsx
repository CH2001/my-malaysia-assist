import React, { useEffect, useState } from 'react';

interface SiriMascotProps {
  isActive?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const SiriMascot: React.FC<SiriMascotProps> = ({ 
  isActive = false, 
  size = 'large' 
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; opacity: number }>>([]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setParticles(prev => {
          const newParticles = [...prev];
          // Add new particle
          if (newParticles.length < 8) {
            newParticles.push({
              id: Date.now(),
              x: Math.random() * 360,
              y: Math.random() * 360,
              opacity: Math.random() * 0.8 + 0.2
            });
          }
          // Remove old particles
          return newParticles.slice(-6);
        });
      }, 200);
      
      return () => clearInterval(interval);
    } else {
      setParticles([]);
    }
  }, [isActive]);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24', 
    large: 'w-32 h-32'
  };

  const particleSizes = {
    small: 'w-1 h-1',
    medium: 'w-1.5 h-1.5',
    large: 'w-2 h-2'
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      <div 
        className={`absolute rounded-full ${sizeClasses[size]} opacity-20`}
        style={{
          background: `conic-gradient(from 0deg, hsl(var(--cyan-primary)), hsl(var(--cyan-secondary)), hsl(var(--cyan-glow)), hsl(var(--cyan-primary)))`,
          animation: isActive ? 'spin 3s linear infinite' : 'none'
        }}
      />
      
      {/* Main orb */}
      <div 
        className={`relative ${sizeClasses[size]} rounded-full siri-orb flex items-center justify-center border border-cyan-400/30`}
        style={{
          animation: isActive ? 'siri-pulse 1.5s ease-in-out infinite' : 'siri-pulse 3s ease-in-out infinite'
        }}
      >
        {/* Inner core */}
        <div 
          className="w-3/4 h-3/4 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, hsl(var(--cyan-secondary)), hsl(var(--cyan-primary) / 0.8))`,
            animation: isActive ? 'siri-wave 0.8s ease-in-out infinite' : 'none'
          }}
        />
        
        {/* Neural network effect */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute ${particleSizes[size]} rounded-full bg-cyan-300`}
              style={{
                left: `${particle.x % 100}%`,
                top: `${particle.y % 100}%`,
                opacity: particle.opacity,
                animation: 'siri-wave 1s ease-in-out infinite',
                animationDelay: `${particle.id % 4 * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Floating particles around */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
              style={{
                left: `${20 + (i * 12)}%`,
                top: `${30 + Math.sin(i) * 20}%`,
                animation: `siri-wave ${1 + (i * 0.2)}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};