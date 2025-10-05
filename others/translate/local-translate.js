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
        'good night': '晚安',
        
        // 新增词汇 - 数字
        'zero': '零', 'one': '一', 'two': '二', 'three': '三', 'four': '四', 'five': '五',
        'six': '六', 'seven': '七', 'eight': '八', 'nine': '九', 'ten': '十',
        'hundred': '百', 'thousand': '千', 'million': '百万', 'billion': '十亿',
        
        // 新增词汇 - 颜色
        'red': '红色', 'blue': '蓝色', 'green': '绿色', 'yellow': '黄色', 'black': '黑色',
        'white': '白色', 'orange': '橙色', 'purple': '紫色', 'pink': '粉色', 'brown': '棕色',
        
        // 新增词汇 - 动物
        'dog': '狗', 'cat': '猫', 'bird': '鸟', 'fish': '鱼', 'horse': '马', 'cow': '牛',
        'sheep': '羊', 'pig': '猪', 'chicken': '鸡', 'duck': '鸭', 'rabbit': '兔子',
        
        // 新增词汇 - 水果
        'apple': '苹果', 'banana': '香蕉', 'orange': '橙子', 'grape': '葡萄', 'strawberry': '草莓',
        'watermelon': '西瓜', 'pineapple': '菠萝', 'mango': '芒果', 'pear': '梨', 'peach': '桃子',
        
        // 新增词汇 - 蔬菜
        'tomato': '番茄', 'potato': '土豆', 'carrot': '胡萝卜', 'onion': '洋葱', 'cabbage': '卷心菜',
        'broccoli': '西兰花', 'spinach': '菠菜', 'corn': '玉米', 'cucumber': '黄瓜', 'pepper': '辣椒',
        
        // 新增词汇 - 天气
        'sun': '太阳', 'moon': '月亮', 'star': '星星', 'cloud': '云', 'rain': '雨',
        'snow': '雪', 'wind': '风', 'storm': '风暴', 'weather': '天气', 'temperature': '温度',
        
        // 新增词汇 - 职业
        'teacher': '老师', 'doctor': '医生', 'engineer': '工程师', 'student': '学生', 'worker': '工人',
        'farmer': '农民', 'driver': '司机', 'cook': '厨师', 'artist': '艺术家', 'scientist': '科学家',
        
        // 新增词汇 - 国家
        'china': '中国', 'america': '美国', 'england': '英国', 'france': '法国', 'germany': '德国',
        'japan': '日本', 'korea': '韩国', 'russia': '俄罗斯', 'india': '印度', 'australia': '澳大利亚',
        
        // 新增词汇 - 城市
        'beijing': '北京', 'shanghai': '上海', 'guangzhou': '广州', 'shenzhen': '深圳', 'hong kong': '香港',
        'new york': '纽约', 'london': '伦敦', 'paris': '巴黎', 'tokyo': '东京', 'seoul': '首尔',
        
        // 新增词汇 - 交通工具
        'bus': '公交车', 'train': '火车', 'airplane': '飞机', 'ship': '船', 'bicycle': '自行车',
        'motorcycle': '摩托车', 'taxi': '出租车', 'subway': '地铁', 'boat': '小船', 'truck': '卡车',
        
        // 新增词汇 - 学校相关
        'school': '学校', 'classroom': '教室', 'teacher': '老师', 'student': '学生', 'book': '书',
        'pen': '笔', 'pencil': '铅笔', 'paper': '纸', 'homework': '作业', 'exam': '考试',
        
        // 新增词汇 - 身体部位
        'head': '头', 'eye': '眼睛', 'ear': '耳朵', 'nose': '鼻子', 'mouth': '嘴',
        'hand': '手', 'foot': '脚', 'leg': '腿', 'arm': '手臂', 'heart': '心脏',
        
        // 新增词汇 - 服装
        'shirt': '衬衫', 'pants': '裤子', 'dress': '裙子', 'shoes': '鞋子', 'hat': '帽子',
        'coat': '外套', 'jacket': '夹克', 'socks': '袜子', 'gloves': '手套', 'scarf': '围巾',
        
        // 新增词汇 - 时间相关
        'morning': '早晨', 'afternoon': '下午', 'evening': '晚上', 'night': '夜晚', 'dawn': '黎明',
        'dusk': '黄昏', 'minute': '分钟', 'hour': '小时', 'second': '秒', 'clock': '时钟',
        
        // 新增词汇 - 方向
        'north': '北', 'south': '南', 'east': '东', 'west': '西', 'left': '左',
        'right': '右', 'up': '上', 'down': '下', 'front': '前', 'back': '后',
        
        // 新增词汇 - 常见动词
        'eat': '吃', 'drink': '喝', 'sleep': '睡觉', 'work': '工作', 'study': '学习',
        'play': '玩', 'read': '读', 'write': '写', 'speak': '说', 'listen': '听',
        'see': '看', 'go': '去', 'come': '来', 'buy': '买', 'sell': '卖',
        
        // 新增词汇 - 常见形容词
        'beautiful': '美丽', 'ugly': '丑陋', 'rich': '富有', 'poor': '贫穷', 'strong': '强壮',
        'weak': '虚弱', 'tall': '高', 'short': '矮', 'long': '长', 'short': '短',
        'heavy': '重', 'light': '轻', 'clean': '干净', 'dirty': '脏', 'easy': '容易',
        'difficult': '困难', 'important': '重要', 'interesting': '有趣', 'boring': '无聊',
        
        // 新增短语 - 日常用语
        'how much': '多少钱', 'what time': '几点', 'where is': '在哪里', 'how old': '多大',
        'can you help me': '你能帮我吗', 'i need help': '我需要帮助', 'excuse me': '打扰一下',
        'i dont understand': '我不明白', 'can you repeat': '你能重复吗', 'speak slowly': '说慢一点',
        'i agree': '我同意', 'i disagree': '我不同意', 'maybe': '也许', 'probably': '可能',
        'of course': '当然', 'no problem': '没问题', 'you are welcome': '不客气',
        'have a good day': '祝你今天愉快', 'see you later': '回头见', 'take care': '保重',
        
        // 扩展词汇 - 更多常见动词
        'run': '跑', 'walk': '走', 'jump': '跳', 'fly': '飞', 'swim': '游泳',
        'drive': '驾驶', 'ride': '骑', 'climb': '爬', 'dance': '跳舞', 'sing': '唱歌',
        'laugh': '笑', 'cry': '哭', 'think': '思考', 'know': '知道', 'understand': '理解',
        'remember': '记住', 'forget': '忘记', 'believe': '相信', 'hope': '希望', 'want': '想要',
        'need': '需要', 'like': '喜欢', 'love': '爱', 'hate': '讨厌', 'prefer': '更喜欢',
        'choose': '选择', 'decide': '决定', 'plan': '计划', 'try': '尝试', 'fail': '失败',
        'succeed': '成功', 'win': '赢', 'lose': '输', 'fight': '战斗', 'argue': '争论',
        'agree': '同意', 'disagree': '不同意', 'accept': '接受', 'refuse': '拒绝', 'invite': '邀请',
        'visit': '参观', 'travel': '旅行', 'move': '移动', 'stay': '停留', 'leave': '离开',
        'arrive': '到达', 'return': '返回', 'enter': '进入', 'exit': '退出', 'open': '打开',
        'close': '关闭', 'start': '开始', 'stop': '停止', 'continue': '继续', 'finish': '完成',
        'end': '结束', 'begin': '开始', 'create': '创建', 'build': '建造', 'make': '制作',
        'produce': '生产', 'grow': '种植', 'cook': '烹饪', 'bake': '烘焙', 'clean': '清洁',
        'wash': '洗', 'repair': '修理', 'break': '打破', 'destroy': '破坏', 'cut': '切割',
        'hit': '打', 'push': '推', 'pull': '拉', 'carry': '携带', 'lift': '举起',
        'throw': '扔', 'catch': '接住', 'kick': '踢', 'pick': '挑选', 'give': '给予',
        'take': '拿取', 'receive': '接收', 'send': '发送', 'bring': '带来', 'follow': '跟随',
        'lead': '领导', 'join': '加入', 'separate': '分离', 'connect': '连接', 'compare': '比较',
        'measure': '测量', 'count': '计数', 'calculate': '计算', 'add': '添加', 'subtract': '减去',
        'multiply': '乘', 'divide': '除', 'increase': '增加', 'decrease': '减少', 'change': '改变',
        'become': '变成', 'turn': '转向', 'appear': '出现', 'disappear': '消失', 'show': '展示',
        'hide': '隐藏', 'find': '寻找', 'search': '搜索', 'discover': '发现', 'explore': '探索',
        'invent': '发明', 'design': '设计', 'draw': '画画', 'paint': '绘画', 'color': '上色',
        'photograph': '拍照', 'record': '记录', 'play': '玩', 'game': '游戏', 'sport': '运动',
        
        // 扩展词汇 - 更多常见形容词
        'happy': '快乐', 'sad': '悲伤', 'angry': '生气', 'calm': '平静', 'excited': '兴奋',
        'bored': '无聊', 'surprised': '惊讶', 'confused': '困惑', 'scared': '害怕', 'brave': '勇敢',
        'nervous': '紧张', 'relaxed': '放松', 'stressed': '压力', 'proud': '自豪', 'ashamed': '羞愧',
        'jealous': '嫉妒', 'generous': '慷慨', 'selfish': '自私', 'kind': '善良', 'cruel': '残忍',
        'polite': '礼貌', 'rude': '粗鲁', 'honest': '诚实', 'dishonest': '不诚实', 'friendly': '友好',
        'unfriendly': '不友好', 'social': '社交', 'antisocial': '反社交', 'outgoing': '外向', 'shy': '害羞',
        'confident': '自信', 'insecure': '不安全', 'intelligent': '聪明', 'stupid': '愚蠢', 'wise': '明智',
        'foolish': '愚蠢', 'creative': '有创意', 'boring': '乏味', 'imaginative': '富有想象力', 'practical': '实用',
        'impractical': '不实用', 'logical': '逻辑', 'emotional': '情感', 'rational': '理性', 'irrational': '不理性',
        'patient': '耐心', 'impatient': '不耐烦', 'hardworking': '勤奋', 'lazy': '懒惰', 'active': '活跃',
        'passive': '被动', 'energetic': '精力充沛', 'tired': '疲倦', 'healthy': '健康', 'sick': '生病',
        'strong': '强壮', 'weak': '虚弱', 'fit': '健康', 'unfit': '不健康', 'flexible': '灵活',
        'stiff': '僵硬', 'fast': '快速', 'slow': '缓慢', 'quick': '迅速', 'swift': '敏捷',
        'young': '年轻', 'old': '年老', 'new': '新', 'ancient': '古老', 'modern': '现代',
        'fresh': '新鲜', 'stale': '不新鲜', 'raw': '生的', 'cooked': '煮熟的', 'hot': '热',
        'cold': '冷', 'warm': '温暖', 'cool': '凉爽', 'freezing': '冰冻', 'boiling': '沸腾',
        'wet': '湿', 'dry': '干', 'moist': '湿润', 'damp': '潮湿', 'humid': '湿润',
        'bright': '明亮', 'dark': '黑暗', 'light': '轻', 'heavy': '重', 'thick': '厚',
        'thin': '薄', 'wide': '宽', 'narrow': '窄', 'deep': '深', 'shallow': '浅',
        'high': '高', 'low': '低', 'tall': '高', 'short': '矮', 'far': '远',
        'near': '近', 'close': '近', 'distant': '远', 'expensive': '昂贵', 'cheap': '便宜',
        'valuable': '有价值', 'worthless': '无价值', 'precious': '珍贵', 'common': '普通', 'rare': '稀有',
        'unique': '独特', 'normal': '正常', 'strange': '奇怪', 'weird': '怪异', 'ordinary': '普通',
        'special': '特别', 'extraordinary': '非凡', 'simple': '简单', 'complex': '复杂', 'easy': '容易',
        'difficult': '困难', 'hard': '困难', 'soft': '软', 'hard': '硬', 'smooth': '光滑',
        'rough': '粗糙', 'sharp': '锋利', 'blunt': '钝', 'clear': '清晰', 'unclear': '不清楚',
        'obvious': '明显', 'hidden': '隐藏', 'visible': '可见', 'invisible': '不可见', 'transparent': '透明',
        'opaque': '不透明', 'loud': '大声', 'quiet': '安静', 'silent': '沉默', 'noisy': '嘈杂',
        'sweet': '甜', 'sour': '酸', 'bitter': '苦', 'salty': '咸', 'spicy': '辣',
        'delicious': '美味', 'tasty': '好吃', 'awful': '糟糕', 'disgusting': '恶心', 'fresh': '新鲜',
        
        // 扩展词汇 - 食物和饮料
        'bread': '面包', 'rice': '米饭', 'noodles': '面条', 'pasta': '意大利面', 'pizza': '披萨',
        'hamburger': '汉堡', 'sandwich': '三明治', 'cheese': '奶酪', 'butter': '黄油', 'milk': '牛奶',
        'yogurt': '酸奶', 'cream': '奶油', 'egg': '鸡蛋', 'meat': '肉', 'beef': '牛肉',
        'pork': '猪肉', 'chicken': '鸡肉', 'fish': '鱼', 'seafood': '海鲜', 'shrimp': '虾',
        'crab': '螃蟹', 'soup': '汤', 'salad': '沙拉', 'vegetable': '蔬菜', 'fruit': '水果',
        'cake': '蛋糕', 'cookie': '饼干', 'chocolate': '巧克力', 'ice cream': '冰淇淋', 'candy': '糖果',
        'sugar': '糖', 'salt': '盐', 'pepper': '胡椒', 'oil': '油', 'vinegar': '醋',
        'sauce': '酱', 'spice': '香料', 'herb': '香草', 'flour': '面粉', 'coffee': '咖啡',
        'tea': '茶', 'juice': '果汁', 'water': '水', 'soda': '苏打水', 'beer': '啤酒',
        'wine': '葡萄酒', 'alcohol': '酒精', 'breakfast': '早餐', 'lunch': '午餐', 'dinner': '晚餐',
        'snack': '零食', 'meal': '餐', 'dish': '菜', 'cuisine': '美食', 'recipe': '食谱',
        
        // 扩展词汇 - 家居用品
        'table': '桌子', 'chair': '椅子', 'sofa': '沙发', 'bed': '床', 'desk': '书桌',
        'shelf': '架子', 'cupboard': '橱柜', 'wardrobe': '衣柜', 'mirror': '镜子', 'lamp': '灯',
        'bulb': '灯泡', 'clock': '时钟', 'watch': '手表', 'battery': '电池', 'key': '钥匙',
        'lock': '锁', 'door': '门', 'window': '窗户', 'wall': '墙', 'floor': '地板',
        'ceiling': '天花板', 'roof': '屋顶', 'garden': '花园', 'yard': '院子', 'kitchen': '厨房',
        'bathroom': '浴室', 'bedroom': '卧室', 'living room': '客厅', 'dining room': '餐厅', 'garage': '车库',
        'basement': '地下室', 'attic': '阁楼', 'balcony': '阳台', 'stairs': '楼梯', 'elevator': '电梯',
        'refrigerator': '冰箱', 'freezer': '冰柜', 'oven': '烤箱', 'microwave': '微波炉', 'stove': '炉子',
        'dishwasher': '洗碗机', 'washing machine': '洗衣机', 'dryer': '烘干机', 'vacuum': '吸尘器', 'broom': '扫帚',
        'mop': '拖把', 'towel': '毛巾', 'soap': '肥皂', 'shampoo': '洗发水', 'toothbrush': '牙刷',
        'toothpaste': '牙膏', 'comb': '梳子', 'brush': '刷子', 'razor': '剃须刀', 'scissors': '剪刀',
        'knife': '刀', 'fork': '叉', 'spoon': '勺', 'plate': '盘子', 'bowl': '碗',
        'cup': '杯子', 'glass': '玻璃杯', 'mug': '马克杯', 'bottle': '瓶子', 'jar': '罐子',
        'pot': '锅', 'pan': '平底锅', 'basket': '篮子', 'bag': '包', 'backpack': '背包',
        'suitcase': '手提箱', 'purse': '钱包', 'wallet': '钱包', 'umbrella': '雨伞', 'trash can': '垃圾桶',
        
        // 扩展词汇 - 自然和环境
        'mountain': '山', 'hill': '小山', 'valley': '山谷', 'river': '河流', 'lake': '湖泊',
        'ocean': '海洋', 'sea': '海', 'beach': '海滩', 'desert': '沙漠', 'forest': '森林',
        'jungle': '丛林', 'wood': '树林', 'park': '公园', 'garden': '花园', 'field': '田野',
        'farm': '农场', 'island': '岛屿', 'volcano': '火山', 'earthquake': '地震', 'flood': '洪水',
        'drought': '干旱', 'storm': '风暴', 'hurricane': '飓风', 'tornado': '龙卷风', 'tsunami': '海啸',
        'fire': '火', 'water': '水', 'air': '空气', 'wind': '风', 'rain': '雨',
        'snow': '雪', 'ice': '冰', 'hail': '冰雹', 'fog': '雾', 'cloud': '云',
        'sky': '天空', 'sun': '太阳', 'moon': '月亮', 'star': '星星', 'planet': '行星',
        'earth': '地球', 'world': '世界', 'universe': '宇宙', 'galaxy': '星系', 'space': '太空',
        'gravity': '重力', 'atmosphere': '大气层', 'oxygen': '氧气', 'carbon dioxide': '二氧化碳', 'pollution': '污染',
        'environment': '环境', 'nature': '自然', 'ecosystem': '生态系统', 'climate': '气候', 'weather': '天气',
        'temperature': '温度', 'season': '季节', 'spring': '春天', 'summer': '夏天', 'autumn': '秋天',
        'winter': '冬天', 'plant': '植物', 'tree': '树', 'flower': '花', 'grass': '草',
        'leaf': '叶子', 'root': '根', 'branch': '树枝', 'seed': '种子', 'fruit': '水果',
        'vegetable': '蔬菜', 'crop': '庄稼', 'soil': '土壤', 'sand': '沙子', 'rock': '岩石',
        'stone': '石头', 'metal': '金属', 'gold': '金', 'silver': '银', 'copper': '铜',
        'iron': '铁', 'steel': '钢', 'plastic': '塑料', 'wood': '木头', 'paper': '纸',
        'glass': '玻璃', 'rubber': '橡胶', 'leather': '皮革', 'fabric': '织物', 'cotton': '棉花',
        'wool': '羊毛', 'silk': '丝绸', 'nylon': '尼龙', 'material': '材料', 'substance': '物质',
        
        // 扩展词汇 - 学习和教育
        'school': '学校', 'university': '大学', 'college': '学院', 'class': '班级', 'lesson': '课程',
        'subject': '科目', 'math': '数学', 'science': '科学', 'biology': '生物学', 'chemistry': '化学',
        'physics': '物理学', 'geography': '地理学', 'history': '历史', 'literature': '文学', 'art': '艺术',
        'music': '音乐', 'language': '语言', 'philosophy': '哲学', 'psychology': '心理学', 'sociology': '社会学',
        'economics': '经济学', 'politics': '政治学', 'law': '法律', 'medicine': '医学', 'engineering': '工程学',
        'architecture': '建筑学', 'computer science': '计算机科学', 'information technology': '信息技术', 'business': '商业',
        'management': '管理', 'marketing': '市场营销', 'accounting': '会计', 'finance': '金融', 'banking': '银行业',
        'teacher': '教师', 'professor': '教授', 'student': '学生', 'pupil': '小学生', 'graduate': '毕业生',
        'undergraduate': '本科生', 'postgraduate': '研究生', 'doctorate': '博士学位', 'degree': '学位', 'diploma': '文凭',
        'certificate': '证书', 'qualification': '资格', 'skill': '技能', 'knowledge': '知识', 'wisdom': '智慧',
        'intelligence': '智力', 'memory': '记忆', 'concentration': '专注', 'attention': '注意力', 'learning': '学习',
        'studying': '学习', 'research': '研究', 'experiment': '实验', 'observation': '观察', 'analysis': '分析',
        'theory': '理论', 'practice': '实践', 'experience': '经验', 'expertise': '专业知识', 'mastery': '精通',
        'textbook': '教科书', 'notebook': '笔记本', 'dictionary': '字典', 'encyclopedia': '百科全书', 'library': '图书馆',
        'laboratory': '实验室', 'workshop': '工作室', 'seminar': '研讨会', 'conference': '会议', 'lecture': '讲座',
        'presentation': '演示', 'assignment': '作业', 'project': '项目', 'thesis': '论文', 'dissertation': '学位论文',
        'exam': '考试', 'test': '测试', 'quiz': '测验', 'assessment': '评估', 'evaluation': '评价',
        'grade': '成绩', 'mark': '分数', 'score': '得分', 'result': '结果', 'achievement': '成就',
        'success': '成功', 'failure': '失败', 'progress': '进步', 'development': '发展', 'improvement': '提高',
        'education': '教育', 'teaching': '教学', 'training': '培训', 'instruction': '指导', 'guidance': '指导',
        'advice': '建议', 'feedback': '反馈', 'criticism': '批评', 'praise': '表扬', 'reward': '奖励',
        'punishment': '惩罚', 'discipline': '纪律', 'rules': '规则', 'regulations': '规定', 'policy': '政策',
        
        // 扩展词汇 - 工作和职业
        'job': '工作', 'work': '工作', 'career': '职业', 'profession': '职业', 'occupation': '职业',
        'employment': '就业', 'unemployment': '失业', 'retirement': '退休', 'promotion': '晋升', 'demotion': '降职',
        'salary': '薪水', 'wage': '工资', 'income': '收入', 'earning': '收入', 'bonus': '奖金',
        'benefit': '福利', 'pension': '养老金', 'insurance': '保险', 'contract': '合同', 'agreement': '协议',
        'responsibility': '责任', 'duty': '职责', 'task': '任务', 'assignment': '任务', 'project': '项目',
        'deadline': '截止日期', 'schedule': '时间表', 'meeting': '会议', 'appointment': '约会', 'interview': '面试',
        'application': '申请', 'resume': '简历', 'cv': '简历', 'qualification': '资格', 'experience': '经验',
        'skill': '技能', 'ability': '能力', 'talent': '才能', 'expertise': '专业知识', 'knowledge': '知识',
        'training': '培训', 'education': '教育', 'degree': '学位', 'certificate': '证书', 'license': '执照',
        'office': '办公室', 'factory': '工厂', 'workshop': '车间', 'warehouse': '仓库', 'store': '商店',
        'shop': '商店', 'market': '市场', 'company': '公司', 'corporation': '公司', 'organization': '组织',
        'institution': '机构', 'government': '政府', 'department': '部门', 'division': '部门', 'team': '团队',
        'group': '小组', 'committee': '委员会', 'board': '董事会', 'management': '管理层', 'leadership': '领导力',
        'supervisor': '主管', 'manager': '经理', 'director': '主任', 'executive': '高管', 'president': '总裁',
        'ceo': '首席执行官', 'cfo': '首席财务官', 'cto': '首席技术官', 'partner': '合伙人', 'associate': '合伙人',
        'assistant': '助理', 'secretary': '秘书', 'receptionist': '接待员', 'clerk': '职员', 'cashier': '收银员',
        'accountant': '会计', 'auditor': '审计员', 'consultant': '顾问', 'advisor': '顾问', 'analyst': '分析师',
        'specialist': '专家', 'expert': '专家', 'technician': '技术员', 'engineer': '工程师', 'architect': '建筑师',
        'designer': '设计师', 'developer': '开发人员', 'programmer': '程序员', 'researcher': '研究员', 'scientist': '科学家',
        'writer': '作家', 'author': '作者', 'journalist': '记者', 'editor': '编辑', 'publisher': '出版商',
        'artist': '艺术家', 'painter': '画家', 'sculptor': '雕塑家', 'musician': '音乐家', 'composer': '作曲家',
        'singer': '歌手', 'actor': '演员', 'actress': '女演员', 'director': '导演', 'producer': '制片人',
        'photographer': '摄影师', 'chef': '厨师', 'baker': '面包师', 'butcher': '屠夫', 'farmer': '农民',
        'gardener': '园丁', 'carpenter': '木匠', 'plumber': '水管工', 'electrician': '电工', 'mechanic': '机械师',
        'driver': '司机', 'pilot': '飞行员', 'sailor': '水手', 'soldier': '士兵', 'police': '警察',
        'officer': '官员', 'firefighter': '消防员', 'doctor': '医生', 'nurse': '护士', 'dentist': '牙医',
        'veterinarian': '兽医', 'pharmacist': '药剂师', 'therapist': '治疗师', 'psychologist': '心理学家', 'counselor': '顾问',
        'lawyer': '律师', 'judge': '法官', 'teacher': '教师', 'professor': '教授', 'principal': '校长',
        
        // 扩展词汇 - 娱乐和休闲
        'game': '游戏', 'sport': '运动', 'hobby': '爱好', 'interest': '兴趣', 'activity': '活动',
        'fun': '乐趣', 'entertainment': '娱乐', 'amusement': '娱乐', 'recreation': '娱乐', 'leisure': '休闲',
        'relaxation': '放松', 'rest': '休息', 'vacation': '假期', 'holiday': '假日', 'trip': '旅行',
        'journey': '旅程', 'adventure': '冒险', 'excursion': '短途旅行', 'tour': '旅游', 'sightseeing': '观光',
        'camping': '露营', 'hiking': '徒步旅行', 'climbing': '攀爬', 'swimming': '游泳', 'diving': '潜水',
        'surfing': '冲浪', 'skiing': '滑雪', 'skating': '滑冰', 'fishing': '钓鱼', 'hunting': '打猎',
        'golf': '高尔夫', 'tennis': '网球', 'football': '足球', 'basketball': '篮球', 'volleyball': '排球',
        'baseball': '棒球', 'cricket': '板球', 'rugby': '橄榄球', 'hockey': '曲棍球', 'badminton': '羽毛球',
        'table tennis': '乒乓球', 'bowling': '保龄球', 'chess': '国际象棋', 'checkers': '跳棋', 'cards': '纸牌',
        'poker': '扑克', 'dice': '骰子', 'puzzle': '拼图', 'crossword': '填字游戏', 'sudoku': '数独',
        'movie': '电影', 'film': '电影', 'cinema': '电影院', 'theater': '剧院', 'concert': '音乐会',
        'show': '表演', 'performance': '表演', 'play': '戏剧', 'opera': '歌剧', 'ballet': '芭蕾舞',
        'dance': '舞蹈', 'music': '音乐', 'song': '歌曲', 'singing': '唱歌', 'band': '乐队',
        'orchestra': '管弦乐队', 'instrument': '乐器', 'guitar': '吉他', 'piano': '钢琴', 'violin': '小提琴',
        'drums': '鼓', 'trumpet': '小号', 'flute': '长笛', 'saxophone': '萨克斯管', 'microphone': '麦克风',
        'radio': '收音机', 'television': '电视', 'tv': '电视', 'computer': '电脑', 'laptop': '笔记本电脑',
        'tablet': '平板电脑', 'smartphone': '智能手机', 'phone': '电话', 'camera': '相机', 'video': '视频',
        'photo': '照片', 'picture': '图片', 'painting': '绘画', 'drawing': '绘画', 'sculpture': '雕塑',
        'art': '艺术', 'museum': '博物馆', 'gallery': '画廊', 'exhibition': '展览', 'festival': '节日',
        'celebration': '庆祝', 'party': '聚会', 'gathering': '聚会', 'event': '事件', 'ceremony': '仪式',
        'wedding': '婚礼', 'birthday': '生日', 'anniversary': '周年纪念', 'christmas': '圣诞节', 'easter': '复活节',
        'halloween': '万圣节', 'new year': '新年', 'fireworks': '烟花', 'parade': '游行', 'carnival': '狂欢节',
        'picnic': '野餐', 'barbecue': '烧烤', 'dinner': '晚餐', 'lunch': '午餐', 'breakfast': '早餐',
        'brunch': '早午餐', 'supper': '晚餐', 'feast': '盛宴', 'banquet': '宴会', 'reception': '招待会',
        'club': '俱乐部', 'bar': '酒吧', 'pub': '酒吧', 'restaurant': '餐厅', 'cafe': '咖啡馆',
        'disco': '迪斯科', 'nightclub': '夜总会', 'casino': '赌场', 'amusement park': '游乐园', 'theme park': '主题公园',
        'zoo': '动物园', 'aquarium': '水族馆', 'park': '公园', 'garden': '花园', 'playground': '游乐场',
        'beach': '海滩', 'pool': '游泳池', 'spa': '水疗中心', 'gym': '健身房', 'fitness center': '健身中心',
        'stadium': '体育场', 'arena': '竞技场', 'course': '课程', 'lesson': '课程', 'class': '班级',
        'workshop': '工作室', 'seminar': '研讨会', 'conference': '会议', 'lecture': '讲座', 'presentation': '演示',
        'meeting': '会议', 'appointment': '约会', 'date': '约会', 'socializing': '社交', 'chatting': '聊天',
        'talking': '谈话', 'discussion': '讨论', 'conversation': '对话', 'debate': '辩论', 'argument': '争论',
        'reading': '阅读', 'writing': '写作', 'studying': '学习', 'learning': '学习', 'researching': '研究',
        'thinking': '思考', 'reflecting': '反思', 'meditating': '冥想', 'praying': '祈祷', 'worshipping': '崇拜',
        'volunteering': '志愿服务', 'donating': '捐赠', 'helping': '帮助', 'supporting': '支持', 'caring': '关心',
        'sharing': '分享', 'giving': '给予', 'receiving': '接收', 'exchanging': '交换', 'trading': '交易',
        'buying': '购买', 'selling': '销售', 'shopping': '购物', 'browsing': '浏览', 'searching': '搜索',
        'exploring': '探索', 'discovering': '发现', 'experimenting': '实验', 'trying': '尝试', 'testing': '测试',
        'practicing': '练习', 'training': '训练', 'exercising': '锻炼', 'working out': '锻炼', 'relaxing': '放松',
        'resting': '休息', 'sleeping': '睡觉', 'napping': '小睡', 'dreaming': '做梦', 'imagining': '想象',
        'creating': '创造', 'inventing': '发明', 'designing': '设计', 'building': '建造', 'making': '制作',
        'cooking': '烹饪', 'baking': '烘焙', 'grilling': '烧烤', 'frying': '煎', 'boiling': '煮',
        'steaming': '蒸', 'roasting': '烤', 'chopping': '切', 'cutting': '切割', 'slicing': '切片',
        'mixing': '混合', 'stirring': '搅拌', 'beating': '打', 'whisking': '搅打', 'kneading': '揉',
        'rolling': '滚动', 'folding': '折叠', 'molding': '塑造', 'shaping': '塑造', 'carving': '雕刻',
        'painting': '绘画', 'drawing': '绘画', 'sketching': '素描', 'coloring': '上色', 'decorating': '装饰',
        'arranging': '安排', 'organizing': '组织', 'planning': '计划', 'preparing': '准备', 'setting up': '设置',
        'cleaning': '清洁', 'washing': '清洗', 'wiping': '擦拭', 'dusting': '除尘', 'sweeping': '扫地',
        'mopping': '拖地', 'vacuuming': '吸尘', 'polishing': '抛光', 'scrubbing': '擦洗', 'rinsing': '冲洗',
        'drying': '干燥', 'hanging': '悬挂', 'folding': '折叠', 'ironing': '熨烫', 'sewing': '缝纫',
        'knitting': '编织', 'crocheting': '钩编', 'embroidering': '刺绣', 'mending': '修补', 'repairing': '修理',
        'fixing': '修理', 'adjusting': '调整', 'modifying': '修改', 'changing': '改变', 'replacing': '替换',
        'installing': '安装', 'assembling': '组装', 'disassembling': '拆卸', 'connecting': '连接', 'disconnecting': '断开',
        'attaching': '连接', 'detaching': '分离', 'fastening': '固定', 'unfastening': '解开', 'tying': '系',
        'untying': '解开', 'binding': '捆绑', 'wrapping': '包装', 'unwrapping': '打开包装', 'packing': '打包',
        'unpacking': '拆包', 'loading': '装载', 'unloading': '卸载', 'carrying': '携带', 'transporting': '运输',
        'delivering': '递送', 'sending': '发送', 'receiving': '接收', 'collecting': '收集', 'gathering': '收集',
        'storing': '存储', 'keeping': '保存', 'saving': '保存', 'preserving': '保存', 'protecting': '保护',
        'guarding': '守卫', 'defending': '防御', 'attacking': '攻击', 'fighting': '战斗', 'competing': '竞争',
        'winning': '获胜', 'losing': '失败', 'succeeding': '成功', 'failing': '失败', 'achieving': '实现',
        'accomplishing': '完成', 'finishing': '完成', 'completing': '完成', 'ending': '结束', 'starting': '开始',
        'beginning': '开始', 'continuing': '继续', 'stopping': '停止', 'pausing': '暂停', 'waiting': '等待',
        'hoping': '希望', 'wishing': '希望', 'dreaming': '梦想', 'desiring': '渴望', 'wanting': '想要',
        'needing': '需要', 'requiring': '需要', 'demanding': '要求', 'requesting': '请求', 'asking': '询问',
        'questioning': '质疑', 'inquiring': '询问', 'investigating': '调查', 'examining': '检查', 'inspecting': '检查',
        'observing': '观察', 'watching': '观看', 'looking': '看', 'seeing': '看见', 'viewing': '观看',
        'witnessing': '见证', 'noticing': '注意到', 'spotting': '发现', 'recognizing': '认出', 'identifying': '识别',
        'discovering': '发现', 'finding': '找到', 'searching': '搜索', 'seeking': '寻找', 'exploring': '探索',
        'traveling': '旅行', 'journeying': '旅行', 'touring': '旅游', 'visiting': '参观', 'sightseeing': '观光',
        'wandering': '漫游', 'roaming': '漫游', 'drifting': '漂移', 'sailing': '航行', 'cruising': '巡航',
        'flying': '飞行', 'soaring': '翱翔', 'gliding': '滑翔', 'floating': '漂浮', 'swimming': '游泳',
        'diving': '潜水', 'plunging': '跳入', 'jumping': '跳跃', 'leaping': '跳跃', 'hopping': '跳跃',
        'skipping': '跳跃', 'running': '跑步', 'jogging': '慢跑', 'sprinting': '冲刺', 'dashing': '猛冲',
        'rushing': '匆忙', 'hurrying': '匆忙', 'speeding': '加速', 'racing': '比赛', 'chasing': '追逐',
        'following': '跟随', 'pursuing': '追求', 'hunting': '狩猎', 'tracking': '追踪', 'tracing': '追踪',
        'leading': '领导', 'guiding': '引导', 'directing': '指导', 'showing': '展示', 'demonstrating': '演示',
        'teaching': '教学', 'educating': '教育', 'training': '训练', 'coaching': '教练', 'instructing': '指导',
        'advising': '建议', 'counseling': '咨询', 'consulting': '咨询', 'recommending': '推荐', 'suggesting': '建议',
        'proposing': '提议', 'offering': '提供', 'presenting': '呈现', 'delivering': '递送', 'providing': '提供',
        'supplying': '供应', 'furnishing': '提供', 'equipping': '装备', 'preparing': '准备', 'arranging': '安排',
        'organizing': '组织', 'planning': '计划', 'scheduling': '安排', 'coordinating': '协调', 'managing': '管理',
        'supervising': '监督', 'overseeing': '监督', 'monitoring': '监控', 'controlling': '控制', 'regulating': '调节',
        'governing': '管理', 'ruling': '统治', 'commanding': '命令', 'ordering': '命令', 'directing': '指导',
        'instructing': '指导', 'telling': '告诉', 'informing': '通知', 'notifying': '通知', 'announcing': '宣布',
        'declaring': '宣布', 'proclaiming': '宣布', 'broadcasting': '广播', 'publishing': '出版', 'printing': '打印',
        'writing': '写作', 'recording': '记录', 'documenting': '记录', 'reporting': '报告', 'describing': '描述',
        'explaining': '解释', 'clarifying': '澄清', 'defining': '定义', 'specifying': '指定', 'detailing': '详细说明',
        'outlining': '概述', 'summarizing': '总结', 'reviewing': '审查', 'analyzing': '分析', 'examining': '检查',
        'investigating': '调查', 'researching': '研究', 'studying': '学习', 'learning': '学习', 'memorizing': '记忆',
        'remembering': '记住', 'recalling': '回忆', 'recollecting': '回忆', 'reminding': '提醒', 'forgetting': '忘记',
        'ignoring': '忽视', 'neglecting': '忽视', 'overlooking': '忽视', 'missing': '错过', 'losing': '失去',
        'finding': '找到', 'locating': '定位', 'discovering': '发现', 'uncovering': '发现', 'revealing': '揭示',
        'exposing': '暴露', 'showing': '展示', 'displaying': '展示', 'exhibiting': '展览', 'presenting': '呈现',
        'offering': '提供', 'giving': '给予', 'donating': '捐赠', 'contributing': '贡献', 'providing': '提供',
        'supplying': '供应', 'delivering': '递送', 'distributing': '分发', 'sharing': '分享', 'dividing': '分割',
        'splitting': '分裂', 'separating': '分离', 'disconnecting': '断开', 'detaching': '分离', 'removing': '移除',
        'eliminating': '消除', 'erasing': '擦除', 'deleting': '删除', 'destroying': '摧毁', 'damaging': '损坏',
        'breaking': '打破', 'cracking': '破裂', 'shattering': '粉碎', 'tearing': '撕裂', 'ripping': '撕扯',
        'cutting': '切割', 'slicing': '切片', 'chopping': '砍', 'hacking': '砍', 'slashing': '砍',
        'piercing': '刺穿', 'puncturing': '刺穿', 'stabbing': '刺', 'shooting': '射击', 'firing': '开火',
        'throwing': '扔', 'tossing': '抛', 'casting': '投', 'flinging': '抛', 'hurling': '猛投',
        'launching': '发射', 'ejecting': '弹出', 'expelling': '驱逐', 'forcing': '强迫', 'pushing': '推',
        'pressing': '按', 'squeezing': '挤压', 'crushing': '压碎', 'grinding': '磨碎', 'pounding': '重击',
        'beating': '打', 'hitting': '击打', 'striking': '打击', 'slapping': '拍打', 'punching': '拳击',
        'kicking': '踢', 'stomping': '踩踏', 'trampling': '践踏', 'stamping': '踩', 'stepping': '踏',
        'walking': '走路', 'marching': '行进', 'parading': '游行', 'patrolling': '巡逻', 'wandering': '漫游',
        'roaming': '漫游', 'drifting': '漂移', 'floating': '漂浮', 'sinking': '下沉', 'drowning': '溺水',
        'swimming': '游泳', 'diving': '潜水', 'plunging': '跳入', 'jumping': '跳跃', 'leaping': '跳跃',
        'hopping': '跳跃', 'skipping': '跳跃', 'dancing': '跳舞', 'twirling': '旋转', 'spinning': '旋转',
        'turning': '转动', 'rotating': '旋转', 'revolving': '旋转', 'circling': '环绕', 'orbiting': '环绕',
        'surrounding': '包围', 'encircling': '环绕', 'enveloping': '包围', 'covering': '覆盖', 'wrapping': '包裹',
        'packaging': '包装', 'boxing': '装箱', 'containing': '包含', 'holding': '持有', 'carrying': '携带',
        'transporting': '运输', 'moving': '移动', 'shifting': '移动', 'transferring': '转移', 'relocating': '搬迁',
        'placing': '放置', 'positioning': '定位', 'locating': '定位', 'situating': '安置', 'installing': '安装',
        'setting': '设置', 'adjusting': '调整', 'modifying': '修改', 'changing': '改变', 'altering': '改变',
        'transforming': '转变', 'converting': '转换', 'adapting': '适应', 'adjusting': '调整', 'accommodating': '适应',
        'fitting': '适合', 'matching': '匹配', 'corresponding': '对应', 'relating': '关联', 'connecting': '连接',
        'linking': '连接', 'joining': '加入', 'uniting': '联合', 'combining': '结合', 'merging': '合并',
        'blending': '混合', 'mixing': '混合', 'stirring': '搅拌', 'beating': '打', 'whisking': '搅打',
        'folding': '折叠', 'bending': '弯曲', 'flexing': '弯曲', 'curving': '弯曲', 'twisting': '扭曲',
        'winding': '缠绕', 'coiling': '盘绕', 'spiraling': '螺旋', 'curling': '卷曲', 'rolling': '滚动',
        'turning': '转动', 'spinning': '旋转', 'rotating': '旋转', 'revolving': '旋转', 'circling': '环绕',
        'orbiting': '环绕', 'encircling': '环绕', 'surrounding': '包围', 'enveloping': '包围', 'covering': '覆盖',
        'wrapping': '包裹', 'packaging': '包装', 'boxing': '装箱', 'containing': '包含', 'holding': '持有',
        'carrying': '携带', 'transporting': '运输', 'moving': '移动', 'shifting': '移动', 'transferring': '转移',
        'relocating': '搬迁', 'placing': '放置', 'positioning': '定位', 'locating': '定位', 'situating': '安置',
        'installing': '安装', 'setting': '设置', 'adjusting': '调整', 'modifying': '修改', 'changing': '改变',
        'altering': '改变', 'transforming': '转变', 'converting': '转换', 'adapting': '适应', 'adjusting': '调整',
        'accommodating': '适应', 'fitting': '适合', 'matching': '匹配', 'corresponding': '对应', 'relating': '关联',
        'connecting': '连接', 'linking': '连接', 'joining': '加入', 'uniting': '联合', 'combining': '结合',
        'merging': '合并', 'blending': '混合', 'mixing': '混合', 'stirring': '搅拌', 'beating': '打',
        'whisking': '搅打', 'folding': '折叠', 'bending': '弯曲', 'flexing': '弯曲', 'curving': '弯曲',
        'twisting': '扭曲', 'winding': '缠绕', 'coiling': '盘绕', 'spiraling': '螺旋', 'curling': '卷曲'
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
        '晚安': 'good night',
        
        // 新增词汇 - 数字
        '零': 'zero', '一': 'one', '二': 'two', '三': 'three', '四': 'four', '五': 'five',
        '六': 'six', '七': 'seven', '八': 'eight', '九': 'nine', '十': 'ten',
        '百': 'hundred', '千': 'thousand', '百万': 'million', '十亿': 'billion',
        
        // 新增词汇 - 颜色
        '红色': 'red', '蓝色': 'blue', '绿色': 'green', '黄色': 'yellow', '黑色': 'black',
        '白色': 'white', '橙色': 'orange', '紫色': 'purple', '粉色': 'pink', '棕色': 'brown',
        
        // 新增词汇 - 动物
        '狗': 'dog', '猫': 'cat', '鸟': 'bird', '鱼': 'fish', '马': 'horse', '牛': 'cow',
        '羊': 'sheep', '猪': 'pig', '鸡': 'chicken', '鸭': 'duck', '兔子': 'rabbit',
        
        // 新增词汇 - 水果
        '苹果': 'apple', '香蕉': 'banana', '橙子': 'orange', '葡萄': 'grape', '草莓': 'strawberry',
        '西瓜': 'watermelon', '菠萝': 'pineapple', '芒果': 'mango', '梨': 'pear', '桃子': 'peach',
        
        // 新增词汇 - 蔬菜
        '番茄': 'tomato', '土豆': 'potato', '胡萝卜': 'carrot', '洋葱': 'onion', '卷心菜': 'cabbage',
        '西兰花': 'broccoli', '菠菜': 'spinach', '玉米': 'corn', '黄瓜': 'cucumber', '辣椒': 'pepper',
        
        // 新增词汇 - 天气
        '太阳': 'sun', '月亮': 'moon', '星星': 'star', '云': 'cloud', '雨': 'rain',
        '雪': 'snow', '风': 'wind', '风暴': 'storm', '天气': 'weather', '温度': 'temperature',
        
        // 新增词汇 - 职业
        '老师': 'teacher', '医生': 'doctor', '工程师': 'engineer', '学生': 'student', '工人': 'worker',
        '农民': 'farmer', '司机': 'driver', '厨师': 'cook', '艺术家': 'artist', '科学家': 'scientist',
        
        // 新增词汇 - 国家
        '中国': 'china', '美国': 'america', '英国': 'england', '法国': 'france', '德国': 'germany',
        '日本': 'japan', '韩国': 'korea', '俄罗斯': 'russia', '印度': 'india', '澳大利亚': 'australia',
        
        // 新增词汇 - 城市
        '北京': 'beijing', '上海': 'shanghai', '广州': 'guangzhou', '深圳': 'shenzhen', '香港': 'hong kong',
        '纽约': 'new york', '伦敦': 'london', '巴黎': 'paris', '东京': 'tokyo', '首尔': 'seoul',
        
        // 新增词汇 - 交通工具
        '公交车': 'bus', '火车': 'train', '飞机': 'airplane', '船': 'ship', '自行车': 'bicycle',
        '摩托车': 'motorcycle', '出租车': 'taxi', '地铁': 'subway', '小船': 'boat', '卡车': 'truck',
        
        // 新增词汇 - 学校相关
        '学校': 'school', '教室': 'classroom', '老师': 'teacher', '学生': 'student', '书': 'book',
        '笔': 'pen', '铅笔': 'pencil', '纸': 'paper', '作业': 'homework', '考试': 'exam',
        
        // 新增词汇 - 身体部位
        '头': 'head', '眼睛': 'eye', '耳朵': 'ear', '鼻子': 'nose', '嘴': 'mouth',
        '手': 'hand', '脚': 'foot', '腿': 'leg', '手臂': 'arm', '心脏': 'heart',
        
        // 新增词汇 - 服装
        '衬衫': 'shirt', '裤子': 'pants', '裙子': 'dress', '鞋子': 'shoes', '帽子': 'hat',
        '外套': 'coat', '夹克': 'jacket', '袜子': 'socks', '手套': 'gloves', '围巾': 'scarf',
        
        // 新增词汇 - 时间相关
        '早晨': 'morning', '下午': 'afternoon', '晚上': 'evening', '夜晚': 'night', '黎明': 'dawn',
        '黄昏': 'dusk', '分钟': 'minute', '小时': 'hour', '秒': 'second', '时钟': 'clock',
        
        // 新增词汇 - 方向
        '北': 'north', '南': 'south', '东': 'east', '西': 'west', '左': 'left',
        '右': 'right', '上': 'up', '下': 'down', '前': 'front', '后': 'back',
        
        // 新增词汇 - 常见动词
        '吃': 'eat', '喝': 'drink', '睡觉': 'sleep', '工作': 'work', '学习': 'study',
        '玩': 'play', '读': 'read', '写': 'write', '说': 'speak', '听': 'listen',
        '看': 'see', '去': 'go', '来': 'come', '买': 'buy', '卖': 'sell',
        
        // 新增词汇 - 常见形容词
        '美丽': 'beautiful', '丑陋': 'ugly', '富有': 'rich', '贫穷': 'poor', '强壮': 'strong',
        '虚弱': 'weak', '高': 'tall', '矮': 'short', '长': 'long', '短': 'short',
        '重': 'heavy', '轻': 'light', '干净': 'clean', '脏': 'dirty', '容易': 'easy',
        '困难': 'difficult', '重要': 'important', '有趣': 'interesting', '无聊': 'boring',
        
        // 扩展词汇 - 日常用语
        '多少钱': 'how much', '几点': 'what time', '在哪里': 'where is', '多大': 'how old',
        '你能帮我吗': 'can you help me', '我需要帮助': 'i need help', '打扰一下': 'excuse me',
        '我不明白': 'i dont understand', '你能重复吗': 'can you repeat', '说慢一点': 'speak slowly',
        '我同意': 'i agree', '我不同意': 'i disagree', '也许': 'maybe', '可能': 'probably',
        '当然': 'of course', '没问题': 'no problem', '不客气': 'you are welcome',
        '祝你今天愉快': 'have a good day', '回头见': 'see you later', '保重': 'take care',
        
        // 扩展词汇 - 更多常见动词
        '跑': 'run', '走': 'walk', '跳': 'jump', '飞': 'fly', '游泳': 'swim',
        '驾驶': 'drive', '骑': 'ride', '爬': 'climb', '跳舞': 'dance', '唱歌': 'sing',
        '笑': 'laugh', '哭': 'cry', '思考': 'think', '知道': 'know', '理解': 'understand',
        '记住': 'remember', '忘记': 'forget', '相信': 'believe', '希望': 'hope', '想要': 'want',
        '需要': 'need', '喜欢': 'like', '爱': 'love', '讨厌': 'hate', '更喜欢': 'prefer',
        '选择': 'choose', '决定': 'decide', '计划': 'plan', '尝试': 'try', '失败': 'fail',
        '成功': 'succeed', '赢': 'win', '输': 'lose', '战斗': 'fight', '争论': 'argue',
        '同意': 'agree', '不同意': 'disagree', '接受': 'accept', '拒绝': 'refuse', '邀请': 'invite',
        '参观': 'visit', '旅行': 'travel', '移动': 'move', '停留': 'stay', '离开': 'leave',
        '到达': 'arrive', '返回': 'return', '进入': 'enter', '退出': 'exit', '打开': 'open',
        '关闭': 'close', '开始': 'start', '停止': 'stop', '继续': 'continue', '完成': 'finish',
        '结束': 'end', '创建': 'create', '建造': 'build', '制作': 'make', '生产': 'produce',
        '种植': 'grow', '烹饪': 'cook', '烘焙': 'bake', '清洁': 'clean', '洗': 'wash',
        '修理': 'repair', '打破': 'break', '破坏': 'destroy', '切割': 'cut', '打': 'hit',
        '推': 'push', '拉': 'pull', '携带': 'carry', '举起': 'lift', '扔': 'throw',
        '接住': 'catch', '踢': 'kick', '挑选': 'pick', '给予': 'give', '拿取': 'take',
        '接收': 'receive', '发送': 'send', '带来': 'bring', '跟随': 'follow', '领导': 'lead',
        '加入': 'join', '分离': 'separate', '连接': 'connect', '比较': 'compare', '测量': 'measure',
        '计数': 'count', '计算': 'calculate', '添加': 'add', '减去': 'subtract', '乘': 'multiply',
        '除': 'divide', '增加': 'increase', '减少': 'decrease', '改变': 'change', '变成': 'become',
        '转向': 'turn', '出现': 'appear', '消失': 'disappear', '展示': 'show', '隐藏': 'hide',
        '寻找': 'find', '搜索': 'search', '发现': 'discover', '探索': 'explore', '发明': 'invent',
        '设计': 'design', '画画': 'draw', '绘画': 'paint', '上色': 'color', '拍照': 'photograph',
        '记录': 'record', '玩': 'play', '游戏': 'game', '运动': 'sport',
        
        // 扩展词汇 - 更多常见形容词
        '快乐': 'happy', '悲伤': 'sad', '生气': 'angry', '平静': 'calm', '兴奋': 'excited',
        '无聊': 'bored', '惊讶': 'surprised', '困惑': 'confused', '害怕': 'scared', '勇敢': 'brave',
        '紧张': 'nervous', '放松': 'relaxed', '压力': 'stressed', '自豪': 'proud', '羞愧': 'ashamed',
        '嫉妒': 'jealous', '慷慨': 'generous', '自私': 'selfish', '善良': 'kind', '残忍': 'cruel',
        '礼貌': 'polite', '粗鲁': 'rude', '诚实': 'honest', '不诚实': 'dishonest', '友好': 'friendly',
        '不友好': 'unfriendly', '社交': 'social', '反社交': 'antisocial', '外向': 'outgoing', '害羞': 'shy',
        '自信': 'confident', '不安全': 'insecure', '聪明': 'intelligent', '愚蠢': 'stupid', '明智': 'wise',
        '有创意': 'creative', '乏味': 'boring', '富有想象力': 'imaginative', '实用': 'practical', '不实用': 'impractical',
        '逻辑': 'logical', '情感': 'emotional', '理性': 'rational', '不理性': 'irrational', '耐心': 'patient',
        '不耐烦': 'impatient', '勤奋': 'hardworking', '懒惰': 'lazy', '活跃': 'active', '被动': 'passive',
        '精力充沛': 'energetic', '疲倦': 'tired', '健康': 'healthy', '生病': 'sick', '强壮': 'strong',
        '虚弱': 'weak', '灵活': 'flexible', '僵硬': 'stiff', '快速': 'fast', '缓慢': 'slow',
        '迅速': 'quick', '敏捷': 'swift', '年轻': 'young', '年老': 'old', '新': 'new',
        '古老': 'ancient', '现代': 'modern', '新鲜': 'fresh', '不新鲜': 'stale', '生的': 'raw',
        '煮熟的': 'cooked', '热': 'hot', '冷': 'cold', '温暖': 'warm', '凉爽': 'cool',
        '冰冻': 'freezing', '沸腾': 'boiling', '湿': 'wet', '干': 'dry', '湿润': 'moist',
        '潮湿': 'damp', '明亮': 'bright', '黑暗': 'dark', '轻': 'light', '重': 'heavy',
        '厚': 'thick', '薄': 'thin', '宽': 'wide', '窄': 'narrow', '深': 'deep',
        '浅': 'shallow', '高': 'high', '低': 'low', '矮': 'short', '远': 'far',
        '近': 'near', '昂贵': 'expensive', '便宜': 'cheap', '有价值': 'valuable', '无价值': 'worthless',
        '珍贵': 'precious', '普通': 'common', '稀有': 'rare', '独特': 'unique', '正常': 'normal',
        '奇怪': 'strange', '怪异': 'weird', '特别': 'special', '非凡': 'extraordinary', '简单': 'simple',
        '复杂': 'complex', '容易': 'easy', '困难': 'difficult', '软': 'soft', '硬': 'hard',
        '光滑': 'smooth', '粗糙': 'rough', '锋利': 'sharp', '钝': 'blunt', '清晰': 'clear',
        '不清楚': 'unclear', '明显': 'obvious', '隐藏': 'hidden', '可见': 'visible', '不可见': 'invisible',
        '透明': 'transparent', '不透明': 'opaque', '大声': 'loud', '安静': 'quiet', '沉默': 'silent',
        '嘈杂': 'noisy', '甜': 'sweet', '酸': 'sour', '苦': 'bitter', '咸': 'salty',
        '辣': 'spicy', '美味': 'delicious', '好吃': 'tasty', '糟糕': 'awful', '恶心': 'disgusting',
        
        // 扩展词汇 - 食物和饮料
        '面包': 'bread', '米饭': 'rice', '面条': 'noodles', '意大利面': 'pasta', '披萨': 'pizza',
        '汉堡': 'hamburger', '三明治': 'sandwich', '奶酪': 'cheese', '黄油': 'butter', '牛奶': 'milk',
        '酸奶': 'yogurt', '奶油': 'cream', '鸡蛋': 'egg', '肉': 'meat', '牛肉': 'beef',
        '猪肉': 'pork', '鸡肉': 'chicken', '鱼': 'fish', '海鲜': 'seafood', '虾': 'shrimp',
        '螃蟹': 'crab', '汤': 'soup', '沙拉': 'salad', '蔬菜': 'vegetable', '水果': 'fruit',
        '蛋糕': 'cake', '饼干': 'cookie', '巧克力': 'chocolate', '冰淇淋': 'ice cream', '糖果': 'candy',
        '糖': 'sugar', '盐': 'salt', '胡椒': 'pepper', '油': 'oil', '醋': 'vinegar',
        '酱': 'sauce', '香料': 'spice', '香草': 'herb', '面粉': 'flour', '咖啡': 'coffee',
        '茶': 'tea', '果汁': 'juice', '水': 'water', '苏打水': 'soda', '啤酒': 'beer',
        '葡萄酒': 'wine', '酒精': 'alcohol', '早餐': 'breakfast', '午餐': 'lunch', '晚餐': 'dinner',
        '零食': 'snack', '餐': 'meal', '菜': 'dish', '美食': 'cuisine', '食谱': 'recipe',
        
        // 扩展词汇 - 家居用品
        '桌子': 'table', '椅子': 'chair', '沙发': 'sofa', '床': 'bed', '书桌': 'desk',
        '架子': 'shelf', '橱柜': 'cupboard', '衣柜': 'wardrobe', '镜子': 'mirror', '灯': 'lamp',
        '灯泡': 'bulb', '时钟': 'clock', '手表': 'watch', '电池': 'battery', '钥匙': 'key',
        '锁': 'lock', '门': 'door', '窗户': 'window', '墙': 'wall', '地板': 'floor',
        '天花板': 'ceiling', '屋顶': 'roof', '花园': 'garden', '院子': 'yard', '厨房': 'kitchen',
        '浴室': 'bathroom', '卧室': 'bedroom', '客厅': 'living room', '餐厅': 'dining room', '车库': 'garage',
        '地下室': 'basement', '阁楼': 'attic', '阳台': 'balcony', '楼梯': 'stairs', '电梯': 'elevator',
        '冰箱': 'refrigerator', '冰柜': 'freezer', '烤箱': 'oven', '微波炉': 'microwave', '炉子': 'stove',
        '洗碗机': 'dishwasher', '洗衣机': 'washing machine', '烘干机': 'dryer', '吸尘器': 'vacuum', '扫帚': 'broom',
        '拖把': 'mop', '毛巾': 'towel', '肥皂': 'soap', '洗发水': 'shampoo', '牙刷': 'toothbrush',
        '牙膏': 'toothpaste', '梳子': 'comb', '刷子': 'brush', '剃须刀': 'razor', '剪刀': 'scissors',
        '刀': 'knife', '叉': 'fork', '勺': 'spoon', '盘子': 'plate', '碗': 'bowl',
        '杯子': 'cup', '玻璃杯': 'glass', '马克杯': 'mug', '瓶子': 'bottle', '罐子': 'jar',
        '锅': 'pot', '平底锅': 'pan', '篮子': 'basket', '包': 'bag', '背包': 'backpack',
        '手提箱': 'suitcase', '钱包': 'purse', '雨伞': 'umbrella', '垃圾桶': 'trash can',
        
        // 扩展词汇 - 自然和环境
        '山': 'mountain', '小山': 'hill', '山谷': 'valley', '河流': 'river', '湖泊': 'lake',
        '海洋': 'ocean', '海': 'sea', '海滩': 'beach', '沙漠': 'desert', '森林': 'forest',
        '丛林': 'jungle', '树林': 'wood', '公园': 'park', '田野': 'field', '农场': 'farm',
        '岛屿': 'island', '火山': 'volcano', '地震': 'earthquake', '洪水': 'flood', '干旱': 'drought',
        '风暴': 'storm', '飓风': 'hurricane', '龙卷风': 'tornado', '海啸': 'tsunami', '火': 'fire',
        '水': 'water', '空气': 'air', '风': 'wind', '雨': 'rain', '雪': 'snow',
        '冰': 'ice', '冰雹': 'hail', '雾': 'fog', '云': 'cloud', '天空': 'sky',
        '太阳': 'sun', '月亮': 'moon', '星星': 'star', '行星': 'planet', '地球': 'earth',
        '世界': 'world', '宇宙': 'universe', '星系': 'galaxy', '太空': 'space', '重力': 'gravity',
        '大气层': 'atmosphere', '氧气': 'oxygen', '二氧化碳': 'carbon dioxide', '污染': 'pollution', '环境': 'environment',
        '自然': 'nature', '生态系统': 'ecosystem', '气候': 'climate', '天气': 'weather', '温度': 'temperature',
        '季节': 'season', '春天': 'spring', '夏天': 'summer', '秋天': 'autumn', '冬天': 'winter',
        '植物': 'plant', '树': 'tree', '花': 'flower', '草': 'grass', '叶子': 'leaf',
        '根': 'root', '树枝': 'branch', '种子': 'seed', '庄稼': 'crop', '土壤': 'soil',
        '沙子': 'sand', '岩石': 'rock', '石头': 'stone', '金属': 'metal', '金': 'gold',
        '银': 'silver', '铜': 'copper', '铁': 'iron', '钢': 'steel', '塑料': 'plastic',
        '木头': 'wood', '纸': 'paper', '玻璃': 'glass', '橡胶': 'rubber', '皮革': 'leather',
        '织物': 'fabric', '棉花': 'cotton', '羊毛': 'wool', '丝绸': 'silk', '尼龙': 'nylon',
        '材料': 'material', '物质': 'substance',
        
        // 扩展词汇 - 学习和教育
        '学校': 'school', '大学': 'university', '学院': 'college', '班级': 'class', '课程': 'lesson',
        '科目': 'subject', '数学': 'math', '科学': 'science', '生物学': 'biology', '化学': 'chemistry',
        '物理学': 'physics', '地理学': 'geography', '历史': 'history', '文学': 'literature', '艺术': 'art',
        '音乐': 'music', '语言': 'language', '哲学': 'philosophy', '心理学': 'psychology', '社会学': 'sociology',
        '经济学': 'economics', '政治学': 'politics', '法律': 'law', '医学': 'medicine', '工程学': 'engineering',
        '建筑学': 'architecture', '计算机科学': 'computer science', '信息技术': 'information technology', '商业': 'business',
        '管理': 'management', '市场营销': 'marketing', '会计': 'accounting', '金融': 'finance', '银行业': 'banking',
        '教师': 'teacher', '教授': 'professor', '学生': 'student', '小学生': 'pupil', '毕业生': 'graduate',
        '本科生': 'undergraduate', '研究生': 'postgraduate', '博士学位': 'doctorate', '学位': 'degree', '文凭': 'diploma',
        '证书': 'certificate', '资格': 'qualification', '技能': 'skill', '知识': 'knowledge', '智慧': 'wisdom',
        '智力': 'intelligence', '记忆': 'memory', '专注': 'concentration', '注意力': 'attention', '学习': 'learning',
        '研究': 'research', '实验': 'experiment', '观察': 'observation', '分析': 'analysis', '理论': 'theory',
        '实践': 'practice', '经验': 'experience', '专业知识': 'expertise', '精通': 'mastery', '教科书': 'textbook',
        '笔记本': 'notebook', '字典': 'dictionary', '百科全书': 'encyclopedia', '图书馆': 'library', '实验室': 'laboratory',
        '工作室': 'workshop', '研讨会': 'seminar', '会议': 'conference', '讲座': 'lecture', '演示': 'presentation',
        '作业': 'assignment', '项目': 'project', '论文': 'thesis', '学位论文': 'dissertation', '考试': 'exam',
        '测试': 'test', '测验': 'quiz', '评估': 'assessment', '评价': 'evaluation', '成绩': 'grade',
        '分数': 'mark', '得分': 'score', '结果': 'result', '成就': 'achievement', '成功': 'success',
        '失败': 'failure', '进步': 'progress', '发展': 'development', '提高': 'improvement', '教育': 'education',
        '教学': 'teaching', '培训': 'training', '指导': 'instruction', '建议': 'advice', '反馈': 'feedback',
        '批评': 'criticism', '表扬': 'praise', '奖励': 'reward', '惩罚': 'punishment', '纪律': 'discipline',
        '规则': 'rules', '规定': 'regulations', '政策': 'policy',
        
        // 扩展词汇 - 工作和职业
        '工作': 'job', '职业': 'career', '就业': 'employment', '失业': 'unemployment', '退休': 'retirement',
        '晋升': 'promotion', '降职': 'demotion', '薪水': 'salary', '工资': 'wage', '收入': 'income',
        '奖金': 'bonus', '福利': 'benefit', '养老金': 'pension', '保险': 'insurance', '合同': 'contract',
        '协议': 'agreement', '责任': 'responsibility', '职责': 'duty', '任务': 'task', '截止日期': 'deadline',
        '时间表': 'schedule', '会议': 'meeting', '约会': 'appointment', '面试': 'interview', '申请': 'application',
        '简历': 'resume', '经验': 'experience', '能力': 'ability', '才能': 'talent', '执照': 'license',
        '办公室': 'office', '工厂': 'factory', '车间': 'workshop', '仓库': 'warehouse', '商店': 'store',
        '市场': 'market', '公司': 'company', '组织': 'organization', '机构': 'institution', '政府': 'government',
        '部门': 'department', '团队': 'team', '小组': 'group', '委员会': 'committee', '董事会': 'board',
        '管理层': 'management', '领导力': 'leadership', '主管': 'supervisor', '经理': 'manager', '主任': 'director',
        '高管': 'executive', '总裁': 'president', '首席执行官': 'ceo', '首席财务官': 'cfo', '首席技术官': 'cto',
        '合伙人': 'partner', '助理': 'assistant', '秘书': 'secretary', '接待员': 'receptionist', '职员': 'clerk',
        '收银员': 'cashier', '会计': 'accountant', '审计员': 'auditor', '顾问': 'consultant', '分析师': 'analyst',
        '专家': 'expert', '技术员': 'technician', '工程师': 'engineer', '建筑师': 'architect', '设计师': 'designer',
        '开发人员': 'developer', '程序员': 'programmer', '研究员': 'researcher', '科学家': 'scientist', '作家': 'writer',
        '作者': 'author', '记者': 'journalist', '编辑': 'editor', '出版商': 'publisher', '艺术家': 'artist',
        '画家': 'painter', '雕塑家': 'sculptor', '音乐家': 'musician', '作曲家': 'composer', '歌手': 'singer',
        '演员': 'actor', '女演员': 'actress', '导演': 'director', '制片人': 'producer', '摄影师': 'photographer',
        '厨师': 'chef', '面包师': 'baker', '屠夫': 'butcher', '农民': 'farmer', '园丁': 'gardener',
        '木匠': 'carpenter', '水管工': 'plumber', '电工': 'electrician', '机械师': 'mechanic', '司机': 'driver',
        '飞行员': 'pilot', '水手': 'sailor', '士兵': 'soldier', '警察': 'police', '官员': 'officer',
        '消防员': 'firefighter', '医生': 'doctor', '护士': 'nurse', '牙医': 'dentist', '兽医': 'veterinarian',
        '药剂师': 'pharmacist', '治疗师': 'therapist', '心理学家': 'psychologist', '律师': 'lawyer', '法官': 'judge',
        '校长': 'principal',
        
        // 扩展词汇 - 娱乐和休闲
        '游戏': 'game', '运动': 'sport', '爱好': 'hobby', '兴趣': 'interest', '活动': 'activity',
        '乐趣': 'fun', '娱乐': 'entertainment', '休闲': 'leisure', '放松': 'relaxation', '休息': 'rest',
        '假期': 'vacation', '假日': 'holiday', '旅行': 'trip', '旅程': 'journey', '冒险': 'adventure',
        '短途旅行': 'excursion', '旅游': 'tour', '观光': 'sightseeing', '露营': 'camping', '徒步旅行': 'hiking',
        '攀爬': 'climbing', '潜水': 'diving', '冲浪': 'surfing', '滑雪': 'skiing', '滑冰': 'skating',
        '钓鱼': 'fishing', '打猎': 'hunting', '高尔夫': 'golf', '网球': 'tennis', '足球': 'football',
        '篮球': 'basketball', '排球': 'volleyball', '棒球': 'baseball', '板球': 'cricket', '橄榄球': 'rugby',
        '曲棍球': 'hockey', '羽毛球': 'badminton', '乒乓球': 'table tennis', '保龄球': 'bowling', '国际象棋': 'chess',
        '跳棋': 'checkers', '纸牌': 'cards', '扑克': 'poker', '骰子': 'dice', '拼图': 'puzzle',
        '填字游戏': 'crossword', '数独': 'sudoku', '电影': 'movie', '电影院': 'cinema', '剧院': 'theater',
        '音乐会': 'concert', '表演': 'performance', '戏剧': 'play', '歌剧': 'opera', '芭蕾舞': 'ballet',
        '舞蹈': 'dance', '歌曲': 'song', '唱歌': 'singing', '乐队': 'band', '管弦乐队': 'orchestra',
        '乐器': 'instrument', '吉他': 'guitar', '钢琴': 'piano', '小提琴': 'violin', '鼓': 'drums',
        '小号': 'trumpet', '长笛': 'flute', '萨克斯管': 'saxophone', '麦克风': 'microphone', '收音机': 'radio',
        '电视': 'television', '电脑': 'computer', '笔记本电脑': 'laptop', '平板电脑': 'tablet', '智能手机': 'smartphone',
        '电话': 'phone', '相机': 'camera', '视频': 'video', '照片': 'photo', '图片': 'picture',
        '绘画': 'painting', '雕塑': 'sculpture', '博物馆': 'museum', '画廊': 'gallery', '展览': 'exhibition',
        '节日': 'festival', '庆祝': 'celebration', '聚会': 'party', '事件': 'event', '仪式': 'ceremony',
        '婚礼': 'wedding', '生日': 'birthday', '周年纪念': 'anniversary', '圣诞节': 'christmas', '复活节': 'easter',
        '万圣节': 'halloween', '新年': 'new year', '烟花': 'fireworks', '游行': 'parade', '狂欢节': 'carnival',
        '野餐': 'picnic', '烧烤': 'barbecue', '早午餐': 'brunch', '盛宴': 'feast', '宴会': 'banquet',
        '招待会': 'reception', '俱乐部': 'club', '酒吧': 'bar', '咖啡馆': 'cafe', '迪斯科': 'disco',
        '夜总会': 'nightclub', '赌场': 'casino', '游乐园': 'amusement park', '主题公园': 'theme park', '动物园': 'zoo',
        '水族馆': 'aquarium', '游乐场': 'playground', '游泳池': 'pool', '水疗中心': 'spa', '健身房': 'gym',
        '健身中心': 'fitness center', '体育场': 'stadium', '竞技场': 'arena', '社交': 'socializing', '聊天': 'chatting',
        '谈话': 'talking', '讨论': 'discussion', '对话': 'conversation', '辩论': 'debate', '争论': 'argument',
        '阅读': 'reading', '写作': 'writing', '研究': 'researching', '思考': 'thinking', '反思': 'reflecting',
        '冥想': 'meditating', '祈祷': 'praying', '崇拜': 'worshipping', '志愿服务': 'volunteering', '捐赠': 'donating',
        '帮助': 'helping', '支持': 'supporting', '关心': 'caring', '分享': 'sharing', '给予': 'giving',
        '接收': 'receiving', '交换': 'exchanging', '交易': 'trading', '购买': 'buying', '销售': 'selling',
        '购物': 'shopping', '浏览': 'browsing', '搜索': 'searching', '探索': 'exploring', '实验': 'experimenting',
        '测试': 'testing', '练习': 'practicing', '锻炼': 'exercising', '放松': 'relaxing', '睡觉': 'sleeping',
        '小睡': 'napping', '做梦': 'dreaming', '想象': 'imagining', '创造': 'creating', '发明': 'inventing',
        '建造': 'building', '制作': 'making', '烧烤': 'grilling', '煎': 'frying', '煮': 'boiling',
        '蒸': 'steaming', '烤': 'roasting', '切': 'chopping', '切片': 'slicing', '混合': 'mixing',
        '搅拌': 'stirring', '打': 'beating', '搅打': 'whisking', '揉': 'kneading', '滚动': 'rolling',
        '折叠': 'folding', '弯曲': 'bending', '扭曲': 'twisting', '缠绕': 'winding', '盘绕': 'coiling',
        '螺旋': 'spiraling', '卷曲': 'curling', '转动': 'turning', '旋转': 'spinning', '环绕': 'circling',
        '包围': 'surrounding', '包裹': 'wrapping', '包装': 'packaging', '装箱': 'boxing', '包含': 'containing',
        '持有': 'holding', '携带': 'carrying', '运输': 'transporting', '移动': 'moving', '转移': 'transferring',
        '搬迁': 'relocating', '放置': 'placing', '定位': 'positioning', '安置': 'situating', '安装': 'installing',
        '设置': 'setting', '调整': 'adjusting', '修改': 'modifying', '改变': 'changing', '转变': 'transforming',
        '转换': 'converting', '适应': 'adapting', '适合': 'fitting', '匹配': 'matching', '对应': 'corresponding',
        '关联': 'relating', '连接': 'connecting', '加入': 'joining', '联合': 'uniting', '结合': 'combining',
        '合并': 'merging', '混合': 'blending'
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

        // 限制文本长度
        if (text.length > 5000) {
            throw new Error('文本过长，请控制在5000字符以内');
        }

        // 检测语言
        const detectedLang = this.detectLanguage(text);
        
        // 如果检测到的语言与指定的源语言不匹配，使用检测到的语言
        if (from !== 'auto' && from !== detectedLang) {
            console.warn(`检测到的语言(${detectedLang})与指定语言(${from})不匹配，使用检测到的语言`);
            from = detectedLang;
        }

        // 如果源语言和目标语言相同，直接返回原文本
        if (from === to) {
            return text;
        }

        // 只支持中英互译
        if ((from === 'zh' && to === 'en') || (from === 'en' && to === 'zh')) {
            if (from === 'zh' && to === 'en') {
                return this.translateZhToEn(text);
            } else {
                return this.translateEnToZh(text);
            }
        }

        // 不支持的语言对
        throw new Error(`本地翻译不支持从${from}到${to}的翻译`);
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

            // 尝试匹配常见句式和语境
            const contextTranslation = this.translateEnToZhWithContext(sentence);
            if (contextTranslation) {
                translatedSentences.push(contextTranslation);
                continue;
            }

            // 如果整句没有匹配，尝试按单词翻译
            const words = sentence.split(/\s+/);
            const translatedWords = [];
            
            // 处理英文语法和时态
            let previousWord = '';
            
            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                const lowerWord = word.toLowerCase();
                
                // 处理标点符号
                const punctuation = word.match(/[.,!?;:()"'']/g);
                const cleanWord = word.replace(/[.,!?;:()"'']/g, '');
                
                if (this.enToZhDict[cleanWord.toLowerCase()]) {
                    let translatedWord = this.enToZhDict[cleanWord.toLowerCase()];
                    
                    // 根据语境调整翻译
                    translatedWord = this.adjustTranslationByContext(
                        translatedWord, 
                        cleanWord.toLowerCase(), 
                        previousWord, 
                        i < words.length - 1 ? words[i + 1].toLowerCase() : ''
                    );
                    
                    translatedWords.push(translatedWord);
                    
                    // 添加标点符号
                    if (punctuation) {
                        translatedWords.push(punctuation.join(''));
                    }
                } else {
                    // 如果单词没有翻译，保留原单词
                    translatedWords.push(word);
                }
                
                previousWord = cleanWord.toLowerCase();
            }

            // 将翻译后的单词组合为句子（中文不需要空格）
            const translatedSentence = translatedWords.join('');
            translatedSentences.push(translatedSentence);
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

            // 尝试匹配常见句式和语境
            const contextTranslation = this.translateZhToEnWithContext(sentence);
            if (contextTranslation) {
                translatedSentences.push(contextTranslation);
                continue;
            }

            // 中文翻译比较复杂，此处使用更智能的分词和语境处理
            let translated = false;
            let result = sentence;

            // 先尝试匹配最长的短语（优先匹配长短语）
            const sortedPhrases = Object.keys(this.zhToEnDict).sort((a, b) => b.length - a.length);
            
            for (const zhPhrase of sortedPhrases) {
                if (sentence.includes(zhPhrase)) {
                    const enPhrase = this.zhToEnDict[zhPhrase];
                    
                    // 根据语境调整翻译
                    const adjustedPhrase = this.adjustZhToEnByContext(enPhrase, zhPhrase, sentence);
                    
                    // 替换匹配到的短语
                    result = result.replace(new RegExp(zhPhrase, 'g'), adjustedPhrase);
                    translated = true;
                }
            }

            // 如果有翻译，处理结果
            if (translated) {
                // 处理未翻译的部分
                const remainingParts = result.split(/[\u4e00-\u9fff]+/);
                const translatedParts = result.split(/[^\u4e00-\u9fff]+/);
                
                // 组合翻译结果
                let finalResult = '';
                for (let i = 0; i < Math.max(remainingParts.length, translatedParts.length); i++) {
                    if (i < translatedParts.length && translatedParts[i]) {
                        finalResult += translatedParts[i];
                    }
                    if (i < remainingParts.length && remainingParts[i]) {
                        finalResult += remainingParts[i];
                    }
                }
                
                translatedSentences.push(finalResult.trim());
            } else {
                // 如果没有匹配到任何短语，尝试单字翻译
                const characters = sentence.split('');
                const translatedChars = [];
                
                for (const char of characters) {
                    if (this.zhToEnDict[char]) {
                        translatedChars.push(this.zhToEnDict[char]);
                    } else if (/[\u4e00-\u9fff]/.test(char)) {
                        // 是中文字符但不在字典中
                        translatedChars.push(`[${char}]`);
                    } else {
                        // 非中文字符，直接保留
                        translatedChars.push(char);
                    }
                }
                
                const translatedSentence = translatedChars.join(' ');
                translatedSentences.push(translatedSentence);
            }
        }

        // 组合翻译后的句子
        return translatedSentences.join('. ').replace(/\s+\./g, '.').replace(/\s+/g, ' ');
    },

    /**
     * 验证语言代码是否有效
     * @param {string} langCode - 语言代码
     * @returns {boolean} 是否有效
     */
    isValidLanguageCode(langCode) {
        const validLanguages = ['auto', 'zh', 'en'];
        return validLanguages.includes(langCode);
    },

    /**
     * 检测文本语言
     * @param {string} text - 要检测的文本
     * @returns {string} 检测到的语言代码 ('en'或'zh')
     */
    detectLanguage(text) {
        // 如果文本为空，返回默认语言
        if (!text.trim()) return 'en';
        
        // 简单的语言检测逻辑
        // 如果包含中文字符，则认为是中文
        const chineseRegex = /[\u4e00-\u9fff]/;
        if (chineseRegex.test(text)) {
            return 'zh';
        }
        
        // 否则认为是英文
        return 'en';
    },

    /**
     * 根据语境翻译英文句子
     * @param {string} sentence - 英文句子
     * @returns {string} 翻译后的中文句子
     */
    translateEnToZhWithContext(sentence) {
        const lowerSentence = sentence.toLowerCase().trim();
        
        // 常见句式和语境的翻译
        const contextPatterns = [
            // 疑问句
            { pattern: /^(how|what|where|when|why|who|which) (are|is|do|does|did|can|could|will|would|should)\b/, 
              template: (match) => {
                const questionWords = {
                  'how': '如何', 'what': '什么', 'where': '在哪里', 'when': '何时',
                  'why': '为什么', 'who': '谁', 'which': '哪个'
                };
                const verbWords = {
                  'are': '是', 'is': '是', 'do': '做', 'does': '做', 'did': '做了',
                  'can': '能', 'could': '能', 'will': '将', 'would': '会', 'should': '应该'
                };
                const questionWord = match[1];
                const verbWord = match[2];
                return questionWords[questionWord] + verbWords[verbWord];
              }
            },
            
            // 问候语
            { pattern: /^(good morning|good afternoon|good evening|hello|hi)\b/, 
              template: (match) => {
                const greetings = {
                  'good morning': '早上好', 'good afternoon': '下午好', 
                  'good evening': '晚上好', 'hello': '你好', 'hi': '嗨'
                };
                return greetings[match[1].toLowerCase()];
              }
            },
            
            // 感谢语
            { pattern: /^(thank you|thanks)\b/, 
              template: (match) => '谢谢'
            },
            
            // 道歉语
            { pattern: /^(sorry|excuse me|pardon me)\b/, 
              template: (match) => {
                const apologies = {
                  'sorry': '对不起', 'excuse me': '打扰一下', 'pardon me': '请原谅'
                };
                return apologies[match[1].toLowerCase()];
              }
            },
            
            // 告别语
            { pattern: /^(goodbye|bye|see you|see you later)\b/, 
              template: (match) => {
                const goodbyes = {
                  'goodbye': '再见', 'bye': '再见', 
                  'see you': '再见', 'see you later': '回头见'
                };
                return goodbyes[match[1].toLowerCase()];
              }
            },
            
            // 请求帮助
            { pattern: /^(can you help me|i need help)\b/, 
              template: (match) => {
                const helpRequests = {
                  'can you help me': '你能帮我吗', 'i need help': '我需要帮助'
                };
                return helpRequests[match[1].toLowerCase()];
              }
            },
            
            // 时间询问
            { pattern: /^(what time|what is the time)\b/, 
              template: (match) => '几点了'
            },
            
            // 价格询问
            { pattern: /^(how much|what is the price)\b/, 
              template: (match) => '多少钱'
            },
            
            // 位置询问
            { pattern: /^(where is|where are)\b/, 
              template: (match) => '在哪里'
            },
            
            // 同意/不同意
            { pattern: /^(i agree|i disagree)\b/, 
              template: (match) => {
                const agreements = {
                  'i agree': '我同意', 'i disagree': '我不同意'
                };
                return agreements[match[1].toLowerCase()];
              }
            }
        ];
        
        // 检查每个模式
        for (const { pattern, template } of contextPatterns) {
            const match = lowerSentence.match(pattern);
            if (match) {
                return template(match);
            }
        }
        
        return null;
    },

    /**
     * 根据语境翻译中文句子
     * @param {string} sentence - 中文句子
     * @returns {string} 翻译后的英文句子
     */
    translateZhToEnWithContext(sentence) {
        const trimmedSentence = sentence.trim();
        
        // 常见句式和语境的翻译
        const contextPatterns = [
            // 疑问句
            { pattern: /^(如何|什么|在哪里|何时|为什么|谁|哪个)(是|做|能|将|会|应该)/, 
              template: (match) => {
                const questionWords = {
                  '如何': 'how', '什么': 'what', '在哪里': 'where', '何时': 'when',
                  '为什么': 'why', '谁': 'who', '哪个': 'which'
                };
                const verbWords = {
                  '是': 'is', '做': 'do', '能': 'can', '将': 'will', 
                  '会': 'would', '应该': 'should'
                };
                return questionWords[match[1]] + ' ' + verbWords[match[2]];
              }
            },
            
            // 问候语
            { pattern: /^(早上好|下午好|晚上好|你好|嗨)/, 
              template: (match) => {
                const greetings = {
                  '早上好': 'good morning', '下午好': 'good afternoon', 
                  '晚上好': 'good evening', '你好': 'hello', '嗨': 'hi'
                };
                return greetings[match[1]];
              }
            },
            
            // 感谢语
            { pattern: /^(谢谢|多谢)/, 
              template: (match) => 'thank you'
            },
            
            // 道歉语
            { pattern: /^(对不起|打扰一下|请原谅)/, 
              template: (match) => {
                const apologies = {
                  '对不起': 'sorry', '打扰一下': 'excuse me', '请原谅': 'pardon me'
                };
                return apologies[match[1]];
              }
            },
            
            // 告别语
            { pattern: /^(再见|回头见)/, 
              template: (match) => {
                const goodbyes = {
                  '再见': 'goodbye', '回头见': 'see you later'
                };
                return goodbyes[match[1]];
              }
            },
            
            // 请求帮助
            { pattern: /^(你能帮我吗|我需要帮助)/, 
              template: (match) => {
                const helpRequests = {
                  '你能帮我吗': 'can you help me', '我需要帮助': 'i need help'
                };
                return helpRequests[match[1]];
              }
            },
            
            // 时间询问
            { pattern: /^(几点了|现在几点)/, 
              template: (match) => 'what time is it'
            },
            
            // 价格询问
            { pattern: /^(多少钱|价格多少)/, 
              template: (match) => 'how much'
            },
            
            // 位置询问
            { pattern: /^(在哪里|在什么地方)/, 
              template: (match) => 'where is'
            },
            
            // 同意/不同意
            { pattern: /^(我同意|我不同意)/, 
              template: (match) => {
                const agreements = {
                  '我同意': 'i agree', '我不同意': 'i disagree'
                };
                return agreements[match[1]];
              }
            }
        ];
        
        // 检查每个模式
        for (const { pattern, template } of contextPatterns) {
            const match = trimmedSentence.match(pattern);
            if (match) {
                return template(match);
            }
        }
        
        return null;
    },

    /**
     * 根据语境调整英文到中文的翻译
     * @param {string} translation - 原始翻译
     * @param {string} word - 原始单词
     * @param {string} previousWord - 前一个单词
     * @param {string} nextWord - 后一个单词
     * @returns {string} 调整后的翻译
     */
    adjustTranslationByContext(translation, word, previousWord, nextWord) {
        // 处理时态和语法
        if (word === 'be' || word === 'is' || word === 'are' || word === 'am') {
            return '是';
        }
        
        if (word === 'have' || word === 'has') {
            return '有';
        }
        
        if (word === 'do' || word === 'does') {
            return '做';
        }
        
        if (word === 'will' || word === 'would') {
            return '将';
        }
        
        if (word === 'can' || word === 'could') {
            return '能';
        }
        
        // 处理否定词
        if (word === 'not' || word === "n't") {
            return '不';
        }
        
        // 处理冠词
        if (word === 'a' || word === 'an') {
            return '一个';
        }
        
        if (word === 'the') {
            return '这个';
        }
        
        // 处理介词
        if (word === 'in') {
            return '在';
        }
        
        if (word === 'on') {
            return '在';
        }
        
        if (word === 'at') {
            return '在';
        }
        
        if (word === 'to') {
            return '到';
        }
        
        if (word === 'from') {
            return '从';
        }
        
        if (word === 'with') {
            return '和';
        }
        
        if (word === 'and') {
            return '和';
        }
        
        if (word === 'or') {
            return '或';
        }
        
        if (word === 'but') {
            return '但是';
        }
        
        return translation;
    },

    /**
     * 根据语境调整中文到英文的翻译
     * @param {string} translation - 原始翻译
     * @param {string} phrase - 原始短语
     * @param {string} sentence - 完整句子
     * @returns {string} 调整后的翻译
     */
    adjustZhToEnByContext(translation, phrase, sentence) {
        // 处理量词
        if (phrase === '一个' && sentence.includes('苹果')) {
            return 'an apple';
        }
        
        if (phrase === '一个' && sentence.includes('橙子')) {
            return 'an orange';
        }
        
        if (phrase === '一个' && /[aeiou]/i.test(translation[0])) {
            return 'an ' + translation;
        }
        
        if (phrase === '一个') {
            return 'a ' + translation;
        }
        
        // 处理时态助词
        if (phrase === '了' && sentence.includes('吃')) {
            return 'ate';
        }
        
        if (phrase === '了' && sentence.includes('看')) {
            return 'saw';
        }
        
        if (phrase === '了' && sentence.includes('去')) {
            return 'went';
        }
        
        if (phrase === '了') {
            return 'ed';
        }
        
        // 处理进行时
        if (phrase === '在' && sentence.includes('吃')) {
            return 'eating';
        }
        
        if (phrase === '在' && sentence.includes('看')) {
            return 'watching';
        }
        
        if (phrase === '在' && sentence.includes('工作')) {
            return 'working';
        }
        
        // 处理否定
        if (phrase === '不' && sentence.includes('是')) {
            return 'not';
        }
        
        if (phrase === '不' && sentence.includes('能')) {
            return 'cannot';
        }
        
        if (phrase === '不' && sentence.includes('会')) {
            return 'will not';
        }
        
        return translation;
    }
};

// 导出模块
export default LocalTranslate;
