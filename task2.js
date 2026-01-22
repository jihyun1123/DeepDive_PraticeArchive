const numbers = [1, 2, 2, 3, 4, 4, 5, 1, 3];

const result = [];

for(let i = 0; i < numbers.length; i++) {
  // 만약 result 배열에 numbers[i] 값이 없다면 추가
  if(result.includes((numbers[i])) === false){
    result.push(numbers[i]);
  }
  // 있으면 계속 진행 (무시)
  else{
    continue;
  }
}

console.log(result);