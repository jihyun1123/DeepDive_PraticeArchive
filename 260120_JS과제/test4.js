
N = 3;

const arr = [];

// 2차원 배열 0으로 초기화
for(let i = 0; i < N; i++){
  arr[i] = [];  
  for(let j = 0; j < N; j++){
    arr[i][j] = 0;
  }
}

// 숫자
let num = 1;

while(num <= N * N){
  for(let i = 0; i < N; i++){
    arr[0][i] = num;
    num++;
  }
  for(let j = 1; j < N; j++){
    arr[j][N-1] = num;
    num++;
  }
}


for(let a of arr){
  console.log(a);
}