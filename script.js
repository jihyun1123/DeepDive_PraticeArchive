
// 변수 선언
textInput = document.querySelector('#text-input');
addTaskButton = document.querySelector('#add-task-button');

taskList = document.querySelector('#task-list');
totalTaskCount = document.querySelector('#total-task-count');
completedTaskCount = document.querySelector('#completed-task-count');

planText = document.querySelector('.task-text');
completedButton = document.querySelector('.completed-task-button');
deleteButton = document.querySelector('.delete-task-button');

/*============= 할 일 추가 기능 ============*/

// 💡입력창에 텍스트를 입력하고 버튼을 클릭하면 목록에 추가된다
addTaskButton.addEventListener('click', function() {
  // 입력값 가져오기
  const inputText = textInput.value.trim();

  // 💡입력창이 비어있으면 추가되지 않는다 (빈 문자열 방지)
  if(inputText === ""){
    alert('할 일을 입력해주세요 !');
    return;
  }

  // 새로운 할 일 항목 생성
  const newTask = document.createElement('li');  // li 요소 생성
  newTask.className = 'task-list-item';  // 새로 생긴 li요소의 클래스 이름 지정

  // 새로 생긴 li 요소의 내부 HTML 구성
  newTask.innerHTML = `
        <span class="task-text">${inputText}</span>
        <button class="completed-task-button">완료</button>
        <button class="delete-task-button">삭제</button>
        `
  
  // 목록에 추가
  taskList.appendChild(newTask);

  // 💡 추가 후 입력창은 비워진다
  textInput.value = '';

  // 새로 추가된 완료 버튼에 이벤트리스너 연결
  const completedBtn = newTask.querySelector('.completed-task-button');
  completedBtn.addEventListener('click', toggleCompleted);

  // 새로 추가된 삭제 버튼에 이벤트리스너 연결
  const deleteBtn = newTask.querySelector('.delete-task-button');
  deleteBtn.addEventListener('click', deleteTask);

  // 통계 업데이트
  updateStatistics();
});

// Enter 키로도 할 일 추가
textInput.addEventListener('keydown', function(e){
  if(e.key === 'Enter'){
    e.preventDefault();
    addTaskButton.click();
  }
});


/*============= 할 일 완료/취소 기능 ============*/

// 💡완료 버튼 클릭 시 상태 토글 함수
function toggleCompleted(e){
  const button = e.target;
  const taskItem = button.closest('.task-list-item'); // 클릭된 버튼의 가장 가까운 부모 새로 생긴 li 요소 찾기
  const taskText = taskItem.querySelector('.task-text');

  // completed 클래스 토글 (있으면 제거, 없으면 추가)
  // completed : 완료 상태라는 걸 표시하기 위한 이름표(클래스 이름)
  taskItem.classList.toggle('completed'); // li 완료 toggle
  taskText.classList.toggle('completed'); // 글씨 완료 toggle

  // 버튼 텍스트 변경
  if(taskItem.classList.contains('completed')){ // 완료 상태라면
    button.textContent = '취소';
  }
  else button.textContent = '완료'; // 미완료 상태라면

  // 통계 업데이트
  updateStatistics();

};

/*============= 할 일 삭제 기능 ============*/
function deleteTask(e){
  const button = e.target;
  const taskItem = button.closest('.task-list-item'); // 클릭된 버튼의 가장 가까운 부모 새로 생긴 li 요소 찾기
  taskList.removeChild(taskItem); // 해당 할 일 항목 삭제

  // 통계 업데이트
  updateStatistics();
}

/*============= 일괄 삭제 기능 ============*/
/*구현 못함 
function deleteAllTasks(){
  // 전체 할 일 항목 삭제
  taskList.innerHTML = '';
  // 통계 업데이트
  updateStatistics();
}
*/

/*============= 통계 기능 ============*/
function updateStatistics(){
  // 완료된 항목은 제외하고 미완료만 총 할 일로 센다
  const totalTasks = taskList.querySelectorAll('.task-list-item:not(.completed)').length; // 미완료 할 일 개수
  // 완료된 항목 개수
  const completedTasks = taskList.querySelectorAll('.task-list-item.completed').length; // 완료된 할 일 개수

  totalTaskCount.textContent = totalTasks;
  completedTaskCount.textContent = completedTasks;
}

