// TimeSelector.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

interface TimeSelectorProps {
  hours: string;
  minutes: string;
  isRunning: boolean;
  isValid: boolean;
  onTimeChange: (value: string, type: 'hours' | 'minutes') => void;
}

// 현재 시각을 가져오는 헬퍼 함수 (두 자리로 포맷)
const getCurrentTime = () => {
  const now = new Date();
  return {
    hours: now.getHours().toString().padStart(2, '0'),
    minutes: now.getMinutes().toString().padStart(2, '0')
  };
};

export function TimeSelector({
  hours,
  minutes,
  isRunning,
  isValid,
  onTimeChange
}: TimeSelectorProps) {
  const hoursInputRef = useRef<HTMLInputElement>(null);
  const minutesInputRef = useRef<HTMLInputElement>(null);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  // 컴포넌트가 렌더링될 때 포커스를 시간 입력란으로 이동
  useEffect(() => {
    if (!isRunning && hoursInputRef.current) {
      hoursInputRef.current.focus();
    }
  }, [isRunning]);

  // 타이머가 동작하지 않을 경우 1분마다 현재 시각 업데이트
  useEffect(() => {
    if (isRunning) return;
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000);
    return () => clearInterval(timer);
  }, [isRunning]);

  // 방향키 및 Enter 키 입력 처리 로직
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: 'hours' | 'minutes') => {
    if (e.key === 'ArrowRight' && type === 'hours') {
      minutesInputRef.current?.focus();
    } else if (e.key === 'ArrowLeft' && type === 'minutes') {
      hoursInputRef.current?.focus();
    } else if (e.key === 'Enter') {
      if (type === 'hours') {
        minutesInputRef.current?.focus();
      } else {
        minutesInputRef.current?.blur();
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-xs mb-4">
        <div className="text-gray-400">시작 시각</div>
        <div className="text-gray-400">종료 시각</div>
      </div>

      <div className="flex justify-between w-full max-w-xs">
        {/* 시작 시각 (읽기 전용) */}
        <div className="text-2xl font-bold">
          {currentTime.hours}:{currentTime.minutes}
        </div>

        {/* 종료 시각 (입력 가능) */}
        <div className="flex items-center gap-2 text-2xl">
          <input
            ref={hoursInputRef}
            type="text"
            value={hours}
            onChange={(e) => onTimeChange(e.target.value, 'hours')}
            onKeyDown={(e) => handleKeyDown(e, 'hours')}
            className={`
              w-12 bg-transparent text-center border-b-2 transition-colors
              ${isRunning 
                ? 'border-gray-600 text-gray-400 cursor-not-allowed' 
                : `border-[#8B95F2] text-white caret-white focus:outline-none
                   ${isValid ? 'focus:border-green-400' : 'focus:border-white'}`
              }
            `}
            placeholder="00"
            maxLength={2}
            disabled={isRunning}
          />
          <span className="text-white">:</span>
          <input
            ref={minutesInputRef}
            type="text"
            value={minutes}
            onChange={(e) => onTimeChange(e.target.value, 'minutes')}
            onKeyDown={(e) => handleKeyDown(e, 'minutes')}
            className={`
              w-12 bg-transparent text-center border-b-2 transition-colors
              ${isRunning 
                ? 'border-gray-600 text-gray-400 cursor-not-allowed' 
                : `border-[#8B95F2] text-white caret-white focus:outline-none
                   ${isValid ? 'focus:border-green-400' : 'focus:border-white'}`
              }
            `}
            placeholder="00"
            maxLength={2}
            disabled={isRunning}
          />
        </div>
      </div>
    </div>
  );
}
