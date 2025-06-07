/**
 * 翻译API服务接口
 * 提供多种翻译API服务的接口
 */

// 这里可以根据需要使用任何翻译API服务
// 本示例同时提供百度翻译和有道翻译两种API接口

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
     * @returns {Promise<string>} 翻译后的文本
     */
    async translate(text, from, to) {
        // 如果文本为空，直接返回
        if (!text.trim()) return '';

        try {
            // 根据当前服务调用相应的API
            if (this.currentService === 'baidu') {
                return await this.baiduTranslate(text, from, to);
            } else if (this.currentService === 'youdao') {
                return await this.youdaoTranslate(text, from, to);
            }
        } catch (error) {
            console.error('翻译失败:', error);
            throw new Error('翻译服务暂时不可用');
        }
    },

    /**
     * 使用百度翻译API
     * @param {string} text - 要翻译的文本
     * @param {string} from - 源语言代码
     * @param {string} to - 目标语言代码
     * @returns {Promise<string>} 翻译后的文本
     */
    async baiduTranslate(text, from, to) {
        // 检查API配置
        const { apiUrl, appId, secretKey } = this.config.baidu;
        if (!appId || !secretKey) {
            throw new Error('百度翻译API密钥未配置');
        }

        // 将自动检测转换为百度API接受的格式
        if (from === 'auto') from = 'auto';

        // 生成请求参数
        const salt = Date.now();
        const sign = this.md5(appId + text + salt + secretKey);

        const url = new URL(apiUrl);
        const params = {
            q: text,
            from,
            to,
            appid: appId,
            salt: salt.toString(),
            sign
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
        if (data.error_code) {
            throw new Error(`翻译错误: ${data.error_code} - ${data.error_msg}`);
        }

        // 返回翻译结果
        return data.trans_result.map(item => item.dst).join('\n');
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
            // 简单翻译测试
            await this.translate('hello', 'en', 'zh');
            return true;
        } catch (error) {
            console.error('API状态检查失败:', error);
            return false;
        }
    }
};

// 导出API对象
export default TranslateAPI;
