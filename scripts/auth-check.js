// 登录验证脚本
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        // 如果未登录，重定向到登录页面
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// 页面加载时检查登录状态
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

// 导出函数供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { checkLoginStatus };
}