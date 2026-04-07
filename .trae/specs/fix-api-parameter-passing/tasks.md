# 修复生图参数传递问题 - 任务分解

## [x] Task 1: 分析并修复 buildPrompt 函数的 styleMap 映射问题
- **Depends On**: 无
- **Description**: `buildPrompt` 函数中的 styleMap 将 config.style 值映射到风格 prompt，但映射逻辑有误。例如 config.style='cute' 时，styleMap['cute'] 返回 undefined，导致回退到 'realistic'。
- **Implementation**:
  - 修正 styleMap，直接使用 config.style 的实际值作为 key
  - 确保 cartoon, realistic, watercolor, pixel 四种风格正确映射
- **Test**: 验证 config.style='cute' 时生成的 prompt 使用 chibi-style 描述

## [x] Task 2: 修复 generate/page.js 中 API 请求体的硬编码参数
- **Depends On**: Task 1
- **Description**: API 请求体中的 size 等参数是硬编码的，需要从 config 中读取
- **Implementation**:
  - 从 config.size 读取用户选择的尺寸
  - 映射到火山引擎 API 支持的 size 格式
  - 将 config.quality 正确传递（如果火山引擎支持）
- **Test**: 验证请求体中的参数与用户选择一致

## [x] Task 3: 验证完整参数传递流程
- **Depends On**: Task 2
- **Description**: 确保风格、背景、质量、尺寸等所有参数正确从 Context 传递到 API
- **Implementation**:
  - 检查 Context 中的 config 结构
  - 验证 setConfig 更新 config 时正确保存
  - 确认 API 调用时读取的是最新的 config 值
- **Test**: 端到端测试用户配置变化到 API 请求的影响

## Task Dependencies
```
Task 1 → Task 2 → Task 3
```
