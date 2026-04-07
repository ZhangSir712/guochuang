# 修复生图参数传递问题 Spec

## Why
当前"风格选择"、"背景设置"和"图像质量"的配置虽然保存到 Context，但未正确传递到火山引擎 API 请求中，导致用户选择无效，始终使用硬编码的默认值。

## What Changes
- 修复 `generate/page.js` 中 API 请求体参数的硬编码问题
- 将 `config.style`、`config.background`、`config.quality` 等正确映射并传递到 API
- 确保 `size` 参数正确反映用户的尺寸选择

## Impact
- Affected specs: ai-pet-reconstruction-v2 (Task 3, Task 4)
- Affected code:
  - `app/pet-reconstruction/generate/page.js` (API 请求体构造)
  - `api/imageGeneration.js` (buildPrompt 函数)
  - Context 配置字段使用

## ADDED Requirements
### Requirement: API 参数正确传递
系统 SHALL 将用户选择的风格、背景、质量、尺寸等参数正确传递到火山引擎 API 请求体中。

#### Scenario: 风格选择影响 API 调用
- **WHEN** 用户在生成页面选择"水彩风"风格
- **THEN** 火山引擎 API 请求体中的 prompt 应包含水彩风格的描述，且 style 参数应映射为 'watercolor'

#### Scenario: 背景设置影响 API 调用
- **WHEN** 用户选择"纯白色"背景
- **THEN** 生成的 prompt 应包含 ", clean white background" 描述

#### Scenario: 尺寸选择影响 API 调用
- **WHEN** 用户选择输出尺寸为 1024x1024
- **THEN** API 请求体的 size 参数应为 '1K' (火山引擎支持的尺寸格式)

## MODIFIED Requirements
### Requirement: buildPrompt 函数增强
现有的 `buildPrompt(config, petDescription)` 函数需要确保：
- `config.style` 正确映射到 styleMap
- `config.background` 正确添加到 prompt
- `config.personalityTags` 正确添加性格描述

## REMOVED Requirements
无

## 技术分析

### 当前问题定位

**问题1**: `generate/page.js` 中 API 请求体硬编码
```javascript
// 当前代码 - 硬编码
const requestBody = {
  model: VOLCENGINE_MODEL,
  prompt: prompt,
  response_format: 'url',
  size: '2K',  // ❌ 硬编码
  stream: false,
  watermark: true
}
```

**问题2**: `buildPrompt` 函数中 `config.style` 的映射问题
```javascript
const styleMap = {
  cartoon: 'cute',     // 实际值是 'cute'，不是 'cartoon'
  artistic: 'watercolor',
  '3d': 'realistic',
  realistic: 'realistic'
}
const styleKey = styleMap[config.style] || 'realistic'  // config.style='cute' 时返回 undefined
```

**问题3**: 火山引擎 API 的 size 参数格式未知
需要确认火山引擎支持的 size 值（如 '512x512', '1024x1024', '2K' 等）

### 修复方案

1. 修正 `buildPrompt` 中的 styleMap 映射，直接使用实际值
2. 从 Context 正确读取并传递 config 参数到 API 请求体
3. 确认并正确映射火山引擎 API 的 size 参数
