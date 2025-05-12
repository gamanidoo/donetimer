import { format } from 'date-fns';

interface TimerHeaderProps {
  endTime: Date | null;
  focusTime: { totalMinutes: number } | null;
  isRunning: boolean;
  isCompleted: boolean;
  isTimeSelectorVisible: boolean;
  onToggleTimeSelector: () => void;
}

// 상태별 텍스트 메시지 정의
const TIMER_MESSAGES = {
  INITIAL: "종료 시각을 선택하세요",
  COMPLETED: "🎉 집중 완료!",
  TIME_SELECTED: (duration: string) => `${duration} 집중하기`,
  // duration은 전체 집중 시간을 나타냄 (남은 시간이 아님)
  RUNNING: (endTime: string, duration: string) => `${endTime}까지\n${duration}동안 집중해요`
} as const;

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
      return `${hours}시간 ${minutes}분`;
    }
    return `${totalMinutes}분`;
  };

  const getHeaderContent = () => {
    // 타이머 완료
    if (isCompleted) {
      return {
        text: TIMER_MESSAGES.COMPLETED,
        className: "text-2xl font-bold text-center text-green-400 animate-bounce"
      };
    }

    // 타이머 작동 중 - focusTime.totalMinutes는 전체 집중 시간을 나타냄
    if (isRunning && endTime && focusTime) {
      return {
        text: TIMER_MESSAGES.RUNNING(
          formatTime(endTime),
          formatMinutes(focusTime.totalMinutes)
        ),
        className: "text-2xl font-bold mb-2 text-[#A5AEFF] whitespace-pre-line",
        showTimeSelector: true
      };
    }

    // 종료 시각 입력 후
    if (endTime && focusTime) {
      return {
        text: TIMER_MESSAGES.TIME_SELECTED(formatMinutes(focusTime.totalMinutes)),
        className: "text-2xl font-bold text-center text-[#A5AEFF]"
      };
    }

    // 종료 시각 입력 전 (초기 상태)
    return {
      text: TIMER_MESSAGES.INITIAL,
      className: "text-2xl font-bold text-center text-[#A5AEFF]"
    };
  };

  const headerContent = getHeaderContent();

  if (headerContent.showTimeSelector) {
    return (
      <div 
        className="text-center cursor-pointer"
        onClick={onToggleTimeSelector}
      >
        <h1 className={headerContent.className}>
          {headerContent.text}
        </h1>
        <p className="text-sm text-gray-400">
          {isTimeSelectorVisible ? '시간 설정 닫기' : '시간 설정 열기'}
        </p>
      </div>
    );
  }

  return (
    <h1 className={headerContent.className}>
      {headerContent.text}
    </h1>
  );
} 