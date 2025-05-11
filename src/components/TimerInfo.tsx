import React from 'react';

export interface TimerInfoProps {
  isRunning: boolean;
  timeLeftMinutes: number;
  elapsedMinutes: number;
  isCompleted: boolean;
}

export function TimerInfo({ 
  isRunning, 
  timeLeftMinutes, 
  elapsedMinutes,
  isCompleted 
}: TimerInfoProps) {
  // 시간 포맷팅 함수
  const formatTime = (minutes: number) => {
    if (minutes === 0) return "0분";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}시간 ${remainingMinutes}분`;
    }
    return `${remainingMinutes}분`;
  };

  if (!isRunning && !isCompleted) return null;

  return (
    <div className="flex flex-col items-center space-y-2 text-gray-300">
      <div>경과 시간: {formatTime(elapsedMinutes)}</div>
      <div>남은 시간: {formatTime(timeLeftMinutes)}</div>
    </div>
  );
} 