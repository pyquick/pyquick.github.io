/**
 * 本地翻译功能模块
 * 实现基础的本地翻译功能，用于API不可用时的备用方案
 */

const LocalTranslate = {
    // 常用短语映射表（英文 -> 中文）
    enToZhDict: {
        'hello': '你好',
        'world': '世界',
        'good morning': '早上好',
        'good afternoon': '下午好',
        'good evening': '晚上好',
        'goodbye': '再见',
        'thank you': '谢谢',
        'sorry': '对不起',
        'yes': '是',
        'no': '否',
        'please': '请',
        'welcome': '欢迎',
        'how are you': '你好吗',
        'i am fine': '我很好',
        'what is your name': '你叫什么名字',
        'my name is': '我的名字是',
        'nice to meet you': '很高兴认识你',
        'where are you from': '你来自哪里',
        'i am from': '我来自',
        'i love you': '我爱你',
        'happy': '高兴',
        'sad': '悲伤',
        'angry': '生气',
        'tired': '疲倦',
        'hungry': '饿',
        'thirsty': '渴',
        'hot': '热',
        'cold': '冷',
        'big': '大',
        'small': '小',
        'old': '老',
        'new': '新',
        'good': '好',
        'bad': '坏',
        'fast': '快',
        'slow': '慢',
        'right': '对',
        'wrong': '错',
        'today': '今天',
        'tomorrow': '明天',
        'yesterday': '昨天',
        'time': '时间',
        'day': '日',
        'week': '周',
        'month': '月',
        'year': '年',
        'water': '水',
        'food': '食物',
        'money': '钱',
        'book': '书',
        'friend': '朋友',
        'family': '家庭',
        'father': '父亲',
        'mother': '母亲',
        'brother': '兄弟',
        'sister': '姐妹',
        'son': '儿子',
        'daughter': '女儿',
        'man': '男人',
        'woman': '女人',
        'child': '孩子',
        'boy': '男孩',
        'girl': '女孩',
        'person': '人',
        'people': '人们',
        'house': '房子',
        'car': '汽车',
        'phone': '电话',
        'computer': '电脑',
        'internet': '互联网',
        'language': '语言',
        'english': '英语',
        'chinese': '中文',
        'translate': '翻译',
        'hello world': '你好世界',
        'good night': '晚安'
    },

    // 常用短语映射表（中文 -> 英文）
    zhToEnDict: {
        '你好': 'hello',
        '世界': 'world',
        '早上好': 'good morning',
        '下午好': 'good afternoon',
        '晚上好': 'good evening',
        '再见': 'goodbye',
        '谢谢': 'thank you',
        '对不起': 'sorry',
        '是': 'yes',
        '否': 'no',
        '请': 'please',
        '欢迎': 'welcome',
        '你好吗': 'how are you',
        '我很好': 'i am fine',
        '你叫什么名字': 'what is your name',
        '我的名字是': 'my name is',
        '很高兴认识你': 'nice to meet you',
        '你来自哪里': 'where are you from',
        '我来自': 'i am from',
        '我爱你': 'i love you',
        '高兴': 'happy',
        '悲伤': 'sad',
        '生气': 'angry',
        '疲倦': 'tired',
        '饿': 'hungry',
        '渴': 'thirsty',
        '热': 'hot',
        '冷': 'cold',
        '大': 'big',
        '小': 'small',
        '老': 'old',
        '新': 'new',
        '好': 'good',
        '坏': 'bad',
        '快': 'fast',
        '慢': 'slow',
        '对': 'right',
        '错': 'wrong',
        '今天': 'today',
        '明天': 'tomorrow',
        '昨天': 'yesterday',
        '时间': 'time',
        '日': 'day',
        '周': 'week',
        '月': 'month',
        '年': 'year',
        '水': 'water',
        '食物': 'food',
        '钱': 'money',
        '书': 'book',
        '朋友': 'friend',
        '家庭': 'family',
        '父亲': 'father',
        '母亲': 'mother',
        '兄弟': 'brother',
        '姐妹': 'sister',
        '儿子': 'son',
        '女儿': 'daughter',
        '男人': 'man',
        '女人': 'woman',
        '孩子': 'child',
        '男孩': 'boy',
        '女孩': 'girl',
        '人': 'person',
        '人们': 'people',
        '房子': 'house',
        '汽车': 'car',
        '电话': 'phone',
        '电脑': 'computer',
        '互联网': 'internet',
        '语言': 'language',
        '英语': 'english',
        '中文': 'chinese',
        '翻译': 'translate',
        '你好世界': 'hello world',
        '晚安': 'good night'
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

        // 本地翻译目前只支持英文和中文
        if ((from === 'en' || from === 'auto') && to === 'zh') {
            return this.translateEnToZh(text);
        } else if ((from === 'zh' || from === 'auto') && to === 'en') {
            return this.translateZhToEn(text);
        } else {
            // 对于其他语言组合，返回一个提示信息
            return `[本地翻译] ${text} (只支持英中互译)`;
        }
    },

    /**
     * 英文翻译为中文
     * @param {string} text - 英文文本
     * @returns {string} 翻译后的中文文本
     */
    translateEnToZh(text) {
        // 将文本转为小写以匹配字典
        const lowerText = text.toLowerCase();

        // 检查完整的文本是否在字典中
        if (this.enToZhDict[lowerText]) {
            return this.enToZhDict[lowerText];
        }

        // 按句子分割文本
        const sentences = text.split(/[.!?。！？]\s*/g);
        const translatedSentences = [];

        for (const sentence of sentences) {
            if (!sentence.trim()) continue;

            // 尝试翻译整个句子
            const lowerSentence = sentence.toLowerCase().trim();
            if (this.enToZhDict[lowerSentence]) {
                translatedSentences.push(this.enToZhDict[lowerSentence]);
                continue;
            }

            // 如果整句没有匹配，尝试按单词翻译
            const words = sentence.split(/\s+/);
            const translatedWords = [];

            for (const word of words) {
                const lowerWord = word.toLowerCase();
                if (this.enToZhDict[lowerWord]) {
                    translatedWords.push(this.enToZhDict[lowerWord]);
                } else {
                    // 如果单词没有翻译，保留原单词
                    translatedWords.push(word);
                }
            }

            // 将翻译后的单词组合为句子（中文不需要空格）
            translatedSentences.push(translatedWords.join(''));
        }

        // 组合翻译后的句子
        return translatedSentences.join('。');
    },

    /**
     * 中文翻译为英文
     * @param {string} text - 中文文本
     * @returns {string} 翻译后的英文文本
     */
    translateZhToEn(text) {
        // 检查完整的文本是否在字典中
        if (this.zhToEnDict[text]) {
            return this.zhToEnDict[text];
        }

        // 按句子分割文本
        const sentences = text.split(/[.!?。！？]\s*/g);
        const translatedSentences = [];

        for (const sentence of sentences) {
            if (!sentence.trim()) continue;

            // 尝试翻译整个句子
            if (this.zhToEnDict[sentence.trim()]) {
                translatedSentences.push(this.zhToEnDict[sentence.trim()]);
                continue;
            }

            // 中文翻译比较复杂，此处仅做简单示例
            // 在实际应用中，可能需要使用分词等更复杂的技术
            let translated = false;

            // 尝试匹配字典中的短语
            for (const [zhPhrase, enPhrase] of Object.entries(this.zhToEnDict)) {
                if (sentence.includes(zhPhrase)) {
                    // 简单替换匹配到的短语
                    const parts = sentence.split(zhPhrase);
                    const result = [];

                    for (let i = 0; i < parts.length; i++) {
                        if (i > 0) {
                            result.push(enPhrase);
                        }
                        if (parts[i]) {
                            // 递归翻译剩余部分
                            result.push(this.translateZhToEn(parts[i]));
                        }
                    }

                    translatedSentences.push(result.join(' '));
                    translated = true;
                    break;
                }
            }

            // 如果没有匹配到任何短语，保留原句
            if (!translated) {
                translatedSentences.push(`[未翻译] ${sentence}`);
            }
        }

        // 组合翻译后的句子
        return translatedSentences.join('. ').replace(/\s+\./g, '.');
    },

    /**
     * 检测文本语言
     * @param {string} text - 要检测的文本
     * @returns {string} 检测到的语言代码 ('en'或'zh')
     */
    detectLanguage(text) {
        // 简单的语言检测逻辑
        // 计算中文字符的比例
        const chineseRegex = /[\u4e00-\u9fa5]/g;
        const chineseChars = text.match(chineseRegex) || [];
        const chineseRatio = chineseChars.length / text.length;

        // 如果中文字符占比超过30%，认为是中文
        return chineseRatio > 0.3 ? 'zh' : 'en';
    }
};

// 导出模块
export default LocalTranslate;
