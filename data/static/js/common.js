/**
 * 下载页面共享JavaScript功能 - 现代化版本
 * 优化性能，减少重复代码，实现事件委托
 */

// 使用立即执行函数表达式(IIFE)创建模块作用域，避免全局变量污染
const DownloadPage = (function() {
    // 私有变量
    let currentDownloadLink = null;
    
    // 检测用户操作系统（只执行一次）
    const userAgent = navigator.userAgent;
    const isWindows = userAgent.indexOf('Win') !== -1;
    const isMac = userAgent.indexOf('Mac') !== -1;
    
    // 私有方法：处理下载按钮显示（适配新HTML结构）
    function handleDownloadButtons() {
        const downloadItems = document.querySelectorAll('.download-item');
        
        if (downloadItems.length === 0) return;
        
        // 使用DocumentFragment减少DOM重绘
        if (isWindows) {
            downloadItems.forEach(item => {
                const platform = item.querySelector('.download-platform').textContent;
                if (!platform.includes('Windows')) {
                    item.style.display = 'none';
                }
            });
            
            // 检查是否有Windows版本可用
            const hasWindowsVersion = Array.from(downloadItems).some(item => {
                const platform = item.querySelector('.download-platform').textContent;
                return platform.includes('Windows') && item.style.display !== 'none';
            });
            
            if (!hasWindowsVersion) {
                const downloadList = document.querySelector('.download-list');
                if (downloadList) {
                    downloadList.innerHTML = '<li class="download-item"><div class="download-info"><span class="download-version">暂无可用版本</span><span class="download-platform">请稍后重试</span></div></li>';
                }
            }
        } else if (isMac) {
            downloadItems.forEach(item => {
                const platform = item.querySelector('.download-platform').textContent;
                if (!platform.includes('macOS')) {
                    item.style.display = 'none';
                }
            });
            
            // 检查是否有macOS版本可用
            const hasMacVersion = Array.from(downloadItems).some(item => {
                const platform = item.querySelector('.download-platform').textContent;
                return platform.includes('macOS') && item.style.display !== 'none';
            });
            
            if (!hasMacVersion) {
                const downloadList = document.querySelector('.download-list');
                if (downloadList) {
                    downloadList.innerHTML = '<li class="download-item"><div class="download-info"><span class="download-version">暂无可用版本</span><span class="download-platform">请稍后重试</span></div></li>';
                }
            }
        } else {
            // 其他操作系统显示所有版本
            const downloadList = document.querySelector('.download-list');
            if (downloadList) {
                downloadList.innerHTML = '<li class="download-item"><div class="download-info"><span class="download-version">请选择适合您操作系统的版本</span><span class="download-platform">当前系统暂不支持自动筛选</span></div></li>';
            }
        }
    }
    
    // 私有方法：设置动画延迟
    function setupAnimationDelays() {
        // 使用requestAnimationFrame优化动画性能
        requestAnimationFrame(() => {
            const elements = document.querySelectorAll('.page-title, .page-subtitle, .version-card, .nav-buttons, .info-box');
            elements.forEach((element, index) => {
                element.style.animationDelay = `${index * 0.1}s`;
            });
        });
    }
    
    // 私有方法：处理下载确认（适配新HTML结构）
    function setupDownloadConfirmation() {
        // 使用事件委托减少事件监听器数量
        document.addEventListener('click', function(e) {
            // 处理下载链接点击
            if (e.target.closest('.download-button')) {
                e.preventDefault();
                const link = e.target.closest('.download-button');
                currentDownloadLink = link.href;
                
                // 显示确认对话框
                showDownloadConfirmation();
            }
        });
    }
    
    // 私有方法：显示下载确认对话框
    function showDownloadConfirmation() {
        // 创建确认对话框
        const overlay = document.createElement('div');
        overlay.id = 'download-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
        `;
        
        const confirmBox = document.createElement('div');
        confirmBox.id = 'download-confirm-box';
        confirmBox.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 12px;
            text-align: center;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        `;
        
        confirmBox.innerHTML = `
            <h3 style="margin-bottom: 1rem; color: #333;">下载确认</h3>
            <p style="margin-bottom: 1.5rem; color: #666; line-height: 1.5;">
                您即将下载PyQuick软件。请确认您已阅读并同意GPL v3许可证条款。
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button id="download-cancel-btn" style="
                    padding: 0.5rem 1.5rem;
                    border: 1px solid #ddd;
                    background: #f8f9fa;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                ">取消</button>
                <button id="download-confirm-btn" style="
                    padding: 0.5rem 1.5rem;
                    border: none;
                    background: #007BFF;
                    color: white;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                ">确认下载</button>
            </div>
        `;
        
        overlay.appendChild(confirmBox);
        document.body.appendChild(overlay);
        
        // 添加按钮事件监听器
        document.getElementById('download-cancel-btn').addEventListener('click', function() {
            document.body.removeChild(overlay);
            currentDownloadLink = null;
        });
        
        document.getElementById('download-confirm-btn').addEventListener('click', function() {
            if (currentDownloadLink) {
                window.location.href = currentDownloadLink;
            }
            document.body.removeChild(overlay);
            currentDownloadLink = null;
        });
    }
    
    // 私有方法：添加性能优化提示
    function setupPerformanceHints() {
        requestAnimationFrame(() => {
            document.querySelectorAll('.version-card, .download-button, .nav-button').forEach(el => {
                el.style.willChange = 'transform, opacity';
            });
        });
    }
    
    // 公共方法：初始化页面
    function init() {
        // 使用DOMContentLoaded事件确保DOM已加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initPage);
        } else {
            initPage();
        }
        
        function initPage() {
            handleDownloadButtons();
            setupDownloadConfirmation();
            setupAnimationDelays();
            setupPerformanceHints();
        }
    }
    
    // 返回公共API
    return {
        init: init
    };
})();

// 初始化下载页面
DownloadPage.init();