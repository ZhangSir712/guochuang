# 宠物语音交互功能 - 任务分解

## 任务概览
本计划将宠物语音交互功能分解为5个核心任务，按照依赖关系和优先级排列。

---

## [x] Task 1: 创建语音识别基础模块
- **Priority**: P0 (关键路径)
- **Depends On**: 无（基于现有项目架构）
- **Description**:
  - 创建 `utils/speechRecognition.js` 工具模块，封装Web Speech API
  - 实现语音识别启动/停止控制
  - 实现语音识别状态管理（idle/listening/processing/error）
  - 处理麦克风权限请求和错误处理
  - 添加浏览器兼容性检测（检查是否支持SpeechRecognition）
  - 实现语音输入的视觉反馈（录音中状态）
- **Acceptance Criteria Addressed**: AC-1 (语音识别功能可用性)
- **Test Requirements**:
  - `programmatic` TR-1.1: 在不支持Web Speech API的浏览器中显示友好提示
  - `programmatic` TR-1.2: 首次调用时正确请求麦克风权限
  - `programmatic` TR-1.3: 权限被拒绝时显示错误提示和引导
  - `programmatic` TR-1.4: 语音识别开始后状态正确变更为"listening"
  - `programmatic` TR-1.5: 识别完成后返回正确的文字结果
  - `programmatic` TR-1.6: 识别过程中实时显示中间结果（interim results）
  - `human-judgement` TR-1.7: 录音状态指示器视觉反馈清晰

---

## [x] Task 2: 集成AI对话接口
- **Priority**: P0 (关键路径)
- **Depends On**: Task 1
- **Description**:
  - 创建 `utils/chatAI.js` 模块，封装AI对话API调用
  - 集成OpenAI GPT API（或其他选定的AI服务）
  - 设计宠物角色Prompt（温暖、可爱、治愈风格）
  - 实现对话上下文管理（维护最近N轮对话历史）
  - 实现API错误处理和重试机制
  - 添加API Key输入界面（在设置中）
  - 实现生成状态管理（思考中动画触发）
- **Acceptance Criteria Addressed**: AC-2 (AI对话回应质量)
- **Test Requirements**:
  - `programmatic` TR-2.1: 输入有效API Key后能成功调用AI API
  - `programmatic` TR-2.2: API返回的回应符合宠物角色设定
  - `programmatic` TR-2.3: 多轮对话中上下文正确传递
  - `programmatic` TR-2.4: API调用失败时显示错误提示
  - `programmatic` TR-2.5: 未输入API Key时显示配置引导
  - `human-judgement` TR-2.6: AI回应风格温暖治愈，符合产品调性
  - `human-judgement` TR-2.7: 回应内容有趣且与输入相关

---

## [x] Task 3: 开发语音交互UI组件
- **Priority**: P0 (核心功能)
- **Depends On**: Task 1, Task 2
- **Description**:
  - 创建 `components/PetVoiceInteraction.jsx` 核心组件
  - 实现麦克风按钮（按住说话/点击切换模式）
  - 实现语音识别波形动画效果
  - 实现对话气泡组件（用户消息+宠物回应）
  - 实现对话历史面板（可滚动查看）
  - 实现快捷对话选项按钮（"你好"、"今天天气如何"等）
  - 添加语音合成开关（文字转语音）
  - 实现"正在思考"状态指示
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-4
- **Test Requirements**:
  - `programmatic` TR-3.1: 麦克风按钮点击后正确触发语音识别
  - `programmatic` TR-3.2: 识别过程中波形动画正常播放
  - `programmatic` TR-3.3: 用户消息和宠物回应正确显示在对话气泡中
  - `programmatic` TR-3.4: 对话历史面板显示完整记录
  - `programmatic` TR-3.5: 快捷对话按钮点击后发送对应消息
  - `programmatic` TR-3.6: 语音合成开关控制TTS播放
  - `human-judgement` TR-3.7: UI设计美观，符合产品整体风格
  - `human-judgement` TR-3.8: 动画效果流畅自然

---

## [x] Task 4: 增强动画系统（说话/倾听/思考状态）
- **Priority**: P1 (重要增强)
- **Depends On**: Task 3
- **Description**:
  - 修改 `components/AnimatedPet.jsx` 添加新的动画状态
  - 实现"倾听"状态动画：眼睛放大、耳朵竖起效果
  - 实现"思考"状态动画：头顶显示思考气泡/问号
  - 实现"说话"状态动画：嘴巴区域轻微缩放模拟说话
  - 添加状态过渡动画（平滑切换不同状态）
  - 将动画状态与语音交互组件联动
- **Acceptance Criteria Addressed**: AC-2 (AI对话回应质量)
- **Test Requirements**:
  - `programmatic` TR-4.1: 语音识别开始时触发"倾听"动画
  - `programmatic` TR-4.2: AI处理时触发"思考"动画
  - `programmatic` TR-4.3: 语音合成播放时触发"说话"动画
  - `programmatic` TR-4.4: 状态切换平滑无卡顿
  - `human-judgement` TR-4.5: "倾听"动画让宠物看起来在专注听
  - `human-judgement` TR-4.6: "思考"动画可爱有趣
  - `human-judgement` TR-4.7: "说话"动画与语音播放同步

---

## [x] Task 5: 集成到预览页面和桌面模式
- **Priority**: P0 (核心功能交付)
- **Depends On**: Task 3, Task 4
- **Description**:
  - 修改 `app/pet-reconstruction/preview/page.js` 集成语音交互面板
  - 在预览页面添加"开始对话"按钮和对话面板
  - 修改 `app/pet-reconstruction/desktop/page.js` 支持桌面模式语音交互
  - 实现桌面模式快捷键支持（Ctrl+Shift+P唤醒）
  - 实现桌面模式右键菜单（开始对话、查看历史等）
  - 确保对话历史在页面刷新后保留（localStorage）
  - 添加设置面板选项：语音合成开关、快捷键配置
- **Acceptance Criteria Addressed**: AC-3, AC-4
- **Test Requirements**:
  - `programmatic` TR-5.1: 预览页面显示"开始对话"按钮
  - `programmatic` TR-5.2: 点击按钮后展开对话面板
  - `programmatic` TR-5.3: 桌面模式下快捷键正确触发语音输入
  - `programmatic` TR-5.4: 桌面模式下右键菜单正常显示
  - `programmatic` TR-5.5: 对话历史在刷新后正确恢复
  - `programmatic` TR-5.6: 设置面板选项修改后即时生效
  - `human-judgement` TR-5.7: 桌面模式语音交互不影响其他操作
  - `human-judgement` TR-5.8: 整体交互体验流畅自然

---

## 任务依赖关系图
```
Task 1 (语音识别模块)
   ↓
Task 2 (AI对话接口) ──┬──→ Task 3 (语音交互UI)
                     │         ↓
                     │    Task 4 (动画增强)
                     │         ↓
                     └────→ Task 5 (页面集成)
```

**可并行执行的任务组**:
- 第一批: Task 1 → Task 2
- 第二批: Task 3（依赖Task 1、2）
- 第三批: Task 4（依赖Task 3）
- 第四批: Task 5（依赖Task 3、4）

## 技术栈补充说明
- **使用浏览器原生API**:
  - `window.SpeechRecognition` 或 `window.webkitSpeechRecognition` (语音识别)
  - `window.speechSynthesis` (语音合成)
- **可能需要的新依赖**:
  - 无需额外依赖，使用原生Web Speech API
- **API Key管理**:
  - 用户自行输入OpenAI API Key
  - 存储在localStorage（本地浏览器）

## 风险与缓解措施
1. **风险**: Web Speech API浏览器兼容性有限（主要是Chrome/Edge）
   - **缓解**: 提供特性检测，在不支持的浏览器中显示提示并降级为文字输入

2. **风险**: 用户可能不愿意授权麦克风权限
   - **缓解**: 提供文字输入作为备选方案

3. **风险**: AI API调用成本和延迟
   - **缓解**: 实现本地缓存，相同输入直接返回缓存结果；添加加载状态指示

4. **风险**: 语音识别准确率受环境影响
   - **缓解**: 显示识别的中间结果让用户确认，提供重新输入按钮

---

## 质量检查清单
- [ ] 每个验收标准至少被一个任务覆盖
- [ ] 每个任务至少有一个测试要求
- [ ] 任务依赖关系形成有效的DAG（无循环依赖）
- [ ] 任务粒度一致（每个任务预计2-4小时完成）
- [ ] Programmatic 和 Human-judgment 验证方式正确保留
