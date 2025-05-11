interface TimerInfoProps {
  isRunning: boolean;
  timeSpentMinutes: number;
  timeLeftMinutes: number;
  isCompleted: boolean;
}

export function TimerInfo({ 
  isRunning, 
  timeSpentMinutes, 
  timeLeftMinutes, 
  isCompleted 
}: TimerInfoProps) {
  if (!isRunning && !isCompleted) return null;

  return (
    <div className="text-center space-y-2">
      {isRunning && (
        <>
          <p className="text-gray-400">
            보낸 시간: {timeSpentMinutes}분
          </p>
          <p className="text-gray-400">
            남은 시간: {timeLeftMinutes}분
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