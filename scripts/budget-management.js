// 预算管理逻辑
const budgetContent = document.getElementById("budget-content");

// 模拟预算数据
function fetchBudgetData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        total: 1000,
        food: 300,
        transport: 200,
        entertainment: 100,
      });
    }, 500);
  });
}

// 渲染预算数据
async function renderBudget() {
  const data = await fetchBudgetData();
  budgetContent.innerHTML = `
    <div class="budget-entry">
      <p>总预算: ${data.total}</p>
      <p>餐饮预算: ${data.food}</p>
      <p>交通预算: ${data.transport}</p>
      <p>娱乐预算: ${data.entertainment}</p>
    </div>
  `;
}

// 初始化页面
renderBudget();