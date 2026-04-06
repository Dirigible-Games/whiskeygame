import React, { useRef, useEffect, useState } from 'react';

interface AutoScalingTextProps {
  children: React.ReactNode;
  className?: string;
  minFontSize?: number;
  maxFontSize?: number;
}

export const AutoScalingText: React.FC<AutoScalingTextProps> = ({ 
  children, 
  className = '',
  minFontSize = 5,
  maxFontSize = 14
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useEffect(() => {
    const resizeText = () => {
      if (!containerRef.current || !textRef.current) return;

      let currentSize = maxFontSize;
      textRef.current.style.fontSize = `${currentSize}px`;

      // Keep reducing font size until it fits or hits minimum
      while (
        textRef.current.scrollWidth > containerRef.current.clientWidth &&
        currentSize > minFontSize
      ) {
        currentSize -= 0.5;
        textRef.current.style.fontSize = `${currentSize}px`;
      }
      
      setFontSize(currentSize);
    };

    resizeText();
    
    const observer = new ResizeObserver(resizeText);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, [children, maxFontSize, minFontSize]);

  return (
    <div ref={containerRef} className={`w-full overflow-hidden flex items-center justify-center ${className}`}>
      <span ref={textRef} className="whitespace-nowrap" style={{ fontSize: `${fontSize}px` }}>
        {children}
      </span>
    </div>
  );
};
