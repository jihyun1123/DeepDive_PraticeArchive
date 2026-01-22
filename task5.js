// 재고 목록
const inventory = [
  { product: "사과", stock: 10 },
  { product: "바나나", stock: 5 },
  { product: "오렌지", stock: 8 }
];

// 주문 목록
const orders = [
  { product: "사과", quantity: 3 },
  { product: "바나나", quantity: 2 },
  { product: "사과", quantity: 4 },
  { product: "오렌지", quantity: 1 }
];

// 총 주문량 계산 후 map 메소드를 활용하여 주문 재고 빼서 결과 생성

// { "사과" : 7, "바나나": 2, "오렌지": 1 }
const totalOrders = {};

for( const order of orders){    
  if(totalOrders[order.product]){
    totalOrders[order.product] += order.quantity;
  } else {
    totalOrders[order.product] = order.quantity;
  }
}
// map 함수에서는 return이 사용됨 !!
// 없는것 같은 경우에는 생략된 것

const result = inventory.map(item =>{
  // 해당 상품의 총 주문 수량
  const orderedQuantity = totalOrders[item.product];
  return {
    product: item.product,
    stock: item.stock - orderedQuantity
  }
})

console.log(result);