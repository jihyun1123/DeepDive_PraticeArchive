const sales = [
  { product: "노트북", quantity: 3 },
  { product: "마우스", quantity: 15 },
  { product: "키보드", quantity: 8 },
  { product: "마우스", quantity: 7 },
  { product: "노트북", quantity: 5 },
  { product: "키보드", quantity: 12 }
];


// 총 판매량 누적
const totalSales = {};

for(let i = 0; i < sales.length; i++) {
  const product = sales[i].product;
  const quantity = sales[i].quantity;

  // totalSales객체에 제품이 이미 존재하는지 확인 후 누적
  if(totalSales[product]) {
    totalSales[product] += quantity;
  } 
  // 제품이 처음 등장하는 경우 
  else {
    totalSales[product] = quantity;
  }
}

// 재할당하므로 const가 아닌 let 사용
let bestProduct = ""; // 판매량이 가장 많은 제품명 저장 변수
let maxQuantity = 0; // 현재까지 가장 큰 판매량 기록 변수

for(let product in totalSales) {
  if(totalSales[product] > maxQuantity) {
    bestProduct = product;
    maxQuantity = totalSales[product];
  }
}

console.log(bestProduct);