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
  const [isTimeSelectorVisible, setIsTimeSelectorVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [updateInterval, setUpdateInterval] = useState(1000);

  // 시간 입력 상태를 하나의 객체로 관리
  const [timeInput, setTimeInput] = useState({
    hours: '',
    minutes: '',
    isValid: false
  });

  // 집중 시간 계산 함수
  const calculateFocusTime = () => {
    if (!endTime) return null;
    
    // 시작 전: 현재 시각을 시작 시각으로 사용
    const baseTime = new Date();
    baseTime.setMinutes(baseTime.getMinutes());
    baseTime.setSeconds(0, 0);
    
    // 시작 후: 시작 시각과 종료 시각의 차이를 집중 시간으로 사용
    if (isRunning && startTime) {
      const focusMinutes = differenceInMinutes(endTime, startTime);
      if (focusMinutes <= 0) return null;
      return { totalMinutes: focusMinutes };
    }
    
    const diffMinutes = differenceInMinutes(endTime, baseTime);
    if (diffMinutes <= 0) return null;
    return { totalMinutes: diffMinutes };
  };

  // 시작 시각 표시 함수
  const getStartTimeDisplay = () => {
    if (isRunning && startTime) {
      return format(startTime, 'HH:mm');
    }
    return format(new Date(), 'HH:mm');
  };

  // 시간 입력값 검증
  const validateTimeInput = (hours: number, minutes: number): boolean => {
    if (hours < 0 || hours > 23) return false;
    if (minutes < 0 || minutes > 59) return false;
    return true;
  };

  // 종료 시각이 현재보다 이전인지 확인
  const isTimeBeforeNow = (hours: number, minutes: number): boolean => {
    const now = new Date();
    const inputTime = new Date();
    inputTime.setHours(hours, minutes, 0, 0);
    return inputTime <= now;
  };

  // 시간 입력 처리
  const handleTimeInput = (value: string, type: 'hours' | 'minutes') => {
    // 숫자가 아닌 문자 제거
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // 빈 값 처리
    if (numericValue === '') {
      const newTimeInput = {
        ...timeInput,
        [type]: ''
      };
      
      // 시간이 입력되어 있고 분이 비어있을 때 자동으로 00으로 설정
      if (type === 'minutes' && timeInput.hours && timeInput.hours.length > 0) {
        newTimeInput.minutes = '00';
        const hours = parseInt(timeInput.hours) || 0;
        newTimeInput.isValid = validateTimeInput(hours, 0);
        
        if (newTimeInput.isValid) {
          const newEndTime = new Date();
          newEndTime.setHours(hours, 0, 0, 0);
          
          if (isTimeBeforeNow(hours, 0)) {
            newEndTime.setDate(newEndTime.getDate() + 1);
          }
          
          setEndTime(newEndTime);
        }
      } else {
        setTimeInput(newTimeInput);
      }
      return;
    }

    // 최대 2자리까지만 처리
    const truncatedValue = numericValue.slice(0, 2);
    const numValue = parseInt(truncatedValue);

    // 첫 번째 숫자 입력 시 (한 자리 숫자)
    if (truncatedValue.length === 1) {
      // 시간일 때 3보다 크면 앞에 0을 붙임 (예: 5 → 05)
      if (type === 'hours' && numValue > 2) {
        const newTimeInput = {
          ...timeInput,
          [type]: `0${numValue}`,
          minutes: timeInput.minutes || '00' // 분이 비어있으면 00으로 설정
        };
        setTimeInput(newTimeInput);
        return;
      }
      // 분일 때 6보다 크면 앞에 0을 붙임 (예: 7 → 07)
      if (type === 'minutes' && numValue > 5) {
        const newTimeInput = {
          ...timeInput,
          [type]: `0${numValue}`
        };
        setTimeInput(newTimeInput);
        return;
      }
    }

    // 두 자리 숫자 입력 시 범위 검사
    if (truncatedValue.length === 2) {
      if (type === 'hours' && numValue > 23) {
        const newTimeInput = {
          ...timeInput,
          [type]: '23',
          minutes: timeInput.minutes || '00' // 분이 비어있으면 00으로 설정
        };
        setTimeInput(newTimeInput);
        return;
      }
      if (type === 'minutes' && numValue > 59) {
        const newTimeInput = {
          ...timeInput,
          [type]: '59'
        };
        setTimeInput(newTimeInput);
        return;
      }
    }

    // 상태 업데이트
    const newTimeInput = {
      ...timeInput,
      [type]: truncatedValue
    };

    // 시간 입력 시 분이 비어있으면 00으로 설정
    if (type === 'hours') {
      newTimeInput.minutes = timeInput.minutes || '00';
    }

    // 유효성 검증
    const hours = parseInt(type === 'hours' ? truncatedValue : timeInput.hours) || 0;
    const minutes = parseInt(type === 'minutes' ? truncatedValue : (newTimeInput.minutes || '0')) || 0;
    newTimeInput.isValid = validateTimeInput(hours, minutes);

    setTimeInput(newTimeInput);

    // 유효한 시간이면 종료 시각 업데이트
    if (newTimeInput.isValid && newTimeInput.hours) {
      const newEndTime = new Date();
      newEndTime.setHours(hours, minutes, 0, 0);

      // 현재 시각보다 이전이면 다음 날로 설정
      if (isTimeBeforeNow(hours, minutes)) {
        newEndTime.setDate(newEndTime.getDate() + 1);
      }

      setEndTime(newEndTime);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning && startTime && endTime) {
      const updateTimer = () => {
        const now = new Date();
        now.setSeconds(0, 0);  // 초와 밀리초를 0으로 설정
        
        const elapsedMs = now.getTime() - startTime.getTime();
        const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));
        
        // 경과 시간에 따른 업데이트 주기 조정
        const newInterval = elapsedMinutes === 0 ? 1000 : 60000;
        if (newInterval !== updateInterval) {
          setUpdateInterval(newInterval);
          clearInterval(timer);
          timer = setInterval(updateTimer, newInterval);
        }

        // 시간 업데이트
        setTimeSpent(elapsedMinutes);
        setTimeLeft(Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / (1000 * 60))));
        
        // 진행률 업데이트
        const currentProgress = calculateProgress();
        setProgress(currentProgress);

        // 완료 체크
        if (now >= endTime) {
          setIsCompleted(true);
          setIsRunning(false);
          setProgress(100);
          clearInterval(timer);
        }
      };

      updateTimer(); // 초기 업데이트
      timer = setInterval(updateTimer, updateInterval);
    }

    return () => clearInterval(timer);
  }, [isRunning, startTime, endTime, updateInterval]);

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

  // 시작 버튼 핸들러
  const handleStart = () => {
    if (!timeInput.isValid || !endTime) return;

    const now = new Date();
    now.setSeconds(0, 0);  // 초와 밀리초를 0으로 설정
    
    // 현재 시각이 종료 시각을 지났는지 다시 한번 확인
    if (endTime <= now) {
      const newEndTime = new Date(endTime);
      newEndTime.setDate(newEndTime.getDate() + 1);
      setEndTime(newEndTime);
    }

    setStartTime(now);
    setIsRunning(true);
    setIsCompleted(false);
    setIsTimeSelectorVisible(false);
    setProgress(0);
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

  // 진행률 계산 함수
  const calculateProgress = () => {
    if (!isRunning || !startTime || !endTime) return 0;
    const now = new Date();
    const totalMs = endTime.getTime() - startTime.getTime();
    const elapsedMs = now.getTime() - startTime.getTime();
    return Math.min(100, Math.max(0, Math.floor((elapsedMs / totalMs) * 100)));
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
    now.setSeconds(0, 0);  // 초와 밀리초를 0으로 설정
    return Math.max(0, Math.floor(differenceInMinutes(endTime, now)));
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
              hours={timeInput.hours}
              minutes={timeInput.minutes}
              isRunning={isRunning}
              endTime={endTime}
              onTimeChange={handleTimeInput}
              isValid={timeInput.isValid}
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