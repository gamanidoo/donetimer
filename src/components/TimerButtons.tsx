interface TimerButtonsProps {
  isRunning: boolean;
  isCompleted: boolean;
  endTime: Date | null;
  focusTime: { totalMinutes: number } | null;
  onStart: () => void;
  onReset: () => void;
}

export function TimerButtons({
  isRunning,
  isCompleted,
  endTime,
  focusTime,
  onStart,
  onReset
}: TimerButtonsProps) {
  // 시작 버튼 표시 조건: 타이머가 실행 중이지 않고, 완료 상태도 아닐 때
  const showStartButton = !isRunning && !isCompleted;
  // 초기화 버튼 표시 조건: 타이머가 실행 중이거나 완료 상태일 때
  const showResetButton = isRunning || isCompleted;
  
  // 시작 버튼 활성화 조건: 종료 시각과 집중 시간이 설정되어 있을 때
  const isStartButtonEnabled = endTime && focusTime;

  return (
    <div className="flex justify-center">
      {showStartButton && (
        <button
          className={`
            w-full max-w-[280px] h-12 rounded-xl font-medium transition-all
            ${isStartButtonEnabled
              ? 'bg-[#8B95F2] hover:bg-[#7A84E1] text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }
          `}
          onClick={onStart}
          disabled={!isStartButtonEnabled}
        >
          시작하기
        </button>
      )}
      
      {showResetButton && (
        <button
          className="w-full max-w-[280px] h-12 rounded-xl font-medium bg-red-500 hover:bg-red-600 text-white transition-all"
          onClick={onReset}
        >
          초기화
        </button>
      )}
    </div>
  );
} 