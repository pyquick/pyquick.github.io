/**
 * 本地翻译功能测试
 * 测试local-translate.js的核心功能
 */

// 测试本地翻译模块
function testLocalTranslate() {
    console.log('=== 开始本地翻译功能测试 ===');
    
    // 测试1: 检查LocalTranslate对象是否存在
    console.log('测试1: 检查LocalTranslate对象');
    if (typeof LocalTranslate !== 'undefined') {
        console.log('✅ LocalTranslate对象存在');
        console.log('LocalTranslate类型:', typeof LocalTranslate);
        console.log('LocalTranslate.translate类型:', typeof LocalTranslate.translate);
    } else {
        console.error('❌ LocalTranslate对象不存在');
        return;
    }
    
    // 测试2: 简单翻译测试
    console.log('\n测试2: 简单翻译测试');
    try {
        const result1 = LocalTranslate.translate('hello', 'en', 'zh');
        console.log('hello ->', result1);
        console.log('✅ 英文到中文翻译成功');
        
        const result2 = LocalTranslate.translate('你好', 'zh', 'en');
        console.log('你好 ->', result2);
        console.log('✅ 中文到英文翻译成功');
    } catch (error) {
        console.error('❌ 简单翻译测试失败:', error);
    }
    
    // 测试3: 复杂句子翻译
    console.log('\n测试3: 复杂句子翻译');
    try {
        const result3 = LocalTranslate.translate('good morning world', 'en', 'zh');
        console.log('good morning world ->', result3);
        console.log('✅ 复杂句子翻译成功');
    } catch (error) {
        console.error('❌ 复杂句子翻译测试失败:', error);
    }
    
    // 测试4: 边界情况测试
    console.log('\n测试4: 边界情况测试');
    try {
        const result4 = LocalTranslate.translate('', 'en', 'zh');
        console.log('空字符串 ->', result4);
        console.log('✅ 空字符串处理成功');
        
        const result5 = LocalTranslate.translate('hello', 'en', 'en');
        console.log('相同语言翻译 ->', result5);
        console.log('✅ 相同语言处理成功');
    } catch (error) {
        console.error('❌ 边界情况测试失败:', error);
    }
    
    // 测试5: 性能测试
    console.log('\n测试5: 性能测试');
    try {
        const start = performance.now();
        for (let i = 0; i < 100; i++) {
            LocalTranslate.translate('hello world', 'en', 'zh');
        }
        const end = performance.now();
        console.log('100次翻译耗时:', (end - start).toFixed(2), 'ms');
        console.log('✅ 性能测试通过');
    } catch (error) {
        console.error('❌ 性能测试失败:', error);
    }
    
    console.log('\n=== 本地翻译功能测试完成 ===');
}

// 如果LocalTranslate可用，自动运行测试
if (typeof LocalTranslate !== 'undefined') {
    // 延迟1秒执行测试，确保页面完全加载
    setTimeout(testLocalTranslate, 1000);
} else {
    console.warn('LocalTranslate未定义，测试无法运行');
}