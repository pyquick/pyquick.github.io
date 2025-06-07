// 主题切换功能
const ThemeManager = {
    // 主题状态
    currentTheme: null,
    
    // 初始化主题
    init() {
        // 创建主题切换按钮
        this.createToggleButton();
        
        // 尝试从本地存储加载主题
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            // 使用保存的主题
            this.setTheme(savedTheme);
        } else {
            // 检查系统主题偏好
            if (this.checkSystemPreference()) {
                // 如果有系统偏好设置，使用系统偏好
                this.setTheme(this.checkSystemPreference());
            } else {
                // 否则根据时间自动设置主题
                this.setThemeByTime();
            }
        }
        
        // 监听系统主题变化
        this.listenForSystemPreferenceChanges();
        
        // 每小时检查一次时间，以便自动切换主题
        setInterval(() => {
            if (!localStorage.getItem('theme')) {
                this.setThemeByTime();
            }
        }, 60 * 60 * 1000); // 每小时检查一次
    },
    
    // 创建主题切换按钮
    createToggleButton() {
        const toggleBtn = document.createElement('div');
        toggleBtn.classList.add('theme-toggle');
        toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        toggleBtn.setAttribute('title', '切换主题');
        
        // 点击切换主题
        toggleBtn.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        document.body.appendChild(toggleBtn);
        this.toggleBtn = toggleBtn;
    },
    
    // 根据时间设置主题
    setThemeByTime() {
        const hour = new Date().getHours();
        // 晚上6点到早上6点使用深色模式
        const theme = (hour >= 18 || hour < 6) ? 'dark' : 'light';
        this.setTheme(theme);
    },
    
    // 切换主题
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // 保存到本地存储
        localStorage.setItem('theme', newTheme);
        
        // 显示主题变更提示
        this.showThemeChangeNotification(newTheme);
    },
    
    // 设置主题
    setTheme(theme) {
        this.currentTheme = theme;
        
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (this.toggleBtn) {
                this.toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
                this.toggleBtn.setAttribute('title', '切换到浅色模式');
            }
            // 更新浏览器主题色
            this.updateThemeColor('#1a1a2e');
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (this.toggleBtn) {
                this.toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
                this.toggleBtn.setAttribute('title', '切换到深色模式');
            }
            // 更新浏览器主题色
            this.updateThemeColor('#f3f9ff');
        }
    },
    
    // 更新浏览器主题色
    updateThemeColor(color) {
        const themeColorMeta = document.getElementById('theme-color');
        if (themeColorMeta) {
            themeColorMeta.setAttribute('content', color);
        }
    },
    
    // 检查系统主题偏好
    checkSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
        return null;
    },
    
    // 监听系统主题变化
    listenForSystemPreferenceChanges() {
        if (window.matchMedia) {
            const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // 添加变化监听器
            darkModeMediaQuery.addEventListener('change', (e) => {
                // 如果没有用户设置的主题偏好，则跟随系统变化
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            }
        }
    },
    
    // 显示主题变更提示
    showThemeChangeNotification(theme) {
        // 创建提示元素
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '80px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '20px';
        notification.style.background = 'var(--card-bg)';
        notification.style.backdropFilter = 'blur(10px)';
        notification.style.boxShadow = 'var(--shadow-light)';
        notification.style.zIndex = '1000';
        notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        notification.style.opacity = '0';
        notification.style.color = 'var(--text-color)';
        
        // 设置提示内容
        notification.textContent = theme === 'dark' ? '已切换到深色模式' : '已切换到浅色模式';
        
        // 添加到文档中
        document.body.appendChild(notification);
        
        // 显示提示
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // 自动隐藏提示
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(20px)';
            
            // 移除元素
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
};

// 页面启动时的动态效果
document.addEventListener('DOMContentLoaded', () => {
    // 初始化主题管理
    ThemeManager.init();

    // 初始化邮件弹窗
    setTimeout(() => {
        EmailPopup.init();
    }, 100);
    
    // 创建页面加载动画
    const loader = document.createElement('div');
    loader.classList.add('page-loader');
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-icon"><i class="fas fa-rocket"></i></div>
            <div class="loader-text">PyQuick 加载中...</div>
        </div>
    `;
    document.body.appendChild(loader);

    // 使用更简单的动画过渡
    setTimeout(() => {
        // 隐藏加载动画
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';

        // 页面元素渐入效果 - 简化动画
        const container = document.querySelector('.container');
        if (container) {
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)';
            setTimeout(() => {
                container.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 50);
        }

        // 标题浮动效果 - 简化动画
        const h1 = document.querySelector('h1');
        if (h1) {
            h1.style.opacity = '0';
            setTimeout(() => {
                h1.style.transition = 'opacity 0.8s ease';
                h1.style.opacity = '1';
                // 使用更轻量的动画
                setTimeout(() => {
                    h1.style.animation = 'float 5s ease-in-out infinite';
                }, 800);
            }, 100);
        }

        // 卡片显示效果 - 简化成批量显示
        const cards = document.querySelectorAll('.card');
        setTimeout(() => {
            cards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }, 300);

        // 移除加载动画
        setTimeout(() => {
            document.body.removeChild(loader);
        }, 600);
    }, 600); // 减少加载动画时间

    // 视差背景元素已移除以提高性能
    function createParallaxBackground() {
        // 空函数，不再创建视差背景
        return null;
    }

    // 简化的滚动显示逻辑
    function initScrollReveal() {
        // 获取所有需要监视的元素
        const cards = document.querySelectorAll('.card');
        let revealElements = [];

        // 初始化，使用数组存储而不是重复查询DOM
        cards.forEach(card => {
            card.classList.add('scroll-reveal');
            revealElements.push(card);
        });

        // 优化的视口检查
        function checkIfInView() {
            // 如果没有要显示的元素了，移除滚动监听器
            if (revealElements.length === 0) {
                window.removeEventListener('scroll', throttledCheck);
                return;
            }

            const windowHeight = window.innerHeight;
            const windowTop = window.scrollY;
            const windowBottom = windowTop + windowHeight;

            // 使用倒序循环，这样可以安全地从数组中移除元素
            for (let i = revealElements.length - 1; i >= 0; i--) {
                const element = revealElements[i];
                const rect = element.getBoundingClientRect();

                // 使用更高效的方式检查元素是否在视口中
                if (rect.top < windowHeight && rect.bottom > 0) {
                    element.classList.add('visible');
                    // 从监视数组中移除已显示的元素
                    revealElements.splice(i, 1);
                }
            }
        }

        // 创建节流版本的检查函数
        const throttledCheck = throttle(checkIfInView, 200);

        // 初始检查
        checkIfInView();

        // 滚动时检查，使用passive参数提高性能
        window.addEventListener('scroll', throttledCheck, { passive: true });
    }

    // 优化滚动效果，使用更低频率的节流
    const handleScroll = throttle(() => {
        // 只在必要时才使用requestAnimationFrame
        // 移除视差效果，只保留基本的滚动显示功能
        const currentScroll = window.scrollY;

        // 使用更简单的区段效果，提高性能
        document.querySelectorAll('section').forEach(section => {
            const rect = section.getBoundingClientRect();
            // 只有当元素接近可视区域时才处理它
            if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
                const speed = section.dataset.speed || 0.03;
                section.style.transform = `translateY(${currentScroll * speed}px)`;
            }
        });
    }, 50); // 降低为20fps，减少计算量

    // 添加平滑滚动效果
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // 优化初始化，延迟执行非关键任务
    window.addEventListener('load', () => {
        // 延迟初始化滚动效果，先让页面渲染完成
        setTimeout(() => {
            // 不再创建视差背景
            initScrollReveal();
        }, 100);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
});

// 简化的邮件弹窗功能
const EmailPopup = {
    popup: null,
    isVisible: false,

    // 初始化邮件弹窗
    init() {
        // 监听邮件图标点击
        const emailIcon = document.getElementById('email-icon');
        if (emailIcon) {
            emailIcon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // 阻止事件冒泡
                this.show(e);
            });

            // 确保内部图标也能触发点击事件
            const iconElement = emailIcon.querySelector('i');
            if (iconElement) {
                iconElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // 阻止事件冒泡
                    this.show(e);
                });
            }
        }

        // 点击其他区域关闭弹窗
        document.addEventListener('click', (e) => {
            if (this.popup && !this.popup.contains(e.target) && e.target.id !== 'email-icon') {
                this.hide();
            }
        });
    },

    // 显示弹窗
    show(e) {
        if (this.isVisible) return;
        this.isVisible = true;

        // 获取点击的元素
        const target = e.target.closest('#email-icon') || e.target;
        const popup = document.createElement('div');
        popup.classList.add('email-popup');

        // 获取图标位置
        const iconRect = target.getBoundingClientRect();
        // 计算弹窗位置，确保在图标上方且居中
        const viewportHeight = window.innerHeight;
        const popupTop = iconRect.top - 220 < 10 ? iconRect.top + iconRect.height + 10 : iconRect.top - 220;

        Object.assign(popup.style, {
            position: 'fixed',
            top: `${popupTop}px`,
            left: `${iconRect.left + (iconRect.width / 2)}px`,
            transform: 'translateX(-50%)',
            opacity: '0'
        });

        // 填充弹窗内容
        popup.innerHTML = `
            <h3 style="margin-top:0;text-align:center;">联系我们</h3>
            <div class="email-list">
                <div class="email-item">
                    <span>技术支持:</span>
                    <div>
                        <span>support@pyquick.org</span>
                        <div class="copy-button-container">
                            <button class="copy-button" data-email="support@pyquick.org">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="email-item">
                    <span>商务合作:</span>
                    <div>
                        <span>business@pyquick.org</span>
                        <div class="copy-button-container">
                            <button class="copy-button" data-email="business@pyquick.org">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="email-item">
                    <span>问题反馈:</span>
                    <div>
                        <span>feedback@pyquick.org</span>
                        <div class="copy-button-container">
                            <button class="copy-button" data-email="feedback@pyquick.org">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <button class="close-button">关闭</button>
        `;

        // 添加到页面
        document.body.appendChild(popup);
        this.popup = popup;

        // 显示动画
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                popup.style.opacity = '1';
                popup.style.transform = 'translateX(-50%)'; // 保持水平居中
            });
        });

        // 添加复制功能
        popup.querySelectorAll('.copy-button').forEach(button => {
            button.addEventListener('click', () => {
                const email = button.dataset.email;
                navigator.clipboard.writeText(email).then(() => {
                    this.showCopyNotification('邮箱已复制到剪贴板');
                });
            });
        });

        // 添加关闭功能
        popup.querySelector('.close-button').addEventListener('click', () => {
            this.hide();
        });
    },

    // 隐藏弹窗
    hide() {
        if (!this.isVisible || !this.popup) return;

        // 隐藏动画
        this.popup.style.opacity = '0';
        this.popup.style.transform = 'translateX(-50%) translateY(10px)';

        // 使用requestAnimationFrame来优化性能
        let popup = this.popup;
        requestAnimationFrame(() => {
            // 移除元素
            setTimeout(() => {
                if (popup && popup.parentNode) {
                    document.body.removeChild(popup);
                }
                this.popup = null;
                this.isVisible = false;
            }, 250);
        });
    },

    // 显示复制通知
    showCopyNotification(message) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.padding = '10px 20px';
        notification.style.background = 'var(--primary-color)';
        notification.style.color = 'white';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1001';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        notification.textContent = message;

        // 添加到页面
        document.body.appendChild(notification);

        // 显示动画
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        // 自动隐藏
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
};

// 优化的节流函数实现
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function(...args) {
        const context = this;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

// 添加邮箱图标悬停事件
// 邮箱弹窗状态管理
const EmailPopup = {
    popup: null,
    inactivityTimer: null,
    isVisible: false,

    // 创建邮箱项
    createEmailItem(email) {
        const item = document.createElement('div');
        item.classList.add('email-item');
        item.textContent = email;

        const copyButton = document.createElement('div');
        copyButton.classList.add('copy-button-container');
        const copyIcon = document.createElement('button');
        copyIcon.classList.add('copy-button');
        copyIcon.innerHTML = '<i class="fas fa-clone"></i>';

        copyIcon.onclick = () => {
            navigator.clipboard.writeText(email).then(() => {
                copyIcon.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyIcon.innerHTML = '<i class="fas fa-clone"></i>';
                }, 2000);
            });
        };

        copyButton.appendChild(copyIcon);
        item.appendChild(copyButton);
        return item;
    },

    // 显示弹窗 - 简化版
    show(e) {
        if (this.isVisible) return;
        this.isVisible = true;

        const popup = document.createElement('div');
        popup.classList.add('email-popup');

        // 获取图标位置
        const iconRect = target.getBoundingClientRect();
        // 计算弹窗位置，确保在图标上方且居中
        const viewportHeight = window.innerHeight;
        const popupTop = iconRect.top - 220 < 10 ? iconRect.top + iconRect.height + 10 : iconRect.top - 220;

        Object.assign(popup.style, {
            position: 'fixed',
            top: `${iconRect.top - 220}px`,
            left: `${iconRect.left + iconRect.width / 2}px`,
            transform: 'translateX(-50%)',
            opacity: '0'
        });

        // 添加邮箱项
        popup.appendChild(this.createEmailItem('hsdfg3@outlook.com'));
        popup.appendChild(this.createEmailItem('dsfksdf67@outlook.com'));

        // 添加关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.classList.add('close-button');
        closeButton.onclick = () => this.hide();
        popup.appendChild(closeButton);

        document.body.appendChild(popup);
        this.popup = popup;

        // 使用requestAnimationFrame确保DOM更新后再添加过渡效果
        requestAnimationFrame(() => {
            popup.style.transition = 'opacity 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
            popup.style.opacity = '1';
            popup.style.transform = 'translateX(-50%) scale(1)';
        });

        // 添加事件监听和自动关闭计时器
        this.addEventListeners();
        this.startInactivityTimer();
    },

    // 隐藏弹窗
    hide() {
        if (!this.isVisible) return;
        this.isVisible = false;

        if (this.popup) {
            this.popup.style.opacity = '0';
            this.popup.style.transform = 'translateX(-50%) scale(0.9)';
            setTimeout(() => {
                document.body.removeChild(this.popup);
                this.popup = null;
            }, 300);
        }

        this.removeEventListeners();
        this.clearInactivityTimer();
    },

    // 添加事件监听器
    addEventListeners() {
        document.addEventListener('mouseleave', this.handleOutsideLeave);
        document.addEventListener('click', this.handleOutsideClick);
    },

    // 移除事件监听器
    removeEventListeners() {
        document.removeEventListener('mouseleave', this.handleOutsideLeave);
        document.removeEventListener('click', this.handleOutsideClick);
    },

    // 开始计时器
    startInactivityTimer() {
        this.clearInactivityTimer();
        this.inactivityTimer = setTimeout(() => this.hide(), 5000);
    },

    // 清除计时器
    clearInactivityTimer() {
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
            this.inactivityTimer = null;
        }
    },

    // 处理外部点击
    handleOutsideClick(e) {
        if (EmailPopup.popup && !EmailPopup.popup.contains(e.target) && e.target.id !== 'email-icon') {
            EmailPopup.hide();
        }
    },

    // 处理鼠标离开
    handleOutsideLeave(e) {
        if (EmailPopup.popup && !EmailPopup.popup.contains(e.target) && e.target.id !== 'email-icon') {
            EmailPopup.hide();
        }
    }
};

// 邮箱图标事件处理
// 绑定邮箱图标事件
document.getElementById('email-icon').addEventListener('mouseenter', (e) => {
    e.preventDefault();
    e.stopPropagation();
    EmailPopup.show(e);
});

// 清理不再使用的全局函数
const handleOutsideClick = null;
const handleOutsideLeave = null;
const showEmailPopup = null;
