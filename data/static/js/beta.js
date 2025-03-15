document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('overlay').style.display = 'block';
            document.getElementById('confirmBox').style.display = 'block';
            // 加载 GPL3 协议内容
            fetch('./gpl3.txt')
                .then(response => response.text())
                .then(text => {
                    document.getElementById('gpl3Box').innerText = text;
                });
        });
    });

    document.getElementById('cancelBtn').addEventListener('click', function() {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('confirmBox').style.display = 'none';
    });

    document.getElementById('okBtn').addEventListener('click', function() {
        const link = document.querySelector('a[href]');
        window.location.href = link.href;
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('confirmBox').style.display = 'none';
    });
});