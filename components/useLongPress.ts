"use client";

import { useRef, useCallback } from "react";

interface LongPressOptions {
  onLongPress: () => void;
  onClick?: () => void;
  threshold?: number;
}

export function useLongPress({ onLongPress, onClick, threshold = 500 }: LongPressOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressingRef = useRef(false);

  const start = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      onLongPress();
      isLongPressingRef.current = true;
    }, threshold);
  }, [onLongPress, threshold]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleMouseDown = useCallback(() => {
    start();
  }, [start]);

  const handleMouseUp = useCallback(() => {
    clear();
    if (onClick && !isLongPressingRef.current) {
      setTimeout(() => {
        if (!isLongPressingRef.current) {
          onClick();
        }
      }, 10);
    }
    isLongPressingRef.current = false;
  }, [clear, onClick]);

  const handleMouseLeave = useCallback(() => {
    clear();
    isLongPressingRef.current = false;
  }, [clear]);

  const handleTouchStart = useCallback(() => {
    start();
  }, [start]);

  const handleTouchEnd = useCallback(() => {
    clear();
    if (onClick && !isLongPressingRef.current) {
      setTimeout(() => {
        if (!isLongPressingRef.current) {
          onClick();
        }
      }, 10);
    }
    isLongPressingRef.current = false;
  }, [clear, onClick]);

  return {
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  };
}