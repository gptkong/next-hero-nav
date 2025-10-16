"use client";

export function useCustomToast() {
  const showSuccess = (message: string, timeout = 3000) => {
    // 简单的实现，可以后续替换为更复杂的 Toast 组件
    console.log("✅", message);
    // 在移动端可以使用浏览器通知 API
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('成功', {
        body: message,
        icon: '/favicon.ico'
      });
    }
  };

  const showError = (message: string, timeout = 5000) => {
    console.error("❌", message);
    // 在移动端可以使用浏览器通知 API
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('错误', {
        body: message,
        icon: '/favicon.ico'
      });
    }
  };

  const showInfo = (message: string, timeout = 3000) => {
    console.info("ℹ️", message);
  };

  const showWarning = (message: string, timeout = 4000) => {
    console.warn("⚠️", message);
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
}