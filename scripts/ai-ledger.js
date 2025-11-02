// 从 localStorage 加载数据
function loadLedgerData() {
    const savedData = localStorage.getItem("aiLedgerData");
    return savedData ? JSON.parse(savedData) : [];
}

// 保存数据到 localStorage
function saveLedgerData(data) {
    localStorage.setItem("aiLedgerData", JSON.stringify(data));
}

// 渲染账本数据
function renderAILedger() {
    const data = loadLedgerData();
    const aiLedgerContent = document.getElementById("ai-ledger-content");
    aiLedgerContent.innerHTML = `
        <div class="input-form">
            <input type="text" id="date" placeholder="日期（YYYY-MM-DD）">
            <input type="text" id="category" placeholder="类别">
            <input type="number" id="amount" placeholder="金额">
            <button id="submit-btn">添加记录</button>
        </div>
        ${data
            .map(
                (entry, index) => `
                <div class="ledger-entry">
                    <p>日期: ${entry.date}</p>
                    <p>类别: ${entry.category}</p>
                    <p>金额: ${entry.amount}</p>
                    <button onclick="deleteLedgerEntry(${index})">删除</button>
                </div>
            `
            )
            .join("")}
    `;
    // 重新绑定事件
    document.getElementById("submit-btn").addEventListener("click", addLedgerEntry);
}

// 添加记录
function addLedgerEntry() {
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const amount = parseFloat(document.getElementById("amount").value);

    if (date && category && !isNaN(amount)) {
        const data = loadLedgerData();
        data.push({ date, category, amount });
        saveLedgerData(data);
        renderAILedger();
        // 清空输入框
        document.getElementById("date").value = "";
        document.getElementById("category").value = "";
        document.getElementById("amount").value = "";
    } else {
        alert("输入无效，请重试！");
    }
}

// 删除记录
function deleteLedgerEntry(index) {
    const data = loadLedgerData();
    data.splice(index, 1);
    saveLedgerData(data);
    renderAILedger();
}

// 初始化页面
renderAILedger();