/**
 * 下载页面共享JavaScript功能
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
    
    // 私有方法：处理下载按钮显示
    function handleDownloadButtons() {
        // 使用DocumentFragment减少DOM重绘
        if (isWindows) {
            document.querySelectorAll('.macos-build').forEach(element => {
                element.style.display = 'none';
            });
            if (document.querySelectorAll('.windows-build').length === 0) {
                document.getElementById('builds-list').innerHTML = '<li>No available builds</li>';
            }
        } else if (isMac) {
            document.querySelectorAll('.windows-build').forEach(element => {
                element.style.display = 'none';
            });
            if (document.querySelectorAll('.macos-build').length === 0) {
                document.getElementById('builds-list').innerHTML = '<li>No available builds</li>';
            }
        } else {
            document.getElementById('builds-list').innerHTML = '<li>No available builds</li>';
        }
    }
    
    // 私有方法：处理旧版本下载按钮显示
    function handleOldBuilds() {
        const oldBuildsList = document.getElementById('old-builds-list');
        if (!oldBuildsList) return; // 如果页面没有old-builds-list元素，直接返回
        
        if (isMac) {
            const macOldBuilds = oldBuildsList.querySelectorAll('.macos-build');
            if (macOldBuilds.length === 0) {
                oldBuildsList.innerHTML = '<li>No available builds</li>';
            } else {
                oldBuildsList.querySelectorAll('.windows-build').forEach(element => {
                    element.style.display = 'none';
                });
            }
        } else if (!isWindows) {
            oldBuildsList.innerHTML = '<li>No available builds</li>';
        }
    }
    
    // 私有方法：设置动画延迟
    function setupAnimationDelays() {
        // 使用requestAnimationFrame优化动画性能
        requestAnimationFrame(() => {
            document.querySelectorAll('.container > *').forEach((element, index) => {
                element.style.animationDelay = `${index * 0.1}s`; // 减少延迟时间提高响应速度
            });
        });
    }
    
    // 私有方法：处理下载确认
    function setupDownloadConfirmation() {
        // 使用事件委托减少事件监听器数量
        document.addEventListener('click', function(e) {
            // 处理下载链接点击
            if (e.target.closest('.version-box a')) {
                e.preventDefault();
                const link = e.target.closest('a');
                currentDownloadLink = link.href;
                document.getElementById('overlay').classList.remove('hidden');
                document.getElementById('confirmBox').classList.remove('hidden');
                
                // 使用缓存避免重复请求GPL文本
                if (!window.gplText) {
                    fetch('./gpl3.txt')
                        .then(response => response.text())
                        .then(text => {
                            window.gplText = text; // 缓存GPL文本
                            document.getElementById('gpl3Box').innerText = text;
                        });
                } else {
                    document.getElementById('gpl3Box').innerText = window.gplText;
                }
                
                // 使用requestAnimationFrame优化滚动性能
                requestAnimationFrame(() => {
                    document.getElementById('gpl3Box').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                });
            }
            
            // 处理取消按钮点击
            if (e.target.id === 'cancelBtn') {
                document.getElementById('overlay').classList.add('hidden');
                document.getElementById('confirmBox').classList.add('hidden');
                currentDownloadLink = null;
            }
            
            // 处理确认按钮点击
            if (e.target.id === 'okBtn') {
                if (currentDownloadLink) {
                    window.location.href = currentDownloadLink;
                }
                document.getElementById('overlay').classList.add('hidden');
                document.getElementById('confirmBox').classList.add('hidden');
                currentDownloadLink = null;
            }
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
            handleOldBuilds();
            setupDownloadConfirmation();
            setupAnimationDelays();
            
            // 添加will-change提示优化动画性能
            document.querySelectorAll('.version-box, .insiders-box, .insiders, h1').forEach(el => {
                el.style.willChange = 'transform, opacity';
            });
        }
    }
    
    // 返回公共API
    return {
        init: init
    };
})();

// 初始化下载页面
DownloadPage.init();