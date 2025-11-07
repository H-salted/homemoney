// 全局主题切换逻辑

// 更新主题
function updateTheme(theme) {
  localStorage.setItem("theme", theme);
  document.body.className = theme;
}

// 初始化主题
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.className = savedTheme;
}

// 页面加载时初始化主题
document.addEventListener('DOMContentLoaded', initTheme);