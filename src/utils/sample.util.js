// 설명: 범용 유틸리티 함수를 정의하는 파일입니다.
// 날짜 포맷팅, 문자열 처리, 데이터 변환 등의 함수를 관리합니다.

// 날짜 포맷팅 함수
export function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day);
}

// 문자열 자르기 함수
export function truncate(str, maxLength, suffix = '...') {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
}

// 랜덤 문자열 생성 함수
export function generateRandomString(length = 10) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// 객체 깊은 복사 함수
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// 배열 청크 함수
export function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// 지연 함수
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default {
  formatDate,
  truncate,
  generateRandomString,
  deepClone,
  chunk,
  delay,
};
