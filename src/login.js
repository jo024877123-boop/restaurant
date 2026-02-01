// 로그인 페이지에 들어오면 기존 세션을 만료시킴 (항상 로그인 요구)
sessionStorage.removeItem('admin_access_granted');


document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');

    if (password === '296800') {
        sessionStorage.setItem('admin_access_granted', 'true');
        // 로그인 성공 시 admin 페이지로 이동
        window.location.replace('/admin.html');
    } else {
        errorMsg.classList.remove('hidden');
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    }
});
