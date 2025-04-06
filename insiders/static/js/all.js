// 使用事件委托优化事件监听
document.addEventListener('click', (event) => {
    if (event.target.matches('.button')) {
        // 处理按钮点击
    }
});

// 使用节流优化滚动事件
let isThrottled = false;
window.addEventListener('scroll', () => {
    if (isThrottled) return;
    isThrottled = true;
    setTimeout(() => {
        // 处理滚动逻辑
        isThrottled = false;
    }, 100);
});

// 时间检测和主题切换

// 滚动动画
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

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
            h1.style.animation = 'float 3s ease-in-out infinite';
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
});

// 滑动效果
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    document.querySelectorAll('section').forEach(section => {
        const speed = section.dataset.speed || 0.03; // 将speed从1调整为0.03，使滑动效果更轻微
        section.style.transform = `translateY(${(currentScroll - lastScroll) * speed}px)`;
    });
    lastScroll = currentScroll;
});

// 菜单项动态效果
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.navbar li');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(5px)';
            item.style.backgroundColor = 'rgba(0, 123, 255, 0.2)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
            item.style.backgroundColor = 'transparent';
        });
    });
});

// 页面元素过渡效果
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        setTimeout(() => {
            section.style.transition = `opacity 0.5s ease ${index * 0.2}s, transform 0.5s ease ${index * 0.2}s`;
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 300 + index * 100);
    });
});