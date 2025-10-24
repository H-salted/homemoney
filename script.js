// 美食决策机
const wheelCanvas = document.getElementById("wheelCanvas");
const ctx = wheelCanvas.getContext("2d");
const spinBtn = document.getElementById("spin-btn");
const addOptionBtn = document.getElementById("add-option-btn");
const wheelOptionInput = document.getElementById("wheel-option-input");
const wheelResult = document.getElementById("wheel-result");
const historyList = document.getElementById("history-list");

let wheelOptions = [];
let spinning = false;

// 初始化轮盘
function initWheel() {
  wheelCanvas.width = 300;
  wheelCanvas.height = 300;
  drawWheel();
}

// 绘制轮盘
function drawWheel() {
  ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
  const centerX = wheelCanvas.width / 2;
  const centerY = wheelCanvas.height / 2;
  const radius = wheelCanvas.width / 2 - 10;
  const segmentAngle = (2 * Math.PI) / Math.max(wheelOptions.length, 1);

  // 绘制轮盘分段
  wheelOptions.forEach((option, index) => {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(
      centerX,
      centerY,
      radius,
      index * segmentAngle,
      (index + 1) * segmentAngle
    );
    ctx.closePath();
    ctx.fillStyle = `hsl(${(index * 360) / wheelOptions.length}, 70%, 70%)`;
    ctx.fill();

    // 绘制文本
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(index * segmentAngle + segmentAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    ctx.fillText(option, radius - 10, 5);
    ctx.restore();
  });
}

// 转动轮盘
function spinWheel() {
  if (spinning || wheelOptions.length === 0) return;
  spinning = true;

  const spinDuration = 3000; // 3秒
  const startTime = Date.now();
  const spins = 5 + Math.random() * 5; // 5-10圈

  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / spinDuration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3); // 缓动效果
    const angle = spins * 2 * Math.PI * easedProgress;

    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    ctx.save();
    ctx.translate(wheelCanvas.width / 2, wheelCanvas.height / 2);
    ctx.rotate(angle);
    ctx.translate(-wheelCanvas.width / 2, -wheelCanvas.height / 2);
    drawWheel();
    ctx.restore();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      const selectedIndex = Math.floor(
        (angle % (2 * Math.PI)) / ((2 * Math.PI) / wheelOptions.length)
      );
      const selectedOption = wheelOptions[selectedIndex];
      wheelResult.textContent = `今天吃：${selectedOption}`;

      // 记录历史
      const historyItem = document.createElement("li");
      historyItem.textContent = `${new Date().toLocaleString()}: ${selectedOption}`;
      historyList.appendChild(historyItem);
    }
  }

  animate();
}

// 添加选项
function addWheelOption() {
  const option = wheelOptionInput.value.trim();
  if (option) {
    wheelOptions.push(option);
    wheelOptionInput.value = "";
    drawWheel();
  }
}

// AI智能账本
const transactionName = document.getElementById("transaction-name");
const transactionAmount = document.getElementById("transaction-amount");
const transactionCategory = document.getElementById("transaction-category");
const addTransactionBtn = document.getElementById("add-transaction-btn");
const transactionTable = document.querySelector("#transaction-table tbody");
const chartCanvas = document.getElementById("chart");
const csvUpload = document.getElementById("csv-upload");
const importCsvBtn = document.getElementById("import-csv-btn");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// 初始化账本
function initLedger() {
  renderTransactions();
  renderChart();
}

// 渲染交易记录
function renderTransactions() {
  transactionTable.innerHTML = "";
  let total = 0;
  transactions.forEach((transaction, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${transaction.name}</td>
            <td>¥${transaction.amount}</td>
            <td>${transaction.category}</td>
            <td><button class="delete-btn" data-index="${index}">删除</button></td>
        `;
    transactionTable.appendChild(row);
  });

  // 绑定删除按钮事件
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      deleteTransaction(index);
    });
  });
}

// 删除交易记录
function deleteTransaction(index) {
  transactions.splice(index, 1);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactions();
  renderChart(); // 更新扇形图
  const transaction = transactions[index];
  const row = document.createElement("tr");
  row.innerHTML = `
            <td>${transaction.name}</td>
            <td>¥${transaction.amount}</td>
            <td>${transaction.category}</td>
        `;
  transactionTable.appendChild(row);
  total += parseFloat(transaction.amount);

  // 显示总计金额
  const totalRow = document.createElement("tr");
  totalRow.innerHTML = `
        <td colspan="2"><strong>总计</strong></td>
        <td><strong>¥${total.toFixed(2)}</strong></td>
    `;
  transactionTable.appendChild(totalRow);
}

// 渲染图表
function renderChart() {
  const categories = {};
  transactions.forEach((transaction) => {
    if (categories[transaction.category]) {
      categories[transaction.category] += parseFloat(transaction.amount);
    } else {
      categories[transaction.category] = parseFloat(transaction.amount);
    }
  });

  const total = Object.values(categories).reduce(
    (sum, amount) => sum + amount,
    0
  );
  const labelsWithPercentage = Object.keys(categories).map((category) => {
    const percentage = ((categories[category] / total) * 100).toFixed(1);
    return `${category} (${percentage}%)`;
  });

  // 销毁旧的图表实例
  if (window.chartInstance) {
    window.chartInstance.destroy();
  }

  window.chartInstance = new Chart(chartCanvas, {
    type: "pie",
    data: {
      labels: labelsWithPercentage,
      datasets: [
        {
          data: Object.values(categories),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        },
      ],
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.raw || 0;
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ¥${value} (${percentage}%)`;
            },
          },
        },
      },
    },
  });
}

// 添加交易记录
function addTransaction() {
  const name = transactionName.value.trim();
  const amount = transactionAmount.value.trim();
  const category = transactionCategory.value;

  if (name && amount) {
    console.log("正在添加交易记录:", { name, amount, category }); // 调试日志
    transactions.push({ name, amount, category });
    localStorage.setItem("transactions", JSON.stringify(transactions));
    transactionName.value = "";
    transactionAmount.value = "";

    console.log("开始渲染交易列表"); // 调试日志
    renderTransactions();

    console.log("开始渲染图表"); // 调试日志
    renderChart();
    console.log("图表渲染完成"); // 调试日志
  }
}

// 导入CSV文件
function importCSV() {
  const file = csvUpload.files[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    complete: function (results) {
      results.data.forEach((row) => {
        if (row.金额 && row.名称) {
          transactions.push({
            name: row.名称,
            amount: row.金额,
            category: row.分类 || "其他",
          });
        }
      });
      localStorage.setItem("transactions", JSON.stringify(transactions));
      renderTransactions();
      renderChart();
    },
  });
}

// 预算管理
const totalBudgetInput = document.getElementById("total-budget");
const foodBudgetInput = document.getElementById("food-budget");
const setBudgetBtn = document.getElementById("set-budget-btn");
const totalProgress = document.getElementById("total-progress");
const foodProgress = document.getElementById("food-progress");

let budgets = JSON.parse(localStorage.getItem("budgets")) || {
  total: 0,
  food: 0,
};

// 初始化预算
function initBudget() {
  totalBudgetInput.value = budgets.total;
  foodBudgetInput.value = budgets.food;
  updateProgress();
}

// 设置预算
function setBudget() {
  budgets.total = parseFloat(totalBudgetInput.value) || 0;
  budgets.food = parseFloat(foodBudgetInput.value) || 0;
  localStorage.setItem("budgets", JSON.stringify(budgets));
  updateProgress();
}

// 更新进度条
function updateProgress() {
  const totalSpent = transactions.reduce(
    (sum, t) => sum + parseFloat(t.amount),
    0
  );
  const foodSpent = transactions
    .filter((t) => t.category === "餐饮")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  totalProgress.style.width =
    budgets.total > 0
      ? `${Math.min(100, (totalSpent / budgets.total) * 100)}%`
      : "0%";
  foodProgress.style.width =
    budgets.food > 0
      ? `${Math.min(100, (foodSpent / budgets.food) * 100)}%`
      : "0%";

  // 超支预警
  if (totalSpent > budgets.total) {
    totalProgress.style.backgroundColor = "#FF6384";
  } else {
    totalProgress.style.backgroundColor = "#4CAF50";
  }

  if (foodSpent > budgets.food) {
    foodProgress.style.backgroundColor = "#FF6384";
  } else {
    foodProgress.style.backgroundColor = "#4CAF50";
  }
}

// 导航切换
document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".nav-btn.active").classList.remove("active");
    document.querySelector("section.active").classList.remove("active");
    btn.classList.add("active");
    document.querySelector(btn.dataset.page).classList.add("active");
  });
});

// 初始化
window.onload = () => {
  initWheel();
  initLedger();
  initBudget();

  if (spinBtn) spinBtn.addEventListener("click", spinWheel);
  if (addOptionBtn) addOptionBtn.addEventListener("click", addWheelOption);
  if (addTransactionBtn)
    addTransactionBtn.addEventListener("click", addTransaction);
  if (importCsvBtn) importCsvBtn.addEventListener("click", importCSV);
  if (setBudgetBtn) setBudgetBtn.addEventListener("click", setBudget);

  // 监听交易记录变化
  transactions.forEach(updateProgress);
};
