//// main.js
document.addEventListener('DOMContentLoaded', () => {
    // 主题切换
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme', 
                btn.classList.contains('dark'));
        });
    });

    // 动态加载Python版本
    const versionSelect = document.getElementById('pythonVersions');
    document.querySelector('.load-version').addEventListener('click', async () => {
        versionSelect.innerHTML = '<option>加载中...</option>';
        const versions = await fetchPythonVersions();
        versionSelect.innerHTML = versions.map(v => 
            `<option value="${v}">Python ${v}</option>`
        ).join('');
    });

    // PIP包搜索
    const searchInput = document.getElementById('packageSearch');
    searchInput.addEventListener('input', debounce(async (e) => {
        const results = await searchPyPI(e.target.value);
        updatePackageSuggestions(results);
    }, 300));
});

// 实用函数
function debounce(fn, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

// 动画加载
function showLoading(element) {
    element.innerHTML = `
        <div class="loading-spinner">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    `;
}
