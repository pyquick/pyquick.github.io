// ja.js
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
        // 在这里添加下载逻辑
        alert('下载开始');
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('confirmBox').style.display = 'none'; // 确保确认框隐藏
    });
});