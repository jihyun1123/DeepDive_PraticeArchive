const students = [
  { name: "철수", score: 85 },
  { name: "영희", score: 92 },
  { name: "민수", score: 78 },
  { name: "지영", score: 95 },
  { name: "동현", score: 88 }
];

// reduce 메서드를 사용하여, 학생들의 평균 점수 계산 (누적)
const averageScore = students.reduce((acc, studentScore) => acc + studentScore.score, 0) / students.length;

// filter메서드를 사용하여, 평균 이상인 학생 선별
const passStudent = students.filter(student => student.score > averageScore);

// map 메서드를 사용하여, 선별된 학생들의 이름만 추출
const resultArray = passStudent.map(passstudent => passstudent.name);
console.log(resultArray);