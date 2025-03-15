document.addEventListener("DOMContentLoaded", function() {
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
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateY(20px)';
        setTimeout(() => {
            feature.style.transition = `opacity 0.5s ease ${index * 0.2}s, transform 0.5s ease ${index * 0.2}s`;
            feature.style.opacity = '1';
            feature.style.transform = 'translateY(0)';
        }, 300 + index * 100);
    });

    // 项目地址浮动效果
    const footerLinks = document.querySelectorAll('.footer a');
    footerLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        setTimeout(() => {
            link.style.transition = `opacity 1s ease ${index * 0.2}s, transform 1s ease ${index * 0.2}s`;
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
            link.style.animation = 'float 3s ease-in-out infinite';
        }, 300 + index * 100);
    });

    // 新增: 更平滑的滑动效果
    window.addEventListener('scroll', () => {
        document.querySelectorAll('section').forEach(section => {
            const rect = section.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const speed = section.dataset.speed || 0.03; // 将speed从0.1调整为0.03，使滑动效果更轻微
            const offset = scrollTop * speed;
            // 添加以下代码，确保在Safari中平滑滑动
            section.style.willChange = 'transform';
            section.style.transform = `translateY(${offset}px) translateZ(0)`;
            section.style.backfaceVisibility = 'hidden';
            section.style.perspective = '1000px';
        });
    });

});