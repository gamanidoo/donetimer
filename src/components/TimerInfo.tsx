interface TimerInfoProps {
  isRunning: boolean;
  elapsedMinutes: number;
  timeLeftMinutes: number;
  isCompleted: boolean;
}

const formatDuration = (minutes: number) => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}시간 ${remainingMinutes}분`;
  }
  return `${minutes}분`;
};

export function TimerInfo({ 
  isRunning, 
  elapsedMinutes, 
  timeLeftMinutes, 
  isCompleted 
}: TimerInfoProps) {
  if (!isRunning && !isCompleted) return null;

  return (
    <div className="text-center space-y-2">
      {isRunning && (
        <>
          <p className="text-gray-400">
            경과 시간: {formatDuration(elapsedMinutes)}
          </p>
          <p className="text-gray-400">
            남은 시간: {formatDuration(timeLeftMinutes)}
          </p>
        </>
      )}
      
      {isCompleted && (
        <div className="text-center text-green-400 font-bold">
          타이머가 완료되었습니다!
        </div>
      )}
    </div>
  );
} 