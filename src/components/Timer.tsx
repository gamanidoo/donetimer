'use client';

import { useState, useEffect } from 'react';
import { format, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { TimerHeader } from './TimerHeader';
import { TimerInfo } from './TimerInfo';
import { TimeSelector } from './TimeSelector';
import { TimerButtons } from './TimerButtons';
import { CircleTimer } from './CircleTimer';

interface FocusTime {
  totalMinutes: number;
}

export function Timer() {
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [showResetAlert, setShowResetAlert] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isTimeSelectorVisible, setIsTimeSelectorVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    
    if (isRunning && endTime) {
      setIsTimeSelectorVisible(false);
      const initialDuration = differenceInMinutes(endTime, new Date());
      setTotalDuration(initialDuration);

      if (!startTime) {
        setStartTime(new Date());
      }

      interval = setInterval(() => {
        const now = new Date();
        const left = Math.max(0, differenceInMinutes(endTime, now));
        
        if (startTime) {
          const elapsed = Math.max(0, differenceInMinutes(now, startTime));
          setTimeSpent(elapsed);
        }
        
        setTimeLeft(left);

        if (left === 0) {
          setIsCompleted(true);
          setIsRunning(false);
          setProgress(100);
        }
      }, 60000);

      progressInterval = setInterval(() => {
        if (startTime) {
          const now = new Date();
          const totalSeconds = initialDuration * 60;
          const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
          const currentProgress = Math.min(100, (elapsedSeconds / totalSeconds) * 100);
          setProgress(currentProgress);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [isRunning, endTime, startTime]);

  useEffect(() => {
    if (isRunning) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '타이머가 초기화됩니다. 다시 시작할까요?';
        return e.returnValue;
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [isRunning]);

  const handleStart = () => {
    if (endTime) {
      setStartTime(new Date());
      setIsRunning(true);
      setIsCompleted(false);
      setIsTimeSelectorVisible(false);
      setProgress(0);
    }
  };

  const handleReset = () => {
    setShowResetAlert(true);
  };

  const confirmReset = () => {
    setStartTime(null);
    window.location.reload();
  };

  const cancelReset = () => {
    setShowResetAlert(false);
  };

  const handleTimeChange = (value: string, type: 'hours' | 'minutes') => {
    let numValue = parseInt(value) || 0;
    let newHours = type === 'hours' ? numValue : parseInt(hours) || 0;
    let newMinutes = type === 'minutes' ? numValue : parseInt(minutes) || 0;
    
    if (type === 'hours') {
      newHours = Math.min(Math.max(newHours, 0), 23);
      setHours(newHours.toString().padStart(2, '0'));
    } else {
      newMinutes = Math.min(Math.max(newMinutes, 0), 59);
      setMinutes(newMinutes.toString().padStart(2, '0'));
    }

    const newEndTime = new Date();
    newEndTime.setHours(newHours, newMinutes, 0);
    
    if (newEndTime < new Date()) {
      newEndTime.setDate(newEndTime.getDate() + 1);
    }
    
    setEndTime(newEndTime);
  };

  const calculateFocusTime = () => {
    if (!endTime) return null;
    const now = new Date();
    const diffMinutes = differenceInMinutes(endTime, now);
    
    if (diffMinutes <= 0) return null;
    
    return { totalMinutes: diffMinutes };
  };

  const focusTime = calculateFocusTime();

  const getElapsedMinutes = () => {
    if (!isRunning || !startTime) return 0;
    const now = new Date();
    return Math.max(0, differenceInMinutes(now, startTime));
  };

  const getLeftMinutes = () => {
    if (!endTime) return 0;
    const now = new Date();
    return Math.max(0, Math.floor(differenceInMinutes(endTime, now)));
  };

  const calculateProgress = () => {
    if (!isRunning || !focusTime) return 0;
    const elapsed = getElapsedMinutes();
    return (elapsed / focusTime.totalMinutes) * 100;
  };

  const progressPercentage
   = calculateProgress();

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}시간 ${remainingMinutes}분`;
    }
    return `${minutes}분`;
  };

  const formatTimeDisplay = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}시간 ${remainingMinutes}분`;
    }
    return `${minutes}분`;
  };

  return (
    <div className="min-h-screen flex flex-col text-white">
      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 px-6 pt-8">
        {/* 헤더 */}
        <div className="mb-6">
          <TimerHeader 
            endTime={endTime} 
            focusTime={focusTime as FocusTime | null}
            isRunning={isRunning}
            isCompleted={isCompleted}
            isTimeSelectorVisible={isTimeSelectorVisible}
            onToggleTimeSelector={() => setIsTimeSelectorVisible(!isTimeSelectorVisible)}
          />
        </div>

        {/* 시간 선택기 */}
        {((isTimeSelectorVisible && isRunning) || !isRunning) && (
          <div className="mb-6">
            <TimeSelector
              hours={hours}
              minutes={minutes}
              isRunning={isRunning}
              endTime={endTime}
              onTimeChange={handleTimeChange}
            />
          </div>
        )}

        {/* 타이머 그래프와 정보 */}
        <div className="flex flex-col items-center">
          <div className="w-[280px]">
            <CircleTimer
              isRunning={isRunning}
              isCompleted={isCompleted}
              progress={progress}
            />
          </div>
          <div className="w-full mt-2">
            <TimerInfo
              isRunning={isRunning}
              elapsedMinutes={getElapsedMinutes()}
              timeLeftMinutes={getLeftMinutes()}
              isCompleted={isCompleted}
            />
          </div>
          
          {/* 버튼 영역 - 타이머 아래 고정 여백 */}
          <div className="w-full mt-16">
            <TimerButtons
              isRunning={isRunning}
              isCompleted={isCompleted}
              endTime={endTime}
              focusTime={focusTime}
              onStart={handleStart}
              onReset={handleReset}
            />
          </div>
        </div>
      </div>

      {/* 초기화 확인 얼럿 */}
      {showResetAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2C3247] rounded-2xl p-6 w-[280px]">
            <h2 className="text-lg font-bold mb-4 text-center">
              초기화하시겠습니까?
            </h2>
            <div className="flex gap-4">
              <button
                onClick={confirmReset}
                className="flex-1 bg-[#8B95F2] text-white py-2.5 rounded-full font-medium hover:bg-[#7A84E1] transition-all hover:shadow-lg"
              >
                예
              </button>
              <button
                onClick={cancelReset}
                className="flex-1 bg-transparent border-2 border-[#8B95F2] text-white py-2.5 rounded-full font-medium hover:bg-[#2C3247] transition-all hover:shadow-lg"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 