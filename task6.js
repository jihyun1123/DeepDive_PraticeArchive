const games = [
  { team: "Red", score: 50 },
  { team: "Blue", score: 80 },
  { team: "Red", score: 70 },
  { team: "Green", score: 60 },
  { team: "Blue", score: 65 },
  { team: "Green", score: 85 }
];

// 총 점수 계산
totalScores = {};

for(game of games){
  // totalScores 객체에 팀이 이미 있는 경우, 점수 누적
  if(totalScores[game.team]){
    totalScores[game.team] += game.score;
  }
  // 없는 경우 점수 추가
  else{
    totalScores[game.team] = game.score;
  }
}

// ============================

// 팀 등장 순서
const teamOrder = {};
let index = 0;

for(game of games){
  if(teamOrder[game.team] === undefined){
    teamOrder[game.team] = index;
    index++;
  }
}

// 객체 -> 배열 변환
const scoreArray = [];

for ( const team in totalScores) {
  scoreArray.push( { team: team, score: totalScores[team] } );
}

// 팀 이름만 추출
const result = scoreArray.map(item => item.team);
console.log(result);


