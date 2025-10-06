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
    const sourceText = document.getElementById('input-text');
    const targetText = document.getElementById('output-text');
    const translateButton = document.getElementById('translate-button');
    const clearButton = document.getElementById('clear-input');
    const copyButton = document.getElementById('copy-output');
    const speakButton = document.getElementById('speak-output');
    const listenButton = document.getElementById('listen-button'); // 可能不存在，需要检查
const documentButton = document.getElementById('document-translation');
const settingsButton = document.getElementById('settings-btn');
const historyButton = document.getElementById('history-btn');
const favoritesButton = document.getElementById('favorites-btn');
const helpButton = document.getElementById('help-btn');
const themeToggle = document.getElementById('theme-toggle');

// 新增按钮变量定义
const pasteInputButton = document.getElementById('paste-input');
const favoriteOutputButton = document.getElementById('favorite-output');
const synonymTranslationButton = document.getElementById('synonym-translation');
const closeComparisonButton = document.getElementById('close-comparison');

const standardOption = document.getElementById('standard-translation');
const smartOption = document.getElementById('smart-translation');
const documentOption = document.getElementById('document-translation');

const historySidebar = document.getElementById('history-sidebar');
const favoritesSidebar = document.getElementById('favorites-sidebar');
const settingsModal = document.getElementById('settings-modal');
const documentModal = document.getElementById('document-modal');
const helpModal = document.getElementById('help-modal');

const historyFilter = document.getElementById('history-filter'); // 可能不存在，需要检查
const favoritesFilter = document.getElementById('favorites-filter'); // 可能不存在，需要检查

const synonymSelector = document.getElementById('synonym-selector'); // 可能不存在，需要检查
const comparisonView = document.getElementById('comparison-view');
const translationInfoPanel = document.getElementById('translation-info-panel'); // 可能不存在，需要检查

const translatingIndicator = document.getElementById('translating-indicator'); // 可能不存在，需要检查
const errorMessage = document.getElementById('error-message'); // 可能不存在，需要检查
const qualityStars = document.getElementById('quality-stars'); // 可能不存在，需要检查
const qualityScore = document.getElementById('quality-score'); // 可能不存在，需要检查
    
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
    
    // 朗读原文按钮
    const speakInputButton = document.getElementById('speak-input');
    if (speakInputButton) {
        speakInputButton.addEventListener('click', function() {
            speakText(sourceText.value, currentSourceLanguage);
        });
    } else {
        console.warn('朗读原文按钮元素未找到');
    }
    
    // 监听按钮
    if (listenButton) {
        listenButton.addEventListener('click', function() {
            startListening();
        });
    } else {
        console.warn('语音输入按钮元素未找到');
    }
    
    // 文档按钮
    documentButton.addEventListener('click', function() {
        openModal(documentModal);
    });
    
    // 文档翻译模态框中的开始翻译按钮
    const documentTranslateButton = document.getElementById('document-translate-button');
    if (documentTranslateButton) {
        documentTranslateButton.addEventListener('click', function() {
            handleDocumentTranslation();
        });
    } else {
        console.warn('文档翻译按钮元素未找到');
    }
    
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
    
    // 粘贴按钮
    if (pasteInputButton) {
        pasteInputButton.addEventListener('click', function() {
            navigator.clipboard.readText().then(text => {
                sourceText.value = text;
                updateCharCount();
                showNotification('已粘贴文本');
            }).catch(err => {
                console.error('粘贴失败:', err);
                showNotification('粘贴失败，请检查浏览器权限');
            });
        });
    } else {
        console.warn('粘贴按钮元素未找到');
    }
    
    // 收藏按钮
    if (favoriteOutputButton) {
        favoriteOutputButton.addEventListener('click', function() {
            if (targetText.value.trim() !== '') {
                addToFavorites(sourceText.value, targetText.value, currentSourceLanguage, currentTargetLanguage);
                showNotification('已添加到收藏夹');
            } else {
                showNotification('请先完成翻译');
            }
        });
    } else {
        console.warn('收藏按钮元素未找到');
    }
    
    // 近义词选择按钮
    if (synonymTranslationButton) {
        synonymTranslationButton.addEventListener('click', function() {
            setTranslationMode('smart');
            if (sourceText.value.trim() !== '') {
                detectSynonyms(sourceText.value.trim());
            } else {
                showNotification('请输入要翻译的文本');
            }
        });
    } else {
        console.warn('近义词选择按钮元素未找到');
    }
    
    // 关闭对比视图按钮
    if (closeComparisonButton) {
        closeComparisonButton.addEventListener('click', function() {
            hideComparisonView();
        });
    } else {
        console.warn('关闭对比视图按钮元素未找到');
    }
    
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
    if (historyFilter) {
        historyFilter.addEventListener('input', function() {
            filterHistory(this.value);
        });
    } else {
        console.warn('历史记录过滤输入框未找到');
    }
    
    if (favoritesFilter) {
        favoritesFilter.addEventListener('input', function() {
            filterFavorites(this.value);
        });
    } else {
        console.warn('收藏夹过滤输入框未找到');
    }
    
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
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSettings();
            closeModal(settingsModal);
            showNotification('设置已保存');
        });
    }
    
    // API配置表单提交
    document.querySelectorAll('.api-config-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveApiConfig(this.getAttribute('data-service'));
            showNotification('API配置已保存');
        });
    });
    
    // 文档翻译表单提交
    const documentForm = document.getElementById('document-form');
    if (documentForm) {
        documentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            translateDocument();
        });
    }
    
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
    const inputText = document.getElementById('input-text');
    const sourceLanguageSelect = document.getElementById('source-language');
    const targetLanguageSelect = document.getElementById('target-language');
    
    if (!inputText || !sourceLanguageSelect || !targetLanguageSelect) {
        console.warn('翻译所需的输入元素未找到');
        return;
    }
    
    const sourceText = inputText.value.trim();
    
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
    
    const sourceLanguage = sourceLanguageSelect.value;
    const targetLanguage = targetLanguageSelect.value;
    
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

async function standardTranslation(text, sourceLang, targetLang) {
    // 调用本地翻译服务
    try {
        const translation = await TranslateAPI.translate(text, sourceLang, targetLang);
        
        if (translation && translation.trim() !== '') {
            displayTranslation(translation);
            addToHistory(text, translation, sourceLang, targetLang);
            evaluateTranslationQuality(text, translation);
        } else {
            showErrorMessage('翻译失败，请重试');
        }
    } catch (error) {
        console.error('翻译错误:', error);
        showErrorMessage('翻译服务出错，请重试');
    } finally {
        isTranslating = false;
        hideTranslatingIndicator();
    }
}

async function smartTranslation(text, sourceLang, targetLang) {
    // 智能翻译，考虑上下文和近义词
    try {
        // 自动检测近义词
        detectSynonyms(text);
        
        // 如果选择了近义词，使用选择的近义词进行翻译
        let processedText = text;
        if (selectedSynonym) {
            processedText = replaceWithSynonym(text, selectedSynonym);
        }
        
        const translation = await TranslateAPI.translate(processedText, sourceLang, targetLang);
        
        if (translation && translation.trim() !== '') {
            displayTranslation(translation);
            addToHistory(text, translation, sourceLang, targetLang);
            evaluateTranslationQuality(text, translation);
            
            // 显示对比视图
            if (currentSynonyms.length > 0) {
                showComparisonView(text, processedText, translation);
            }
        } else {
            showErrorMessage('翻译失败，请重试');
        }
    } catch (error) {
        console.error('智能翻译错误:', error);
        showErrorMessage('翻译服务出错，请重试');
    } finally {
        isTranslating = false;
        hideTranslatingIndicator();
    }
}

async function documentTranslation(text, sourceLang, targetLang) {
    // 文档翻译，保持格式和结构
    try {
        const translation = await TranslateAPI.translate(text, sourceLang, targetLang);
        
        if (translation && translation.trim() !== '') {
            displayTranslation(translation);
            addToHistory(text, translation, sourceLang, targetLang);
            evaluateTranslationQuality(text, translation);
        } else {
            showErrorMessage('翻译失败，请重试');
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
    const targetText = document.getElementById('output-text');
    if (targetText) {
        targetText.value = translation;
        // 显示翻译信息
        showTranslationInfo(translation);
    } else {
        console.warn('输出文本元素未找到');
    }
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
    
    if (!synonymSelector || !synonymOptions) {
        console.warn('近义词选择器元素未找到');
        return;
    }
    
    // 清空之前的选项
    synonymOptions.innerHTML = '';
    
    // 添加近义词选项
    synonyms.forEach(synonymGroup => {
        const groupTitle = document.createElement('div');
        if (groupTitle && groupTitle.className !== undefined) {
            groupTitle.className = 'synonym-group-title';
            groupTitle.textContent = `"${synonymGroup.original}" 的近义词:`;
            synonymOptions.appendChild(groupTitle);
        } else {
            console.warn('groupTitle元素或其className属性不存在');
            return;
        }
        
        const optionsContainer = document.createElement('div');
        if (optionsContainer && optionsContainer.className !== undefined) {
            optionsContainer.className = 'synonym-options';
        } else {
            console.warn('optionsContainer元素或其className属性不存在');
            return;
        }
        
        // 添加"使用原词"选项
        const originalOption = document.createElement('div');
        if (originalOption && originalOption.className !== undefined) {
            originalOption.className = 'synonym-option';
            originalOption.textContent = synonymGroup.original;
            originalOption.addEventListener('click', function() {
                selectSynonym(synonymGroup.original, synonymGroup.original);
            });
            optionsContainer.appendChild(originalOption);
        } else {
            console.warn('originalOption元素或其className属性不存在');
        }
        
        // 添加近义词选项
        synonymGroup.options.forEach(option => {
            const optionElement = document.createElement('div');
            if (optionElement && optionElement.className !== undefined) {
                optionElement.className = 'synonym-option';
                optionElement.textContent = option;
                optionElement.addEventListener('click', function() {
                    selectSynonym(synonymGroup.original, option);
                });
                optionsContainer.appendChild(optionElement);
            } else {
                console.warn('optionElement元素或其className属性不存在');
            }
        });
        
        synonymOptions.appendChild(optionsContainer);
    });
    
    // 显示近义词选择器
    if (synonymSelector && synonymSelector.style) {
        synonymSelector.style.display = 'block';
    } else {
        console.warn('近义词选择器元素或其style属性不存在');
    }
}

function hideSynonymSelector() {
    const synonymSelector = document.getElementById('synonym-selector');
    if (synonymSelector) {
        synonymSelector.style.display = 'none';
    } else {
        console.warn('近义词选择器元素未找到');
    }
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
        if (option && option.classList) {
            if (option.textContent === synonym) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        }
    });
    
    // 如果文本不为空，自动重新翻译
    const sourceText = document.getElementById('input-text').value.trim();
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
async function showComparisonView(originalText, modifiedText, translation) {
    const comparisonView = document.getElementById('comparison-view');
    const comparisonContent = document.getElementById('comparison-content');
    
    if (!comparisonView || !comparisonContent) {
        console.warn('对比视图元素未找到');
        return;
    }
    
    // 清空之前的内容
    comparisonContent.innerHTML = '';
    
    // 添加原始文本翻译
    const originalTranslation = document.createElement('div');
    if (originalTranslation && originalTranslation.className !== undefined) {
        originalTranslation.className = 'translation-option';
        originalTranslation.innerHTML = `
            <div class="option-header">
                <div class="option-title">原始翻译</div>
                <button class="use-translation" data-translation="${translation}">使用此翻译</button>
            </div>
            <div class="option-content">${translation}</div>
        `;
        comparisonContent.appendChild(originalTranslation);
    } else {
        console.warn('originalTranslation元素或其className属性不存在');
        return;
    }
    
    // 如果修改了文本，添加修改后的翻译
    if (modifiedText !== originalText) {
        try {
            const modifiedTranslationText = await TranslateAPI.translate(modifiedText, currentSourceLanguage, currentTargetLanguage);
            
            if (modifiedTranslationText && modifiedTranslationText.trim() !== '') {
                const modifiedTranslation = document.createElement('div');
                if (modifiedTranslation && modifiedTranslation.className !== undefined) {
                    modifiedTranslation.className = 'translation-option';
                    modifiedTranslation.innerHTML = `
                        <div class="option-header">
                            <div class="option-title">近义词翻译</div>
                            <button class="use-translation" data-translation="${modifiedTranslationText}">使用此翻译</button>
                        </div>
                        <div class="option-content">${modifiedTranslationText}</div>
                    `;
                    comparisonContent.appendChild(modifiedTranslation);
                } else {
                    console.warn('modifiedTranslation元素或其className属性不存在');
                }
            }
        } catch (error) {
            console.error('获取近义词翻译失败:', error);
        }
    }
    
    // 添加使用翻译按钮的事件监听器
    document.querySelectorAll('.use-translation').forEach(button => {
        button.addEventListener('click', function() {
            const translation = this.getAttribute('data-translation');
            const targetText = document.getElementById('target-text');
            
            if (targetText) {
                targetText.value = translation;
                showNotification('已应用选择的翻译');
            } else {
                console.warn('目标文本元素未找到');
            }
        });
    });
    
    // 显示对比视图
    if (comparisonView && comparisonView.style) {
        comparisonView.style.display = 'block';
    } else {
        console.warn('对比视图元素或其style属性不存在');
    }
}

function hideComparisonView() {
    const comparisonView = document.getElementById('comparison-view');
    if (comparisonView) {
        comparisonView.style.display = 'none';
    } else {
        console.warn('对比视图元素未找到');
    }
}

// ===== 翻译信息面板功能 =====
function showTranslationInfo(translation) {
    const translationInfoPanel = document.getElementById('translation-info-panel');
    
    if (!translationInfoPanel) {
        console.warn('翻译信息面板元素未找到');
        return;
    }
    
    // 显示翻译信息面板
    if (translationInfoPanel && translationInfoPanel.style) {
        translationInfoPanel.style.display = 'block';
    } else {
        console.warn('翻译信息面板元素或其style属性不存在');
    }
    
    // 更新词典信息
    updateDictionaryInfo(translation);
    
    // 更新语法信息
    updateGrammarInfo(translation);
    
    // 更新上下文信息
    updateContextInfo(translation);
}

function hideTranslationInfo() {
    const translationInfoPanel = document.getElementById('translation-info-panel');
    if (translationInfoPanel) {
        translationInfoPanel.style.display = 'none';
    } else {
        console.warn('翻译信息面板元素未找到');
    }
}

function updateDictionaryInfo(translation) {
    // 更新词典信息
    // 这里使用简化的逻辑，实际应用中可以调用词典API
    
    const dictionaryPronunciation = document.getElementById('dictionary-pronunciation');
    const dictionaryDefinitions = document.getElementById('dictionary-definitions');
    
    if (!dictionaryPronunciation || !dictionaryDefinitions) {
        console.warn('词典信息元素未找到');
        return;
    }
    
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
    
    if (!grammarInfo) {
        console.warn('语法信息元素未找到');
        return;
    }
    
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
    
    if (!contextInfo) {
        console.warn('上下文信息元素未找到');
        return;
    }
    
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
    
    if (!qualityStars || !qualityScore) {
        console.warn('质量指示器元素未找到');
        return;
    }
    
    // 更新星级
    const stars = Math.ceil(quality / 20);
    qualityStars.innerHTML = '';
    
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        if (star && star.className !== undefined) {
            star.className = 'star';
            star.textContent = i <= stars ? '★' : '☆';
            qualityStars.appendChild(star);
        } else {
            console.warn('star元素或其className属性不存在');
        }
    }
    
    // 更新分数
    if (qualityScore) {
        qualityScore.textContent = `${quality}/100`;
    }
    
    // 根据质量设置颜色
    if (qualityStars) {
        if (quality >= 80) {
            qualityStars.style.color = 'var(--success-color)';
        } else if (quality >= 60) {
            qualityStars.style.color = 'var(--warning-color)';
        } else {
            qualityStars.style.color = 'var(--danger-color)';
        }
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
    
    if (!historyList) {
        console.warn('历史记录列表元素未找到');
        return;
    }
    
    // 清空之前的内容
    historyList.innerHTML = '';
    
    if (translationHistory.length === 0) {
        const emptyMessage = document.createElement('div');
        if (emptyMessage && emptyMessage.className !== undefined) {
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = '暂无翻译历史';
            historyList.appendChild(emptyMessage);
        } else {
            console.warn('emptyMessage元素或其className属性不存在');
        }
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
    
    if (!favoritesList) {
        console.warn('收藏夹列表元素未找到');
        return;
    }
    
    // 清空之前的内容
    favoritesList.innerHTML = '';
    
    if (favoriteTranslations.length === 0) {
        const emptyMessage = document.createElement('div');
        if (emptyMessage && emptyMessage.className !== undefined) {
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = '暂无收藏的翻译';
            favoritesList.appendChild(emptyMessage);
        } else {
            console.warn('emptyMessage元素或其className属性不存在');
        }
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
    if (historyItem && historyItem.className !== undefined) {
        historyItem.className = 'history-item';
    } else {
        console.warn('historyItem元素或其className属性不存在');
        return null;
    }
    
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
            const inputText = document.getElementById('input-text');
            const outputText = document.getElementById('output-text');
            const sourceLanguage = document.getElementById('source-language');
            const targetLanguage = document.getElementById('target-language');
            const historySidebar = document.getElementById('history-sidebar');
            
            if (inputText && outputText && sourceLanguage && targetLanguage) {
                inputText.value = item.sourceText;
                outputText.value = item.translation;
                sourceLanguage.value = item.sourceLang;
                targetLanguage.value = item.targetLang;
                updateCharCount();
            } else {
                console.warn('翻译区域元素未找到');
            }
            
            if (historySidebar) {
                closeSidebar(historySidebar);
            }
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
    if (favoriteItem && favoriteItem.className !== undefined) {
        favoriteItem.className = 'favorite-item';
    } else {
        console.warn('favoriteItem元素或其className属性不存在');
        return null;
    }
    
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
            const inputText = document.getElementById('input-text');
            const outputText = document.getElementById('output-text');
            const sourceLanguage = document.getElementById('source-language');
            const targetLanguage = document.getElementById('target-language');
            const favoritesSidebar = document.getElementById('favorites-sidebar');
            
            if (inputText && outputText && sourceLanguage && targetLanguage) {
                inputText.value = item.sourceText;
                outputText.value = item.translation;
                sourceLanguage.value = item.sourceLang;
                targetLanguage.value = item.targetLang;
                updateCharCount();
            } else {
                console.warn('翻译区域元素未找到');
            }
            
            if (favoritesSidebar) {
                closeSidebar(favoritesSidebar);
            }
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
        const textElement = item.querySelector('.history-item-text');
        const translationElement = item.querySelector('.history-item-translation');
        
        if (!textElement || !translationElement) {
            console.warn('历史记录项的子元素未找到');
            return;
        }
        
        const text = textElement.textContent.toLowerCase();
        const translation = translationElement.textContent.toLowerCase();
        
        if (text.includes(query.toLowerCase()) || translation.includes(query.toLowerCase())) {
            if (item && item.style) {
                item.style.display = 'block';
            } else {
                console.warn('历史记录项或其style属性不存在');
            }
        } else {
            if (item && item.style) {
                item.style.display = 'none';
            } else {
                console.warn('历史记录项或其style属性不存在');
            }
        }
    });
}

function filterFavorites(query) {
    const favoriteItems = document.querySelectorAll('.favorite-item');
    
    favoriteItems.forEach(item => {
        const textElement = item.querySelector('.favorite-item-text');
        const translationElement = item.querySelector('.favorite-item-translation');
        
        if (!textElement || !translationElement) {
            console.warn('收藏项的子元素未找到');
            return;
        }
        
        const text = textElement.textContent.toLowerCase();
        const translation = translationElement.textContent.toLowerCase();
        
        if (text.includes(query.toLowerCase()) || translation.includes(query.toLowerCase())) {
            if (item && item.style) {
                item.style.display = 'block';
            } else {
                console.warn('收藏项或其style属性不存在');
            }
        } else {
            if (item && item.style) {
                item.style.display = 'none';
            } else {
                console.warn('收藏项或其style属性不存在');
            }
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
            const sourceLanguageElement = document.getElementById('source-language');
            const targetLanguageElement = document.getElementById('target-language');
            
            if (sourceLanguageElement) {
                sourceLanguageElement.value = currentSourceLanguage;
            }
            if (targetLanguageElement) {
                targetLanguageElement.value = currentTargetLanguage;
            }
            
            // 应用界面设置
            if (parsedSettings.theme) {
                if (document.body && document.body.className !== undefined) {
                    document.body.className = parsedSettings.theme;
                } else {
                    console.warn('文档body元素未找到或className属性不存在');
                }
            }
            
            if (parsedSettings.fontSize) {
                if (document.body && document.body.style) {
                    document.body.style.fontSize = parsedSettings.fontSize;
                } else {
                    console.warn('文档body元素或其style属性不存在');
                }
            }
            
            // 应用翻译选项
            if (parsedSettings.autoTranslate !== undefined) {
                const autoTranslate = document.getElementById('auto-translate');
                if (autoTranslate) {
                    autoTranslate.checked = parsedSettings.autoTranslate;
                }
            }
            
            if (parsedSettings.copyOnTranslate !== undefined) {
                const copyOnTranslate = document.getElementById('copy-on-translate');
                if (copyOnTranslate) {
                    copyOnTranslate.checked = parsedSettings.copyOnTranslate;
                }
            }
            
            if (parsedSettings.showComparison !== undefined) {
                const showComparison = document.getElementById('show-comparison');
                if (showComparison) {
                    showComparison.checked = parsedSettings.showComparison;
                }
            }
            
            // 应用API配置
            if (parsedSettings.apiServices) {
                Object.keys(parsedSettings.apiServices).forEach(service => {
                    const config = parsedSettings.apiServices[service];
                    const enabledElement = document.getElementById(`${service}-enabled`);
                    const apiKeyElement = document.getElementById(`${service}-api-key`);
                    const apiSecretElement = document.getElementById(`${service}-api-secret`);
                    const appIdElement = document.getElementById(`${service}-app-id`);
                    
                    if (config.enabled !== undefined && enabledElement) {
                        enabledElement.checked = config.enabled;
                    }
                    if (config.apiKey && apiKeyElement) {
                        apiKeyElement.value = config.apiKey;
                    }
                    if (config.apiSecret && apiSecretElement) {
                        apiSecretElement.value = config.apiSecret;
                    }
                    if (config.appId && appIdElement) {
                        appIdElement.value = config.appId;
                    }
                });
            }
            
            // 设置当前API服务
            if (parsedSettings.currentApiService) {
                const currentApiServiceElement = document.getElementById('current-api-service');
                if (currentApiServiceElement) {
                    currentApiServiceElement.textContent = parsedSettings.currentApiService;
                }
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
        autoTranslate: document.getElementById('auto-translate')?.checked || false,
        copyOnTranslate: document.getElementById('copy-on-translate')?.checked || false,
        showComparison: document.getElementById('show-comparison')?.checked || false,
        apiServices: {
            baidu: {
                enabled: document.getElementById('baidu-enabled')?.checked || false,
                appId: document.getElementById('baidu-app-id')?.value || '',
                apiKey: document.getElementById('baidu-api-key')?.value || '',
                apiSecret: document.getElementById('baidu-api-secret')?.value || ''
            },
            youdao: {
                enabled: document.getElementById('youdao-enabled')?.checked || false,
                appId: document.getElementById('youdao-app-id')?.value || '',
                apiKey: document.getElementById('youdao-api-key')?.value || '',
                apiSecret: document.getElementById('youdao-api-secret')?.value || ''
            },
            google: {
                enabled: document.getElementById('google-enabled')?.checked || false,
                apiKey: document.getElementById('google-api-key')?.value || ''
            },
            local: {
                enabled: document.getElementById('local-enabled')?.checked || false
            }
        },
        currentApiService: document.getElementById('current-api-service')?.textContent || 'baidu'
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
            const baiduEnabled = document.getElementById('baidu-enabled');
            const baiduAppId = document.getElementById('baidu-app-id');
            const baiduApiKey = document.getElementById('baidu-api-key');
            const baiduApiSecret = document.getElementById('baidu-api-secret');
            
            settings.apiServices.baidu = {
                enabled: baiduEnabled?.checked || false,
                appId: baiduAppId?.value || '',
                apiKey: baiduApiKey?.value || '',
                apiSecret: baiduApiSecret?.value || ''
            };
            break;
        case 'youdao':
            const youdaoEnabled = document.getElementById('youdao-enabled');
            const youdaoAppId = document.getElementById('youdao-app-id');
            const youdaoApiKey = document.getElementById('youdao-api-key');
            const youdaoApiSecret = document.getElementById('youdao-api-secret');
            
            settings.apiServices.youdao = {
                enabled: youdaoEnabled?.checked || false,
                appId: youdaoAppId?.value || '',
                apiKey: youdaoApiKey?.value || '',
                apiSecret: youdaoApiSecret?.value || ''
            };
            break;
        case 'google':
            const googleEnabled = document.getElementById('google-enabled');
            const googleApiKey = document.getElementById('google-api-key');
            
            settings.apiServices.google = {
                enabled: googleEnabled?.checked || false,
                apiKey: googleApiKey?.value || ''
            };
            break;
        case 'local':
            const localEnabled = document.getElementById('local-enabled');
            
            settings.apiServices.local = {
                enabled: localEnabled?.checked || false
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
    const sourceText = document.getElementById('input-text');
    const charCount = document.querySelector('.char-counter');
    
    if (!sourceText || !charCount) {
        console.warn('字符计数所需的元素未找到');
        return;
    }
    
    charCount.textContent = sourceText.value.length;
}

function showTranslatingIndicator() {
    const translatingIndicator = document.getElementById('translating-indicator');
    if (translatingIndicator && translatingIndicator.style) {
        translatingIndicator.style.display = 'flex';
    } else {
        console.warn('翻译指示器元素或其style属性不存在');
    }
}

function hideTranslatingIndicator() {
    const translatingIndicator = document.getElementById('translating-indicator');
    if (translatingIndicator && translatingIndicator.style) {
        translatingIndicator.style.display = 'none';
    } else {
        console.warn('翻译指示器元素或其style属性不存在');
    }
}

function showErrorMessage(message) {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage && errorMessage.style) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    } else {
        console.warn('错误消息元素或其style属性不存在，消息：', message);
    }
}

function hideErrorMessage() {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage && errorMessage.style) {
        errorMessage.style.display = 'none';
    } else {
        console.warn('错误消息元素或其style属性不存在');
    }
}

function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    if (notification && notification.className !== undefined) {
        notification.className = 'notification';
    } else {
        console.warn('通知元素创建失败或className属性不存在');
        return;
    }
    notification.textContent = message;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        if (notification && notification.classList) {
            notification.classList.add('show');
        } else {
            console.warn('notification元素或其classList属性不存在');
        }
    }, 10);
    
    // 3秒后隐藏通知
    setTimeout(() => {
        if (notification && notification.classList) {
            notification.classList.remove('show');
            
            // 动画结束后移除元素
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        } else {
            console.warn('notification元素或其classList属性不存在');
        }
    }, 3000);
}

function swapLanguages() {
    const sourceLanguageSelect = document.getElementById('source-language');
    const targetLanguageSelect = document.getElementById('target-language');
    const sourceText = document.getElementById('input-text');
    const targetText = document.getElementById('output-text');
    
    if (!sourceLanguageSelect || !targetLanguageSelect || !sourceText || !targetText) {
        console.warn('语言交换所需的元素未找到');
        return;
    }
    
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
        if (button && button.classList) {
            button.classList.remove('active');
        }
    });
    
    switch (mode) {
        case 'standard':
            const standardTranslation = document.getElementById('standard-translation');
            if (standardTranslation && standardTranslation.classList) {
                standardTranslation.classList.add('active');
            }
            hideSynonymSelector();
            hideComparisonView();
            break;
        case 'smart':
            const smartTranslation = document.getElementById('smart-translation');
            if (smartTranslation && smartTranslation.classList) {
                smartTranslation.classList.add('active');
            }
            // 如果有文本，检测近义词
            const inputText = document.getElementById('input-text');
            if (inputText && inputText.value.trim() !== '') {
                detectSynonyms(inputText.value.trim());
            }
            break;
        case 'document':
            const documentTranslation = document.getElementById('document-translation');
            if (documentTranslation && documentTranslation.classList) {
                documentTranslation.classList.add('active');
            }
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
    
    if (!sourceLanguageSelect || !targetLanguageSelect) {
        console.warn('语言选择器元素未找到');
        return;
    }
    
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
        if (tab && tab.classList) {
            tab.classList.remove('active');
        }
    });
    
    document.querySelectorAll('.settings-panel').forEach(panel => {
        if (panel && panel.classList) {
            panel.classList.remove('active');
        }
    });
    
    const settingsTab = document.querySelector(`.settings-tab[data-tab="${tabId}"]`);
    const settingsPanel = document.getElementById(`${tabId}-settings`);
    
    if (settingsTab && settingsPanel) {
        if (settingsTab.classList && settingsPanel.classList) {
            settingsTab.classList.add('active');
            settingsPanel.classList.add('active');
        } else {
            console.warn(`设置选项卡或面板的classList属性不存在: ${tabId}`);
        }
    } else {
        console.warn(`设置选项卡或面板未找到: ${tabId}`);
    }
}

function showApiConfigTab(tabId) {
    // 显示指定的API配置选项卡
    document.querySelectorAll('.api-config-tab').forEach(tab => {
        if (tab && tab.classList) {
            tab.classList.remove('active');
        }
    });
    
    document.querySelectorAll('.api-service-panel').forEach(panel => {
        if (panel && panel.classList) {
            panel.classList.remove('active');
        }
    });
    
    const apiConfigTab = document.querySelector(`.api-config-tab[data-tab="${tabId}"]`);
    const apiConfigPanel = document.getElementById(`${tabId}-config`);
    
    if (apiConfigTab && apiConfigPanel) {
        if (apiConfigTab.classList && apiConfigPanel.classList) {
            apiConfigTab.classList.add('active');
            apiConfigPanel.classList.add('active');
        } else {
            console.warn(`API配置选项卡或面板的classList属性不存在: ${tabId}`);
        }
    } else {
        console.warn(`API配置选项卡或面板未找到: ${tabId}`);
    }
}

function showInfoTab(tabId) {
    // 显示指定的翻译信息选项卡
    document.querySelectorAll('.info-tab').forEach(tab => {
        if (tab && tab.classList) {
            tab.classList.remove('active');
        }
    });
    
    document.querySelectorAll('.info-panel').forEach(panel => {
        if (panel && panel.classList) {
            panel.classList.remove('active');
        }
    });
    
    const infoTab = document.querySelector(`.info-tab[data-tab="${tabId}"]`);
    const infoPanel = document.getElementById(`${tabId}-panel`);
    
    if (infoTab && infoPanel) {
        if (infoTab.classList && infoPanel.classList) {
            infoTab.classList.add('active');
            infoPanel.classList.add('active');
        } else {
            console.warn(`信息选项卡或面板的classList属性不存在: ${tabId}`);
        }
    } else {
        console.warn(`信息选项卡或面板未找到: ${tabId}`);
    }
}

function openModal(modal) {
    if (modal) {
        if (modal.classList) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            console.warn('模态框元素的classList属性不存在');
        }
    } else {
        console.warn('模态框元素为空');
    }
}

function closeModal(modal) {
    if (modal) {
        if (modal.classList) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            console.warn('模态框元素的classList属性不存在');
        }
    } else {
        console.warn('模态框元素为空');
    }
}

function toggleSidebar(sidebar) {
    if (!sidebar) {
        console.warn('侧边栏元素为空');
        return;
    }
    
    if (sidebar.classList) {
        sidebar.classList.toggle('active');
        
        // 如果打开了一个侧边栏，关闭另一个
        if (sidebar.classList && sidebar.classList.contains('active')) {
            if (sidebar.id === 'history-sidebar') {
                const favoritesSidebar = document.getElementById('favorites-sidebar');
                if (favoritesSidebar && favoritesSidebar.classList) {
                    favoritesSidebar.classList.remove('active');
                }
            } else {
                const historySidebar = document.getElementById('history-sidebar');
                if (historySidebar && historySidebar.classList) {
                    historySidebar.classList.remove('active');
                }
            }
        }
    } else {
        console.warn('侧边栏元素的classList属性不存在');
    }
}

function closeSidebar(sidebar) {
    if (!sidebar) {
        console.warn('侧边栏元素为空');
        return;
    }
    if (sidebar.classList) {
        sidebar.classList.remove('active');
    } else {
        console.warn('侧边栏元素的classList属性不存在');
    }
}

function toggleTheme() {
    if (document.body && document.body.classList) {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
        } else {
            document.body.classList.add('dark-theme');
        }
        
        // 保存设置
        saveSettings();
    } else {
        console.warn('文档body元素未找到');
    }
}

function initializeTheme() {
    // 初始化主题
    const savedTheme = localStorage.getItem('theme');
    
    if (document.body && document.body.classList) {
        if (savedTheme) {
            document.body.className = savedTheme;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-theme');
        }
    } else {
        console.warn('文档body元素未找到');
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
            const inputText = document.getElementById('input-text');
            
            if (inputText) {
                inputText.value = transcript;
                updateCharCount();
                
                // 如果开启了自动翻译，执行翻译
                const autoTranslate = document.getElementById('auto-translate');
                if (autoTranslate && autoTranslate.checked) {
                    performTranslation();
                }
            } else {
                console.warn('输入文本元素未找到');
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
        const sourceLanguageElement = document.getElementById('source-language');
        if (sourceLanguageElement) {
            window.speechRecognition.lang = getLanguageCodeForSpeech(sourceLanguageElement.value);
        } else {
            console.warn('源语言选择器元素未找到，使用默认语言');
            window.speechRecognition.lang = 'zh-CN';
        }
        
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
        
        if (statusIndicator && statusText) {
            // 假设API正常
            if (statusIndicator && statusIndicator.className !== undefined) {
                statusIndicator.className = 'status-indicator status-online';
                statusText.textContent = '在线';
            } else {
                console.warn('状态指示器元素或其className属性不存在');
            }
        } else {
            console.warn('状态指示器元素未找到');
        }
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
    
    if (!fileList || !fileItems) {
        console.warn('文件列表元素未找到');
        return;
    }
    
    // 清空之前的文件
    fileItems.innerHTML = '';
    
    // 添加文件项
    const fileItem = document.createElement('div');
    if (fileItem && fileItem.className !== undefined) {
        fileItem.className = 'file-item';
    } else {
        console.warn('fileItem元素或其className属性不存在');
        return;
    }
    
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
    if (fileList && fileList.style) {
        fileList.style.display = 'block';
    } else {
        console.warn('文件列表元素或其style属性不存在');
    }
    
    // 添加移除文件按钮的事件监听器
    const removeButton = fileItem.querySelector('.remove-file-button');
    removeButton.addEventListener('click', function() {
        fileItems.removeChild(fileItem);
        if (fileItems.children.length === 0) {
            if (fileList && fileList.style) {
                fileList.style.display = 'none';
            } else {
                console.warn('文件列表元素或其style属性不存在');
            }
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
            const inputText = document.getElementById('input-text');
            const autoTranslate = document.getElementById('auto-translate');
            
            if (inputText) {
                inputText.value = content;
                updateCharCount();
                
                // 如果开启了自动翻译，执行翻译
                if (autoTranslate && autoTranslate.checked) {
                    performTranslation();
                }
            } else {
                console.warn('输入文本元素未找到');
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
    const inputText = document.getElementById('input-text');
    const documentModal = document.getElementById('document-modal');
    
    if (!inputText) {
        console.warn('输入文本元素未找到');
        return;
    }
    
    const sourceText = inputText.value.trim();
    
    if (sourceText === '') {
        showNotification('请先上传文档或输入文本');
        return;
    }
    
    // 设置翻译模式为文档翻译
    setTranslationMode('document');
    
    // 执行翻译
    performTranslation();
    
    // 关闭文档翻译模态框
    if (documentModal) {
        closeModal(documentModal);
    } else {
        console.warn('文档模态框元素未找到');
    }
}

function handleDocumentTranslation() {
    // 处理文档翻译
    const documentModal = document.getElementById('document-modal');
    
    if (!documentModal) {
        console.warn('文档翻译模态框未找到');
        return;
    }
    
    // 检查是否有上传的文件
    const fileItems = document.getElementById('file-items');
    const inputText = document.getElementById('input-text');
    
    if (!fileItems || !inputText) {
        console.warn('文件列表或输入文本元素未找到');
        return;
    }
    
    // 如果有上传的文件，读取文件内容
    if (fileItems.children.length > 0) {
        // 这里应该读取文件内容并设置到输入框中
        // 由于文件读取已经在handleFileUpload中处理，这里直接使用输入框的内容
        const sourceText = inputText.value.trim();
        
        if (sourceText === '') {
            showNotification('请先上传文档或输入文本');
            return;
        }
        
        // 设置翻译模式为文档翻译
        setTranslationMode('document');
        
        // 执行翻译
        performTranslation();
        
        // 关闭文档翻译模态框
        closeModal(documentModal);
    } else {
        // 如果没有上传文件，检查输入框中是否有文本
        const sourceText = inputText.value.trim();
        
        if (sourceText === '') {
            showNotification('请先上传文档或输入文本');
            return;
        }
        
        // 设置翻译模式为文档翻译
        setTranslationMode('document');
        
        // 执行翻译
        performTranslation();
        
        // 关闭文档翻译模态框
        closeModal(documentModal);
    }
}

// ===== 本地翻译服务集成 =====
// 这里集成local-translate.js中的翻译功能

// 检查local-translate.js是否已加载
if (typeof LocalTranslate === 'undefined') {
    console.error('local-translate.js 未加载，本地翻译功能将不可用');
}

// 扩展翻译功能，添加近义词支持
function enhancedTranslate(text, sourceLang, targetLang, synonymInfo) {
    // 增强的翻译功能，支持近义词
    
    // 如果有近义词信息，先替换文本
    let processedText = text;
    if (synonymInfo) {
        processedText = replaceWithSynonym(text, synonymInfo);
    }
    
    // 调用本地翻译函数（如果可用）
    if (typeof LocalTranslate !== 'undefined' && LocalTranslate.translate) {
        return LocalTranslate.translate(processedText, sourceLang, targetLang);
    }
    
    // 如果本地翻译不可用，返回原始文本
    console.warn('本地翻译功能不可用，返回原始文本');
    return processedText;
}