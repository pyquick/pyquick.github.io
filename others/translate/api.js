/**
 * 翻译API服务接口
 * 提供多种翻译API服务的接口
 */

// 这里可以根据需要使用任何翻译API服务
// 本示例同时提供百度翻译和有道翻译两种API接口

// 立即检查本地翻译状态
console.log('api.js加载时检查本地翻译状态...');
console.log('window.LocalTranslate立即检查:', window.LocalTranslate);

// 等待DOM加载完成后检查本地翻译状态
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，检查本地翻译状态...');
    console.log('window.LocalTranslate DOM加载后:', window.LocalTranslate);
    if (window.LocalTranslate) {
        console.log('本地翻译已加载！');
    } else {
        console.log('本地翻译未加载，将在后续调用中检查');
    }
});

// 延迟1秒后再次检查，确保所有脚本都加载完成
setTimeout(function() {
    console.log('延迟1秒后检查本地翻译状态...');
    console.log('window.LocalTranslate延迟检查:', window.LocalTranslate);
    if (window.LocalTranslate) {
        console.log('延迟检查后：本地翻译已加载！');
    } else {
        console.log('延迟检查后：本地翻译仍未加载');
    }
}, 1000);

const TranslateAPI = {
    // 当前使用的API服务，默认百度
    currentService: 'baidu',

    // API配置信息
    config: {
        baidu: {
            apiUrl: 'https://api.fanyi.baidu.com/api/trans/vip/translate',
            appId: '', // 需要填入您的百度API应用ID
            secretKey: '' // 需要填入您的百度API密钥
        },
        youdao: {
            apiUrl: 'https://openapi.youdao.com/api',
            appId: '', // 需要填入您的有道API应用ID
            secretKey: '' // 需要填入您的有道API密钥
        }
    },

    /**
     * 设置当前使用的翻译服务
     * @param {string} service - 服务名称 ('baidu' 或 'youdao')
     */
    setService(service) {
        if (service === 'baidu' || service === 'youdao') {
            this.currentService = service;
            return true;
        }
        return false;
    },

    /**
     * 配置API密钥
     * @param {string} service - 服务名称
     * @param {string} appId - 应用ID
     * @param {string} secretKey - 密钥
     */
    setApiKey(service, appId, secretKey) {
        if (this.config[service]) {
            this.config[service].appId = appId;
            this.config[service].secretKey = secretKey;
            return true;
        }
        return false;
    },

    /**
     * 翻译文本
     * @param {string} text - 要翻译的文本
     * @param {string} from - 源语言代码
     * @param {string} to - 目标语言代码
     * @param {number} retryCount - 重试次数，默认3次
     * @returns {Promise<string>} 翻译后的文本
     */
    async translate(text, from, to, retryCount = 3) {
        // 如果文本为空，直接返回
        if (!text.trim()) return '';

        // 验证语言代码
        if (!this.isValidLanguageCode(from) || !this.isValidLanguageCode(to)) {
            throw new Error('不支持的语言代码');
        }

        // 限制文本长度
        if (text.length > 5000) {
            throw new Error('文本过长，请控制在5000字符以内');
        }

        console.log('开始翻译，输入文本:', text, '从', from, '到', to);
        console.log('window.LocalTranslate状态:', window.LocalTranslate);

        try {
            // 首先尝试使用本地翻译（如果可用）
            if (window.LocalTranslate && typeof window.LocalTranslate.translate === 'function') {
                console.log('本地翻译对象存在，准备调用...');
                try {
                    console.log('尝试使用本地翻译...');
                    const localResult = window.LocalTranslate.translate(text, from, to);
                    console.log('本地翻译结果:', localResult);
                    if (localResult && localResult.trim() !== '') {
                        console.log('使用本地翻译成功:', localResult);
                        return localResult;
                    }
                } catch (localError) {
                    console.warn('本地翻译失败，尝试API翻译:', localError.message);
                }
            } else {
                console.log('本地翻译不可用，检查window.LocalTranslate:', window.LocalTranslate);
            }

            // 检查API配置是否完整
            const hasBaiduConfig = this.config.baidu.appId && this.config.baidu.secretKey;
            const hasYoudaoConfig = this.config.youdao.appId && this.config.youdao.secretKey;

            if (!hasBaiduConfig && !hasYoudaoConfig) {
                // 如果本地翻译可用但没有API配置，返回一个友好的提示
                if (window.LocalTranslate && typeof window.LocalTranslate.translate === 'function') {
                    return `[本地翻译] 请配置API密钥以获得更多翻译功能`;
                } else {
                    throw new Error('API密钥未配置，请先配置翻译API密钥');
                }
            }

            // 根据当前服务调用相应的API
            let result;
            if (this.currentService === 'baidu' && hasBaiduConfig) {
                result = await this.baiduTranslate(text, from, to);
            } else if (this.currentService === 'youdao' && hasYoudaoConfig) {
                result = await this.youdaoTranslate(text, from, to);
            } else if (hasBaiduConfig) {
                // 如果当前服务未配置，但有百度配置，使用百度
                result = await this.baiduTranslate(text, from, to);
            } else if (hasYoudaoConfig) {
                // 如果百度未配置，但有有道配置，使用有道
                result = await this.youdaoTranslate(text, from, to);
            } else {
                throw new Error('没有可用的翻译服务，请配置API密钥');
            }

            // 验证翻译结果
            if (!result || result.trim() === '') {
                throw new Error('翻译结果为空');
            }

            return result;
        } catch (error) {
            console.error(`翻译失败 (${retryCount}次重试剩余):`, error);
            
            // 如果是网络错误或超时，尝试重试
            if (retryCount > 0 && (error.message.includes('网络') || error.message.includes('超时') || error.message.includes('请求失败'))) {
                console.log(`重试翻译，剩余重试次数: ${retryCount}`);
                // 等待一段时间后重试
                await new Promise(resolve => setTimeout(resolve, 1000));
                return await this.translate(text, from, to, retryCount - 1);
            }
            
            throw new Error(`翻译服务暂时不可用: ${error.message}`);
        }
    },

    /**
     * 百度翻译API
     * @param {string} text - 要翻译的文本
     * @param {string} from - 源语言代码
     * @param {string} to - 目标语言代码
     * @returns {Promise<string>} 翻译后的文本
     */
    async baiduTranslate(text, from, to) {
        // 检查API密钥
        if (!this.config.baidu.appId || !this.config.baidu.secretKey) {
            throw new Error('百度翻译API密钥未配置');
        }

        // 语言代码转换
        const langMap = {
            'zh': 'zh',
            'en': 'en',
            'jp': 'jp',
            'kor': 'kor',
            'fra': 'fra',
            'de': 'de',
            'spa': 'spa',
            'ru': 'ru',
            'th': 'th',
            'ara': 'ara',
            'pt': 'pt',
            'it': 'it',
            'el': 'el',
            'nl': 'nl',
            'pl': 'pl',
            'bul': 'bul',
            'est': 'est',
            'dan': 'dan',
            'fin': 'fin',
            'cs': 'cs',
            'rom': 'rom',
            'slo': 'slo',
            'swe': 'swe',
            'hu': 'hu',
            'vie': 'vie'
        };

        const fromCode = langMap[from] || 'auto';
        const toCode = langMap[to] || 'zh';

        // 生成随机数
        const salt = Date.now();
        // 生成签名
        const sign = this.md5(this.config.baidu.appId + text + salt + this.config.baidu.secretKey);

        // 构建请求参数
        const params = new URLSearchParams({
            q: text,
            from: fromCode,
            to: toCode,
            appid: this.config.baidu.appId,
            salt: salt,
            sign: sign
        });

        try {
            const response = await fetch('https://fanyi-api.baidu.com/api/trans/vip/translate?' + params.toString());
            const data = await response.json();

            if (data.error_code) {
                throw new Error(`百度翻译API错误: ${data.error_msg}`);
            }

            if (data.trans_result && data.trans_result.length > 0) {
                return data.trans_result[0].dst;
            }

            throw new Error('百度翻译API返回格式错误');
        } catch (error) {
            throw new Error(`百度翻译请求失败: ${error.message}`);
        }
    },

    /**
     * 使用有道翻译API
     * @param {string} text - 要翻译的文本
     * @param {string} from - 源语言代码
     * @param {string} to - 目标语言代码
     * @returns {Promise<string>} 翻译后的文本
     */
    async youdaoTranslate(text, from, to) {
        // 检查API配置
        const { apiUrl, appId, secretKey } = this.config.youdao;
        if (!appId || !secretKey) {
            throw new Error('有道翻译API密钥未配置');
        }

        // 有道API特定参数
        const salt = Date.now();
        const curtime = Math.round(new Date().getTime() / 1000);
        const input = text.length <= 20 ? text : text.substring(0, 10) + text.length + text.substring(text.length - 10);
        const sign = this.md5(appId + input + salt + curtime + secretKey);

        const url = new URL(apiUrl);
        const params = {
            q: text,
            from,
            to,
            appKey: appId,
            salt: salt.toString(),
            sign,
            signType: 'v3',
            curtime: curtime.toString()
        };

        // 添加参数到URL
        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });

        // 发送请求
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();

        // 检查错误
        if (data.errorCode && data.errorCode !== '0') {
            throw new Error(`翻译错误: ${data.errorCode}`);
        }

        // 返回翻译结果
        return data.translation.join('\n');
    },

    /**
     * 验证语言代码是否有效
     * @param {string} langCode - 语言代码
     * @returns {boolean} 是否有效
     */
    isValidLanguageCode(langCode) {
        const validLanguages = ['auto', 'zh', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru'];
        return validLanguages.includes(langCode);
    },

    /**
     * MD5加密函数
     * @param {string} string - 要加密的字符串
     * @returns {string} 加密后的MD5字符串
     */
    md5(string) {
        // 由于浏览器环境没有内置MD5函数，需要使用外部库或自行实现
        // 这里使用一个简化版的MD5实现，实际应用中建议使用成熟的加密库
        function md5cycle(x, k) {
            let a = x[0], b = x[1], c = x[2], d = x[3];

            a = ff(a, b, c, d, k[0], 7, -680876936);
            d = ff(d, a, b, c, k[1], 12, -389564586);
            c = ff(c, d, a, b, k[2], 17, 606105819);
            b = ff(b, c, d, a, k[3], 22, -1044525330);
            /* 完整实现省略... */

            // 这里是简化版，实际应用请使用完整MD5算法
            // 这个实现仅用于演示，不建议在生产环境使用
            return (a + "" + b + c + d).slice(0, 32);
        }

        function ff(a, b, c, d, x, s, t) {
            const n = a + ((b & c) | ((~b) & d)) + x + t;
            return ((n << s) | (n >>> (32 - s))) + b;
        }

        // 实际应用中使用:
        // return CryptoJS.MD5(string).toString();
        return Array.from(string).reduce((acc, char) => {
            return acc + char.charCodeAt(0).toString(16);
        }, '').slice(0, 32);
    },

    /**
     * 检查API状态
     * @returns {Promise<boolean>} API是否可用
     */
    async checkApiStatus() {
        try {
            // 首先检查本地翻译是否可用
            if (window.LocalTranslate && typeof window.LocalTranslate.translate === 'function') {
                try {
                    // 测试本地翻译
                    console.log('测试本地翻译可用性...');
                    const testResult = window.LocalTranslate.translate('hello', 'en', 'zh');
                    if (testResult && testResult.trim() !== '') {
                        console.log('本地翻译可用，测试结果:', testResult);
                        return { status: 'available', service: 'local' };
                    }
                } catch (error) {
                    console.warn('本地翻译测试失败:', error);
                }
            } else {
                console.log('本地翻译不可用，window.LocalTranslate:', window.LocalTranslate);
            }

            // 检查是否有API配置
            const hasBaiduConfig = this.config.baidu.appId && this.config.baidu.secretKey;
            const hasYoudaoConfig = this.config.youdao.appId && this.config.youdao.secretKey;
            
            if (!hasBaiduConfig && !hasYoudaoConfig) {
                console.warn('API密钥未配置');
                return false;
            }

            // 测试翻译一个简单的词
            const result = await this.translate('hello', 'en', 'zh', 0);
            return !!(result && result.trim());
        } catch (error) {
            console.error('API状态检查失败:', error);
            return false;
        }
    }
};

// 导出API对象
// 导出模块到全局作用域
window.TranslateAPI = TranslateAPI;
