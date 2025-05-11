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
  const [isRunning, setIsRunning] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [showResetAlert, setShowResetAlert] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isTimeSelectorVisible, setIsTimeSelectorVisible] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && endTime) {
      setIsTimeSelectorVisible(false);
      const initialDuration = differenceInSeconds(endTime, new Date());
      setTotalDuration(initialDuration);

      interval = setInterval(() => {
        const now = new Date();
        const spent = Math.floor((now.getTime() - new Date().getTime()) / 1000);
        const left = Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000));
        
        setTimeSpent(spent);
        setTimeLeft(left);

        if (left === 0) {
          setIsCompleted(true);
          setIsRunning(false);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, endTime]);

  const handleStart = () => {
    if (endTime) {
      setIsRunning(true);
      setIsCompleted(false);
      setIsTimeSelectorVisible(false);
    }
  };

  const handleReset = () => {
    setShowResetAlert(true);
  };

  const confirmReset = () => {
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

  const progress = endTime && timeLeft > 0
    ? ((endTime.getTime() - new Date().getTime() - timeLeft * 1000) / (endTime.getTime() - new Date().getTime())) * 100
    : 0;

  const formatTimeDisplay = (seconds: number) => {
    const totalMinutes = Math.floor(seconds / 60);
    return `${totalMinutes}`;
  };

  const getSpentMinutes = () => {
    if (!focusTime) return 0;
    const totalFocusMinutes = focusTime.totalMinutes;
    const leftMinutes = Math.ceil(timeLeft / 60);
    return totalFocusMinutes - leftMinutes;
  };

  const getLeftMinutes = () => {
    if (!focusTime) return 0;
    return Math.ceil(timeLeft / 60);
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
              timeSpent={timeSpent}
              timeLeft={timeLeft}
              totalDuration={totalDuration}
              timeDisplay={formatTimeDisplay(timeLeft)}
            />
          </div>
          <div className="w-full mt-2">
            <TimerInfo
              isRunning={isRunning}
              timeSpentMinutes={getSpentMinutes()}
              timeLeftMinutes={getLeftMinutes()}
              isCompleted={isCompleted}
            />
          </div>
          
          {/* 버튼 영역 - 타이머 아래 고정 여백 */}
          <div className="w-full mt-16">
            <TimerButtons
              isRunning={isRunning}
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