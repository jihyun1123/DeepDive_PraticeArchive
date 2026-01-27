
// =====localStorage 저장/불러오기 함수=====
/**
 * localStorage에서 이벤트 데이터를 가져옴
 * @returns {Array} 이벤트 배열 (불러오기 실패 시 빈 배열 반환)
 */
function loadEvents() {
  try {
    const data = localStorage.getItem("events");
    if (data === null) {
      console.log("저장된 데이터가 없습니다. 빈 배열로 초기화합니다.");
      return [];
    }
    const events = JSON.parse(data);
    console.log(`${events.length}개의 이벤트를 불러왔습니다.`);
    return events;
  } catch (error) {
    console.error("이벤트 불러오기 실패:", error);
    alert("데이터를 불러오는 중 오류가 발생했습니다. 기본값으로 초기화합니다.");
    return [];
  }
}

/**
 * 이벤트 데이터를 localStorage에 저장
 * @param {Array} events - 저장할 이벤트 배열
 * @returns {boolean} 저장 성공 여부
 */
function saveEvents(events) {
  try {
    localStorage.setItem("events", JSON.stringify(events));
    console.log(`${events.length}개의 이벤트를 저장했습니다.`);
    return true;
  } catch (error) {
    console.error("이벤트 저장 실패:", error);
    alert("데이터 저장에 실패했습니다. 다시 시도해주세요.");
    return false;
  }
}

/**
 * localStorage 용량 확인
 */
function checkStorageStatus() {
  try {
    const test = "__test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    console.log("localStorage 사용 가능");
    return true;
  } catch (error) {
    console.error("localStorage 사용 불가:", error);
    alert("브라우저 저장 공간이 부족합니다.");
    return false;
  }
}

// =====이벤트 추가 기능=====
function addEvent(){
  // 입력 요소 선택
  const nameInput = document.querySelector(".event-input");
  const dateInput = document.querySelector(".date-input");
  const categorySelect = document.querySelector(".category-select");

  // 입력 값 가져오기
  const name = nameInput.value;
  const dateString = dateInput.value;
  const category = categorySelect.value;

  // 입력 값 유효성 검사
  if(!validateInput(name, dateString, category)){
    return; // 유효성 검사 실패 시 함수 종료
  }

  // 이벤트 객체 생성
  const newEvent = {
    id: Date.now(), // 고유 ID 생성
    name: name,
    date: dateString,
    category: category,
    createdAt: new Date().toISOString() // 생성 시간 추가
  };

  // 기존 이벤트 불러오기
  const events = loadEvents();
  events.push(newEvent);

  // localStorage에 저장
  if (!saveEvents(events)) {
    return; // 저장 실패 시 함수 종료
  }

  // 입력값 초기화
  nameInput.value = "";
  dateInput.value = "";
  categorySelect.value = "etc";

  // 이벤트 목록 렌더링
  renderEventList();

  // 통계 업데이트
  updateStatistics();
}


// ======D-Day 계산 기능=====
function calculateDday(targetDate) {
  const today = new Date();
  const target = new Date(targetDate);

  // 시간을 00:00:00으로 맞춰서 순수 날짜만 비교
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diff = target - today;
  const daysDiff = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (daysDiff > 0) return `D-${daysDiff}`;
  if (daysDiff === 0) return "D-Day";
  return `D+${Math.abs(daysDiff)}`;
}



// =====날짜 유효성 검사=======
function isValidDate(dateString){
  if(!dateString){
    alert("날짜를 입력하세요!");
    return false;
  }

  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0,0,0,0);

  // 오늘보다 과거는 허용하지만, 먼 미래는 경고 !
  const maxDate = new Date(today);
  maxDate.setFullYear(maxDate.getFullYear() + 10); // 10년 후까지 허용

  if(selectedDate > maxDate){
    alert("10년 이상 먼 미래는 입력할 수 없습니다!");
    return false;
  }
  return true;
}

// 중복 이벤트 검사
function isDuplicateEvent(name, dateString) {
  const events = loadEvents();
  return events.some(event => event.name === name && event.date === dateString); // 하나라도 일치하면 true
}

// 빈 값 검사
function validateInput(name, dateString, category) {
  if (!name.trim()) {
    alert("이벤트 이름을 입력하세요!");
    return false;
  }
  
  if (!dateString) {
    alert("날짜를 입력하세요!");
    return false;
  }
  
  // 날짜 유효성 검사 코드
  if (!isValidDate(dateString)) {
    return false;
  }
  
  // 중복 이벤트 경고 코드
  if (isDuplicateEvent(name, dateString)) {
    alert("이미 같은 날짜와 이름의 이벤트가 존재합니다!");
    return false;
  }
  
  return true;
}


// =====통계 계산 함수=======
function updateStatistics() {
  const events = loadEvents();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let totalCount = 0;
  let upcomingCount = 0;
  let pastCount = 0;

  let closestEvent = null;  // 가장 가까운 이벤트
  let minDaysDifference = Infinity; // 최소 일수 차이

  events.forEach(event => {
    totalCount++;  // 총 이벤트 수 증가
    
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    const daysDifference = Math.floor((eventDate - today) / (1000 * 60 * 60 * 24)); // 일수 차이 계산

    // 미래 이벤트 / 과거 이벤트 분류
    if (daysDifference > 0) {
      upcomingCount++;
    } else if (daysDifference < 0) {
      pastCount++;
    }

    // 가장 가까운 이벤트 찾기 (양수인 것들 중에서만)
    if (daysDifference > 0 && daysDifference < minDaysDifference) {
      minDaysDifference = daysDifference;
      closestEvent = event;
    }
  });

  // DOM 업데이트 및 색상 효과
  const totalElement = document.querySelector("#total-events");
  const upcomingElement = document.querySelector("#upcoming-events");
  const pastElement = document.querySelector("#past-events");

  // 숫자 업데이트 및 하이라이트 클래스 추가
  updateStatisticElement(totalElement, totalCount);
  updateStatisticElement(upcomingElement, upcomingCount);
  updateStatisticElement(pastElement, pastCount);

  // 가장 가까운 이벤트 하이라이트
  highlightClosestEvent(closestEvent);
}

// 통계 요소 업데이트 함수 (색상 효과 포함)
function updateStatisticElement(element, newValue) {
  element.textContent = newValue;
  
  // 숫자가 0보다 크면 진한 색상 유지
  if (newValue > 0) {
    element.classList.add("stat-update");
  } else {
    element.classList.remove("stat-update");
  }
}

// 가장 가까운 이벤트 하이라이트
function highlightClosestEvent(closestEvent) {
  // 기존 하이라이트 제거
  document.querySelectorAll(".event-list-item").forEach(item => {
    item.classList.remove("closest-event");
  });

  // 새로운 하이라이트 적용
  if (closestEvent) {
    const eventItems = document.querySelectorAll(".event-list-item");
    eventItems.forEach(item => {
      const title = item.querySelector(".event-item-title").textContent;
      const date = item.querySelector(".event-item-date").textContent;
      
      if (title === closestEvent.name && date === closestEvent.date) {
        item.classList.add("closest-event");
      }
    });
  }
}

// =====이벤트 목록 렌더링=====
function renderEventList() {
  const events = loadEvents();
  const eventList = document.getElementById("event-list");
  
  eventList.innerHTML = ""; // 기존 목록 초기화

  if (events.length === 0) {
    eventList.innerHTML = "<li style='text-align: center; list-style: none; padding: 3vh; color: #ccc;'>이벤트를 추가해주세요!</li>";
    return;
  }

  // 날짜순으로 정렬 (가까운 날짜가 위로)
  events.sort((a, b) => new Date(a.date) - new Date(b.date));

  events.forEach(event => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    const daysDifference = Math.floor((eventDate - today) / (1000 * 60 * 60 * 24));

    // D-day 계산
    const dday = daysDifference > 0 ? `D-${daysDifference}` : (daysDifference === 0 ? "D-Day!" : `D+${Math.abs(daysDifference)}`);

    // 카테고리 이모지
    const getCategoryEmoji = (category) => {
      const emojiMap = {
        "anniversary": "💐",
        "trip": "✈️",
        "gift": "🎁",
        "etc": "📌"
      };
      return emojiMap[category] || "📌";
    };

    // 카테고리 한글명
    const getCategoryName = (category) => {
      const nameMap = {
        "anniversary": "기념일",
        "trip": "여행",
        "gift": "선물",
        "etc": "기타"
      };
      return nameMap[category] || category;
    };

    const li = document.createElement("li");
    li.className = "event-list-item";
    
    // 지난 이벤트는 "past-event" 클래스 추가
    if (daysDifference < 0) {
      li.classList.add("past-event");
    }

    li.innerHTML = `
      <p class="event-item-title">${event.name}</p>
      <span class="event-item-type category-${event.category}">${getCategoryEmoji(event.category)} ${getCategoryName(event.category)}</span>
      <p class="event-item-date">${event.date}</p>
      <p class="event-item-dday">${dday}</p>
      <button class="delete-button" onclick="deleteEvent(${event.id})">삭제</button>
    `;
    eventList.appendChild(li);
  });
}

// =====이벤트 삭제 기능=====
function deleteEvent(eventId) {
  const events = loadEvents();
  const updatedEvents = events.filter(event => event.id !== eventId);
  
  if (saveEvents(updatedEvents)) {
    renderEventList();
    updateStatistics();
  }
}

// =====전체 삭제 기능=====
function clearAllEvents() {
  if (confirm("정말 모든 이벤트를 삭제하시겠습니까?")) {
    if (saveEvents([])) {
      renderEventList();
      updateStatistics();
    }
  }
}

// =====페이지 로드 시 초기화=====
window.addEventListener("DOMContentLoaded", () => {
  // localStorage 사용 가능 여부 확인
  if (!checkStorageStatus()) {
    alert("브라우저 저장 기능을 사용할 수 없습니다. 데이터가 저장되지 않을 수 있습니다.");
  }
  
  renderEventList();
  updateStatistics();
  
  // 추가 버튼 이벤트
  const addBtn = document.getElementById("add-button");
  if (addBtn) {
    addBtn.addEventListener("click", addEvent);
  }

  // 전체 삭제 버튼 이벤트
  const clearBtn = document.getElementById("clear-all-button");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearAllEvents);
  }
});