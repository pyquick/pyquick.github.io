document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('overlay').style.display = 'block';
            document.getElementById('confirmBox').style.display = 'block'; // 确保确认框显示
        });
    });

    document.getElementById('cancelBtn').addEventListener('click', function() {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('confirmBox').style.display = 'none'; // 确保确认框隐藏
    });

    document.getElementById('okBtn').addEventListener('click', function() {
        alert('下载开始');
        // 获取当前点击的链接并触发下载
        const link = document.querySelector('a[href]');
        window.location.href = link.href;
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('confirmBox').style.display = 'none'; // 确保确认框隐藏
    });
});