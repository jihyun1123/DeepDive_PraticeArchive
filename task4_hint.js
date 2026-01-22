const users = [
  { name: "철수", age: 25 },
  { name: "영희", age: 17 },
  { name: "민수", age: 32 },
  { name: "지영", age: 28 },
  { name: "동현", age: 19 },
  { name: "수진", age: 35 }
];

const result = { "10대": [], "20대": [], "30대": [] };

for (let i = 0; i < users.length; i++){
  const userName = users[i].name;
  const userAge = users[i].age;

  const calAge = Math.floor(userAge / 10) * 10 + "대"
  result[calAge].push(userName);
}

console.log(result);