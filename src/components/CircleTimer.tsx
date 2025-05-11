interface CircleTimerProps {
  isRunning: boolean;
  isCompleted: boolean;
  timeSpent: number;
  timeLeft: number;
  totalDuration: number;
  timeDisplay: string;
}

export function CircleTimer({
  isRunning,
  isCompleted,
  timeSpent,
  timeLeft,
  totalDuration,
  timeDisplay
}: CircleTimerProps) {
  // SVG 원의 둘레 계산 (r * 2 * PI)
  const CIRCLE_CIRCUMFERENCE = 283; // 45 * 2 * 3.14159

  // 진행률 계산 (0-100)
  const calculateProgress = () => {
    if (isCompleted) return 100;
    if (!isRunning || totalDuration === 0) return 0;
    return (timeSpent / totalDuration) * 100;
  };

  const progress = calculateProgress();
  const dashOffset = CIRCLE_CIRCUMFERENCE * (1 - progress / 100);

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      {/* 배경 원 */}
      <svg 
        className="w-full h-full -rotate-90 transform"
        viewBox="0 0 100 100"
      >
        <circle
          className="stroke-[#2C3247] fill-none"
          strokeWidth="8"
          r="45"
          cx="50"
          cy="50"
        />
        
        {/* 진행 원 */}
        {(isRunning || isCompleted) && (
          <circle
            className={`
              fill-none transition-all duration-1000 ease-in-out
              ${isCompleted ? 'stroke-green-400' : 'stroke-[#8B95F2]'}
            `}
            strokeWidth="8"
            r="45"
            cx="50"
            cy="50"
            strokeLinecap="round"
            strokeDasharray={CIRCLE_CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
        )}
      </svg>

      {/* 중앙 시간 표시 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        {isRunning && (
          <>
            <div className="text-4xl font-bold mb-2">
              {timeDisplay}
            </div>
            <div className="text-sm text-gray-400">
              {Math.floor(progress)}%
            </div>
          </>
        )}
        
        {isCompleted && (
          <div className="text-2xl font-bold text-green-400 animate-bounce">
            완료!
          </div>
        )}

        {!isRunning && !isCompleted && (
          <div className="text-xl text-gray-400">
            타이머 대기 중
          </div>
        )}
      </div>
    </div>
  );
} 