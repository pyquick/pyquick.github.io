// 主题管理功能
const ThemeManager = {
    // 主题状态
    currentTheme: null,
    
    // 初始化主题
    init() {
        // 获取主题切换按钮
        this.toggleBtn = document.querySelector('.theme-toggle');
        
        if (this.toggleBtn) {
            // 点击切换主题
            this.toggleBtn.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
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
            this.updateThemeColor('#232323');
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (this.toggleBtn) {
                this.toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
                this.toggleBtn.setAttribute('title', '切换到深色模式');
            }
            // 更新浏览器主题色
            this.updateThemeColor('#f9f9f9');
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
            });
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
        notification.style.background = 'var(--container-bg)';
        notification.style.backdropFilter = 'blur(10px)';
        notification.style.boxShadow = 'var(--shadow-color) 0 2px 8px';
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

// 回到顶部功能
const BackToTop = {
    init() {
        this.button = document.querySelector('.back-to-top');
        
        if (!this.button) return;
        
        // 监听滚动事件
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // 点击回到顶部
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    },
    
    handleScroll() {
        if (window.scrollY > 300) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }
};

// 图片查看增强
const ImageViewer = {
    init() {
        // 为所有图片添加点击放大功能
        const images = document.querySelectorAll('.img-container img');
        
        images.forEach(img => {
            img.addEventListener('click', () => {
                this.showFullScreen(img);
            });
            
            // 添加鼠标悬停提示
            img.setAttribute('title', '点击查看大图');
            
            // 添加放大镜图标指示器
            this.addZoomIndicator(img);
        });
    },
    
    // 添加放大镜图标
    addZoomIndicator(img) {
        const zoomIcon = document.createElement('div');
        zoomIcon.classList.add('zoom-indicator');
        zoomIcon.innerHTML = '<i class="fas fa-search-plus"></i>';
        
        // 获取图片的父容器并设置为相对定位
        const container = img.closest('.img-container');
        if (container) {
            container.style.position = 'relative';
            container.appendChild(zoomIcon);
        }
    },
    
    showFullScreen(img) {
        // 创建全屏查看容器
        const container = document.createElement('div');
        container.classList.add('fullscreen-viewer');
        
        // 创建图片元素
        const fullImg = document.createElement('img');
        fullImg.src = img.src;
        fullImg.classList.add('fullscreen-image');
        fullImg.style.transform = 'scale(0.9)'; // 初始缩小状态
        
        // 创建关闭按钮
        const closeBtn = document.createElement('div');
        closeBtn.classList.add('fullscreen-close');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        
        // 添加图像说明
        const imgCaption = img.closest('.img-container').querySelector('.img-caption');
        if (imgCaption) {
            const caption = document.createElement('div');
            caption.classList.add('fullscreen-caption');
            caption.textContent = imgCaption.textContent;
            container.appendChild(caption);
        }
        
        // 添加到容器
        container.appendChild(fullImg);
        container.appendChild(closeBtn);
        document.body.appendChild(container);
        
        // 防止滚动
        document.body.style.overflow = 'hidden';
        
        // 动画效果
        setTimeout(() => {
            fullImg.style.transform = 'scale(1)';
        }, 10);
        
        // 点击关闭
        container.addEventListener('click', (e) => {
            if (e.target !== fullImg) {
                this.closeFullScreen(container);
            }
        });
        
        // 关闭按钮事件
        closeBtn.addEventListener('click', () => {
            this.closeFullScreen(container);
        });
        
        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeFullScreen(container);
            }
        }, { once: true });
    },
    
    // 关闭全屏查看
    closeFullScreen(container) {
        const fullImg = container.querySelector('.fullscreen-image');
        fullImg.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            document.body.removeChild(container);
            document.body.style.overflow = '';
        }, 200);
    }
};

// 列表动画效果
const ListAnimator = {
    init() {
        const listItems = document.querySelectorAll('ul li');
        
        // 使用IntersectionObserver检测列表项是否在视窗内
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, { threshold: 0.1 });
        
        // 设置初始样式并添加到观察者
        listItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
            observer.observe(item);
        });
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化主题
    ThemeManager.init();
    
    // 初始化回到顶部按钮
    BackToTop.init();
    
    // 初始化图片查看器
    ImageViewer.init();
    
    // 初始化列表动画
    ListAnimator.init();
    
    // 页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
}); 