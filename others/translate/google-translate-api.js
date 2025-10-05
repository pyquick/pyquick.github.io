/**
 * Google Cloud Translation API 接口模块
 * 实现Google翻译API的连接和调用
 */

const GoogleTranslateAPI = {
    // API配置
    config: {
        apiKey: '', // 需要填入您的Google API密钥
        baseUrl: 'https://translation.googleapis.com/language/translate/v2'
    },

    /**
     * 设置API密钥
     * @param {string} apiKey - Google API密钥
     */
    setApiKey(apiKey) {
        if (apiKey && typeof apiKey === 'string') {
            this.config.apiKey = apiKey;
            return true;
        }
        return false;
    },

    /**
     * 翻译文本
     * @param {string} text - 要翻译的文本
     * @param {string} from - 源语言代码 (可以是'auto'自动检测)
     * @param {string} to - 目标语言代码
     * @param {number} retryCount - 重试次数，默认3次
     * @returns {Promise<string>} 翻译后的文本
     */
    async translate(text, from, to, retryCount = 3) {
        // 如果文本为空，直接返回
        if (!text.trim()) return '';

        // 检查API密钥是否配置
        if (!this.config.apiKey) {
            throw new Error('Google翻译API密钥未配置');
        }

        // 验证语言代码
        if (!this.isValidLanguageCode(from) || !this.isValidLanguageCode(to)) {
            throw new Error('不支持的语言代码');
        }

        // 限制文本长度
        if (text.length > 5000) {
            throw new Error('文本过长，请控制在5000字符以内');
        }

        try {
            // 构建请求URL
            const url = new URL(this.config.baseUrl);

            // 添加参数
            const params = {
                q: text,
                target: to,
                key: this.config.apiKey
            };

            // 如果源语言不是自动检测，添加源语言参数
            if (from !== 'auto') {
                params.source = from;
            }

            // 添加所有参数到URL
            Object.keys(params).forEach(key => {
                url.searchParams.append(key, params[key]);
            });

            // 设置超时控制
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

            // 发送请求
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API请求失败: ${errorData.error?.message || response.status}`);
            }

            // 解析响应
            const data = await response.json();

            // 检查是否有有效的翻译结果
            if (!data.data || !data.data.translations || data.data.translations.length === 0) {
                throw new Error('翻译结果为空');
            }

            // 返回翻译结果
            return data.data.translations.map(item => item.translatedText).join('\n');
        } catch (error) {
            console.error(`Google翻译出错 (${retryCount}次重试剩余):`, error);
            
            // 如果是网络错误或超时，尝试重试
            if (retryCount > 0 && (error.name === 'AbortError' || error.message.includes('网络') || error.message.includes('超时') || error.message.includes('请求失败'))) {
                console.log(`重试Google翻译，剩余重试次数: ${retryCount}`);
                // 等待一段时间后重试
                await new Promise(resolve => setTimeout(resolve, 1000));
                return await this.translate(text, from, to, retryCount - 1);
            }
            
            throw new Error(`Google翻译失败: ${error.message}`);
        }
    },

    /**
     * 验证语言代码是否有效
     * @param {string} langCode - 语言代码
     * @returns {boolean} 是否有效
     */
    isValidLanguageCode(langCode) {
        const validLanguages = ['auto', 'zh', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru', 'pt', 'it', 'nl', 'pl', 'sv', 'da', 'fi', 'no', 'cs', 'hu', 'ro', 'sk', 'sl', 'bg', 'hr', 'sr', 'uk', 'be', 'el', 'tr', 'ar', 'he', 'th', 'vi', 'id', 'ms', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'si', 'my', 'km', 'lo', 'ne', 'ur', 'fa', 'am', 'ti', 'om', 'so', 'sw', 'rw', 'yo', 'ig', 'ha', 'zu', 'xh', 'st', 'tn', 'ts', 'ss', 've', 'nr', 'nd', 'sn', 'ny', 'mg', 'eo', 'co', 'haw', 'sm', 'to', 'fj', 'mi', 'ty', 'kl', 'bi', 'na', 'tvl', 'gil', 'mh', 'pon', 'kos', 'rar', 'niu', 'rar', 'rar', 'rar'];
        return validLanguages.includes(langCode);
    },

    /**
     * 检查API状态
     * @returns {Promise<boolean>} API是否可用
     */
    async checkApiStatus() {
        try {
            // 检查API密钥是否配置
            if (!this.config.apiKey) {
                return false;
            }

            // 简单翻译测试
            await this.translate('hello', 'en', 'zh');
            return true;
        } catch (error) {
            console.error('Google API状态检查失败:', error);
            return false;
        }
    },

    /**
     * 获取支持的语言列表
     * @returns {Promise<Array>} 支持的语言列表
     */
    async getLanguages() {
        if (!this.config.apiKey) {
            throw new Error('Google翻译API密钥未配置');
        }

        try {
            const url = new URL(`${this.config.baseUrl}/languages`);
            url.searchParams.append('key', this.config.apiKey);

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API请求失败: ${errorData.error?.message || response.status}`);
            }

            const data = await response.json();
            return data.data.languages;
        } catch (error) {
            console.error('获取支持语言列表失败:', error);
            throw new Error(`获取语言列表失败: ${error.message}`);
        }
    }
};

// 导出模块
export default GoogleTranslateAPI;
