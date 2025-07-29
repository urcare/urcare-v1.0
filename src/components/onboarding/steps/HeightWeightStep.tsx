import React from 'react';

interface HeightWeightStepProps {
  unitSystem: 'imperial' | 'metric';
  heightFeet: string;
  heightInches: string;
  heightCm: string;
  weightLb: string;
  weightKg: string;
  onChange: (field: string, value: string) => void;
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
      className={`relative ${width} h-48 sm:h-56 overflow-hidden flex flex-col justify-center focus:outline-none rounded-xl`}
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
            fontSize = 'clamp(14px, 3.5vw, 18px)';
            fontWeight = '700';
            color = '#111827';
            textShadow = 'none';
            transform = 'scale(1) translateZ(0)';
            zIndex = 10;
          } else if (distance === 1) {
            opacity = 0.7;
            fontSize = 'clamp(12px, 3vw, 16px)';
            fontWeight = '500';
            color = '#374151';
            textShadow = 'none';
            transform = 'scale(1) translateZ(0)';
            zIndex = 5;
          } else if (distance === 2) {
            opacity = 0.4;
            fontSize = 'clamp(10px, 2.5vw, 14px)';
            fontWeight = '400';
            color = '#6b7280';
            textShadow = 'none';
            transform = 'scale(1) translateZ(0)';
            zIndex = 3;
          } else {
            opacity = 0.2;
            fontSize = 'clamp(9px, 2vw, 12px)';
            fontWeight = '400';
            color = '#9ca3af';
            textShadow = 'none';
            transform = 'scale(1) translateZ(0)';
            zIndex = 1;
          }
          
          return (
            <div
              key={`${item.value}-${index}`}
              className="flex items-center justify-center cursor-pointer transition-all duration-300 ease-out px-1 sm:px-2"
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

// Helper functions for height and weight pickers
const getHeightFeet = () => Array.from({ length: 6 }, (_, i) => (i + 3).toString()); // 3-8 feet
const getHeightInches = () => Array.from({ length: 12 }, (_, i) => i.toString()); // 0-11 inches
const getHeightCm = () => Array.from({ length: 151 }, (_, i) => (i + 100).toString()); // 100-250 cm
const getWeightLb = () => Array.from({ length: 301 }, (_, i) => (i + 50).toString()); // 50-350 lb
const getWeightKg = () => Array.from({ length: 221 }, (_, i) => (i + 30).toString()); // 30-250 kg

export const HeightWeightStep: React.FC<HeightWeightStepProps> = ({
  unitSystem,
  heightFeet,
  heightInches,
  heightCm,
  weightLb,
  weightKg,
  onChange,
  error
}) => (
  <div className="space-y-4 sm:space-y-6 w-full">
    {/* Unit System Toggle */}
    <div className="flex justify-center space-x-2 px-2">
      <button
        onClick={() => onChange('unitSystem', 'metric')}
        className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl border-2 transition-all duration-200 text-sm sm:text-base ${
          unitSystem === 'metric'
            ? 'border-gray-900 bg-gray-900 text-white'
            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
        }`}
      >
        Metric (cm, kg)
      </button>
      <button
        onClick={() => onChange('unitSystem', 'imperial')}
        className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl border-2 transition-all duration-200 text-sm sm:text-base ${
          unitSystem === 'imperial'
            ? 'border-gray-900 bg-gray-900 text-white'
            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
        }`}
      >
        Imperial (ft, in, lb)
      </button>
    </div>

    {/* Height and Weight Pickers */}
    <div className="flex justify-center space-x-2 sm:space-x-4 px-2">
      {unitSystem === 'metric' ? (
        <>
          <div className="flex flex-col items-center">
            <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Height (cm)</label>
            <WheelPicker
              options={getHeightCm()}
              selectedValue={heightCm}
              onValueChange={(value) => onChange('heightCm', value)}
              width="w-16 sm:w-20"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Weight (kg)</label>
            <WheelPicker
              options={getWeightKg()}
              selectedValue={weightKg}
              onValueChange={(value) => onChange('weightKg', value)}
              width="w-16 sm:w-20"
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center">
            <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Height (ft)</label>
            <WheelPicker
              options={getHeightFeet()}
              selectedValue={heightFeet}
              onValueChange={(value) => onChange('heightFeet', value)}
              width="w-12 sm:w-16"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Height (in)</label>
            <WheelPicker
              options={getHeightInches()}
              selectedValue={heightInches}
              onValueChange={(value) => onChange('heightInches', value)}
              width="w-12 sm:w-16"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Weight (lb)</label>
            <WheelPicker
              options={getWeightLb()}
              selectedValue={weightLb}
              onValueChange={(value) => onChange('weightLb', value)}
              width="w-16 sm:w-20"
            />
          </div>
        </>
      )}
    </div>
    
    {error && (
      <div className="text-red-500 text-sm text-center mt-2 px-2">
        {error}
      </div>
    )}
  </div>
); 