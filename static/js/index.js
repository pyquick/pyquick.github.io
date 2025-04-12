// 页面启动时的动态效果
document.addEventListener('DOMContentLoaded', () => {
    // 页面元素渐入效果
    const container = document.querySelector('.container');
    if (container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';
        setTimeout(() => {
            container.style.transition = 'opacity 1s ease, transform 1s ease';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 100);
    }

    // 标题浮动效果
    const h1 = document.querySelector('h1');
    if (h1) {
        h1.style.opacity = '0';
        h1.style.transform = 'translateY(20px)';
        setTimeout(() => {
            h1.style.transition = 'opacity 1s ease, transform 1s ease';
            h1.style.opacity = '1';
            h1.style.transform = 'translateY(0)';
            h1.style.animation = 'float 3s ease-in-out infinite, glow 2s ease-in-out infinite alternate';
        }, 200);
    }

    // 卡片逐个显示效果
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = `opacity 0.5s ease ${index * 0.2}s, transform 0.5s ease ${index * 0.2}s`;
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 + index * 100);
    });

    // 优化滚动效果，使用节流和requestAnimationFrame
    const handleScroll = throttle(() => {
        requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset;
            document.querySelectorAll('section').forEach(section => {
                const speed = section.dataset.speed || 0.03;
                section.style.transform = `translateY(${currentScroll * speed}px)`;
            });
        });
    }, 16); // 约60fps

    window.addEventListener('scroll', handleScroll, { passive: true });
});

// 节流函数实现
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
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

    // 显示弹窗
    show(e) {
        if (this.isVisible) return;
        this.isVisible = true;

        const popup = document.createElement('div');
        popup.classList.add('email-popup');
        const iconRect = e.target.getBoundingClientRect();
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
            popup.style.opacity = '1';
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
