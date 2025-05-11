interface CircleTimerProps {
  isRunning: boolean;
  isCompleted: boolean;
  progress: number;
}

export function CircleTimer({
  isRunning,
  isCompleted,
  progress
}: CircleTimerProps) {
  // SVG 원의 둘레 계산 (r * 2 * PI)
  const CIRCLE_CIRCUMFERENCE = 283; // 45 * 2 * 3.14159

  // 진행률에 따른 원호 길이 계산
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
        
        {/* 진행 원호 */}
        {(isRunning || isCompleted) && (
          <circle
            className={`
              fill-none transition-all duration-1000 ease-in-out
              ${isCompleted ? 'stroke-[#4ADE80]' : 'stroke-[#8B95F2]'}
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

      {/* 중앙 텍스트 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        {isRunning && (
          <div className="text-2xl font-bold text-[#8B95F2]">
            {Math.floor(progress)}%
          </div>
        )}
        
        {isCompleted && (
          <div className="text-2xl font-bold text-[#4ADE80] animate-bounce">
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