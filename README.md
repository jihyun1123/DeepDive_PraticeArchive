DeepDive 부트캠프 실습 과제물 모음
    -  디바운싱을 활용한 도서 검색

    # 🔌 도서 검색 API 명세

> **서버 주소**: `http://54.180.25.65:3040`  
> **Swagger 문서**: `http://54.180.25.65:3040/swagger/index.html`

---

## ⚠️ Rate Limit

- **제한**: 분당 60회
- **초과 시**: 1분간 차단 (HTTP 429 반환)
- **적용 범위**: `/api/books/*` 경로만 적용

**응답 헤더 (모든 도서 API 응답에 포함):**
```
X-RateLimit-Limit: 60          # 최대 요청 수
X-RateLimit-Remaining: 55      # 남은 요청 수
X-RateLimit-Reset: 1705312800  # 윈도우 리셋 시간 (Unix timestamp)
```

---

## 1. 도서 검색

제목 또는 저자명으로 도서를 검색합니다.

```
GET /api/books/search
```

**Query Parameters:**

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|-------|------|
| `q` | string | O | - | 검색어 (제목, 저자에서 검색) |
| `limit` | int | X | 10 | 결과 개수 (최대 50) |
| `delay` | int | X | 0 | 응답 지연 ms (로딩 테스트용, 최대 3000) |

**요청 예시:**
```
GET /api/books/search?q=JavaScript
GET /api/books/search?q=자바&limit=5
GET /api/books/search?q=리액트&delay=1000
```

**성공 응답 (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "JavaScript 완벽 가이드",
      "author": "데이비드 플래너건",
      "publisher": "인사이트",
      "year": 2022,
      "cover": "https://picsum.photos/seed/js1/200/300",
      "description": "JavaScript의 모든 것을 다루는 바이블. 초보자부터 전문가까지."
    },
    {
      "id": 2,
      "title": "모던 JavaScript 튜토리얼",
      "author": "일리아 칸터",
      "publisher": "길벗",
      "year": 2021,
      "cover": "https://picsum.photos/seed/js2/200/300",
      "description": "현대적인 JavaScript를 배우는 가장 좋은 방법."
    }
  ],
  "meta": {
    "query": "JavaScript",
    "total": 2,
    "limit": 10
  }
}
```

**검색 결과 없음 (200):**
```json
{
  "success": true,
  "data": [],
  "meta": {
    "query": "asdfqwerzxcv",
    "total": 0,
    "limit": 10
  }
}
```

**실패 응답 (400) - 검색어 누락:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "검색어를 입력해주세요."
  }
}
```

---

## 2. 도서 상세 조회

ID로 특정 도서의 상세 정보를 조회합니다.

```
GET /api/books/:id
```

**Path Parameters:**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `id` | int | O | 도서 ID |

**요청 예시:**
```
GET /api/books/1
GET /api/books/5
```

**성공 응답 (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "JavaScript 완벽 가이드",
    "author": "데이비드 플래너건",
    "publisher": "인사이트",
    "year": 2022,
    "cover": "https://picsum.photos/seed/js1/200/300",
    "description": "JavaScript의 모든 것을 다루는 바이블. 초보자부터 전문가까지."
  }
}
```

**실패 응답 (400) - 잘못된 ID:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "잘못된 ID입니다."
  }
}
```

**실패 응답 (404) - 도서 없음:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "도서를 찾을 수 없습니다."
  }
}
```

---

## 3. 헬스체크

서버 상태를 확인합니다. (Rate Limit 미적용)

```
GET /api/health
```

**응답 예시:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0"
}
```

---

## 📋 에러 코드 정리

| 코드 | HTTP 상태 | 설명 |
|-----|----------|------|
| `VALIDATION_ERROR` | 400 | 요청 데이터 유효성 검사 실패 |
| `NOT_FOUND` | 404 | 리소스를 찾을 수 없음 |
| `RATE_LIMITED` | 429 | 요청 제한 초과 |

**Rate Limit 초과 응답 (429):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "요청 제한을 초과했습니다. 60초 동안 차단됩니다."
  }
}
```

---

## 📚 검색 가능한 키워드

| 키워드 | 예상 결과 |
|--------|-----------|
| JavaScript | 2개 |
| 자바스크립트 | 2개 |
| 리액트 | 2개 |
| Node | 1개 |
| 타입스크립트 | 1개 |
| 파이썬 | 1개 |
| Go | 1개 |
| 클린 코드 | 1개 |
| JS | 1개 |
| 김민준 (저자) | 1개 |
| 조현영 (저자) | 1개 |
| asdfqwer | 0개 (결과 없음) |

---

## 💡 디바운싱 검색 구현 팁

```javascript
let timerId = null;

// 디바운싱 적용 검색
function handleInput(event) {
  const query = event.target.value.trim();
  
  // 이전 타이머 취소
  clearTimeout(timerId);
  
  // 2글자 미만이면 검색 안 함
  if (query.length < 2) {
    showInitialState();
    return;
  }
  
  // 300ms 후에 검색 실행
  timerId = setTimeout(() => {
    search(query);
  }, 300);
}

// 검색 API 호출
async function search(query) {
  showLoading();
  
  try {
    const response = await fetch(
      `http://54.180.25.65:3040/api/books/search?q=${encodeURIComponent(query)}`
    );
    const result = await response.json();
    
    if (result.data.length === 0) {
      showNoResults(query);
    } else {
      showResults(result.data);
    }
  } catch (error) {
    showError('검색 중 오류가 발생했습니다.');
  }
}

// input 이벤트 리스너
searchInput.addEventListener('input', handleInput);
```
