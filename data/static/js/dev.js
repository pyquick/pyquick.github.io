document.addEventListener('DOMContentLoaded', function() {
    let currentDownloadLink = null; // 新增变量存储当前点击的下载链接

    document.querySelectorAll('.version-box a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            currentDownloadLink = this.href; // 存储当前点击的链接
            document.getElementById('overlay').style.display = 'block';
            document.getElementById('confirmBox').style.display = 'block';
            
            fetch('./gpl3.txt')
                .then(response => response.text())
                .then(text => {
                    document.getElementById('gpl3Box').innerText = text;
                    document.getElementById('gpl3Box').scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                });
        });
    });

    document.getElementById('cancelBtn').addEventListener('click', function() {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('confirmBox').style.display = 'none';
        currentDownloadLink = null; // 清空存储的链接
    });

    document.getElementById('okBtn').addEventListener('click', function() {
        if(currentDownloadLink) {
            window.location.href = currentDownloadLink; // 使用存储的链接
        }
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('confirmBox').style.display = 'none';
        currentDownloadLink = null; // 下载完成后清空
    });

    document.querySelectorAll('.container > *').forEach((element, index) => {
        element.style.animationDelay = `${index * 0.2}s`;
    });
});
