import React from 'react';

interface WorkScheduleStepProps {
  workStart: string;
  workEnd: string;
  onChange: (field: 'workStart' | 'workEnd', value: string) => void;
  error?: string;
}

// Custom Wheel Picker Component
interface WheelPickerProps {
  options: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  width: string;
}

const WheelPicker: React.FC<WheelPickerProps> = ({ options, selectedValue, onValueChange, width }) => {
  const selectedIndex = options.indexOf(selectedValue);
  const visibleItems = 7;
  const itemHeight = 50;
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [touchStartY, setTouchStartY] = React.useState<number | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isScrolling, setIsScrolling] = React.useState(false);

  const triggerHapticFeedback = () => {
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate([30]);
      }
    } catch (error) {
      // Silently fail if haptic feedback is not supported
    }
  };

  const getVisibleOptions = () => {
    const result = [];
    const halfVisible = Math.floor(visibleItems / 2);
    
    for (let i = -halfVisible; i <= halfVisible; i++) {
      const index = selectedIndex + i;
      if (index >= 0 && index < options.length) {
        result.push({
          value: options[index],
          index: index,
          offset: i,
          isSelected: i === 0
        });
      } else {
        result.push({
          value: '',
          index: -1,
          offset: i,
          isSelected: false
        });
      }
    }
    return result;
  };

  const handleItemClick = (targetIndex: number) => {
    if (targetIndex >= 0 && targetIndex < options.length && targetIndex !== selectedIndex) {
      triggerHapticFeedback();
      onValueChange(options[targetIndex]);
    }
  };

  const moveUp = () => {
    if (selectedIndex > 0) {
      setIsScrolling(true);
      triggerHapticFeedback();
      onValueChange(options[selectedIndex - 1]);
      setTimeout(() => setIsScrolling(false), 150);
    }
  };

  const moveDown = () => {
    if (selectedIndex < options.length - 1) {
      setIsScrolling(true);
      triggerHapticFeedback();
      onValueChange(options[selectedIndex + 1]);
      setTimeout(() => setIsScrolling(false), 150);
    }
  };

  // Use useEffect to add wheel event listener with passive: false
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        moveDown();
      } else {
        moveUp();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [selectedIndex]); // Re-add listener when selectedIndex changes

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setTouchStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || touchStartY === null) return;
    
    e.preventDefault();
    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY - currentY;
    
    if (Math.abs(deltaY) > 15) {
      if (deltaY > 0) {
        moveDown();
      } else {
        moveUp();
      }
      setTouchStartY(currentY);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartY(null);
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStartY(e.clientY);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || touchStartY === null) return;
    
    const currentY = e.clientY;
    const deltaY = touchStartY - currentY;
    
    if (Math.abs(deltaY) > 12) {
      if (deltaY > 0) {
        moveDown();
      } else {
        moveUp();
      }
      setTouchStartY(currentY);
    }
  };

  const handleMouseUp = () => {
    setTouchStartY(null);
    setIsDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveUp();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveDown();
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative ${width} h-56 overflow-hidden flex flex-col justify-center focus:outline-none rounded-xl`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ userSelect: 'none' }}
    >
      <div className={`flex flex-col items-center justify-center h-full relative transition-all duration-200 ease-out ${isScrolling ? 'scale-105' : 'scale-100'}`}>
        {getVisibleOptions().map((item, index) => {
          if (!item.value) {
            return (
              <div
                key={`empty-${index}`}
                style={{ height: `${itemHeight}px` }}
                className="flex items-center justify-center"
              >
              </div>
            );
          }

          const distance = Math.abs(item.offset);
          let opacity, fontSize, fontWeight, color, textShadow, transform, zIndex;
          
          if (item.isSelected) {
            opacity = 1;
            fontSize = 'clamp(16px, 4vw, 20px)';
            fontWeight = '700';
            color = '#111827';
            textShadow = 'none';
            transform = 'scale(1) translateZ(0)';
            zIndex = 10;
          } else if (distance === 1) {
            opacity = 0.7;
            fontSize = 'clamp(14px, 3.5vw, 18px)';
            fontWeight = '500';
            color = '#374151';
            textShadow = 'none';
            transform = 'scale(1) translateZ(0)';
            zIndex = 5;
          } else if (distance === 2) {
            opacity = 0.4;
            fontSize = 'clamp(12px, 3vw, 16px)';
            fontWeight = '400';
            color = '#6b7280';
            textShadow = 'none';
            transform = 'scale(1) translateZ(0)';
            zIndex = 3;
          } else {
            opacity = 0.2;
            fontSize = 'clamp(11px, 2.5vw, 14px)';
            fontWeight = '400';
            color = '#9ca3af';
            textShadow = 'none';
            transform = 'scale(1) translateZ(0)';
            zIndex = 1;
          }
          
          return (
            <div
              key={`${item.value}-${index}`}
              className="flex items-center justify-center cursor-pointer transition-all duration-300 ease-out px-2"
              style={{
                height: `${itemHeight}px`,
                opacity,
                transform,
                zIndex
              }}
              onClick={() => handleItemClick(item.index)}
            >
              <span 
                className="select-none text-center leading-tight pointer-events-none whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                style={{
                  fontSize,
                  fontWeight,
                  color,
                  textShadow
                }}
              >
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Helper function for time options
const getTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push(timeString);
    }
  }
  return times;
};

export const WorkScheduleStep: React.FC<WorkScheduleStepProps> = ({ workStart, workEnd, onChange, error }) => (
  <div className="space-y-6">
    <div className="flex justify-center space-x-8">
      <div className="flex flex-col items-center">
        <label className="text-sm font-medium text-gray-600 mb-2">Work Start</label>
        <WheelPicker
          options={getTimeOptions()}
          selectedValue={workStart}
          onValueChange={(value) => onChange('workStart', value)}
          width="w-24"
        />
      </div>
      
      <div className="flex flex-col items-center">
        <label className="text-sm font-medium text-gray-600 mb-2">Work End</label>
        <WheelPicker
          options={getTimeOptions()}
          selectedValue={workEnd}
          onValueChange={(value) => onChange('workEnd', value)}
          width="w-24"
        />
      </div>
    </div>
    
    {error && (
      <div className="text-red-500 text-sm text-center mt-2">
        {error}
      </div>
    )}
  </div>
); 