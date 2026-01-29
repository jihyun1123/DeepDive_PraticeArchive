const nicknameInput = document.querySelector(".nickname-input");
const enterButton = document.querySelector(".enter-button");

// 채팅방 입장 버튼 클릭시, 이름이 비어있는경우 입장 불가능 알림 발생 !! 유효성 검사 필요
enterButton.addEventListener("click", () => {
  const nickName = nicknameInput.value.trim();

  // 닉네임 유효성 검사
  if(!nickName){
    alert("이름을 입력해주세요!!");
    return;
  }

  // 닉네임 localStorage에 저장
  // localStorage.setItem(저장할 키, 저장할 값)
  localStorage.setItem("userNickname", nickName);

  // chat.html로 이동
  window.location.href = "./chat.html";

});

  // Enter키로도 입장 가능
  nicknameInput.addEventListener("keypress", (e) => {
    if(e.key === "Enter"){
      enterButton.click();
    }
  })
