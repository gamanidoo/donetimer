interface TimerButtonsProps {
  isRunning: boolean;
  endTime: Date | null;
  focusTime: { totalMinutes: number } | null;
  onStart: () => void;
  onReset: () => void;
}

export function TimerButtons({
  isRunning,
  endTime,
  focusTime,
  onStart,
  onReset
}: TimerButtonsProps) {
  return (
    <div className="flex justify-center">
      {!isRunning ? (
        <button
          className={`
            w-full max-w-[280px] h-12 rounded-xl font-medium
            ${endTime && focusTime
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }
          `}
          onClick={onStart}
          disabled={!endTime || !focusTime}
        >
          시작하기
        </button>
      ) : (
        <button
          className="w-full max-w-[280px] h-12 rounded-xl font-medium bg-red-500 hover:bg-red-600 text-white"
          onClick={onReset}
        >
          초기화
        </button>
      )}
    </div>
  );
} 