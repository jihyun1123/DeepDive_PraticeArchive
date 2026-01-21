
for(let i = 0; i < 5; i++){
  let star = "";

  //공백 추가
  for(let j = 4; j > i; j--){
    star += " ";
  }

  // 별 추가
  for(let k = 0; k < (2*i + 1); k++){
    star += "*";
  }

  console.log(star);
}

for(let i = 0; i < 4; i++){
  let star = "";
  // 공백 감소
  for(let j = 0; j <= i; j++){
    star += " ";
  }

  // 별 감소
  for(let k = 7; k > (2*i); k--){
    star += "*";
  }
  console.log(star);
}