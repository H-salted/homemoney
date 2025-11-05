// 设置功能
function openSettings() {
  document.getElementById("settings-modal").style.display = "block";
}

function closeSettings() {
  document.getElementById("settings-modal").style.display = "none";
}

function saveSettings() {
  const name = document.getElementById("user-name").value;
  const email = document.getElementById("user-email").value;
  const theme = document.getElementById("theme-preference").value;

  const settings = {
    name,
    email,
    theme
  };

  localStorage.setItem("userSettings", JSON.stringify(settings));
  closeSettings();
}

function loadSettings() {
  const settings = JSON.parse(localStorage.getItem("userSettings")) || {};
  if (settings.theme) {
    document.body.className = settings.theme;
  }
}

// 页面加载时初始化设置
window.onload = function() {
  loadSettings();
};