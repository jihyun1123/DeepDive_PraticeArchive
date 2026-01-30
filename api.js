// API 기본 URL
const API_BASE_URL = 'http://54.180.25.65:3040';

/**
 * 도서 검색 API 호출
 * @param : 이 함수에 들어오는 값(매개변수) 설명 표기
 * @param {string} q - 검색어
 * @param {number} limit - 결과 개수 (기본값: 10)
 * @returns {Promise<Object>} API 응답 데이터
 */
// 도서 검색 함수
export async function searchBooks(q, limit = 10) {
  try {
    // API 요청 URL 구성 | encodeURIComponent :특수문자 인코딩
    const url = `${API_BASE_URL}/api/books/search?q=${encodeURIComponent(q)}&limit=${limit}`;
    
    // API 호출
    const response = await fetch(url);
    
    // Rate Limit 초과
    if (response.status === 429) {
      throw new Error('요청 제한을 초과했습니다. 잠시 후 다시 시도해주세요.');
    }
    
    // 기타 에러
    if (!response.ok) {
      throw new Error('검색 중 오류가 발생했습니다.');
    }
    
    // 응답 데이터 파싱
    const data = await response.json();
    
    // API 에러 응답 처리
    if (!data.success) {
      throw new Error(data.error?.message || '검색에 실패했습니다.');
    }
    
    return data;
    
    // 오류 처리
  } catch (error) {
    console.error('API 호출 오류:', error);
    throw error;
  }
}

/**
 * 도서 상세 조회 API 호출
 * @param {number} id - 도서 ID
 * @returns {Promise<Object>} API 응답 데이터
 */
// 도서 상세 조회 함수
async function getBookById(id) {
  try {
    const url = `${API_BASE_URL}/api/books/${id}`;
    const response = await fetch(url);
    
    // 도서 없음
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('도서를 찾을 수 없습니다.');
      }
      // 기타 에러
      throw new Error('조회 중 오류가 발생했습니다.');
    }
    
    // 응답 데이터 파싱
    const data = await response.json();
    
    // API 에러 응답 처리
    if (!data.success) {
      throw new Error(data.error?.message || '조회에 실패했습니다.');
    }
    
    return data;
    
  } catch (error) {
    console.error('API 호출 오류:', error);
    throw error;
  }
}