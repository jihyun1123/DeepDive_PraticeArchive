import { searchBooks } from "./api.js";
import { debounce } from "./debouncing-script.js";

const searchInput = document.querySelector("#search-input");
const bookContainer = document.querySelector("#bookContainer");
const resultsCount = document.querySelector("#resultsCount");

// UI 상태 표시 함수
function showLoadingState() {
  bookContainer.innerHTML = `
    <div class="message-box loading-message">
      <div class="spinner"></div>
      <p>검색 중...</p>
    </div>
  `;
}

function showNoResults() {
  bookContainer.innerHTML = `
    <div class="message-box no-results-message">
      <p>😕 검색 결과가 없습니다</p>
    </div>
  `;
  resultsCount.textContent = "0";
}

function showError(message) {
  bookContainer.innerHTML = `
    <div class="message-box error-message">
      <p>❌ ${message}</p>
    </div>
  `;
}

function displayBooks(books) {
  resultsCount.textContent = books.length;
  
  bookContainer.innerHTML = books.map(book => `
    <div class="book-card">
      <img src="${book.cover || ''}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/200x300?text=No+Image'">
      <div class="book-info">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">${book.author || '저자 정보 없음'}</p>
        <p class="book-publisher">${book.publisher || ''} ${book.year ? `(${book.year})` : ''}</p>
        <p class="book-description">${book.description || '설명이 없습니다.'}</p>
      </div>
    </div>
  `).join('');
}

// 검색 함수
async function handleSearch() {
  const query = searchInput.value.trim();
  
  // 입력이 비어있으면 초기 상태로
  if (query.length === 0) {
    showInitialState();
    return;
  }
  
  // 2글자 미만이면 검색하지 않음
  if (query.length < 2) {
    return;
  }
  
  try {
    showLoadingState();
    
    // API 호출
    console.log(`Searching for: ${query}`);
    const result = await searchBooks(query);
    
    // 검색 결과 처리
    if (result.data.length === 0) {
      showNoResults();
    } else {
      displayBooks(result.data);
    }
    
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    showError(error.message || '검색 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
}

// 디바운싱 적용된 검색 함수 (300ms)
const debouncedSearch = debounce(handleSearch, 300);

// input 이벤트로 입력 즉시 검색 (디바운싱 적용)
searchInput.addEventListener("input", debouncedSearch);
