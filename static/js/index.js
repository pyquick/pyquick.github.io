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

// 添加邮箱图标悬停事件
let emailPopup = null; // 用于存储邮箱弹出窗口的引用

document.getElementById('email-icon').addEventListener('mouseenter', (e) => {
    e.preventDefault();
    e.stopPropagation(); // 阻止事件冒泡
    if (emailPopup) {
        // 如果窗口已存在，则移除
        document.body.removeChild(emailPopup);
        emailPopup = null;
        return;
    }

    emailPopup = document.createElement('div');
    const iconRect = e.target.getBoundingClientRect();
    emailPopup.style.position = 'fixed';
    emailPopup.style.top = `${iconRect.top - 220}px`; // 将窗口上移20px
    emailPopup.style.left = `${iconRect.left + iconRect.width / 2}px`;
    emailPopup.style.transform = 'translateX(-50%)';
    emailPopup.style.opacity = '0';
    emailPopup.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    emailPopup.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // 设置背景为半透明
    emailPopup.classList.add('email-popup'); // 添加CSS类

    const email1 = document.createElement('div');
    email1.style.marginBottom = '10px';
    email1.textContent = 'hsdfg3@outlook.com';
    email1.classList.add('email-item'); // 添加CSS类
    email1.style.padding = '10px'; // 添加内边距
    email1.style.border = '1px solid #ccc'; // 添加边框
    email1.style.borderRadius = '5px'; // 添加圆角
    email1.style.display = 'flex'; // 使用flex布局
    email1.style.alignItems = 'center'; // 垂直居中
    email1.style.justifyContent = 'space-between'; // 左右分布
    const copyButton1 = document.createElement('div');
    copyButton1.classList.add('copy-button-container'); // 添加新的容器
    const copyIcon1 = document.createElement('button');
    copyIcon1.innerHTML = '<i class="fas fa-clone"></i>'; // 使用更现代的复制图标
    copyIcon1.classList.add('copy-button'); // 添加CSS类
    copyIcon1.onclick = () => {
        navigator.clipboard.writeText('hsdfg3@outlook.com').then(() => {
            copyIcon1.innerHTML = '<i class="fas fa-check"></i>'; // 显示勾图标
            setTimeout(() => {
                copyIcon1.innerHTML = '<i class="fas fa-clone"></i>'; // 2秒后恢复为复制图标
            }, 2000);
        });
    };
    copyButton1.appendChild(copyIcon1);
    email1.appendChild(copyButton1);

    const email2 = document.createElement('div');
    email2.textContent = 'dsfksdf67@outlook.com';
    email2.classList.add('email-item'); // 添加CSS类
    email2.style.padding = '10px'; // 添加内边距
    email2.style.border = '1px solid #ccc'; // 添加边框
    email2.style.borderRadius = '5px'; // 添加圆角
    email2.style.display = 'flex'; // 使用flex布局
    email2.style.alignItems = 'center'; // 垂直居中
    email2.style.justifyContent = 'space-between'; // 左右分布
    const copyButton2 = document.createElement('div');
    copyButton2.classList.add('copy-button-container'); // 添加新的容器
    const copyIcon2 = document.createElement('button');
    copyIcon2.innerHTML = '<i class="fas fa-clone"></i>'; // 使用更现代的复制图标
    copyIcon2.classList.add('copy-button'); // 添加CSS类
    copyIcon2.onclick = () => {
        navigator.clipboard.writeText('dsfksdf67@outlook.com').then(() => {
            copyIcon2.innerHTML = '<i class="fas fa-check"></i>'; // 显示勾图标
            setTimeout(() => {
                copyIcon2.innerHTML = '<i class="fas fa-clone"></i>'; // 2秒后恢复为复制图标
            }, 2000);
        });
    };
    copyButton2.appendChild(copyIcon2);
    email2.appendChild(copyButton2);

    emailPopup.appendChild(email1);
    emailPopup.appendChild(email2);

    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.style.marginTop = '10px';
    closeButton.style.display = 'block';
    closeButton.style.marginLeft = 'auto';
    closeButton.style.marginRight = 'auto';
    closeButton.classList.add('close-button'); // 添加CSS类
    closeButton.onclick = () => {
        document.body.removeChild(emailPopup);
        emailPopup = null;
    };
    emailPopup.appendChild(closeButton);

    document.body.appendChild(emailPopup);

    setTimeout(() => {
        emailPopup.style.opacity = '1';
    }, 10);

    // 添加全局鼠标离开事件监听器
    document.addEventListener('mouseleave', handleOutsideLeave);
});

// 处理鼠标离开外部区域关闭窗口的函数
function handleOutsideLeave(e) {
    if (emailPopup && !emailPopup.contains(e.target) && e.target.id !== 'email-icon') {
        // 添加渐隐效果
        emailPopup.style.transition = 'opacity 0.3s ease';
        emailPopup.style.opacity = '0';
        // 等待动画结束后移除窗口
        setTimeout(() => {
            document.body.removeChild(emailPopup);
            emailPopup = null;
            // 移除事件监听器
            document.removeEventListener('mouseleave', handleOutsideLeave);
        }, 300); // 300ms 是动画持续时间
    }
}
