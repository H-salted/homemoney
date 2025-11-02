// 美食决策机逻辑
const wheelCanvas = document.getElementById("wheelCanvas");
const ctx = wheelCanvas.getContext("2d");
const spinBtn = document.getElementById("spin-btn");
const addOptionBtn = document.getElementById("add-option-btn");
const wheelOptionInput = document.getElementById("wheel-option-input");
const wheelResult = document.getElementById("wheel-result");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history-btn");
const deleteOptionBtn = document.getElementById("delete-option-btn");
const editOptionBtn = document.getElementById("edit-option-btn");

let wheelOptions = JSON.parse(localStorage.getItem("wheelOptions")) || [];
let spinning = false;

// 初始化轮盘选项
function initWheelOptions() {
  if (wheelOptions.length > 0) {
    drawWheel();
  }

  // 绑定按钮事件
  deleteOptionBtn.addEventListener("click", function () {
    const selectedOption = prompt("请输入要删除的选项名称：");
    const index = wheelOptions.indexOf(selectedOption);
    if (index !== -1) {
      deleteOption(index);
    } else {
      alert("未找到该选项！");
    }
  });

  editOptionBtn.addEventListener("click", function () {
    const oldOption = prompt("请输入要修改的选项名称：");
    const index = wheelOptions.indexOf(oldOption);
    if (index !== -1) {
      const newOption = prompt("请输入新的选项名称：");
      if (newOption) {
        editOption(index, newOption);
      }
    } else {
      alert("未找到该选项！");
    }
  });
}

// 初始化轮盘
function initWheel() {
  wheelCanvas.width = 300;
  wheelCanvas.height = 300;
  drawWheel();
  initWheelOptions();
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
    localStorage.setItem("wheelOptions", JSON.stringify(wheelOptions));
    wheelOptionInput.value = "";
    drawWheel();
  }
}

// 删除指定选项
function deleteOption(index) {
  if (wheelOptions.length > 0 && index >= 0 && index < wheelOptions.length) {
    wheelOptions.splice(index, 1);
    localStorage.setItem("wheelOptions", JSON.stringify(wheelOptions));
    drawWheel();
  }
}

// 修改指定选项
function editOption(index, newOption) {
  if (wheelOptions.length > 0 && index >= 0 && index < wheelOptions.length) {
    wheelOptions[index] = newOption;
    localStorage.setItem("wheelOptions", JSON.stringify(wheelOptions));
    drawWheel();
  }
}

// 清空历史记录
function clearHistory() {
  historyList.innerHTML = "";
}

// 初始化事件监听
spinBtn.addEventListener("click", spinWheel);
addOptionBtn.addEventListener("click", addWheelOption);
clearHistoryBtn.addEventListener("click", clearHistory);

// 初始化页面
initWheel();