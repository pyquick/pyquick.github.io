// 智能翻译系统 - 主应用脚本

// ===== 全局变量 =====
let currentTranslationMode = 'standard'; // 当前翻译模式: standard, smart, document
let currentSourceLanguage = 'auto'; // 当前源语言
let currentTargetLanguage = 'en'; // 当前目标语言
let isTranslating = false; // 是否正在翻译
let translationHistory = []; // 翻译历史
let favoriteTranslations = []; // 收藏的翻译
let currentSynonyms = []; // 当前近义词列表
let selectedSynonym = null; // 选择的近义词
let translationQuality = 0; // 翻译质量评分

// ===== DOM 元素 =====
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const sourceLanguageSelect = document.getElementById('source-language');
    const targetLanguageSelect = document.getElementById('target-language');
    const swapButton = document.getElementById('swap-languages');
    const sourceText = document.getElementById('source-text');
    const targetText = document.getElementById('target-text');
    const translateButton = document.getElementById('translate-button');
    const clearButton = document.getElementById('clear-button');
    const copyButton = document.getElementById('copy-button');
    const speakButton = document.getElementById('speak-button');
    const listenButton = document.getElementById('listen-button');
    const documentButton = document.getElementById('document-button');
    const settingsButton = document.getElementById('settings-button');
    const historyButton = document.getElementById('history-button');
    const favoritesButton = document.getElementById('favorites-button');
    const helpButton = document.getElementById('help-button');
    const themeToggle = document.getElementById('theme-toggle');
    
    const standardOption = document.getElementById('standard-option');
    const smartOption = document.getElementById('smart-option');
    const documentOption = document.getElementById('document-option');
    
    const historySidebar = document.getElementById('history-sidebar');
    const favoritesSidebar = document.getElementById('favorites-sidebar');
    const settingsModal = document.getElementById('settings-modal');
    const documentModal = document.getElementById('document-modal');
    const helpModal = document.getElementById('help-modal');
    
    const historyFilter = document.getElementById('history-filter');
    const favoritesFilter = document.getElementById('favorites-filter');
    
    const synonymSelector = document.getElementById('synonym-selector');
    const comparisonView = document.getElementById('comparison-view');
    const translationInfoPanel = document.getElementById('translation-info-panel');
    
    const translatingIndicator = document.getElementById('translating-indicator');
    const errorMessage = document.getElementById('error-message');
    const qualityStars = document.getElementById('quality-stars');
    const qualityScore = document.getElementById('quality-score');
    
    // 初始化应用
    initializeApp();
    
    // ===== 事件监听器 =====
    
    // 语言选择
    sourceLanguageSelect.addEventListener('change', function() {
        currentSourceLanguage = this.value;
        saveSettings();
    });
    
    targetLanguageSelect.addEventListener('change', function() {
        currentTargetLanguage = this.value;
        saveSettings();
    });
    
    // 交换语言
    swapButton.addEventListener('click', function() {
        swapLanguages();
    });
    
    // 文本输入
    sourceText.addEventListener('input', function() {
        updateCharCount();
        if (currentTranslationMode === 'smart' && this.value.trim() !== '') {
            // 智能模式下，自动检测近义词
            detectSynonyms(this.value);
        }
    });
    
    // 翻译按钮
    translateButton.addEventListener('click', function() {
        performTranslation();
    });
    
    // 清空按钮
    clearButton.addEventListener('click', function() {
        sourceText.value = '';
        targetText.value = '';
        updateCharCount();
        clearSynonyms();
        hideComparisonView();
        hideTranslationInfo();
    });
    
    // 复制按钮
    copyButton.addEventListener('click', function() {
        copyToClipboard(targetText.value);
    });
    
    // 朗读按钮
    speakButton.addEventListener('click', function() {
        speakText(targetText.value, currentTargetLanguage);
    });
    
    // 监听按钮
    listenButton.addEventListener('click', function() {
        startListening();
    });
    
    // 文档按钮
    documentButton.addEventListener('click', function() {
        openModal(documentModal);
    });
    
    // 设置按钮
    settingsButton.addEventListener('click', function() {
        openModal(settingsModal);
    });
    
    // 历史记录按钮
    historyButton.addEventListener('click', function() {
        toggleSidebar(historySidebar);
    });
    
    // 收藏夹按钮
    favoritesButton.addEventListener('click', function() {
        toggleSidebar(favoritesSidebar);
    });
    
    // 帮助按钮
    helpButton.addEventListener('click', function() {
        openModal(helpModal);
    });
    
    // 主题切换
    themeToggle.addEventListener('click', function() {
        toggleTheme();
    });
    
    // 翻译模式选择
    standardOption.addEventListener('click', function() {
        setTranslationMode('standard');
    });
    
    smartOption.addEventListener('click', function() {
        setTranslationMode('smart');
    });
    
    documentOption.addEventListener('click', function() {
        setTranslationMode('document');
    });
    
    // 历史记录和收藏夹过滤
    historyFilter.addEventListener('input', function() {
        filterHistory(this.value);
    });
    
    favoritesFilter.addEventListener('input', function() {
        filterFavorites(this.value);
    });
    
    // 模态框关闭按钮
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // 侧边栏关闭按钮
    document.querySelectorAll('.close-sidebar').forEach(button => {
        button.addEventListener('click', function() {
            const sidebar = this.closest('.sidebar');
            closeSidebar(sidebar);
        });
    });
    
    // 设置选项卡
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            showSettingsTab(tabId);
        });
    });
    
    // API服务选项卡
    document.querySelectorAll('.api-config-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            showApiConfigTab(tabId);
        });
    });
    
    // 翻译信息选项卡
    document.querySelectorAll('.info-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            showInfoTab(tabId);
        });
    });
    
    // 文档上传区域
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--primary-color)';
        this.style.backgroundColor = 'rgba(74, 108, 247, 0.05)';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--border-color)';
        this.style.backgroundColor = 'var(--bg-secondary)';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--border-color)';
        this.style.backgroundColor = 'var(--bg-secondary)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });
    
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            handleFileUpload(this.files[0]);
        }
    });
    
    // 设置表单提交
    document.getElementById('settings-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveSettings();
        closeModal(settingsModal);
        showNotification('设置已保存');
    });
    
    // API配置表单提交
    document.querySelectorAll('.api-config-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveApiConfig(this.getAttribute('data-service'));
            showNotification('API配置已保存');
        });
    });
    
    // 文档翻译表单提交
    document.getElementById('document-form').addEventListener('submit', function(e) {
        e.preventDefault();
        translateDocument();
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter: 翻译
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            performTranslation();
        }
        
        // Ctrl/Cmd + S: 交换语言
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            swapLanguages();
        }
        
        // Ctrl/Cmd + D: 清空文本
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            sourceText.value = '';
            targetText.value = '';
            updateCharCount();
            clearSynonyms();
            hideComparisonView();
            hideTranslationInfo();
        }
        
        // Escape: 关闭模态框和侧边栏
        if (e.key === 'Escape') {
            closeModal(settingsModal);
            closeModal(documentModal);
            closeModal(helpModal);
            closeSidebar(historySidebar);
            closeSidebar(favoritesSidebar);
        }
    });
    
    // 窗口大小改变时的处理
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            closeSidebar(historySidebar);
            closeSidebar(favoritesSidebar);
        }
    });
});

// ===== 初始化应用 =====
function initializeApp() {
    // 加载设置
    loadSettings();
    
    // 加载翻译历史和收藏
    loadTranslationHistory();
    loadFavoriteTranslations();
    
    // 更新字符计数
    updateCharCount();
    
    // 检查API状态
    checkApiStatus();
    
    // 初始化主题
    initializeTheme();
    
    // 初始化翻译模式
    setTranslationMode(currentTranslationMode);
    
    // 初始化语言选择器
    initializeLanguageSelectors();
    
    // 初始化设置选项卡
    showSettingsTab('interface');
    
    // 初始化API配置选项卡
    showApiConfigTab('baidu');
    
    // 初始化翻译信息选项卡
    showInfoTab('dictionary');
    
    // 初始化语音识别
    initializeSpeechRecognition();
}

// ===== 翻译功能 =====
function performTranslation() {
    const sourceText = document.getElementById('source-text').value.trim();
    
    if (sourceText === '') {
        showNotification('请输入要翻译的文本');
        return;
    }
    
    if (isTranslating) {
        return;
    }
    
    isTranslating = true;
    showTranslatingIndicator();
    hideErrorMessage();
    
    const sourceLanguage = document.getElementById('source-language').value;
    const targetLanguage = document.getElementById('target-language').value;
    
    // 根据翻译模式调用不同的翻译方法
    switch (currentTranslationMode) {
        case 'standard':
            standardTranslation(sourceText, sourceLanguage, targetLanguage);
            break;
        case 'smart':
            smartTranslation(sourceText, sourceLanguage, targetLanguage);
            break;
        case 'document':
            documentTranslation(sourceText, sourceLanguage, targetLanguage);
            break;
    }
}

function standardTranslation(text, sourceLang, targetLang) {
    // 调用本地翻译服务
    try {
        const result = translate(text, sourceLang, targetLang);
        
        if (result.success) {
            displayTranslation(result.translation);
            addToHistory(text, result.translation, sourceLang, targetLang);
            evaluateTranslationQuality(text, result.translation);
        } else {
            showErrorMessage(result.error || '翻译失败，请重试');
        }
    } catch (error) {
        console.error('翻译错误:', error);
        showErrorMessage('翻译服务出错，请重试');
    } finally {
        isTranslating = false;
        hideTranslatingIndicator();
    }
}

function smartTranslation(text, sourceLang, targetLang) {
    // 智能翻译，考虑上下文和近义词
    try {
        // 如果选择了近义词，使用选择的近义词进行翻译
        let processedText = text;
        if (selectedSynonym) {
            processedText = replaceWithSynonym(text, selectedSynonym);
        }
        
        const result = translate(processedText, sourceLang, targetLang);
        
        if (result.success) {
            displayTranslation(result.translation);
            addToHistory(text, result.translation, sourceLang, targetLang);
            evaluateTranslationQuality(text, result.translation);
            
            // 显示对比视图
            if (currentSynonyms.length > 0) {
                showComparisonView(text, processedText, result.translation);
            }
        } else {
            showErrorMessage(result.error || '翻译失败，请重试');
        }
    } catch (error) {
        console.error('智能翻译错误:', error);
        showErrorMessage('翻译服务出错，请重试');
    } finally {
        isTranslating = false;
        hideTranslatingIndicator();
    }
}

function documentTranslation(text, sourceLang, targetLang) {
    // 文档翻译，保持格式和结构
    try {
        const result = translate(text, sourceLang, targetLang);
        
        if (result.success) {
            displayTranslation(result.translation);
            addToHistory(text, result.translation, sourceLang, targetLang);
            evaluateTranslationQuality(text, result.translation);
        } else {
            showErrorMessage(result.error || '翻译失败，请重试');
        }
    } catch (error) {
        console.error('文档翻译错误:', error);
        showErrorMessage('翻译服务出错，请重试');
    } finally {
        isTranslating = false;
        hideTranslatingIndicator();
    }
}

function displayTranslation(translation) {
    const targetText = document.getElementById('target-text');
    targetText.value = translation;
    
    // 显示翻译信息
    showTranslationInfo(translation);
}

// ===== 近义词功能 =====
function detectSynonyms(text) {
    // 检测文本中的关键词，并提供近义词建议
    // 这里使用简化的逻辑，实际应用中可以使用更复杂的NLP技术
    
    // 清空之前的近义词
    clearSynonyms();
    
    // 简单的关键词检测（实际应用中应该使用更复杂的算法）
    const keywords = extractKeywords(text);
    
    if (keywords.length === 0) {
        hideSynonymSelector();
        return;
    }
    
    // 获取近义词
    const synonyms = getSynonymsForKeywords(keywords);
    
    if (synonyms.length > 0) {
        currentSynonyms = synonyms;
        showSynonymSelector(synonyms);
    } else {
        hideSynonymSelector();
    }
}

function extractKeywords(text) {
    // 简单的关键词提取算法
    // 实际应用中应该使用更复杂的NLP技术
    
    // 移除标点符号和常见停用词
    const cleanText = text.replace(/[^\w\s]/g, ' ').toLowerCase();
    const words = cleanText.split(/\s+/).filter(word => 
        word.length > 2 && 
        !isStopWord(word)
    );
    
    // 计算词频
    const wordFreq = {};
    words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    // 按词频排序，取前3个
    const sortedWords = Object.keys(wordFreq).sort((a, b) => wordFreq[b] - wordFreq[a]);
    return sortedWords.slice(0, 3);
}

function isStopWord(word) {
    // 常见停用词列表
    const stopWords = [
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
        '的', '了', '和', '是', '在', '有', '我', '你', '他', '她', '它', '这', '那', '一个', '一些'
    ];
    
    return stopWords.includes(word);
}

function getSynonymsForKeywords(keywords) {
    // 获取关键词的近义词
    // 这里使用简化的逻辑，实际应用中可以使用同义词词典或API
    
    const synonyms = [];
    
    keywords.forEach(keyword => {
        const keywordSynonyms = getSynonyms(keyword);
        if (keywordSynonyms.length > 0) {
            synonyms.push({
                original: keyword,
                options: keywordSynonyms
            });
        }
    });
    
    return synonyms;
}

function getSynonyms(word) {
    // 获取单个词的近义词
    // 这里使用简化的逻辑，实际应用中可以使用同义词词典或API
    
    // 简单的同义词映射（实际应用中应该使用更完整的词典）
    const synonymMap = {
        'happy': ['joyful', 'cheerful', 'delighted', 'pleased', 'content'],
        'sad': ['unhappy', 'sorrowful', 'gloomy', 'miserable', 'depressed'],
        'good': ['excellent', 'great', 'wonderful', 'fantastic', 'superb'],
        'bad': ['poor', 'terrible', 'awful', 'horrible', 'dreadful'],
        'big': ['large', 'huge', 'enormous', 'massive', 'immense'],
        'small': ['tiny', 'little', 'miniature', 'compact', 'minute'],
        'fast': ['quick', 'rapid', 'swift', 'speedy', 'hasty'],
        'slow': ['sluggish', 'leisurely', 'gradual', 'unhurried', 'delayed'],
        'beautiful': ['attractive', 'pretty', 'lovely', 'gorgeous', 'stunning'],
        'ugly': ['unattractive', 'hideous', 'unsightly', 'unpleasant', 'repulsive'],
        '快乐': ['高兴', '愉快', '开心', '欢喜', '愉悦'],
        '悲伤': ['伤心', '难过', '哀伤', '悲痛', '忧伤'],
        '好': ['优秀', '良好', '棒', '不错', '很好'],
        '坏': ['差', '糟糕', '不好', '劣质', '恶劣'],
        '大': ['巨大', '庞大', '宽广', '高大', '宏大的'],
        '小': ['微小', '细小', '迷你', '紧凑', '微型的'],
        '快': ['迅速', '快速', '飞快', '急速', '神速'],
        '慢': ['缓慢', '迟缓', '徐徐', '慢慢', '迟钝'],
        '美丽': ['漂亮', '好看', '优美', '秀丽', '好看']
    };
    
    return synonymMap[word.toLowerCase()] || [];
}

function showSynonymSelector(synonyms) {
    const synonymSelector = document.getElementById('synonym-selector');
    const synonymOptions = document.getElementById('synonym-options');
    
    // 清空之前的选项
    synonymOptions.innerHTML = '';
    
    // 添加近义词选项
    synonyms.forEach(synonymGroup => {
        const groupTitle = document.createElement('div');
        groupTitle.className = 'synonym-group-title';
        groupTitle.textContent = `"${synonymGroup.original}" 的近义词:`;
        synonymOptions.appendChild(groupTitle);
        
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'synonym-options';
        
        // 添加"使用原词"选项
        const originalOption = document.createElement('div');
        originalOption.className = 'synonym-option';
        originalOption.textContent = synonymGroup.original;
        originalOption.addEventListener('click', function() {
            selectSynonym(synonymGroup.original, synonymGroup.original);
        });
        optionsContainer.appendChild(originalOption);
        
        // 添加近义词选项
        synonymGroup.options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'synonym-option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', function() {
                selectSynonym(synonymGroup.original, option);
            });
            optionsContainer.appendChild(optionElement);
        });
        
        synonymOptions.appendChild(optionsContainer);
    });
    
    // 显示近义词选择器
    synonymSelector.style.display = 'block';
}

function hideSynonymSelector() {
    const synonymSelector = document.getElementById('synonym-selector');
    synonymSelector.style.display = 'none';
}

function clearSynonyms() {
    currentSynonyms = [];
    selectedSynonym = null;
    hideSynonymSelector();
}

function selectSynonym(originalWord, synonym) {
    selectedSynonym = {
        original: originalWord,
        synonym: synonym
    };
    
    // 高亮选择的选项
    document.querySelectorAll('.synonym-option').forEach(option => {
        if (option.textContent === synonym) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
    
    // 如果文本不为空，自动重新翻译
    const sourceText = document.getElementById('source-text').value.trim();
    if (sourceText !== '') {
        performTranslation();
    }
}

function replaceWithSynonym(text, synonymInfo) {
    // 替换文本中的词为选择的近义词
    const regex = new RegExp(`\\b${synonymInfo.original}\\b`, 'gi');
    return text.replace(regex, synonymInfo.synonym);
}

// ===== 对比视图功能 =====
function showComparisonView(originalText, modifiedText, translation) {
    const comparisonView = document.getElementById('comparison-view');
    const comparisonContent = document.getElementById('comparison-content');
    
    // 清空之前的内容
    comparisonContent.innerHTML = '';
    
    // 添加原始文本翻译
    const originalTranslation = document.createElement('div');
    originalTranslation.className = 'translation-option';
    originalTranslation.innerHTML = `
        <div class="option-header">
            <div class="option-title">原始翻译</div>
            <button class="use-translation" data-translation="${translation}">使用此翻译</button>
        </div>
        <div class="option-content">${translation}</div>
    `;
    comparisonContent.appendChild(originalTranslation);
    
    // 如果修改了文本，添加修改后的翻译
    if (modifiedText !== originalText) {
        try {
            const modifiedResult = translate(modifiedText, currentSourceLanguage, currentTargetLanguage);
            
            if (modifiedResult.success) {
                const modifiedTranslation = document.createElement('div');
                modifiedTranslation.className = 'translation-option';
                modifiedTranslation.innerHTML = `
                    <div class="option-header">
                        <div class="option-title">近义词翻译</div>
                        <button class="use-translation" data-translation="${modifiedResult.translation}">使用此翻译</button>
                    </div>
                    <div class="option-content">${modifiedResult.translation}</div>
                `;
                comparisonContent.appendChild(modifiedTranslation);
            }
        } catch (error) {
            console.error('获取近义词翻译失败:', error);
        }
    }
    
    // 添加使用翻译按钮的事件监听器
    document.querySelectorAll('.use-translation').forEach(button => {
        button.addEventListener('click', function() {
            const translation = this.getAttribute('data-translation');
            document.getElementById('target-text').value = translation;
            showNotification('已应用选择的翻译');
        });
    });
    
    // 显示对比视图
    comparisonView.style.display = 'block';
}

function hideComparisonView() {
    const comparisonView = document.getElementById('comparison-view');
    comparisonView.style.display = 'none';
}

// ===== 翻译信息面板功能 =====
function showTranslationInfo(translation) {
    const translationInfoPanel = document.getElementById('translation-info-panel');
    
    // 显示翻译信息面板
    translationInfoPanel.style.display = 'block';
    
    // 更新词典信息
    updateDictionaryInfo(translation);
    
    // 更新语法信息
    updateGrammarInfo(translation);
    
    // 更新上下文信息
    updateContextInfo(translation);
}

function hideTranslationInfo() {
    const translationInfoPanel = document.getElementById('translation-info-panel');
    translationInfoPanel.style.display = 'none';
}

function updateDictionaryInfo(translation) {
    // 更新词典信息
    // 这里使用简化的逻辑，实际应用中可以调用词典API
    
    const dictionaryPronunciation = document.getElementById('dictionary-pronunciation');
    const dictionaryDefinitions = document.getElementById('dictionary-definitions');
    
    // 清空之前的内容
    dictionaryPronunciation.textContent = '';
    dictionaryDefinitions.innerHTML = '';
    
    // 获取翻译中的关键词
    const keywords = extractKeywords(translation);
    
    if (keywords.length > 0) {
        const keyword = keywords[0];
        
        // 显示发音（模拟）
        dictionaryPronunciation.textContent = `/${keyword}/`;
        
        // 显示定义（模拟）
        const definitions = getDefinitions(keyword);
        definitions.forEach(definition => {
            const p = document.createElement('p');
            p.textContent = definition;
            dictionaryDefinitions.appendChild(p);
        });
    }
}

function getDefinitions(word) {
    // 获取单词的定义
    // 这里使用简化的逻辑，实际应用中可以调用词典API
    
    // 简单的定义映射（实际应用中应该使用更完整的词典）
    const definitionMap = {
        'happy': 'feeling or showing pleasure or contentment.',
        'sad': 'feeling or showing sorrow; unhappy.',
        'good': 'to be desired or approved of; having the qualities required for a particular role.',
        'bad': 'of poor quality; a low standard or level.',
        'big': 'of considerable size or extent.',
        'small': 'of a size that is less than normal or usual.',
        'fast': 'moving or capable of moving at high speed.',
        'slow': 'moving or operating at low speed.',
        'beautiful': 'pleasing the senses or mind aesthetically.',
        'ugly': 'unpleasant or repulsive, especially in appearance.',
        '快乐': '感到高兴或满足的情绪状态。',
        '悲伤': '感到伤心或不愉快的情绪状态。',
        '好': '令人满意的；具有特定角色所需的质量。',
        '坏': '质量差的；低于标准或水平。',
        '大': '相当大的尺寸或范围。',
        '小': '小于正常或通常的尺寸。',
        '快': '能够或正在高速移动。',
        '慢': '以低速移动或运行。',
        '美丽': '在美学上令人愉悦的。'
    };
    
    return definitionMap[word.toLowerCase()] ? [definitionMap[word.toLowerCase()]] : ['暂无定义'];
}

function updateGrammarInfo(translation) {
    // 更新语法信息
    // 这里使用简化的逻辑，实际应用中可以使用更复杂的NLP技术
    
    const grammarInfo = document.getElementById('grammar-info');
    
    // 清空之前的内容
    grammarInfo.innerHTML = '';
    
    // 分析句子结构（模拟）
    const sentences = translation.split(/[.!?]+/).filter(s => s.trim() !== '');
    
    if (sentences.length > 0) {
        const h4 = document.createElement('h4');
        h4.textContent = '句子结构';
        grammarInfo.appendChild(h4);
        
        const p = document.createElement('p');
        p.textContent = `此翻译包含 ${sentences.length} 个句子。`;
        grammarInfo.appendChild(p);
        
        // 分析词性（模拟）
        const words = translation.split(/\s+/);
        const nouns = words.filter(word => isNoun(word)).length;
        const verbs = words.filter(word => isVerb(word)).length;
        const adjectives = words.filter(word => isAdjective(word)).length;
        
        const p2 = document.createElement('p');
        p2.textContent = `名词: ${nouns}, 动词: ${verbs}, 形容词: ${adjectives}`;
        grammarInfo.appendChild(p2);
    }
}

function isNoun(word) {
    // 简单的名词检测（实际应用中应该使用更复杂的NLP技术）
    const nounSuffixes = ['tion', 'sion', 'ment', 'ness', 'ity', 'er', 'or', 'ist', 'ism', 
                          '的', '子', '性', '度', '员', '家', '者', '主义'];
    
    return nounSuffixes.some(suffix => word.toLowerCase().endsWith(suffix));
}

function isVerb(word) {
    // 简单的动词检测（实际应用中应该使用更复杂的NLP技术）
    const verbSuffixes = ['ing', 'ed', 'en', 'es', 's', 
                         '了', '着', '过', '化'];
    
    return verbSuffixes.some(suffix => word.toLowerCase().endsWith(suffix));
}

function isAdjective(word) {
    // 简单的形容词检测（实际应用中应该使用更复杂的NLP技术）
    const adjectiveSuffixes = ['ful', 'less', 'ous', 'ive', 'able', 'ible', 'al', 'ial', 
                              '的', '性', '样'];
    
    return adjectiveSuffixes.some(suffix => word.toLowerCase().endsWith(suffix));
}

function updateContextInfo(translation) {
    // 更新上下文信息
    // 这里使用简化的逻辑，实际应用中可以使用更复杂的NLP技术
    
    const contextInfo = document.getElementById('context-info');
    
    // 清空之前的内容
    contextInfo.innerHTML = '';
    
    // 分析语境（模拟）
    const h4 = document.createElement('h4');
    h4.textContent = '语境分析';
    contextInfo.appendChild(h4);
    
    const p = document.createElement('p');
    p.textContent = '此翻译基于标准语境，适用于一般交流场景。';
    contextInfo.appendChild(p);
    
    // 分析语域（模拟）
    const formality = analyzeFormality(translation);
    const p2 = document.createElement('p');
    p2.textContent = `语域: ${formality}`;
    contextInfo.appendChild(p2);
}

function analyzeFormality(text) {
    // 分析文本的正式程度（模拟）
    // 这里使用简化的逻辑，实际应用中可以使用更复杂的NLP技术
    
    const formalWords = ['therefore', 'however', 'consequently', 'furthermore', 'nevertheless',
                        '因此', '然而', '所以', '此外', '不过'];
    const informalWords = ['hey', 'yeah', 'okay', 'cool', 'awesome',
                          '嘿', '好的', '嗯', '不错', '很棒'];
    
    const words = text.toLowerCase().split(/\s+/);
    const formalCount = words.filter(word => formalWords.includes(word)).length;
    const informalCount = words.filter(word => informalWords.includes(word)).length;
    
    if (formalCount > informalCount) {
        return '正式';
    } else if (informalCount > formalCount) {
        return '非正式';
    } else {
        return '中性';
    }
}

// ===== 翻译质量评估 =====
function evaluateTranslationQuality(sourceText, translation) {
    // 评估翻译质量
    // 这里使用简化的逻辑，实际应用中可以使用更复杂的算法
    
    let quality = 50; // 基础分数
    
    // 基于长度比例调整分数
    const lengthRatio = translation.length / sourceText.length;
    if (lengthRatio >= 0.8 && lengthRatio <= 1.2) {
        quality += 20;
    } else if (lengthRatio >= 0.6 && lengthRatio <= 1.4) {
        quality += 10;
    }
    
    // 基于句子结构调整分数
    const sourceSentences = sourceText.split(/[.!?]+/).filter(s => s.trim() !== '').length;
    const translationSentences = translation.split(/[.!?]+/).filter(s => s.trim() !== '').length;
    
    if (sourceSentences === translationSentences) {
        quality += 15;
    } else if (Math.abs(sourceSentences - translationSentences) <= 1) {
        quality += 5;
    }
    
    // 基于词汇多样性调整分数
    const sourceWords = new Set(sourceText.toLowerCase().split(/\s+/).filter(w => w.length > 2));
    const translationWords = new Set(translation.toLowerCase().split(/\s+/).filter(w => w.length > 2));
    
    if (translationWords.size >= sourceWords.size * 0.8) {
        quality += 15;
    }
    
    // 确保分数在0-100之间
    quality = Math.max(0, Math.min(100, quality));
    
    translationQuality = quality;
    updateQualityIndicator(quality);
}

function updateQualityIndicator(quality) {
    const qualityStars = document.getElementById('quality-stars');
    const qualityScore = document.getElementById('quality-score');
    
    // 更新星级
    const stars = Math.ceil(quality / 20);
    qualityStars.innerHTML = '';
    
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.textContent = i <= stars ? '★' : '☆';
        qualityStars.appendChild(star);
    }
    
    // 更新分数
    qualityScore.textContent = `${quality}/100`;
    
    // 根据质量设置颜色
    if (quality >= 80) {
        qualityStars.style.color = 'var(--success-color)';
    } else if (quality >= 60) {
        qualityStars.style.color = 'var(--warning-color)';
    } else {
        qualityStars.style.color = 'var(--danger-color)';
    }
}

// ===== 历史记录和收藏功能 =====
function addToHistory(sourceText, translation, sourceLang, targetLang) {
    const historyItem = {
        id: Date.now(),
        sourceText,
        translation,
        sourceLang,
        targetLang,
        timestamp: new Date().toISOString()
    };
    
    translationHistory.unshift(historyItem);
    
    // 限制历史记录数量
    if (translationHistory.length > 50) {
        translationHistory = translationHistory.slice(0, 50);
    }
    
    saveTranslationHistory();
    updateHistoryDisplay();
}

function addToFavorites(sourceText, translation, sourceLang, targetLang) {
    const favoriteItem = {
        id: Date.now(),
        sourceText,
        translation,
        sourceLang,
        targetLang,
        timestamp: new Date().toISOString()
    };
    
    favoriteTranslations.unshift(favoriteItem);
    
    saveFavoriteTranslations();
    updateFavoritesDisplay();
    showNotification('已添加到收藏夹');
}

function removeFromFavorites(id) {
    favoriteTranslations = favoriteTranslations.filter(item => item.id !== id);
    saveFavoriteTranslations();
    updateFavoritesDisplay();
    showNotification('已从收藏夹移除');
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    
    // 清空之前的内容
    historyList.innerHTML = '';
    
    if (translationHistory.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = '暂无翻译历史';
        historyList.appendChild(emptyMessage);
        return;
    }
    
    // 添加历史记录项
    translationHistory.forEach(item => {
        const historyItem = createHistoryItem(item);
        historyList.appendChild(historyItem);
    });
}

function updateFavoritesDisplay() {
    const favoritesList = document.getElementById('favorites-list');
    
    // 清空之前的内容
    favoritesList.innerHTML = '';
    
    if (favoriteTranslations.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = '暂无收藏的翻译';
        favoritesList.appendChild(emptyMessage);
        return;
    }
    
    // 添加收藏项
    favoriteTranslations.forEach(item => {
        const favoriteItem = createFavoriteItem(item);
        favoritesList.appendChild(favoriteItem);
    });
}

function createHistoryItem(item) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const date = new Date(item.timestamp);
    const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    
    historyItem.innerHTML = `
        <div class="history-item-header">
            <div class="history-item-date">${dateStr}</div>
            <button class="icon-button favorite-button" title="添加到收藏夹">
                <span>☆</span>
            </button>
        </div>
        <div class="history-item-text">${item.sourceText}</div>
        <div class="history-item-translation">${item.translation}</div>
    `;
    
    // 点击历史记录项，填充到翻译区域
    historyItem.addEventListener('click', function(e) {
        if (!e.target.closest('.favorite-button')) {
            document.getElementById('source-text').value = item.sourceText;
            document.getElementById('target-text').value = item.translation;
            document.getElementById('source-language').value = item.sourceLang;
            document.getElementById('target-language').value = item.targetLang;
            updateCharCount();
            closeSidebar(document.getElementById('history-sidebar'));
        }
    });
    
    // 添加到收藏夹按钮
    const favoriteButton = historyItem.querySelector('.favorite-button');
    favoriteButton.addEventListener('click', function(e) {
        e.stopPropagation();
        addToFavorites(item.sourceText, item.translation, item.sourceLang, item.targetLang);
    });
    
    return historyItem;
}

function createFavoriteItem(item) {
    const favoriteItem = document.createElement('div');
    favoriteItem.className = 'favorite-item';
    
    const date = new Date(item.timestamp);
    const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    
    favoriteItem.innerHTML = `
        <div class="favorite-item-header">
            <div class="favorite-item-date">${dateStr}</div>
            <button class="icon-button remove-favorite-button" title="从收藏夹移除">
                <span>×</span>
            </button>
        </div>
        <div class="favorite-item-text">${item.sourceText}</div>
        <div class="favorite-item-translation">${item.translation}</div>
    `;
    
    // 点击收藏项，填充到翻译区域
    favoriteItem.addEventListener('click', function(e) {
        if (!e.target.closest('.remove-favorite-button')) {
            document.getElementById('source-text').value = item.sourceText;
            document.getElementById('target-text').value = item.translation;
            document.getElementById('source-language').value = item.sourceLang;
            document.getElementById('target-language').value = item.targetLang;
            updateCharCount();
            closeSidebar(document.getElementById('favorites-sidebar'));
        }
    });
    
    // 从收藏夹移除按钮
    const removeButton = favoriteItem.querySelector('.remove-favorite-button');
    removeButton.addEventListener('click', function(e) {
        e.stopPropagation();
        removeFromFavorites(item.id);
    });
    
    return favoriteItem;
}

function filterHistory(query) {
    const historyItems = document.querySelectorAll('.history-item');
    
    historyItems.forEach(item => {
        const text = item.querySelector('.history-item-text').textContent.toLowerCase();
        const translation = item.querySelector('.history-item-translation').textContent.toLowerCase();
        
        if (text.includes(query.toLowerCase()) || translation.includes(query.toLowerCase())) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function filterFavorites(query) {
    const favoriteItems = document.querySelectorAll('.favorite-item');
    
    favoriteItems.forEach(item => {
        const text = item.querySelector('.favorite-item-text').textContent.toLowerCase();
        const translation = item.querySelector('.favorite-item-translation').textContent.toLowerCase();
        
        if (text.includes(query.toLowerCase()) || translation.includes(query.toLowerCase())) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// ===== 设置和配置功能 =====
function loadSettings() {
    // 从本地存储加载设置
    const settings = localStorage.getItem('translationSettings');
    
    if (settings) {
        try {
            const parsedSettings = JSON.parse(settings);
            
            // 应用设置
            currentTranslationMode = parsedSettings.translationMode || 'standard';
            currentSourceLanguage = parsedSettings.sourceLanguage || 'auto';
            currentTargetLanguage = parsedSettings.targetLanguage || 'en';
            
            // 更新UI
            document.getElementById('source-language').value = currentSourceLanguage;
            document.getElementById('target-language').value = currentTargetLanguage;
            
            // 应用界面设置
            if (parsedSettings.theme) {
                document.body.className = parsedSettings.theme;
            }
            
            if (parsedSettings.fontSize) {
                document.body.style.fontSize = parsedSettings.fontSize;
            }
            
            // 应用翻译选项
            if (parsedSettings.autoTranslate !== undefined) {
                document.getElementById('auto-translate').checked = parsedSettings.autoTranslate;
            }
            
            if (parsedSettings.copyOnTranslate !== undefined) {
                document.getElementById('copy-on-translate').checked = parsedSettings.copyOnTranslate;
            }
            
            if (parsedSettings.showComparison !== undefined) {
                document.getElementById('show-comparison').checked = parsedSettings.showComparison;
            }
            
            // 应用API配置
            if (parsedSettings.apiServices) {
                Object.keys(parsedSettings.apiServices).forEach(service => {
                    const config = parsedSettings.apiServices[service];
                    if (config.enabled !== undefined) {
                        document.getElementById(`${service}-enabled`).checked = config.enabled;
                    }
                    if (config.apiKey) {
                        document.getElementById(`${service}-api-key`).value = config.apiKey;
                    }
                    if (config.apiSecret) {
                        document.getElementById(`${service}-api-secret`).value = config.apiSecret;
                    }
                    if (config.appId) {
                        document.getElementById(`${service}-app-id`).value = config.appId;
                    }
                });
            }
            
            // 设置当前API服务
            if (parsedSettings.currentApiService) {
                document.getElementById('current-api-service').textContent = parsedSettings.currentApiService;
            }
        } catch (error) {
            console.error('加载设置失败:', error);
        }
    }
}

function saveSettings() {
    // 保存设置到本地存储
    const settings = {
        translationMode: currentTranslationMode,
        sourceLanguage: currentSourceLanguage,
        targetLanguage: currentTargetLanguage,
        theme: document.body.className,
        fontSize: document.body.style.fontSize,
        autoTranslate: document.getElementById('auto-translate').checked,
        copyOnTranslate: document.getElementById('copy-on-translate').checked,
        showComparison: document.getElementById('show-comparison').checked,
        apiServices: {
            baidu: {
                enabled: document.getElementById('baidu-enabled').checked,
                appId: document.getElementById('baidu-app-id').value,
                apiKey: document.getElementById('baidu-api-key').value,
                apiSecret: document.getElementById('baidu-api-secret').value
            },
            youdao: {
                enabled: document.getElementById('youdao-enabled').checked,
                appId: document.getElementById('youdao-app-id').value,
                apiKey: document.getElementById('youdao-api-key').value,
                apiSecret: document.getElementById('youdao-api-secret').value
            },
            google: {
                enabled: document.getElementById('google-enabled').checked,
                apiKey: document.getElementById('google-api-key').value
            },
            local: {
                enabled: document.getElementById('local-enabled').checked
            }
        },
        currentApiService: document.getElementById('current-api-service').textContent
    };
    
    localStorage.setItem('translationSettings', JSON.stringify(settings));
}

function saveApiConfig(service) {
    // 保存特定API服务的配置
    const settings = JSON.parse(localStorage.getItem('translationSettings') || '{}');
    
    if (!settings.apiServices) {
        settings.apiServices = {};
    }
    
    if (!settings.apiServices[service]) {
        settings.apiServices[service] = {};
    }
    
    switch (service) {
        case 'baidu':
            settings.apiServices.baidu = {
                enabled: document.getElementById('baidu-enabled').checked,
                appId: document.getElementById('baidu-app-id').value,
                apiKey: document.getElementById('baidu-api-key').value,
                apiSecret: document.getElementById('baidu-api-secret').value
            };
            break;
        case 'youdao':
            settings.apiServices.youdao = {
                enabled: document.getElementById('youdao-enabled').checked,
                appId: document.getElementById('youdao-app-id').value,
                apiKey: document.getElementById('youdao-api-key').value,
                apiSecret: document.getElementById('youdao-api-secret').value
            };
            break;
        case 'google':
            settings.apiServices.google = {
                enabled: document.getElementById('google-enabled').checked,
                apiKey: document.getElementById('google-api-key').value
            };
            break;
        case 'local':
            settings.apiServices.local = {
                enabled: document.getElementById('local-enabled').checked
            };
            break;
    }
    
    localStorage.setItem('translationSettings', JSON.stringify(settings));
}

function loadTranslationHistory() {
    // 从本地存储加载翻译历史
    const history = localStorage.getItem('translationHistory');
    
    if (history) {
        try {
            translationHistory = JSON.parse(history);
            updateHistoryDisplay();
        } catch (error) {
            console.error('加载翻译历史失败:', error);
            translationHistory = [];
        }
    }
}

function saveTranslationHistory() {
    // 保存翻译历史到本地存储
    localStorage.setItem('translationHistory', JSON.stringify(translationHistory));
}

function loadFavoriteTranslations() {
    // 从本地存储加载收藏的翻译
    const favorites = localStorage.getItem('favoriteTranslations');
    
    if (favorites) {
        try {
            favoriteTranslations = JSON.parse(favorites);
            updateFavoritesDisplay();
        } catch (error) {
            console.error('加载收藏翻译失败:', error);
            favoriteTranslations = [];
        }
    }
}

function saveFavoriteTranslations() {
    // 保存收藏的翻译到本地存储
    localStorage.setItem('favoriteTranslations', JSON.stringify(favoriteTranslations));
}

// ===== UI 辅助功能 =====
function updateCharCount() {
    const sourceText = document.getElementById('source-text');
    const charCount = document.getElementById('char-count');
    
    charCount.textContent = sourceText.value.length;
}

function showTranslatingIndicator() {
    const translatingIndicator = document.getElementById('translating-indicator');
    translatingIndicator.style.display = 'flex';
}

function hideTranslatingIndicator() {
    const translatingIndicator = document.getElementById('translating-indicator');
    translatingIndicator.style.display = 'none';
}

function showErrorMessage(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideErrorMessage() {
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'none';
}

function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 3秒后隐藏通知
    setTimeout(() => {
        notification.classList.remove('show');
        
        // 动画结束后移除元素
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function swapLanguages() {
    const sourceLanguageSelect = document.getElementById('source-language');
    const targetLanguageSelect = document.getElementById('target-language');
    const sourceText = document.getElementById('source-text');
    const targetText = document.getElementById('target-text');
    
    // 交换语言选择
    const tempLanguage = sourceLanguageSelect.value;
    sourceLanguageSelect.value = targetLanguageSelect.value;
    targetLanguageSelect.value = tempLanguage === 'auto' ? 'zh' : tempLanguage;
    
    // 交换文本
    const tempText = sourceText.value;
    sourceText.value = targetText.value;
    targetText.value = tempText;
    
    // 更新当前语言变量
    currentSourceLanguage = sourceLanguageSelect.value;
    currentTargetLanguage = targetLanguageSelect.value;
    
    // 更新字符计数
    updateCharCount();
    
    // 保存设置
    saveSettings();
}

function setTranslationMode(mode) {
    currentTranslationMode = mode;
    
    // 更新UI
    document.querySelectorAll('.option-button').forEach(button => {
        button.classList.remove('active');
    });
    
    switch (mode) {
        case 'standard':
            document.getElementById('standard-option').classList.add('active');
            hideSynonymSelector();
            hideComparisonView();
            break;
        case 'smart':
            document.getElementById('smart-option').classList.add('active');
            // 如果有文本，检测近义词
            const sourceText = document.getElementById('source-text').value.trim();
            if (sourceText !== '') {
                detectSynonyms(sourceText);
            }
            break;
        case 'document':
            document.getElementById('document-option').classList.add('active');
            hideSynonymSelector();
            hideComparisonView();
            break;
    }
    
    // 保存设置
    saveSettings();
}

function initializeLanguageSelectors() {
    // 初始化语言选择器
    const sourceLanguageSelect = document.getElementById('source-language');
    const targetLanguageSelect = document.getElementById('target-language');
    
    // 语言列表
    const languages = [
        { code: 'auto', name: '自动检测' },
        { code: 'zh', name: '中文' },
        { code: 'en', name: '英语' },
        { code: 'ja', name: '日语' },
        { code: 'ko', name: '韩语' },
        { code: 'fr', name: '法语' },
        { code: 'de', name: '德语' },
        { code: 'es', name: '西班牙语' },
        { code: 'ru', name: '俄语' },
        { code: 'pt', name: '葡萄牙语' },
        { code: 'it', name: '意大利语' },
        { code: 'ar', name: '阿拉伯语' },
        { code: 'hi', name: '印地语' },
        { code: 'th', name: '泰语' },
        { code: 'vi', name: '越南语' }
    ];
    
    // 填充语言选择器
    languages.forEach(lang => {
        const sourceOption = document.createElement('option');
        sourceOption.value = lang.code;
        sourceOption.textContent = lang.name;
        sourceLanguageSelect.appendChild(sourceOption);
        
        const targetOption = document.createElement('option');
        targetOption.value = lang.code;
        targetOption.textContent = lang.name;
        targetLanguageSelect.appendChild(targetOption);
    });
    
    // 设置默认值
    sourceLanguageSelect.value = currentSourceLanguage;
    targetLanguageSelect.value = currentTargetLanguage;
}

function showSettingsTab(tabId) {
    // 显示指定的设置选项卡
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.settings-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    document.querySelector(`.settings-tab[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`${tabId}-settings`).classList.add('active');
}

function showApiConfigTab(tabId) {
    // 显示指定的API配置选项卡
    document.querySelectorAll('.api-config-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.api-service-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    document.querySelector(`.api-config-tab[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`${tabId}-config`).classList.add('active');
}

function showInfoTab(tabId) {
    // 显示指定的翻译信息选项卡
    document.querySelectorAll('.info-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.info-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    document.querySelector(`.info-tab[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`${tabId}-panel`).classList.add('active');
}

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function toggleSidebar(sidebar) {
    sidebar.classList.toggle('active');
    
    // 如果打开了一个侧边栏，关闭另一个
    if (sidebar.classList.contains('active')) {
        if (sidebar.id === 'history-sidebar') {
            document.getElementById('favorites-sidebar').classList.remove('active');
        } else {
            document.getElementById('history-sidebar').classList.remove('active');
        }
    }
}

function closeSidebar(sidebar) {
    sidebar.classList.remove('active');
}

function toggleTheme() {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
    } else {
        document.body.classList.add('dark-theme');
    }
    
    // 保存设置
    saveSettings();
}

function initializeTheme() {
    // 初始化主题
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        document.body.className = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-theme');
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('已复制到剪贴板');
        }).catch(err => {
            console.error('复制失败:', err);
            showNotification('复制失败，请重试');
        });
    } else {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showNotification('已复制到剪贴板');
        } catch (err) {
            console.error('复制失败:', err);
            showNotification('复制失败，请重试');
        }
        
        document.body.removeChild(textArea);
    }
}

function speakText(text, language) {
    if ('speechSynthesis' in window) {
        // 停止任何正在进行的朗读
        window.speechSynthesis.cancel();
        
        // 创建新的朗读请求
        const utterance = new SpeechSynthesisUtterance(text);
        
        // 设置语言
        utterance.lang = getLanguageCodeForSpeech(language);
        
        // 设置语速和音调
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
        // 开始朗读
        window.speechSynthesis.speak(utterance);
    } else {
        showNotification('您的浏览器不支持语音合成功能');
    }
}

function getLanguageCodeForSpeech(language) {
    // 获取语音合成的语言代码
    const languageMap = {
        'zh': 'zh-CN',
        'en': 'en-US',
        'ja': 'ja-JP',
        'ko': 'ko-KR',
        'fr': 'fr-FR',
        'de': 'de-DE',
        'es': 'es-ES',
        'ru': 'ru-RU',
        'pt': 'pt-BR',
        'it': 'it-IT',
        'ar': 'ar-SA',
        'hi': 'hi-IN',
        'th': 'th-TH',
        'vi': 'vi-VN'
    };
    
    return languageMap[language] || 'en-US';
}

function initializeSpeechRecognition() {
    // 初始化语音识别
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'zh-CN';
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('source-text').value = transcript;
            updateCharCount();
            
            // 如果开启了自动翻译，执行翻译
            if (document.getElementById('auto-translate').checked) {
                performTranslation();
            }
        };
        
        recognition.onerror = function(event) {
            console.error('语音识别错误:', event.error);
            showNotification('语音识别失败，请重试');
        };
        
        // 将识别对象保存到全局变量
        window.speechRecognition = recognition;
    }
}

function startListening() {
    if (window.speechRecognition) {
        // 设置识别语言为当前源语言
        const sourceLanguage = document.getElementById('source-language').value;
        window.speechRecognition.lang = getLanguageCodeForSpeech(sourceLanguage);
        
        // 开始识别
        window.speechRecognition.start();
        showNotification('正在听取...');
    } else {
        showNotification('您的浏览器不支持语音识别功能');
    }
}

function checkApiStatus() {
    // 检查API状态
    // 这里使用简化的逻辑，实际应用中应该调用API进行健康检查
    
    // 模拟API检查
    setTimeout(() => {
        const statusIndicator = document.getElementById('status-indicator');
        const statusText = document.getElementById('status-text');
        
        // 假设API正常
        statusIndicator.className = 'status-indicator status-online';
        statusText.textContent = '在线';
    }, 1000);
}

// ===== 文档翻译功能 =====
function handleFileUpload(file) {
    // 处理文件上传
    const validTypes = ['text/plain', 'application/pdf', 'application/msword', 
                       'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(file.type)) {
        showNotification('不支持的文件类型，请上传文本文件、PDF或Word文档');
        return;
    }
    
    // 显示文件信息
    const fileList = document.getElementById('file-list');
    const fileItems = document.getElementById('file-items');
    
    // 清空之前的文件
    fileItems.innerHTML = '';
    
    // 添加文件项
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    
    const fileIcon = getFileIcon(file.type);
    const fileSize = formatFileSize(file.size);
    
    fileItem.innerHTML = `
        <div class="file-info">
            <div class="file-icon">${fileIcon}</div>
            <div class="file-details">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${fileSize}</div>
            </div>
        </div>
        <div class="file-actions">
            <button class="icon-button remove-file-button" title="移除文件">
                <span>×</span>
            </button>
        </div>
    `;
    
    fileItems.appendChild(fileItem);
    fileList.style.display = 'block';
    
    // 添加移除文件按钮的事件监听器
    const removeButton = fileItem.querySelector('.remove-file-button');
    removeButton.addEventListener('click', function() {
        fileItems.removeChild(fileItem);
        if (fileItems.children.length === 0) {
            fileList.style.display = 'none';
        }
    });
    
    // 读取文件内容
    readFileContent(file);
}

function getFileIcon(fileType) {
    // 获取文件图标
    switch (fileType) {
        case 'text/plain':
            return '📄';
        case 'application/pdf':
            return '📕';
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return '📘';
        default:
            return '📄';
    }
}

function formatFileSize(bytes) {
    // 格式化文件大小
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function readFileContent(file) {
    // 读取文件内容
    const reader = new FileReader();
    
    reader.onload = function(e) {
        let content = e.target.result;
        
        // 如果是PDF或Word文档，这里应该使用相应的库来提取文本
        // 这里简化处理，只处理文本文件
        if (file.type === 'text/plain') {
            document.getElementById('source-text').value = content;
            updateCharCount();
            
            // 如果开启了自动翻译，执行翻译
            if (document.getElementById('auto-translate').checked) {
                performTranslation();
            }
        } else {
            showNotification('已上传文件，请点击"翻译文档"按钮进行翻译');
        }
    };
    
    reader.onerror = function() {
        showNotification('读取文件失败，请重试');
    };
    
    // 根据文件类型选择读取方式
    if (file.type === 'text/plain') {
        reader.readAsText(file);
    } else {
        // 对于PDF和Word文档，这里应该使用相应的库来提取文本
        // 这里简化处理，只显示文件已上传
        reader.readAsArrayBuffer(file);
    }
}

function translateDocument() {
    // 翻译文档
    const sourceText = document.getElementById('source-text').value.trim();
    
    if (sourceText === '') {
        showNotification('请先上传文档或输入文本');
        return;
    }
    
    // 设置翻译模式为文档翻译
    setTranslationMode('document');
    
    // 执行翻译
    performTranslation();
    
    // 关闭文档翻译模态框
    closeModal(document.getElementById('document-modal'));
}

// ===== 本地翻译服务集成 =====
// 这里集成local-translate.js中的翻译功能

// 检查local-translate.js是否已加载
if (typeof translate === 'undefined') {
    console.error('local-translate.js 未加载，翻译功能将不可用');
}

// 扩展翻译功能，添加近义词支持
function enhancedTranslate(text, sourceLang, targetLang, synonymInfo) {
    // 增强的翻译功能，支持近义词
    
    // 如果有近义词信息，先替换文本
    let processedText = text;
    if (synonymInfo) {
        processedText = replaceWithSynonym(text, synonymInfo);
    }
    
    // 调用原始翻译函数
    return translate(processedText, sourceLang, targetLang);
}