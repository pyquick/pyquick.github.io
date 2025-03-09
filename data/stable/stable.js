document.addEventListener('DOMContentLoaded', function() {
    // 只监听下载链接的点击事件，排除 insiders 按钮
    document.querySelectorAll('.version-box a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('overlay').style.display = 'block';
            document.getElementById('confirmBox').style.display = 'block';
            // 加载 GPL3 协议内容
            fetch('/data/stable/gpl3.txt')
                .then(response => response.text())
                .then(text => {
                    document.getElementById('gpl3Box').innerText = text;
                    // 新增滚动到协议内容的效果
                    document.getElementById('gpl3Box').scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
        });
    });

    document.getElementById('cancelBtn').addEventListener('click', function() {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('confirmBox').style.display = 'none';
    });

    document.getElementById('okBtn').addEventListener('click', function() {
        const link = document.querySelector('.version-box a[href]');
        window.location.href = link.href;
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('confirmBox').style.display = 'none';
    });

    // 新增页面加载时的动画效果
    document.querySelectorAll('.container > *').forEach((element, index) => {
        element.style.animationDelay = `${index * 0.2}s`;
    });
});