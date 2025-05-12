// Timer.tsx
'use client';

import { useState, useEffect } from 'react';
import { differenceInMinutes } from 'date-fns';
import { TimerHeader } from './TimerHeader';
import { TimerInfo } from './TimerInfo';
import { TimeSelector } from './TimeSelector';
import { TimerButtons } from './TimerButtons';
import { CircleTimer } from './CircleTimer';

// 집중 시간 타입 정의
interface FocusTime {
  totalMinutes: number;
}

export function Timer() {
  // 1. 상태 선언 -----------------------------------------------------

  // 시간 관련 상태
  const [startTime, setStartTime] = useState<Date | null>(null); // 시작 시각 (타이머 시작 시 고정됨)
  const [endTime, setEndTime] = useState<Date | null>(null);     // 사용자가 설정한 종료 시각

  // 타이머 작동 상태
  const [isRunning, setIsRunning] = useState(false);             // 타이머 진행 중 여부
  const [isCompleted, setIsCompleted] = useState(false);         // 타이머 종료 여부

  // 시간 경과 상태
  const [timeSpent, setTimeSpent] = useState(0);                 // 경과 시간 (분)
  const [timeLeft, setTimeLeft] = useState(0);                   // 남은 시간 (분)
  const [progress, setProgress] = useState(0);                   // 진행률 (%)

  // 입력 UI 상태
  const [timeInput, setTimeInput] = useState({
    hours: '',
    minutes: '',
    isValid: false,
  });

  // 기타 UI 상태
  const [isTimeSelectorVisible, setIsTimeSelectorVisible] = useState(false);
  const [showResetAlert, setShowResetAlert] = useState(false);
  const [updateInterval, setUpdateInterval] = useState(1000); // 초기 1초 간격

  // 2. 시간 계산 함수 -----------------------------------------------------

  // 종료 시각 - 시작 시각 → 집중 시간 계산
  const calculateFocusTime = (): FocusTime | null => {
    if (!endTime) return null;
    const now = new Date();
    now.setSeconds(0, 0);

    if (isRunning && startTime) {
      const diff = differenceInMinutes(endTime, startTime);
      return diff > 0 ? { totalMinutes: diff } : null;
    } else {
      const diff = differenceInMinutes(endTime, now);
      return diff > 0 ? { totalMinutes: diff } : null;
    }
  };

  // 입력값 유효성 검증
  const validateTimeInput = (hours: number, minutes: number): boolean => {
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
  };

  // 현재보다 이전 시각인지 판단
  const isTimeBeforeNow = (hours: number, minutes: number): boolean => {
    const now = new Date();
    const input = new Date();
    input.setHours(hours, minutes, 0, 0);
    return input <= now;
  };

  // 3. 이벤트 핸들러 -----------------------------------------------------

  // 종료 시각 입력 핸들러
  const handleTimeInput = (value: string, type: 'hours' | 'minutes') => {
    const numeric = value.replace(/[^0-9]/g, '').slice(0, 2);
    const updated = { ...timeInput, [type]: numeric };

    const hours = parseInt(type === 'hours' ? numeric : timeInput.hours) || 0;
    const minutes = parseInt(type === 'minutes' ? numeric : timeInput.minutes) || 0;

    updated.isValid = validateTimeInput(hours, minutes);
    setTimeInput(updated);

    if (updated.isValid) {
      const newEnd = new Date();
      newEnd.setHours(hours, minutes, 0, 0);
      if (isTimeBeforeNow(hours, minutes)) {
        newEnd.setDate(newEnd.getDate() + 1);
      }
      setEndTime(newEnd);
    }
  };

  // 시작 버튼 핸들러
  const handleStart = () => {
    if (!endTime || !timeInput.isValid) return;

    const now = new Date();
    now.setSeconds(0, 0);
    if (endTime <= now) {
      const adjusted = new Date(endTime);
      adjusted.setDate(adjusted.getDate() + 1);
      setEndTime(adjusted);
    }

    setStartTime(now);
    setIsRunning(true);
    setIsCompleted(false);
    setProgress(0);
    setIsTimeSelectorVisible(false);
  };

  const handleReset = () => setShowResetAlert(true);
  const confirmReset = () => window.location.reload();
  const cancelReset = () => setShowResetAlert(false);

  // 4. 타이머 작동 useEffect -----------------------------------------------------

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && startTime && endTime) {
      const updateTimer = () => {
        const now = new Date();
        now.setSeconds(0, 0);

        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60));
        const total = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));
        const left = Math.max(0, total - elapsed);
        const progress = Math.min(100, Math.floor((elapsed / total) * 100));

        setTimeSpent(elapsed);
        setTimeLeft(left);
        setProgress(progress);

        // 완료 처리
        if (now >= endTime) {
          setIsCompleted(true);
          setIsRunning(false);
          setProgress(100);
          clearInterval(timer);
        }

        // 1분 이내면 초 단위 업데이트
        const newInterval = elapsed === 0 ? 1000 : 60000;
        if (newInterval !== updateInterval) {
          clearInterval(timer);
          setUpdateInterval(newInterval);
          timer = setInterval(updateTimer, newInterval);
        }
      };

      updateTimer();
      timer = setInterval(updateTimer, updateInterval);
    }

    return () => clearInterval(timer);
  }, [isRunning, startTime, endTime, updateInterval]);

  // 새로고침 시 경고창
  useEffect(() => {
    if (!isRunning) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '타이머가 초기화됩니다.';
      return e.returnValue;
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isRunning]);

  // 5. 렌더링 -----------------------------------------------------

  const focusTime = calculateFocusTime();

  return (
    <div className="min-h-screen flex flex-col text-white">
      <div className="flex-1 px-6 pt-8">
        <div className="mb-6">
          <TimerHeader
            endTime={endTime}
            focusTime={focusTime}
            isRunning={isRunning}
            isCompleted={isCompleted}
            isTimeSelectorVisible={isTimeSelectorVisible}
            onToggleTimeSelector={() => setIsTimeSelectorVisible(!isTimeSelectorVisible)}
          />
        </div>

        {(isTimeSelectorVisible || !isRunning) && (
          <div className="mb-6">
            <TimeSelector
              hours={timeInput.hours}
              minutes={timeInput.minutes}
              isRunning={isRunning}
              isValid={timeInput.isValid}
              onTimeChange={handleTimeInput}
            />
          </div>
        )}

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
              elapsedMinutes={timeSpent}
              timeLeftMinutes={timeLeft}
              isCompleted={isCompleted}
            />
          </div>
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

      {showResetAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2C3247] rounded-2xl p-6 w-[280px]">
            <h2 className="text-lg font-bold mb-4 text-center">초기화하시겠습니까?</h2>
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
