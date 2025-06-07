/**
 * 实时翻译功能
 * 实现输入实时翻译功能
 */

// 导入翻译API服务
import TranslateAPI from './api.js';
import GoogleTranslateAPI from './google-translate-api.js';
import LocalTranslate from './local-translate.js';

const TranslateApp = {
    // 元素引用
    elements: {
        sourceText: null,
        translatedText: null,
        sourceLanguage: null,
        targetLanguage: null,
        swapButton: null,
        clearSource: null,
        copySource: null,
        copyTranslation: null,
        speakTranslation: null,
        statusIndicator: null,
        statusText: null,
        apiStatusDiv: null,
        apiConfigModal: null,
        modalClose: null,
        apiConfigTabs: null,
        apiServiceConfigs: null,
        currentServiceSelect: null,
        saveApiConfigBtn: null,
        cancelApiConfigBtn: null
    },

    // 当前使用的翻译服务
    currentService: 'baidu', // 默认使用百度翻译

    // 所有支持的翻译服务
    translateServices: {
        baidu: TranslateAPI,
        google: GoogleTranslateAPI,
        local: LocalTranslate
    },

    // 翻译延迟计时器
    translateTimer: null,

    // 上次翻译的文本
    lastTranslatedText: '',

    // 上次使用的语言对
    lastLanguagePair: '',

    // 语音合成器
    speechSynthesis: window.speechSynthesis,

    // API状态
    apiStatus: 'online',

    // 初始化应用
    init() {
        this.initElements();
        this.initEventListeners();
        this.loadApiConfig();
        this.loadPreferences();

        // 检查API状态
        this.checkApiStatus();

        // 显示欢迎消息
        this.elements.translatedText.value = '请在左侧输入要翻译的文本，翻译会实时显示...';

        // 初始化API配置对话框
        this.initApiConfigModal();
    },

    // 初始化API配置对话框
    initApiConfigModal() {
        // 点击API状态指示器打开配置对话框
        this.elements.apiStatusDiv.addEventListener('click', () => {
            this.openApiConfigModal();
        });

        // 关闭对话框
        this.elements.modalClose.addEventListener('click', () => {
            this.closeApiConfigModal();
        });

        // 点击对话框外部关闭对话框
        window.addEventListener('click', (event) => {
            if (event.target === this.elements.apiConfigModal) {
                this.closeApiConfigModal();
            }
        });

        // 切换API配置选项卡
        this.elements.apiConfigTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchApiConfigTab(tab.dataset.tab);
            });
        });

        // 保存API配置
        this.elements.saveApiConfigBtn.addEventListener('click', () => {
            this.saveAllApiConfig();
        });

        // 取消API配置
        this.elements.cancelApiConfigBtn.addEventListener('click', () => {
            this.closeApiConfigModal();
        });

        // 填充当前配置到表单
        this.fillApiConfigForm();
    },

    // 加载API配置
    loadApiConfig() {
        try {
            const apiConfig = JSON.parse(localStorage.getItem('translateApiConfig'));
            if (apiConfig) {
                // 设置当前服务
                if (apiConfig.service) {
                    this.currentService = apiConfig.service;
                    if (apiConfig.service === 'baidu' || apiConfig.service === 'youdao') {
                        TranslateAPI.setService(apiConfig.service);
                    }
                }

                // 设置百度翻译API密钥
                if (apiConfig.baidu && apiConfig.baidu.appId && apiConfig.baidu.secretKey) {
                    TranslateAPI.setApiKey('baidu', apiConfig.baidu.appId, apiConfig.baidu.secretKey);
                }

                // 设置有道翻译API密钥
                if (apiConfig.youdao && apiConfig.youdao.appId && apiConfig.youdao.secretKey) {
                    TranslateAPI.setApiKey('youdao', apiConfig.youdao.appId, apiConfig.youdao.secretKey);
                }

                // 设置Google翻译API密钥
                if (apiConfig.google && apiConfig.google.apiKey) {
                    GoogleTranslateAPI.setApiKey(apiConfig.google.apiKey);
                }
            }
        } catch (e) {
            console.error('加载API配置失败:', e);
        }
    },

    // 保存API配置
    saveApiConfig(service, provider, appId, secretKey) {
        try {
            let apiConfig = JSON.parse(localStorage.getItem('translateApiConfig') || '{}');

            // 更新配置
            if (service === 'current') {
                apiConfig.service = provider;
                this.currentService = provider;
            } else {
                if (!apiConfig[provider]) {
                    apiConfig[provider] = {};
                }

                if (provider === 'google') {
                    // Google翻译只需要一个apiKey
                    apiConfig[provider].apiKey = appId;
                } else {
                    // 百度和有道翻译需要appId和secretKey
                    apiConfig[provider].appId = appId;
                    apiConfig[provider].secretKey = secretKey;
                }
            }

            // 保存到本地存储
            localStorage.setItem('translateApiConfig', JSON.stringify(apiConfig));

            return true;
        } catch (e) {
            console.error('保存API配置失败:', e);
            return false;
        }
    },

    // 保存所有API配置
    saveAllApiConfig() {
        try {
            // 获取当前所选服务
            const currentService = this.elements.currentServiceSelect.value;

            // 获取百度翻译API配置
            const baiduAppId = document.getElementById('baidu-app-id').value.trim();
            const baiduSecretKey = document.getElementById('baidu-secret-key').value.trim();

            // 获取有道翻译API配置
            const youdaoAppId = document.getElementById('youdao-app-id').value.trim();
            const youdaoSecretKey = document.getElementById('youdao-secret-key').value.trim();

            // 获取Google翻译API配置
            const googleApiKey = document.getElementById('google-api-key').value.trim();

            // 创建配置对象
            let apiConfig = {};

            // 设置当前服务
            apiConfig.service = currentService;
            this.currentService = currentService;

            // 设置百度翻译API配置
            if (baiduAppId && baiduSecretKey) {
                apiConfig.baidu = {
                    appId: baiduAppId,
                    secretKey: baiduSecretKey
                };
                TranslateAPI.setApiKey('baidu', baiduAppId, baiduSecretKey);
            }

            // 设置有道翻译API配置
            if (youdaoAppId && youdaoSecretKey) {
                apiConfig.youdao = {
                    appId: youdaoAppId,
                    secretKey: youdaoSecretKey
                };
                TranslateAPI.setApiKey('youdao', youdaoAppId, youdaoSecretKey);
            }

            // 设置Google翻译API配置
            if (googleApiKey) {
                apiConfig.google = {
                    apiKey: googleApiKey
                };
                GoogleTranslateAPI.setApiKey(googleApiKey);
            }

            // 如果是百度或有道翻译，设置当前服务
            if (currentService === 'baidu' || currentService === 'youdao') {
                TranslateAPI.setService(currentService);
            }

            // 保存到本地存储
            localStorage.setItem('translateApiConfig', JSON.stringify(apiConfig));

            // 更新API状态
            this.checkApiStatus();

            // 显示成功提示
            this.showNotification('API配置已保存');

            // 关闭对话框
            this.closeApiConfigModal();

            return true;
        } catch (e) {
            console.error('保存API配置失败:', e);
            this.showNotification('保存API配置失败');
            return false;
        }
    },

    // 保存所有API配置
    saveAllApiConfig() {
        try {
            // 获取当前所选服务
            const currentService = this.elements.currentServiceSelect.value;

            // 获取百度翻译API配置
            const baiduAppId = document.getElementById('baidu-app-id').value.trim();
            const baiduSecretKey = document.getElementById('baidu-secret-key').value.trim();

            // 获取有道翻译API配置
            const youdaoAppId = document.getElementById('youdao-app-id').value.trim();
            const youdaoSecretKey = document.getElementById('youdao-secret-key').value.trim();

            // 获取Google翻译API配置
            const googleApiKey = document.getElementById('google-api-key').value.trim();

            // 创建配置对象
            let apiConfig = {};

            // 设置当前服务
            apiConfig.service = currentService;
            this.currentService = currentService;

            // 设置百度翻译API配置
            if (baiduAppId && baiduSecretKey) {
                apiConfig.baidu = {
                    appId: baiduAppId,
                    secretKey: baiduSecretKey
                };
                TranslateAPI.setApiKey('baidu', baiduAppId, baiduSecretKey);
            }

            // 设置有道翻译API配置
            if (youdaoAppId && youdaoSecretKey) {
                apiConfig.youdao = {
                    appId: youdaoAppId,
                    secretKey: youdaoSecretKey
                };
                TranslateAPI.setApiKey('youdao', youdaoAppId, youdaoSecretKey);
            }

            // 设置Google翻译API配置
            if (googleApiKey) {
                apiConfig.google = {
                    apiKey: googleApiKey
                };
                GoogleTranslateAPI.setApiKey(googleApiKey);
            }

            // 如果是百度或有道翻译，设置当前服务
            if (currentService === 'baidu' || currentService === 'youdao') {
                TranslateAPI.setService(currentService);
            }

            // 保存到本地存储
            localStorage.setItem('translateApiConfig', JSON.stringify(apiConfig));

            // 更新API状态
            this.checkApiStatus();

            // 显示成功提示
            this.showNotification('API配置已保存');

            // 关闭对话框
            this.closeApiConfigModal();

            return true;
        } catch (e) {
            console.error('保存API配置失败:', e);
            this.showNotification('保存API配置失败');
            return false;
        }
    },

    // 检查API状态
    async checkApiStatus() {
        let isAvailable = false;

        // 根据当前服务检查API状态
        if (this.currentService === 'baidu' || this.currentService === 'youdao') {
            isAvailable = await TranslateAPI.checkApiStatus();
        } else if (this.currentService === 'google') {
            isAvailable = await GoogleTranslateAPI.checkApiStatus();
        } else if (this.currentService === 'local') {
            // 本地翻译始终可用
            isAvailable = true;
        }

        this.updateApiStatus(isAvailable ? 'online' : 'offline');
    },

    // 打开API配置对话框
    openApiConfigModal() {
        // 填充表单
        this.fillApiConfigForm();

        // 显示对话框
        this.elements.apiConfigModal.style.display = 'block';

        // 设置当前选项卡
        this.switchApiConfigTab(this.currentService);
    },

    // 关闭API配置对话框
    closeApiConfigModal() {
        this.elements.apiConfigModal.style.display = 'none';
    },

    // 切换API配置选项卡
    switchApiConfigTab(tabId) {
        // 更新选项卡状态
        this.elements.apiConfigTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });

        // 更新内容显示
        this.elements.apiServiceConfigs.forEach(config => {
            const configId = config.id.replace('-config', '');
            config.style.display = configId === tabId ? 'block' : 'none';
        });
    },

    // 填充API配置表单
    fillApiConfigForm() {
        try {
            const apiConfig = JSON.parse(localStorage.getItem('translateApiConfig') || '{}');

            // 设置当前服务
            if (apiConfig.service) {
                this.elements.currentServiceSelect.value = apiConfig.service;
            }

            // 填充百度翻译API配置
            if (apiConfig.baidu) {
                document.getElementById('baidu-app-id').value = apiConfig.baidu.appId || '';
                document.getElementById('baidu-secret-key').value = apiConfig.baidu.secretKey || '';
            }

            // 填充有道翻译API配置
            if (apiConfig.youdao) {
                document.getElementById('youdao-app-id').value = apiConfig.youdao.appId || '';
                document.getElementById('youdao-secret-key').value = apiConfig.youdao.secretKey || '';
            }

            // 填充Google翻译API配置
            if (apiConfig.google) {
                document.getElementById('google-api-key').value = apiConfig.google.apiKey || '';
            }
        } catch (e) {
            console.error('填充API配置表单失败:', e);
        }
    },

    // 初始化DOM元素引用
    initElements() {
        this.elements.sourceText = document.getElementById('source-text');
        this.elements.translatedText = document.getElementById('translated-text');
        this.elements.sourceLanguage = document.getElementById('source-language');
        this.elements.targetLanguage = document.getElementById('target-language');
        this.elements.swapButton = document.querySelector('.swap-button');
        this.elements.clearSource = document.getElementById('clear-source');
        this.elements.copySource = document.getElementById('copy-source');
        this.elements.copyTranslation = document.getElementById('copy-translation');
        this.elements.speakTranslation = document.getElementById('speak-translation');
        this.elements.statusIndicator = document.getElementById('status-indicator');
        this.elements.statusText = document.getElementById('status-text');

        // API配置对话框元素
        this.elements.apiStatusDiv = document.querySelector('.api-status');
        this.elements.apiConfigModal = document.getElementById('api-config-modal');
        this.elements.modalClose = this.elements.apiConfigModal.querySelector('.close');
        this.elements.apiConfigTabs = Array.from(document.querySelectorAll('.api-config-tab'));
        this.elements.apiServiceConfigs = Array.from(document.querySelectorAll('.api-service-config'));
        this.elements.currentServiceSelect = document.getElementById('current-service');
        this.elements.saveApiConfigBtn = document.getElementById('save-api-config');
        this.elements.cancelApiConfigBtn = document.getElementById('cancel-api-config');
    },

    // 初始化事件监听器
    initEventListeners() {
        // 输入文本变化时触发翻译
        this.elements.sourceText.addEventListener('input', this.handleTextInput.bind(this));

        // 源语言变化时触发翻译
        this.elements.sourceLanguage.addEventListener('change', () => {
            this.savePreferences();
            this.translateText();
        });

        // 目标语言变化时触发翻译
        this.elements.targetLanguage.addEventListener('change', () => {
            this.savePreferences();
            this.translateText();
        });

        // 交换语言按钮
        this.elements.swapButton.addEventListener('click', this.swapLanguages.bind(this));

        // 清空源文本
        this.elements.clearSource.addEventListener('click', this.clearSourceText.bind(this));

        // 复制源文本
        this.elements.copySource.addEventListener('click', () => this.copyText(this.elements.sourceText));

        // 复制翻译结果
        this.elements.copyTranslation.addEventListener('click', () => this.copyText(this.elements.translatedText));

        // 朗读翻译结果
        this.elements.speakTranslation.addEventListener('click', this.speakTranslation.bind(this));

        // 自动调整文本区高度
        this.elements.sourceText.addEventListener('input', () => this.adjustTextareaHeight(this.elements.sourceText));
    },

    // 处理文本输入
    handleTextInput() {
        // 使用防抖延迟翻译，提高性能
        clearTimeout(this.translateTimer);
        this.translateTimer = setTimeout(() => {
            this.translateText();
        }, 300); // 300ms延迟
    },

    // 翻译文本
    translateText() {
        const sourceText = this.elements.sourceText.value.trim();
        const sourceLanguage = this.elements.sourceLanguage.value;
        const targetLanguage = this.elements.targetLanguage.value;

        // 如果文本为空，清空翻译结果
        if (!sourceText) {
            this.elements.translatedText.value = '';
            return;
        }

        // 如果文本和语言与上次相同，无需重新翻译
        const currentLanguagePair = `${sourceLanguage}-${targetLanguage}`;
        if (sourceText === this.lastTranslatedText && currentLanguagePair === this.lastLanguagePair) {
            return;
        }

        this.lastTranslatedText = sourceText;
        this.lastLanguagePair = currentLanguagePair;

        // 模拟翻译过程（实际项目中会调用翻译API）
        this.simulateTranslation(sourceText, sourceLanguage, targetLanguage);
    },

    // 使用API进行实际翻译
    async simulateTranslation(text, sourceLanguage, targetLanguage) {
        // 设置加载状态
        this.elements.translatedText.value = '翻译中...';

        try {
            let translatedText = '';

            // 根据当前服务选择翻译API
            if (this.currentService === 'baidu' || this.currentService === 'youdao') {
                translatedText = await TranslateAPI.translate(text, sourceLanguage, targetLanguage);
            } else if (this.currentService === 'google') {
                translatedText = await GoogleTranslateAPI.translate(text, sourceLanguage, targetLanguage);
            } else if (this.currentService === 'local') {
                translatedText = await LocalTranslate.translate(text, sourceLanguage, targetLanguage);
            }

            // 更新翻译结果
            this.elements.translatedText.value = translatedText;

            // 更新API状态为在线
            this.updateApiStatus('online');
        } catch (error) {
            console.error('翻译失败:', error);
            // 更新API状态为离线
            this.updateApiStatus('offline');

            // 显示错误信息
            this.elements.translatedText.value = `翻译服务暂不可用: ${error.message}`;

            // 如果API服务不可用，使用本地模拟翻译作为后备
            this.fallbackTranslation(text, sourceLanguage, targetLanguage);
        } finally {
            // 调整文本区域高度
            this.adjustTextareaHeight(this.elements.translatedText);
        }
    },

    // 本地模拟翻译（作为API不可用时的后备方案）
    async fallbackTranslation(text, sourceLanguage, targetLanguage) {
        try {
            // 使用本地翻译模块
            const translatedText = await LocalTranslate.translate(text, sourceLanguage, targetLanguage);

            // 如果本地翻译有结果，更新UI
            if (translatedText && this.elements.translatedText.value.includes('翻译服务暂不可用')) {
                this.elements.translatedText.value = `${translatedText}\n(使用本地翻译，API服务不可用)`;
            }
        } catch (error) {
            console.error('本地翻译失败:', error);
        }
    },

    // 交换语言
    swapLanguages() {
        // 只有当源语言不是自动检测时才能交换
        if (this.elements.sourceLanguage.value === 'auto') {
            this.showNotification('自动检测模式下无法交换语言');
            return;
        }

        // 保存当前语言值
        const sourceLanguage = this.elements.sourceLanguage.value;
        const targetLanguage = this.elements.targetLanguage.value;

        // 交换语言选择
        this.elements.sourceLanguage.value = targetLanguage;
        this.elements.targetLanguage.value = sourceLanguage;

        // 交换文本内容
        const sourceText = this.elements.sourceText.value;
        this.elements.sourceText.value = this.elements.translatedText.value;

        // 触发翻译
        this.savePreferences();
        this.translateText();

        // 显示动画效果
        this.elements.swapButton.classList.add('active');
        setTimeout(() => {
            this.elements.swapButton.classList.remove('active');
        }, 500);
    },

    // 清空源文本
    clearSourceText() {
        this.elements.sourceText.value = '';
        this.elements.translatedText.value = '';
        this.elements.sourceText.focus();
        this.adjustTextareaHeight(this.elements.sourceText);
        this.adjustTextareaHeight(this.elements.translatedText);
    },

    // 复制文本到剪贴板
    copyText(textArea) {
        if (!textArea.value) return;

        navigator.clipboard.writeText(textArea.value).then(
            () => {
                this.showNotification('已复制到剪贴板');
            },
            (err) => {
                console.error('无法复制文本: ', err);
                this.showNotification('复制失败，请手动复制');
            }
        );
    },

    // 朗读翻译结果
    speakTranslation() {
        if (!this.elements.translatedText.value) return;

        // 检查浏览器是否支持语音合成
        if (!this.speechSynthesis) {
            this.showNotification('您的浏览器不支持语音合成');
            return;
        }

        // 停止任何正在进行的朗读
        this.speechSynthesis.cancel();

        // 创建语音对象
        const utterance = new SpeechSynthesisUtterance(this.elements.translatedText.value);

        // 设置语言
        utterance.lang = this.getLanguageCode(this.elements.targetLanguage.value);

        // 开始朗读
        this.speechSynthesis.speak(utterance);
    },

    // 获取语言代码
    getLanguageCode(langValue) {
        const langMap = {
            'zh': 'zh-CN',
            'en': 'en-US',
            'ja': 'ja-JP',
            'ko': 'ko-KR',
            'fr': 'fr-FR',
            'de': 'de-DE',
            'es': 'es-ES',
            'ru': 'ru-RU'
        };

        return langMap[langValue] || 'en-US';
    },

    // 调整文本区域高度
    adjustTextareaHeight(textarea) {
        // 重置高度
        textarea.style.height = 'auto';

        // 设置新高度（最小200px）
        const newHeight = Math.max(200, textarea.scrollHeight);
        textarea.style.height = newHeight + 'px';
    },

    // 显示通知
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;

        document.body.appendChild(notification);

        // 显示动画
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(-50%) translateY(0)';
            });
        });

        // 自动隐藏
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(20px)';

            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    },

    // 检测文本是否为英文
    isEnglish(text) {
        // 简单检查：如果包含英文字符，则认为是英文
        return /[a-zA-Z]/.test(text);
    },

    // 检测文本是否为中文
    isChinese(text) {
        // 检查是否包含中文字符
        return /[\u4E00-\u9FFF]/.test(text);
    },

    // 模拟英译中
    fakeTranslateToZh(text) {
        const translations = {
            'hello': '你好',
            'world': '世界',
            'good': '好的',
            'morning': '早上',
            'evening': '晚上',
            'welcome': '欢迎',
            'thanks': '谢谢',
            'thank you': '谢谢你',
            'translate': '翻译',
            'language': '语言',
            'english': '英语',
            'chinese': '中文',
            'programming': '编程',
            'website': '网站',
            'code': '代码',
            'developer': '开发者',
            'user': '用户',
            'interface': '界面',
            'experience': '体验',
            'design': '设计',
            'feature': '功能',
            'application': '应用',
            'real-time': '实时',
            'service': '服务'
        };

        // 简单替换
        let result = text.toLowerCase();

        Object.keys(translations).forEach(key => {
            const regex = new RegExp(`\\b${key}\\b`, 'gi');
            result = result.replace(regex, translations[key]);
        });

        // 如果没有变化，添加提示信息
        if (result === text.toLowerCase()) {
            result = `${text} (这是模拟翻译，实际应用中请接入翻译API)`;
        }

        return result;
    },

    // 模拟中译英
    fakeTranslateToEn(text) {
        const translations = {
            '你好': 'hello',
            '世界': 'world',
            '好的': 'good',
            '早上': 'morning',
            '晚上': 'evening',
            '欢迎': 'welcome',
            '谢谢': 'thanks',
            '谢谢你': 'thank you',
            '翻译': 'translate',
            '语言': 'language',
            '英语': 'english',
            '中文': 'chinese',
            '编程': 'programming',
            '网站': 'website',
            '代码': 'code',
            '开发者': 'developer',
            '用户': 'user',
            '界面': 'interface',
            '体验': 'experience',
            '设计': 'design',
            '功能': 'feature',
            '应用': 'application',
            '实时': 'real-time',
            '服务': 'service'
        };

        // 简单替换
        let result = text;

        Object.keys(translations).forEach(key => {
            result = result.replace(new RegExp(key, 'g'), translations[key]);
        });

        // 如果没有变化，添加提示信息
        if (result === text) {
            result = `${text} (This is a simulated translation, please connect to a translation API in actual application)`;
        }

        return result;
    },

    // 更新API状态
    updateApiStatus(status) {
        this.apiStatus = status;
        this.elements.statusIndicator.className = status === 'online' ? 'status-online' : 'status-offline';
        this.elements.statusText.textContent = status === 'online' ? 'API服务正常' : 'API服务异常';
    },

    // 保存用户偏好设置
    savePreferences() {
        const preferences = {
            sourceLanguage: this.elements.sourceLanguage.value,
            targetLanguage: this.elements.targetLanguage.value
        };

        localStorage.setItem('translatePreferences', JSON.stringify(preferences));
    },

    // 加载用户偏好设置
    loadPreferences() {
        try {
            const preferences = JSON.parse(localStorage.getItem('translatePreferences'));
            if (preferences) {
                this.elements.sourceLanguage.value = preferences.sourceLanguage || 'en';
                this.elements.targetLanguage.value = preferences.targetLanguage || 'zh';
            }
        } catch (e) {
            console.error('加载偏好设置失败:', e);
        }
    }
};

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 初始化翻译应用
    TranslateApp.init();

    // 添加通知和API设置对话框样式
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background-color: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-light);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            pointer-events: none;
        }

        .api-config-dialog {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1001;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
        }

        .api-config-dialog.active {
            opacity: 1;
            visibility: visible;
        }

        .api-config-content {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            transform: translateY(20px);
            transition: transform 0.3s;
        }

        .api-config-dialog.active .api-config-content {
            transform: translateY(0);
        }

        .api-config-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .api-config-header h2 {
            margin: 0;
            color: var(--primary-color);
        }

        .api-config-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #999;
        }

        .api-config-form {
            display: flex;
            flex-direction: column;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: #555;
        }

        .form-group select,
        .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }

        .form-actions {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }

        .form-actions button {
            padding: 10px 15px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.2s;
        }

        .save-btn {
            background-color: var(--primary-color);
            color: white;
        }

        .cancel-btn {
            background-color: #f1f1f1;
            color: #333;
        }
    `;
    document.head.appendChild(style);

    // 创建API设置对话框
    const apiConfigDialog = document.createElement('div');
    apiConfigDialog.className = 'api-config-dialog';
    apiConfigDialog.innerHTML = `
        <div class="api-config-content">
            <div class="api-config-header">
                <h2>翻译API设置</h2>
                <button class="api-config-close">&times;</button>
            </div>
            <div class="api-config-form">
                <div class="form-group">
                    <label for="api-service">当前使用的翻译服务</label>
                    <select id="api-service">
                        <option value="baidu">百度翻译</option>
                        <option value="youdao">有道翻译</option>
                    </select>
                </div>

                <div class="api-service-config" id="baidu-config">
                    <h3>百度翻译设置</h3>
                    <div class="form-group">
                        <label for="baidu-app-id">百度应用ID (AppID)</label>
                        <input type="text" id="baidu-app-id" placeholder="请输入百度翻译API的AppID">
                    </div>
                    <div class="form-group">
                        <label for="baidu-secret-key">百度密钥 (SecretKey)</label>
                        <input type="password" id="baidu-secret-key" placeholder="请输入百度翻译API的SecretKey">
                    </div>
                </div>

                <div class="api-service-config" id="youdao-config" style="display: none;">
                    <h3>有道翻译设置</h3>
                    <div class="form-group">
                        <label for="youdao-app-id">有道应用ID (AppID)</label>
                        <input type="text" id="youdao-app-id" placeholder="请输入有道翻译API的AppID">
                    </div>
                    <div class="form-group">
                        <label for="youdao-secret-key">有道密钥 (SecretKey)</label>
                        <input type="password" id="youdao-secret-key" placeholder="请输入有道翻译API的SecretKey">
                    </div>
                </div>

                <div class="form-actions">
                    <button class="cancel-btn">取消</button>
                    <button class="save-btn">保存设置</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(apiConfigDialog);

    // 初始化API设置对话框事件
    const apiService = document.getElementById('api-service');
    const baiduConfig = document.getElementById('baidu-config');
    const youdaoConfig = document.getElementById('youdao-config');
    const saveBtn = document.querySelector('.save-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    const closeBtn = document.querySelector('.api-config-close');

    // 切换API服务显示
    apiService.addEventListener('change', () => {
        if (apiService.value === 'baidu') {
            baiduConfig.style.display = 'block';
            youdaoConfig.style.display = 'none';
        } else {
            baiduConfig.style.display = 'none';
            youdaoConfig.style.display = 'block';
        }
    });

    // 保存API设置
    saveBtn.addEventListener('click', () => {
        const service = apiService.value;

        // 保存当前服务选择
        TranslateApp.saveApiConfig('current', service);
        TranslateAPI.setService(service);

        // 保存百度API配置
        const baiduAppId = document.getElementById('baidu-app-id').value;
        const baiduSecretKey = document.getElementById('baidu-secret-key').value;
        if (baiduAppId && baiduSecretKey) {
            TranslateApp.saveApiConfig('api', 'baidu', baiduAppId, baiduSecretKey);
            TranslateAPI.setApiKey('baidu', baiduAppId, baiduSecretKey);
        }

        // 保存有道API配置
        const youdaoAppId = document.getElementById('youdao-app-id').value;
        const youdaoSecretKey = document.getElementById('youdao-secret-key').value;
        if (youdaoAppId && youdaoSecretKey) {
            TranslateApp.saveApiConfig('api', 'youdao', youdaoAppId, youdaoSecretKey);
            TranslateAPI.setApiKey('youdao', youdaoAppId, youdaoSecretKey);
        }

        // 关闭对话框
        apiConfigDialog.classList.remove('active');

        // 检查API状态
        TranslateApp.checkApiStatus();

        // 显示通知
        TranslateApp.showNotification('API设置已保存');
    });

    // 取消按钮
    cancelBtn.addEventListener('click', () => {
        apiConfigDialog.classList.remove('active');
    });

    // 关闭按钮
    closeBtn.addEventListener('click', () => {
        apiConfigDialog.classList.remove('active');
    });

    // 点击状态指示器打开API设置
    document.querySelector('.api-status').addEventListener('click', () => {
        // 加载当前配置到表单
        try {
            const apiConfig = JSON.parse(localStorage.getItem('translateApiConfig') || '{}');

            // 设置当前服务
            apiService.value = apiConfig.service || 'baidu';

            // 切换显示对应服务配置
            if (apiService.value === 'baidu') {
                baiduConfig.style.display = 'block';
                youdaoConfig.style.display = 'none';
            } else {
                baiduConfig.style.display = 'none';
                youdaoConfig.style.display = 'block';
            }

            // 设置百度API密钥
            if (apiConfig.baidu) {
                document.getElementById('baidu-app-id').value = apiConfig.baidu.appId || '';
                document.getElementById('baidu-secret-key').value = apiConfig.baidu.secretKey || '';
            }

            // 设置有道API密钥
            if (apiConfig.youdao) {
                document.getElementById('youdao-app-id').value = apiConfig.youdao.appId || '';
                document.getElementById('youdao-secret-key').value = apiConfig.youdao.secretKey || '';
            }
        } catch (e) {
            console.error('加载API配置到表单失败:', e);
        }

        // 显示对话框
        apiConfigDialog.classList.add('active');
    });
});
