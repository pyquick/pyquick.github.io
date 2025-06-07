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
     * @returns {Promise<string>} 翻译后的文本
     */
    async translate(text, from, to) {
        // 如果文本为空，直接返回
        if (!text.trim()) return '';

        // 检查API密钥是否配置
        if (!this.config.apiKey) {
            throw new Error('Google翻译API密钥未配置');
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

            // 发送请求
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

            // 解析响应
            const data = await response.json();

            // 检查是否有有效的翻译结果
            if (!data.data || !data.data.translations || data.data.translations.length === 0) {
                throw new Error('翻译结果为空');
            }

            // 返回翻译结果
            return data.data.translations.map(item => item.translatedText).join('\n');
        } catch (error) {
            console.error('Google翻译出错:', error);
            throw new Error(`Google翻译失败: ${error.message}`);
        }
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
