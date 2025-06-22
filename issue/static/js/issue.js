// Listen for messages from giscus iframe
window.addEventListener('message', event => {
    if (event.origin !== 'https://giscus.app') return;

    const message = event.data;
    if (typeof message === 'object' && message.giscus === 'comment-created') {
        // Comment successfully posted
        showSuccessMessage('评论成功！感谢您的宝贵意见。');
    }
});

function showSuccessMessage(message) {
    let successMessageDiv = document.getElementById('success-message');
    if (!successMessageDiv) {
        successMessageDiv = document.createElement('div');
        successMessageDiv.id = 'success-message';
        document.body.appendChild(successMessageDiv);
    }

    successMessageDiv.textContent = message;
    successMessageDiv.style.display = 'block';
    successMessageDiv.style.opacity = '1';

    // Hide message after 3 seconds
    setTimeout(() => {
        successMessageDiv.style.opacity = '0';
        setTimeout(() => {
            successMessageDiv.style.display = 'none';
        }, 500); // Wait for fade out to complete
    }, 3000);
}

// Theme switching logic
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

// Check initial theme preference
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
if (systemPrefersDark.matches) {
    applyTheme('dark');
} else {
    applyTheme('light');
}

// Listen for changes in system theme preference
systemPrefersDark.addEventListener('change', event => {
    if (event.matches) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
});

// Category switching logic
document.addEventListener('DOMContentLoaded', () => {
    const categoryButtons = document.querySelectorAll('.category-button');
    const giscusScript = document.getElementById('giscus-script');
    const giscusContainer = document.querySelector('.giscus-container');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');

            const newCategory = button.dataset.category;
            const newCategoryId = button.dataset.categoryId;

            // Remove existing giscus iframe if any
            const existingIframe = giscusContainer.querySelector('iframe.giscus-frame');
            if (existingIframe) {
                existingIframe.remove();
            }

            // Re-render giscus with new category
            const script = document.createElement('script');
            script.src = 'https://giscus.app/client.js';
            script.setAttribute('data-repo', giscusScript.dataset.repo);
            script.setAttribute('data-repo-id', giscusScript.dataset.repoId);
            script.setAttribute('data-category', newCategory);
            script.setAttribute('data-category-id', newCategoryId);
            script.setAttribute('data-mapping', giscusScript.dataset.mapping);
            script.setAttribute('data-strict', giscusScript.dataset.strict);
            script.setAttribute('data-reactions-enabled', giscusScript.dataset.reactionsEnabled);
            script.setAttribute('data-emit-metadata', giscusScript.dataset.emitMetadata);
            script.setAttribute('data-input-position', giscusScript.dataset.inputPosition);
            script.setAttribute('data-theme', giscusScript.dataset.theme);
            script.setAttribute('data-lang', giscusScript.dataset.lang);
            script.setAttribute('crossorigin', giscusScript.crossOrigin);
            script.setAttribute('async', '');

            giscusContainer.appendChild(script);
        });
    });
}); 