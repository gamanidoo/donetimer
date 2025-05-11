import { format } from 'date-fns';

interface TimerHeaderProps {
  endTime: Date | null;
  focusTime: { totalMinutes: number } | null;
  isRunning: boolean;
  isCompleted: boolean;
  isTimeSelectorVisible: boolean;
  onToggleTimeSelector: () => void;
}

export function TimerHeader({ 
  endTime, 
  focusTime, 
  isRunning,
  isCompleted,
  isTimeSelectorVisible,
  onToggleTimeSelector 
}: TimerHeaderProps) {
  const formatTime = (date: Date) => {
    return format(date, 'HH:mm');
  };

  const formatMinutes = (totalMinutes: number) => {
    if (totalMinutes >= 60) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`;
    }
    return `${totalMinutes}분`;
  };

  // 타이머 완료
  if (isCompleted) {
    return (
      <h1 className="text-2xl font-bold text-center text-green-400 animate-bounce">
        완료!
      </h1>
    );
  }

  // 타이머 작동 중
  if (isRunning && endTime && focusTime) {
    return (
      <div 
        className="text-center cursor-pointer"
        onClick={onToggleTimeSelector}
      >
        <h1 className="text-2xl font-bold mb-2 text-[#A5AEFF]">
          {formatTime(endTime)}까지, {formatMinutes(focusTime.totalMinutes)} 남았어요
        </h1>
        <p className="text-sm text-gray-400">
          {isTimeSelectorVisible ? '시간 설정 닫기' : '시간 설정 열기'}
        </p>
      </div>
    );
  }

  // 종료 시각 입력 후
  if (endTime && focusTime) {
    return (
      <h1 className="text-2xl font-bold text-center text-[#A5AEFF]">
        {formatMinutes(focusTime.totalMinutes)} 집중하기
      </h1>
    );
  }

  // 종료 시각 입력 전
  return (
    <h1 className="text-2xl font-bold text-center text-[#A5AEFF]">
      종료 시각을 선택하세요
    </h1>
  );
} 