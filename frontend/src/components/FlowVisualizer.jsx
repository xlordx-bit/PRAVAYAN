import React, { useMemo } from 'react';

export default function FlowVisualizer() {
  const centerX = 400;
  const centerY = 280;
  const scaleX = 35; // horizontal scale factor
  const scaleY = 20; // vertical scale factor (isometric ratio)

  // Grid definition (Z = 0 Plane)
  const gridRange = useMemo(() => {
    const lines = [];
    const min = -6;
    const max = 6;

    // Lines parallel to X axis (moving along Y)
    for (let y = min; y <= max; y++) {
      const p1x = centerX + (min - y) * scaleX;
      const p1y = centerY + (min + y) * scaleY;
      const p2x = centerX + (max - y) * scaleX;
      const p2y = centerY + (max + y) * scaleY;
      lines.push({ x1: p1x, y1: p1y, x2: p2x, y2: p2y, key: `x-${y}` });
    }

    // Lines parallel to Y axis (moving along X)
    for (let x = min; x <= max; x++) {
      const p1x = centerX + (x - min) * scaleX;
      const p1y = centerY + (x + min) * scaleY;
      const p2x = centerX + (x - max) * scaleX;
      const p2y = centerY + (x + max) * scaleY;
      lines.push({ x1: p1x, y1: p1y, x2: p2x, y2: p2y, key: `y-${x}` });
    }

    return lines;
  }, [centerX, centerY, scaleX, scaleY]);

  // Wave paths calculation (3D elevated curves representing the water stream)
  const paths = useMemo(() => {
    const mainStreamPoints = [];
    const leftCurrentPoints = [];
    const rightCurrentPoints = [];
    
    const shadowMainPoints = [];
    const shadowLeftPoints = [];
    const shadowRightPoints = [];
    
    // Scan along the main diagonal (from x = -6.8 to 6.8 for a longer, flowing line)
    for (let x = -6.8; x <= 6.8; x += 0.1) {
      // Fluid height (Z) - organic wavy path
      const z = 36 * Math.sin(x * 0.9) + 14 * Math.cos(x * 0.45) + 12;
      
      // Horizontal fluid sway in XY plane
      const yOffset = 0.9 * Math.sin(x * 0.55);
      
      // 1. Central wide riverbed current
      const yMain = -x + yOffset;
      const pxMain = centerX + (x - yMain) * scaleX;
      const pyMain = centerY + (x + yMain) * scaleY - z;
      mainStreamPoints.push(`${pxMain.toFixed(1)},${pyMain.toFixed(1)}`);
      
      const spyMain = centerY + (x + yMain) * scaleY;
      shadowMainPoints.push(`${pxMain.toFixed(1)},${spyMain.toFixed(1)}`);

      // 2. Left stream (cyan water highlight)
      const yLeft = -x + yOffset - 0.28;
      const pxLeft = centerX + (x - yLeft) * scaleX;
      const pyLeft = centerY + (x + yLeft) * scaleY - z;
      leftCurrentPoints.push(`${pxLeft.toFixed(1)},${pyLeft.toFixed(1)}`);
      
      const spyLeft = centerY + (x + yLeft) * scaleY;
      shadowLeftPoints.push(`${pxLeft.toFixed(1)},${spyLeft.toFixed(1)}`);

      // 3. Right stream (deep blue/purple current)
      const yRight = -x + yOffset + 0.28;
      const pxRight = centerX + (x - yRight) * scaleX;
      const pyRight = centerY + (x + yRight) * scaleY - z;
      rightCurrentPoints.push(`${pxRight.toFixed(1)},${pyRight.toFixed(1)}`);
      
      const spyRight = centerY + (x + yRight) * scaleY;
      shadowRightPoints.push(`${pxRight.toFixed(1)},${spyRight.toFixed(1)}`);
    }

    return {
      main: `M ${mainStreamPoints.join(' L ')}`,
      left: `M ${leftCurrentPoints.join(' L ')}`,
      right: `M ${rightCurrentPoints.join(' L ')}`,
      
      sMain: `M ${shadowMainPoints.join(' L ')}`,
      sLeft: `M ${shadowLeftPoints.join(' L ')}`,
      sRight: `M ${shadowRightPoints.join(' L ')}`,
    };
  }, [centerX, centerY, scaleX, scaleY]);

  return (
    <div className="relative w-full h-[320px] md:h-[450px] flex items-center justify-center overflow-visible select-none">
      {/* Ambient background aquatic glow */}
      <div className="absolute w-80 h-80 rounded-full bg-cyan-200/20 blur-3xl -z-10 pointer-events-none animate-float-slow" />
      <div className="absolute w-72 h-72 rounded-full bg-blue-200/25 blur-3xl -z-10 pointer-events-none animate-float-medium" style={{ animationDelay: '3s' }} />
      
      <svg 
        className="w-full h-full max-w-[800px] overflow-visible"
        viewBox="0 0 800 500"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Real-time organic water ripples shader using displacement mapping */}
          <filter id="water-shimmer" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.015 0.04" 
              numOctaves="3" 
              result="noise"
            >
              <animate 
                attributeName="baseFrequency" 
                dur="12s" 
                values="0.012 0.035; 0.018 0.05; 0.012 0.035" 
                repeatCount="indefinite" 
              />
            </feTurbulence>
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="12" 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
          </filter>

          {/* Glowing particle shadow */}
          <filter id="droplet-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Cast Shadow Filter */}
          <filter id="shadow-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" result="blur" />
          </filter>

          {/* Gradients */}
          <linearGradient id="grid-fade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#94a3b8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.05" />
          </linearGradient>

          {/* Main Riverbed/Water base gradient */}
          <linearGradient id="riverbed-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0891b2" stopOpacity="0.45" /> {/* Cyan 600 */}
            <stop offset="50%" stopColor="#2563eb" stopOpacity="0.35" /> {/* Blue 600 */}
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.45" /> {/* Indigo 600 */}
          </linearGradient>

          {/* Left Aquatic Stream (Teal/Cyan) */}
          <linearGradient id="aqua-grad-left" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan */}
            <stop offset="50%" stopColor="#38bdf8" /> {/* Sky blue */}
            <stop offset="100%" stopColor="#0284c7" /> {/* Ocean blue */}
          </linearGradient>

          {/* Right Deep Flow Stream (Blue/Purple) */}
          <linearGradient id="purple-grad-right" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#2563eb" /> {/* Royal Blue */}
            <stop offset="60%" stopColor="#7c3aed" /> {/* Violet */}
            <stop offset="100%" stopColor="#db2777" /> {/* Pink water highlight */}
          </linearGradient>

          {/* Water Droplet gradient */}
          <radialGradient id="water-droplet-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#e0f2fe" /> {/* Sky 100 */}
            <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.9" /> {/* Sky 400 */}
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Isometric Grid (Z = 0 Plane) */}
        <g className="opacity-70 animate-grid-pulse">
          {gridRange.map((line) => (
            <line
              key={line.key}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="url(#grid-fade)"
              strokeWidth="1.2"
            />
          ))}
        </g>

        {/* 2. Wave Shadows (Projected on Z = 0) */}
        <g filter="url(#shadow-blur)" className="opacity-[0.15] pointer-events-none">
          {/* Main riverbed shadow */}
          <path d={paths.sMain} stroke="#0f172a" strokeWidth="22" strokeLinecap="round" fill="none" />
          {/* Side streams shadow */}
          <path d={paths.sLeft} stroke="#0f172a" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d={paths.sRight} stroke="#0f172a" strokeWidth="8" strokeLinecap="round" fill="none" />
        </g>

        {/* 3. Broad Riverbed Base Current (With Shimmer ripple shader) */}
        <path
          d={paths.main}
          stroke="url(#riverbed-grad)"
          strokeWidth="18"
          strokeLinecap="round"
          fill="none"
          filter="url(#water-shimmer)"
        />

        {/* 4. Secondary Left Current (Shimmering Light Aqua) */}
        <path
          d={paths.left}
          stroke="url(#aqua-grad-left)"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#water-shimmer)"
          className="animate-wave-glow"
        />

        {/* 5. Secondary Right Current (Deep Violet/Blue) */}
        <path
          d={paths.right}
          stroke="url(#purple-grad-right)"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#water-shimmer)"
          className="animate-wave-glow"
        />

        {/* 6. Surface Ripples (Thin moving dash lines overlay) */}
        <path
          d={paths.left}
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeOpacity="0.7"
          strokeLinecap="round"
          fill="none"
          className="animate-flow-fast"
        />
        <path
          d={paths.right}
          stroke="#e0f2fe"
          strokeWidth="1.5"
          strokeOpacity="0.55"
          strokeLinecap="round"
          fill="none"
          className="animate-flow-slow"
        />

        {/* 7. Floating Water Droplets & Liquid Particles */}
        {/* Droplet 1: Large cyan drop flowing on Left stream */}
        <circle r="10" fill="url(#water-droplet-glow)" filter="url(#droplet-glow)">
          <animateMotion
            path={paths.left}
            dur="4.5s"
            repeatCount="indefinite"
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="linear"
          />
        </circle>

        {/* Droplet 2: Small fast bubble flowing on Right stream */}
        <circle r="7.5" fill="url(#water-droplet-glow)" filter="url(#droplet-glow)">
          <animateMotion
            path={paths.right}
            dur="3.2s"
            begin="1.2s"
            repeatCount="indefinite"
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="linear"
          />
        </circle>

        {/* Droplet 3: Medium droplet flowing on Left stream (delayed) */}
        <circle r="8.5" fill="url(#water-droplet-glow)" filter="url(#droplet-glow)">
          <animateMotion
            path={paths.left}
            dur="6s"
            begin="2.2s"
            repeatCount="indefinite"
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="linear"
          />
        </circle>

        {/* Droplet 4: Tiny glowing current tracer on main riverbed */}
        <circle r="6" fill="#ffffff" filter="url(#droplet-glow)" className="opacity-95">
          <animateMotion
            path={paths.main}
            dur="5s"
            begin="0.5s"
            repeatCount="indefinite"
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="linear"
          />
        </circle>

        {/* Droplet 5: Fast tracer on main riverbed */}
        <circle r="5" fill="#e0f7fa" filter="url(#droplet-glow)" className="opacity-95">
          <animateMotion
            path={paths.main}
            dur="3.8s"
            begin="2.8s"
            repeatCount="indefinite"
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="linear"
          />
        </circle>

        {/* Infrastructure Nodes (Grounding references) */}
        <g className="opacity-95">
          {/* Node 1 */}
          <circle cx="210" cy="380" r="6" fill="#06b6d4" className="animate-ping opacity-60" />
          <circle cx="210" cy="380" r="4.5" fill="#0891b2" stroke="#ffffff" strokeWidth="1.5" />

          {/* Node 2 */}
          <circle cx="430" cy="210" r="6" fill="#3b82f6" className="animate-ping opacity-60" />
          <circle cx="430" cy="210" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />

          {/* Node 3 */}
          <circle cx="610" cy="275" r="6" fill="#8b5cf6" className="animate-ping opacity-60" />
          <circle cx="610" cy="275" r="4.5" fill="#7c3aed" stroke="#ffffff" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}
