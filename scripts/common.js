// 显示头像
function displayAvatar() {
    const avatar = localStorage.getItem('avatar');
    const avatarContainer = document.getElementById('avatar-container');
    if (avatar && avatarContainer) {
        avatarContainer.innerHTML = `<img src="${avatar}" class="avatar-preview" alt="头像" />`;
    }
}

// 页面加载时显示头像
document.addEventListener('DOMContentLoaded', () => {
    displayAvatar();
});