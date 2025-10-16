"use client";

import { useCallback } from "react";

export function useHaptic() {
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    // 检查是否支持振动API
    if ('vibrate' in navigator) {
      const patterns = {
        light: 10,
        medium: 25,
        heavy: 50
      };

      navigator.vibrate(patterns[type]);
    }
  }, []);

  const triggerSuccess = useCallback(() => {
    if ('vibrate' in navigator) {
      // 成功：短振动两次
      navigator.vibrate([10, 50, 10]);
    }
  }, []);

  const triggerError = useCallback(() => {
    if ('vibrate' in navigator) {
      // 错误：长振动一次
      navigator.vibrate(100);
    }
  }, []);

  const triggerWarning = useCallback(() => {
    if ('vibrate' in navigator) {
      // 警告：中等振动
      navigator.vibrate(25);
    }
  }, []);

  return {
    triggerHaptic,
    triggerSuccess,
    triggerError,
    triggerWarning,
  };
}