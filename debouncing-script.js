// 디바운싱 함수 구현
export function debounce(callback, delay) {
  let timer;
  
  return function(...args) {
    // 기존 타이머 취소
    clearTimeout(timer);
    
    // delay ms 후에 실행되도록 새 타이머 설정
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
