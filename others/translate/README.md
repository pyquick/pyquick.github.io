# 实时翻译工具

这是一个实时翻译工具，可以在用户输入文本时立即提供翻译结果，无需等待或点击翻译按钮。

## 功能特点

- **实时翻译**：随着用户输入自动进行翻译
- **多语言支持**：支持多种常用语言之间的互译
- **语言交换**：一键交换源语言和目标语言
- **复制功能**：便捷复制原文和译文
- **文本朗读**：支持朗读译文（使用浏览器内置语音合成功能）
- **用户偏好**：自动保存用户的语言选择偏好

## 技术实现

本翻译工具已集成实际的翻译API服务，目前支持以下翻译API：

- 百度翻译API
- 有道翻译API
- Google Cloud Translation API
- 本地翻译（无需API，仅支持基础的中英文互译）

用户可以在界面上直接配置API密钥，并选择使用哪种翻译服务。

### 翻译API配置

本应用提供了简便的API配置界面：

1. 点击页面底部的API状态指示器
2. 在弹出的配置对话框中选择翻译服务提供商（百度或有道）
3. 输入相应的AppID和密钥
4. 点击保存设置

### 获取API密钥

#### 百度翻译API

1. 访问[百度翻译开放平台](http://api.fanyi.baidu.com/)
2. 注册/登录账号
3. 创建应用，选择通用翻译API
4. 获取应用ID（AppID）和密钥（SecretKey）

#### 有道翻译API

1. 访问[有道智云](https://ai.youdao.com/)
2. 注册/登录账号
3. 创建应用，选择自然语言翻译服务
4. 获取应用ID和应用密钥

#### Google Cloud Translation API

1. 访问[Google Cloud Console](https://console.cloud.google.com/)
2. 创建一个新项目或选择现有项目
3. 启用Cloud Translation API
4. 创建API密钥并设置适当的限制
5. 获取API密钥

#### 本地翻译

本地翻译不需要配置API密钥，但功能有限，只支持基础的中英文互译。当其他翻译API不可用时，系统会自动降级使用本地翻译作为备用方案。

### API实现细节

本应用使用独立的API服务模块处理翻译请求，实现如下：

```javascript
// API调用示例（已集成在api.js中）
async function translateText(text, from, to) {
    // 检查API配置
    const { apiUrl, appId, secretKey } = config;
    if (!appId || !secretKey) {
        throw new Error('翻译API密钥未配置');
    }

    // 生成签名
    const salt = Date.now();
    const sign = md5(appId + text + salt + secretKey);

    // 构建请求参数
    const params = new URLSearchParams({
        q: text,
        from: from,
        to: to,
        appid: appId,
        salt: salt.toString(),
        sign: sign
    });

    // 发送请求
    const response = await fetch(`${apiUrl}?${params.toString()}`);
    const data = await response.json();

    // 处理结果
    return data.trans_result.map(item => item.dst).join('\n');
}
```

如果API服务不可用，应用会自动降级使用本地模拟翻译作为备用方案。
```

## 使用说明

1. 在左侧文本框中输入要翻译的文本
2. 选择源语言和目标语言（默认英译中）
3. 翻译结果会自动显示在右侧文本框中
4. 可以使用复制按钮复制文本
5. 可以使用朗读按钮朗读译文

### 配置翻译API

首次使用时，需要配置翻译API：

1. 点击界面底部的API状态指示器
2. 在弹出的对话框中选择翻译服务提供商（百度翻译或有道翻译）
3. 输入你的API密钥（AppID和SecretKey）
4. 点击保存设置

配置成功后，API状态指示器会显示为绿色；如果配置有误或API服务不可用，则显示为红色，此时会自动降级使用本地模拟翻译。

## 特色功能

- **响应式布局**：在各种设备上都能提供良好的使用体验，从桌面电脑到平板电脑和手机
- **多翻译API支持**：支持百度、有道、Google翻译API，以及本地翻译作为备用
- **实时翻译**：输入过程中自动翻译，无需点击翻译按钮
- **语音朗读**：支持朗读翻译结果

## 未来改进

- 添加更多语言支持
- 添加历史记录功能
- 实现完整的离线翻译支持
- 添加文本纠错建议
- 支持OCR图像文字识别翻译

## 注意事项

当前版本使用模拟翻译功能，不具备真实的翻译能力。在实际部署时，请替换为真实的翻译API服务。
