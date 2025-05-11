import { format } from 'date-fns';
import { useEffect, useRef } from 'react';

interface TimeSelectorProps {
  hours: string;
  minutes: string;
  isRunning: boolean;
  endTime: Date | null;
  onTimeChange: (value: string, type: 'hours' | 'minutes') => void;
}

export function TimeSelector({ 
  hours, 
  minutes, 
  isRunning, 
  endTime,
  onTimeChange 
}: TimeSelectorProps) {
  const hoursInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hoursInputRef.current) {
      hoursInputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex justify-between items-center">
      {/* 시작 시각 */}
      <div className="text-center">
        <p className="text-sm text-gray-400 mb-1.5">시작 시각</p>
        <p className="text-xl text-white">{format(new Date(), 'HH:mm')}</p>
      </div>

      {/* 종료 시각 */}
      <div className="text-center">
        <p className="text-sm text-gray-400 mb-1.5">종료 시각</p>
        <div className="flex items-center justify-center text-xl">
          <input
            ref={hoursInputRef}
            type="text"
            value={hours}
            onChange={(e) => onTimeChange(e.target.value, 'hours')}
            className="w-[50px] bg-transparent border-b-2 border-white text-center py-1 text-white focus:outline-none focus:border-[#8B95F2]"
            placeholder="00"
            disabled={isRunning}
          />
          <span className="mx-2 text-white">:</span>
          <input
            type="text"
            value={minutes}
            onChange={(e) => onTimeChange(e.target.value, 'minutes')}
            className="w-[50px] bg-transparent border-b-2 border-white text-center py-1 text-white focus:outline-none focus:border-[#8B95F2]"
            placeholder="00"
            disabled={isRunning}
          />
        </div>
      </div>
    </div>
  );
} 