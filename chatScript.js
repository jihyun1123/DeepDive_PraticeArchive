const logoutButton = document.querySelector(".logout-button");
const userInputMessage = document.querySelector(".message-input");
const sendMessageButton = document.querySelector(".send-message-button");
const chatMessagesContainer = document.querySelector(".chat-messages");
const myChatContainer = document.getElementById("my-chat-message");
const loadingMessage = document.getElementById("loading-message");
const API_BASE_URL = "http://54.180.25.65:3030";  // 서버 주소
const errorMessage = document.getElementById("error-message");
const userNickname = localStorage.getItem("userNickname");

let messages = [];  // 메시지 저장 배열
let lastMessageId = 0;
const messageIds = new Set(); // 중복 메시지 ID 저장용 세트
let pollingInterval = null;  // 폴링 인터발 아이디
let isSending = false;  // 메시지 전송 중 여부

// 닉네임 표시 (main.html에서 이미 저장됨)
document.querySelector(".user-nickname").textContent = `${userNickname}`;

// 로드/에러 메시지 표시 함수
function showLoading() {
  loadingMessage.style.display = "block";
}

function hideLoading() {
  loadingMessage.style.display = "none";
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  setTimeout(() => {
    errorMessage.style.display = "none";
  }, 5000);  // 5초 후 자동 사라짐
}

function clearError() {
  errorMessage.style.display = "none";
  errorMessage.textContent = "";
}

// 페이지 로드 시 기존 메시지 불러오기
window.addEventListener("load", async () => {
  await loadMessages();
  displayAllMessages();
  startPolling();  // 3초 폴링 시작
});

// 서버에서 메시지 불러오기 !!
async function loadMessages() {
  showLoading();
  try {
    const response = await fetch(`${API_BASE_URL}/api/messages?limit=50`); // 최근 50개 메시지
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
      }
      throw new Error("메시지 불러오기 실패");
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result?.error?.message || "메시지 불러오기 실패");
    }

    messages = result.data || [];
    messages.sort((a, b) => a.id - b.id); // ID 기준 정렬

    messages.forEach((messageObj) => {
      messageIds.add(messageObj.id);
    });

    lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : 0; // 마지막 메시지 ID 업데이트
    clearError();
  } catch (error) {
    showError(error.message || "메시지 불러오기 실패: 다시 시도해주세요.");
    console.error("메시지 로드 에러:", error);
  } finally {
    hideLoading();
  }
}

// 모든 메시지 화면에 표시
function displayAllMessages() {
  messages.forEach(messageObj => {
    displayMessage(messageObj);  // 화면에 메시지 표시
  });
}

// 3초마다 샌 메시지 확인 (폴링)
function startPolling() {
  pollingInterval = setInterval(() => {
    checkNewMessages();
  }, 3000);  // 3초
}

// 새 메시지 확인 함수
async function checkNewMessages() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/messages/new?after=${lastMessageId}`);
    if (!response.ok) { // 응답 실패 시
      if (response.status === 429) { // 요청 제한 초과
        throw new Error("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
      }
      // 기타 오류
      throw new Error("새 메시지 조회 실패");
    }

    const result = await response.json();
    if (!result.success) { // 성공 플래그 확인
      // Optional chaining (?.) 사용
      // 
      // result.error가 undefined면 에러 없이 넘어감
      // result.error.message가 있으면 그 메시지 사용
      throw new Error(result?.error?.message || "새 메시지 조회 실패"); // 오류 메시지 표시
    }

    // 새 메시지 처리
    //|| [] → 만약 result.data가 undefined나 null이면 빈 배열로 처리 즉, 새 메시지가 없더라도 코드 오류 방지
    const newMessages = result.data || []; // 새 메시지 배열
    if (newMessages.length > 0) { // 새 메시지가 있으면
      // ID 기준 정렬 / 오래된 메세지 낮은 id, 최신 메세지 높은 id
      newMessages.sort((a, b) => a.id - b.id);  
      // 중복 없이 메시지 추가 및 표시
      newMessages.forEach((messageObj) => {
        // set객체로 중복 체크
        if (!messageIds.has(messageObj.id)) { // 중복 체크
          messageIds.add(messageObj.id);
          messages.push(messageObj);
          displayMessage(messageObj);
        }
      });
      // 마지막 메시지 ID 업데이트
      lastMessageId = newMessages[newMessages.length - 1].id;
    }
  } catch (error) {
    showError(error.message || "새 메시지 조회 중 오류가 발생했습니다.");
    console.error("새 메시지 조회 에러:", error);
  }
}

// 로그아웃 버튼 클릭 시 main.html로 이동
logoutButton.addEventListener("click", () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
  localStorage.removeItem("userNickname"); // 닉네임 삭제
  window.location.href = "./main.html";
});

/*=======================================================*/ 

// 메시지 전송
sendMessageButton.addEventListener("click", sendMessage);

// Enter키로도 전송 가능
userInputMessage.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// 메시지 전송 함수
async function sendMessage() {
  // 이미 전송 중이면 중복 전송 방지
  if (isSending) {
    showError("메시지를 전송 중입니다. 잠시 기다려주세요.");
    return;
  }

  const message = userInputMessage.value.trim();

  // 빈 메시지 체크
  if (!message) {
    showError("메시지를 입력해주세요!!");
    return;
  }

  clearError();
  isSending = true;
  sendMessageButton.disabled = true;

  try {
    const requestBody = {
      nickname: userNickname || "익명",
      content: message,
    };

    const response = await fetch(`${API_BASE_URL}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
      }
      const result = await response.json();
      throw new Error(result?.error?.message || "메시지 전송 실패");
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result?.error?.message || "메시지 전송 실패");
    }

    const savedMessage = result.data;
    if (!messageIds.has(savedMessage.id)) {
      messageIds.add(savedMessage.id);
      messages.push(savedMessage);
      displayMessage(savedMessage);
    }
    lastMessageId = Math.max(lastMessageId, savedMessage.id);

    userInputMessage.value = "";
    userInputMessage.focus();
  } catch (error) {
    showError(error.message || "메시지 전송 실패: 다시 시도해주세요.");
    console.error("메시지 전송 에러:", error);
  } finally {
    isSending = false;
    sendMessageButton.disabled = false;
  }
}

// 메시지 화면에 표시 함수
function displayMessage(messageObj) {
  // 메시지 컨테이너 선택 
  const isMyMessage = messageObj.nickname === userNickname;
  const container = isMyMessage ? myChatContainer : document.getElementById("other-chat-message");
  
  if (!container) {
    console.error("메시지 컨테이너를 찾을 수 없습니다");
    return;
  }

  // 메시지 요소 생성
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-item");
  messageElement.classList.add(isMyMessage ? "my-chat-message" : "other-chat-message");
  messageElement.innerHTML =
    `<div class="chat-nickname">${messageObj.nickname}</div>
    <div class="chat-text">${messageObj.content}</div>
    <div class="chat-message-time">${new Date(messageObj.createdAt).toLocaleTimeString('ko-KR', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    })}</div>`;

  container.appendChild(messageElement);

  // 자동 스크롤 (최신 메시지가 보이도록)
  if (chatMessagesContainer) {
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight; // 자동 스크롤
  }
}
