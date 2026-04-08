# 宠物语音交互功能 Spec

## Why
当前2D宠物形象已经具备了基础的动画效果（眨眼、呼吸、点击反馈），但交互方式仅限于视觉反馈。为了让数字宠物更加生动、有情感连接，需要增加语音交互能力，让用户可以通过语音与宠物"对话"，宠物能够识别用户语音并以文字/语音方式回应，增强陪伴感和互动性。

## What Changes
- 新增语音识别功能：用户可以通过麦克风与宠物对话
- 新增AI对话能力：宠物能够理解用户话语并做出智能回应
- 新增语音合成功能：宠物可以用语音回应用户（可选）
- 新增对话历史展示：显示用户与宠物的对话记录
- 新增交互触发方式：语音唤醒、点击对话按钮、快捷键
- **BREAKING**: 需要用户授权麦克风权限

## Impact
- Affected specs: AI宠物形象重建Demo (ai-pet-reconstruction-v2)
- Affected code: 
  - `components/AnimatedPet.jsx` - 新增语音交互状态
  - `app/pet-reconstruction/preview/page.js` - 新增对话面板
  - `app/pet-reconstruction/desktop/page.js` - 桌面模式语音交互
  - 新增 `components/PetVoiceInteraction.jsx` - 语音交互核心组件
  - 新增 `utils/speechRecognition.js` - 语音识别工具
  - 新增 `utils/chatAI.js` - AI对话接口

## ADDED Requirements

### Requirement: 语音识别功能
系统 SHALL 支持通过浏览器Web Speech API识别用户语音输入：

#### Scenario: 用户首次启用语音交互
- **GIVEN** 用户在预览页面或桌面模式
- **WHEN** 用户点击"开始对话"按钮
- **THEN** 系统请求麦克风权限
- **AND** 权限 granted 后显示语音输入状态指示器

#### Scenario: 用户进行语音输入
- **GIVEN** 语音交互已启用且权限已授权
- **WHEN** 用户按住/点击麦克风按钮说话
- **THEN** 系统实时显示语音识别中的视觉反馈（波形动画）
- **AND** 识别完成后显示用户说的话文字内容
- **AND** 将识别文本发送给AI生成回应

#### Scenario: 语音识别失败处理
- **GIVEN** 用户正在进行语音输入
- **WHEN** 网络中断或语音识别失败
- **THEN** 显示友好的错误提示
- **AND** 提供重试或切换到文字输入的选项

### Requirement: AI对话能力
系统 SHALL 集成AI对话能力，让宠物能够智能回应用户：

#### Scenario: 宠物回应用户话语
- **GIVEN** 用户语音/文字输入已识别
- **WHEN** AI接收到用户输入
- **THEN** 根据宠物性格设定生成合适的回应
- **AND** 回应以文字气泡形式显示在宠物旁边
- **AND** 回应内容符合宠物角色设定（可爱、温暖、治愈风格）

#### Scenario: 对话上下文记忆
- **GIVEN** 用户与宠物已经进行了多轮对话
- **WHEN** 用户继续新的对话
- **THEN** AI能够参考之前的对话上下文
- **AND** 保持对话的连贯性和个性化

#### Scenario: 对话历史展示
- **GIVEN** 用户与宠物进行了对话
- **WHEN** 用户查看对话面板
- **THEN** 显示完整的对话历史记录
- **AND** 支持滚动查看之前的消息

### Requirement: 语音合成功能（可选增强）
系统 SHALL 支持将宠物的文字回应转换为语音输出：

#### Scenario: 宠物语音回应
- **GIVEN** AI已生成宠物的文字回应
- **WHEN** 语音合成功能已开启
- **THEN** 使用Web Speech API将文字转换为语音播放
- **AND** 播放时有对应的口型动画（简单的嘴巴开合）

### Requirement: 多种交互触发方式
系统 SHALL 提供多种方式触发语音交互：

#### Scenario: 点击触发对话
- **GIVEN** 用户在预览或桌面模式
- **WHEN** 用户点击宠物形象
- **THEN** 除了现有的跳跃动画外，触发对话气泡
- **AND** 显示快捷对话选项（"你好"、"你在做什么"等）

#### Scenario: 快捷键唤醒
- **GIVEN** 用户在桌面宠物模式
- **WHEN** 用户按下设定的快捷键（如Ctrl+Shift+P）
- **THEN** 快速激活语音输入状态
- **AND** 无需点击按钮即可开始说话

#### Scenario: 语音唤醒词（可选）
- **GIVEN** 语音交互处于监听状态
- **WHEN** 用户说出唤醒词（如"小宠"、"宝贝"）
- **THEN** 宠物做出反应（动画+声音）
- **AND** 进入对话模式等待用户指令

### Requirement: 桌面模式语音交互
系统 SHALL 在桌面宠物模式下支持完整的语音交互：

#### Scenario: 桌面模式语音对话
- **GIVEN** 桌面宠物窗口已打开
- **WHEN** 用户通过语音或点击与宠物交互
- **THEN** 对话气泡显示在宠物附近
- **AND** 不影响桌面其他操作（非模态）
- **AND** 支持最小化对话面板只保留宠物

#### Scenario: 桌面模式快捷操作
- **GIVEN** 桌面宠物正在运行
- **WHEN** 右键点击宠物
- **THEN** 显示上下文菜单
- **AND** 包含选项：开始对话、查看历史、设置、退出

## MODIFIED Requirements

### Requirement: 动画系统增强
**原需求**: 现有的AnimatedPet组件支持眨眼、呼吸、idle动画

**修改后**: 
- 新增"说话"动画状态：宠物说话时嘴巴区域有轻微开合动画
- 新增"倾听"动画状态：用户说话时宠物显示专注表情（眼睛变大或耳朵竖起）
- 新增"思考"动画状态：AI处理中时宠物显示思考动画（如头顶问号或托腮）

## REMOVED Requirements
无

## 技术假设
1. 使用浏览器原生Web Speech API（SpeechRecognition + SpeechSynthesis）
2. AI对话使用OpenAI GPT API或类似的云端大模型API
3. 需要用户设备有麦克风硬件
4. 语音识别准确率取决于浏览器实现和环境噪音
5. 桌面模式下语音交互需要窗口保持焦点或定期检查

## 验收标准

### AC-1: 语音识别功能可用性
- **Given**: 用户在支持Web Speech API的浏览器中（Chrome/Edge）
- **When**: 用户授权麦克风权限并点击语音输入按钮
- **Then**: 系统成功识别用户语音并显示文字内容
- **Verification**: `programmatic` + `human-judgment`

### AC-2: AI对话回应质量
- **Given**: 用户已输入语音或文字
- **When**: AI处理完成后
- **Then**: 宠物显示符合角色设定的回应内容
- **And**: 回应风格温暖、可爱、治愈
- **Verification**: `human-judgment`

### AC-3: 桌面模式语音交互
- **Given**: 桌面宠物窗口已打开
- **When**: 用户使用语音或点击与宠物交互
- **Then**: 对话正常进行，不影响其他桌面操作
- **Verification**: `programmatic` + `human-judgment`

### AC-4: 对话历史记录
- **Given**: 用户已与宠物进行了多轮对话
- **When**: 用户打开对话历史面板
- **Then**: 完整显示所有对话记录
- **Verification**: `programmatic`

## 开放问题
- [ ] 使用哪个AI对话API？（OpenAI GPT-3.5/4、Claude、或其他）
- [ ] 是否需要支持文字输入作为语音的备选？
- [ ] 语音合成是否需要多种声音选择？
- [ ] 对话历史是否需要持久化存储（localStorage）？
- [ ] 是否需要支持多语言语音识别？
