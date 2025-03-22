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

    // 更平滑的滑动效果
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        document.querySelectorAll('section').forEach(section => {
            const speed = section.dataset.speed || 0.03;
            section.style.transform = `translateY(${currentScroll * speed}px)`;
        });
    });
});