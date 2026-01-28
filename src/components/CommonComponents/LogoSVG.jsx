import React from 'react'

export default function LogoSVG() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center">
      {/* Container for the logo - Relative positioning context */}
      <div className="relative w-48 h-64">
        
        {/* BOTTOM LEFT SQUARE */}
        {/* Top line */}
        <div className="absolute bottom-16 left-0 w-24 h-2 bg-primary"></div>
        {/* Bottom line */}
        <div className="absolute bottom-0 left-0 w-24 h-2 bg-primary"></div>
        {/* Left line */}
        <div className="absolute bottom-0 left-0 w-2 h-16 bg-primary"></div>
        {/* Center vertical line (shared) */}
        <div className="absolute bottom-0 left-24 w-2 h-16 bg-primary -translate-x-1/2"></div>

        {/* BOTTOM RIGHT SQUARE */}
        {/* Top line */}
        <div className="absolute bottom-16 left-24 w-24 h-2 bg-primary"></div>
        {/* Bottom line */}
        <div className="absolute bottom-0 rounded-l-md right-0 w-20 h-2 bg-primary"></div>
        {/* Right line */}
        <div className="absolute bottom-0 right-0 w-2 h-16 bg-primary"></div>

        {/* TOP TRIANGLE / PEAK */}
        {/* Right Slant (The vertical-ish line going up) */}
        <div 
          className="absolute top-10 left-24 w-2 h-36 rounded-t-md bg-primary origin-bottom"
          style={{ transform: 'translateX(-50%)' }}
        ></div>
        
        {/* Left Slant (The angled line closing the top) */}
        <div 
          className="absolute rounded-md top-[46px] left-12 w-2 h-28 bg-primary origin-top-right rotate-[45deg]"
          style={{ left: 'calc(50% - 4px)' }}
        ></div>
      </div>
    </div>
  )
}  
