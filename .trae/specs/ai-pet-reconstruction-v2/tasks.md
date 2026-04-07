# AI宠物形象重建Demo - 实施计划（任务分解与优先级排序）

## 任务概览
本计划将AI宠物形象重建功能分解为6个核心任务，按照依赖关系和优先级排列。每个任务都是可独立验证的交付单元。

---

## [x] Task 1: 创建项目基础架构与路由结构
- **Priority**: P0 (关键路径)
- **Depends On**: 无
- **Description**:
  - 在Next.js App Router中创建新的页面目录结构 `/app/pet-reconstruction/`
  - 建立子页面：主页面（`page.js`）、上传页面（`/upload/page.js`）、生成页面（`/generate/page.js`）、预览页面（`/preview/page.js`）、桌面模式页面（`/desktop/page.js`）
  - 创建共享状态管理（使用React Context或自定义Hook）管理整个流程的数据流（上传的文件、生成参数、生成的图像等）
  - 配置必要的依赖项检查（确认是否需要安装额外的npm包）
- **Acceptance Criteria Addressed**: AC-5 (工作流连贯性)
- **Test Requirements**:
  - `programmatic` TR-1.1: 所有5个子页面都能正常访问且不报错（HTTP 200）
  - `programmatic` TR-1.2: 页面间导航链接正确配置，可以互相跳转
  - `programmatic` TR-1.3: 共享Context创建成功，可以在不同组件间传递数据
  - `human-judgement` TR-1.4: 目录结构清晰合理，符合Next.js最佳实践
- **Notes**: 这是所有后续任务的基础，必须先完成

---

## [x] Task 2: 实现多媒体文件上传系统
- **Priority**: P0 (关键路径)
- **Depends On**: Task 1
- **Description**:
  - 实现拖拽上传区域组件（Drag & Drop Zone），支持拖拽文件到指定区域
  - 实现点击选择文件功能（使用隐藏的 `<input type="file">` 元素）
  - 实现文件验证逻辑：
    - 格式验证：图片支持 jpg/jpeg/png/webp，视频支持 mp4/webm
    - 大小验证：图片 ≤ 10MB，视频 ≤ 50MB
    - 数量验证：3-10张图片 或 0-1个视频
  - 使用 `URL.createObjectURL()` 生成本地预览缩略图
  - 实现已上传文件列表展示，包含删除功能
  - 实现上传进度显示（模拟或真实）
  - 添加友好的错误提示信息（文件过大、格式不支持、数量超限等）
- **Acceptance Criteria Addressed**: AC-1 (上传功能完整性)
- **Test Requirements**:
  - `programmatic` TR-2.1: 拖拽3张JPG图片到上传区域后，成功显示3个缩略图预览
  - `programmatic` TR-2.2: 上传超过10MB的图片时，显示"文件过大"错误提示
  - `programmatic` TR-2.3: 上传第11张图片时，提示"最多支持10张图片"
  - `programmatic` TR-2.4: 上传BMP等不支持的格式时，提示格式错误并建议支持的格式列表
  - `programmatic` TR-2.5: 点击删除按钮后，对应文件从列表中移除，计数更新
  - `programmatic` TR-2.6: 上传MP4视频文件成功并在预览区显示视频图标
  - `human-judgement` TR-2.7: 拖拽区域有明显的视觉反馈（高亮、边框变化、提示文字）
  - `human-judgement` TR-2.8: 缩略图显示质量良好，加载速度快
- **Implementation Details**:
  - 文件输入组件建议封装为可复用的 `FileUploader.jsx`
  - 使用 `useDropzone` 库（如果允许安装）或原生 HTML5 Drag and Drop API
  - 缩略图使用CSS `object-fit: cover` 保持比例
  - 考虑使用 `react-hot-toast` 或类似库显示Toast通知（如项目未安装则用简单的alert）

---

## [x] Task 3: 构建AI参数配置界面
- **Priority**: P1 (重要但不阻塞)
- **Depends On**: Task 2
- **Description**:
  - 设计并实现生成参数配置表单UI
  - 参数包括：
    - **风格选择**: 卡通风格选项（Q版萌系 / 写实卡通 / 水彩风 / 像素风），使用单选按钮或卡片选择器
    - **风格强度**: 滑块控制（0-100%），控制卡通化程度
    - **背景设置**: 透明 / 纯色（可选颜色）/ 渐变（可选颜色组合）
    - **输出尺寸**: 下拉选择（512x512 / 768x768 / 1024x1024）
    - **提示词补充**: 可选文本框，用户可添加额外描述
  - 实现参数的本地存储（localStorage），方便用户下次使用
  - 提供默认参数预设（一键应用推荐设置）
  - 参数变更实时预览效果（如果有预览能力）
- **Acceptance Criteria Addressed**: AC-2 (AI生成流程), AC-5 (工作流连贯性)
- **Test Requirements**:
  - `programmatic` TR-3.1: 所有参数控件都能正常交互，值能正确读取
  - `programmatic` TR-3.2: 选择不同风格选项时，对应的值正确更新
  - `programmatic` TR-3.3: 滑块拖动时数值实时变化
  - `programmatic` TR-3.4: 点击"使用默认设置"按钮后，所有参数重置为默认值
  - `programmatic` TR-3.5: 刷新页面后，之前保存的参数能从localStorage恢复
  - `human-judgement` TR-3.6: UI设计美观，符合产品调性（温暖、治愈）
  - `human-judgement` TR-3.7: 控件布局合理，操作直观易懂
- **Notes**: 此任务可与Task 4并行开发，但Task 4需要用到这里的参数数据

---

## [x] Task 4: 集成AI图像生成引擎
- **Priority**: P0 (核心功能)
- **Depends On**: Task 2, Task 3
- **Description**:
  - **主要方案**: 实现调用外部AI API的逻辑
    - 支持OpenAI DALL-E 3 API（image generation endpoint）
    - 支持Stability AI / Replicate API作为备选
    - 用户在设置页面输入API Key（存储在内存或localStorage）
    - 将上传的图片作为参考图（reference image）传入API
    - 根据Task 3的参数构建prompt和请求体
  - **降级方案（必须实现）**: 当没有API Key或API不可用时
    - 使用Canvas API对上传的图片进行滤镜处理（模糊、边缘检测、色彩量化）
    - 应用卡通化效果（posterize + edge detection + color simplification）
    - 叠加可爱元素（如大眼睛、简化特征）
  - 实现生成状态管理：
    - IDLE（空闲）→ QUEUED（排队）→ PROCESSING（处理中）→ COMPLETED（完成）/ FAILED（失败）
    - 显示预估等待时间和当前阶段
    - 进度条动画（真实进度或模拟进度）
  - 错误处理和重试机制：
    - API超时处理（30秒超时）
    - API限流处理（429错误，提示稍后重试）
    - 网络错误处理（断网提示）
    - 提供"重新生成"按钮（最多3次自动重试）
  - 生成结果展示：
    - 显示生成的最终图像
    - 支持"下载图片"功能（使用 `<a download>` 或 canvas.toBlob）
    - 显示生成耗时统计
- **Acceptance Criteria Addressed**: AC-2 (AI生成流程可用性)
- **Test Requirements**:
  - `programmatic` TR-4.1: 输入有效API Key并调用DALL-E API后，能在60秒内返回生成结果
  - `programmatic` TR-4.2: API调用失败时，错误信息明确显示（包含错误代码和建议操作）
  - `programmatic` TR-4.3: 不输入API Key时，降级方案（Canvas滤镜）能正常工作并输出卡通化图片
  - `programmatic` TR-4.4: 生成过程中状态流转正确（IDLE → PROCESSING → COMPLETED）
  - `programmatic` TR-4.5: 点击"重新生成"后能再次触发生成流程
  - `programmatic` TR-4.6: 下载按钮能将生成的图片保存为PNG文件
  - `human-judgement` TR-4.7: 主方案生成的图像质量较高，保留宠物关键特征
  - `human-judgement` TR-4.8: 降级方案生成的图像有明显卡通化效果，虽然简单但可用
  - `human-judgement` TR-4.9: 加载动画流畅，用户体验良好
- **Implementation Details**:
  - API调用逻辑封装为 `api/imageGeneration.js` 工具模块
  - 使用 `fetch` API进行HTTP请求（无需额外库）
  - Canvas滤镜降级方案封装为 `utils/cartoonFilter.js`
  - 考虑添加请求缓存，避免重复生成相同参数的结果
  - API Key安全提示：提醒用户Key仅存储在本地浏览器，不会上传到其他服务器

---

## [x] Task 5: 实现2D动态宠物动画系统
- **Priority**: P0 (核心差异化功能)
- **Depends On**: Task 4
- **Description**:
  - **架构设计**:
    - 创建 `AnimatedPetComponent.jsx` 组件，接收静态图片URL和动画配置
    - 使用分层渲染技术：底层（身体）+ 中层（眼睛/表情）+ 高层（特效）
    - 使用CSS Transform和Opacity属性实现高性能动画（GPU加速）
  - **眨眼动画实现**:
    - 使用CSS `@keyframes blink` 动画，通过 scaleY(0.1) 模拟闭眼
    - 或者使用多帧图片切换（open-eye.png → closed-eye.png → open-eye.png）
    - JavaScript定时器随机触发，间隔3-8秒（正态分布或均匀分布）
    - 眨眼持续时间150-300ms
    - 双眼同步眨眼（更自然）
  - **呼吸动画实现**:
    - CSS `@keyframes breathe` 动画，translateY(0) → translateY(-8px) → translateY(0)
    - 周期4-6秒，使用 ease-in-out 缓动函数
    - 同时配合轻微的 scale(1.02) 效果（胸部起伏感）
  - **Idle动画实现**:
    - 头部轻微倾斜：rotate(-2deg) → rotate(2deg)，周期8-12秒
    - 身体轻微晃动：translateX(-2px) → translateX(2px)，周期5-7秒
    - 随机触发，不是持续播放（增加自然感）
  - **交互反馈动画**:
    - 鼠标悬停时：轻微放大 scale(1.05)
    - 点击时：跳跃动画 translateY(-20px) → translateY(0)，带弹性效果
    - 可选：显示气泡文字（"喵~"、"汪！"等，随机显示）
  - **动画控制系统**:
    - 提供 play/pause/toggle 方法
    - 动画速度调节（0.5x / 1x / 1.5x / 2x）
    - 单独开关每种动画类型（如只开呼吸，关闭idle）
  - **性能优化**:
    - 使用 `will-change: transform` 属性提示浏览器优化
    - 使用 `requestAnimationFrame` 替代 setInterval（对于JS控制的动画）
    - 当页面不可见时（visibilitychange事件）暂停动画以节省资源
- **Acceptance Criteria Addressed**: AC-3 (动态宠物动画效果)
- **Test Requirements**:
  - `programmatic` TR-5.1: 组件挂载后3-8秒内触发第一次眨眼动作
  - `programmatic` TR-5.2: 使用Performance API监测动画帧率≥55fps（采样10秒）
  - `programmatic` TR-5.3: 点击暂停按钮后，所有CSS animation-play-state变为paused
  - `programmatic` TR-5.4: 点击恢复按钮后，animation-play-state恢复为running
  - `programmatic` TR-5.5: 切换标签页到后台再切回，动画继续正常运行
  - `programmatic` TR-5.6: 调节速度滑块到2x后，动画速度明显加快
  - `human-judgement` TR-5.7: 眨眼动作看起来自然，不像机械式重复
  - `human-judgement` TR-5.8: 呼吸动画节奏舒缓，不会让人感到眩晕
  - `human-judgement` TR-5.9: Idle动画增加了生动感，整体看起来有生命力
  - `human-judgement` TR-5.10: 点击反馈及时明显，有良好的交互感
- **Implementation Details**:
  - 动画配置使用自定义Hook `usePetAnimation(config)` 封装逻辑
  - CSS Keyframes定义在全局样式文件或组件样式中
  - 考虑使用 `framer-motion` 库（如果允许安装）简化复杂动画
  - 如果不用第三方库，纯CSS + JS也能完全实现需求
  - 多帧图片方案需要准备素材（可在Task 4生成时同时生成闭眼帧）

---

## [x] Task 6: 开发桌面宠物模式界面
- **Priority**: P1 (重要增强功能)
- **Depends On**: Task 5
- **Description**:
  - **窗口管理**:
    - 使用 `window.open()` 打开新窗口，配置特定参数（无工具栏、无地址栏、固定大小）
    - 新窗口URL指向 `/desktop` 页面，通过URL参数传递宠物图像数据和配置
    - 实现"始终置顶"功能（使用 `window.focus()` 定期调用或请求Fullscreen API）
    - 窗口尺寸可选：小(200x250)、中(300x375)、大(400x500)
  - **透明背景实现**:
    - 新窗口使用 `-webkit-app-region: drag` 样式（如果是Electron环境）
    - 浏览器环境下使用 `background: transparent` + PNG透明底图
    - 通过Canvas渲染去除背景色（chroma key或alpha通道）
  - **拖拽功能**:
    - 监听 mousedown/mousemove/mouseup 事件
    - 计算鼠标位移，更新窗口位置（使用 `window.moveTo()` 或CSS定位）
    - 拖拽时显示半透明阴影效果
    - 边界检测：防止拖出屏幕可视区域
  - **快捷操作栏**:
    - 悬浮在宠物右上角的小工具栏（默认隐藏，鼠标悬停时显示）
    - 包含按钮：最小化（缩小到托盘或任务栏）、设置（打开设置面板）、关闭（退出桌面模式）
    - 使用Lucide React图标库（已有依赖）
  - **设置面板**:
    - 弹出层或侧边栏形式
    - 可调整：动画速度、动画开关、宠物大小、透明度
    - "关于"信息：版本号、作者、链接
  - **双屏支持**:
    - 检测 `window.screen` 对象获取屏幕信息
    - 允许拖拽到第二屏幕（跨屏幕边界检测）
- **Acceptance Criteria Addressed**: AC-4 (桌面宠物模式交互)
- **Test Requirements**:
  - `programmatic` TR-6.1: 点击"启动桌面宠物"后，成功弹出新的浏览器窗口
  - `programmatic` TR-6.2: 新窗口显示正确的宠物形象（非空白）
  - `programmatic` TR-6.3: 鼠标按下宠物并移动时，宠物跟随鼠标位置改变
  - `programmatic` TR-6.4: 松开鼠标后，宠物停留在当前位置
  - `programmatic` TR-6.5: 点击关闭按钮后，新窗口关闭
  - `programmatic` TR-6.6: 选择不同尺寸档位后，宠物显示大小相应改变
  - `programmatic` TR-6.7: 设置面板中的选项修改后即时生效
  - `human-judgement` TR-6.8: 窗口置顶效果明显，不会被其他窗口遮挡
  - `human-judgement` TR-6.9: 透明背景效果好，宠物融入桌面环境
  - `human-judgement` TR-6.10: 操作栏易用，图标含义清晰
  - `human-judgement` TR-6.11: 整体体验接近真实的桌面宠物软件
- **Implementation Details**:
  - 桌面模式页面 `/desktop/page.js` 是一个独立的轻量级页面
  - 数据通过 URL Query Params 或 sessionStorage 传递（避免postMessage复杂性）
  - 拖拽逻辑封装为自定义Hook `useDraggable(ref, options)`
  - 考虑添加右键菜单（context menu）提供更多快捷操作
  - 如果浏览器限制 `window.open` 的某些特性（如alwaysOnTop），需提供备选方案说明

---

## 任务依赖关系图
```
Task 1 (基础架构)
   ↓
Task 2 (上传系统) ──┬──→ Task 4 (AI生成引擎)
                     │         ↓
              Task 3 (参数配置) ┘──→ Task 5 (动画系统)
                                         ↓
                                    Task 6 (桌面模式)
```

**可并行执行的任务组**:
- 第一批（串行）: Task 1 → Task 2
- 第二批（并行）: Task 3 + Task 4（都依赖Task 2，但彼此不依赖）
- 第三批（串行）: Task 5（依赖Task 4）
- 第四批（串行）: Task 6（依赖Task 5）

## 技术栈补充说明
- **可能需要的新依赖**:
  - `react-dropzone` 或 `@dropzone/react` (文件拖拽上传)
  - `framer-motion` (高级动画库，可选，也可用纯CSS替代)
  - `react-hot-toast` 或 `sonner` (Toast通知，可选)
  - `uuid` (生成唯一ID，用于文件标识)
- **不需要的依赖**:
  - 不需要Redux/Zustand等重型状态管理（用React Context足够）
  - 不需要Three.js/Babylon.js等3D引擎（2D动画即可）
  - 不需要Electron/Tauri（浏览器窗口模拟即可）

## 风险与缓解措施
1. **风险**: AI API响应慢或不稳定
   - **缓解**: 实现健壮的降级方案（Canvas滤镜），确保即使没有网络也能演示功能
   
2. **风险**: 浏览器兼容性问题（特别是桌面模式的窗口API）
   - **缓解**: 提供特性检测和优雅降级，在不支持的浏览器中给出明确提示

3. **风险**: 动画性能问题（低端设备卡顿）
   - **缓解**: 默认降低动画复杂度，提供性能配置选项，使用GPU加速属性

4. **风险**: 图片版权和法律问题
   - **缓解**: 明确声明仅用于个人纪念用途，不商用；建议用户使用自己拍摄的宠物照片

---

## 质量检查清单
- [x] 每个验收标准至少被一个任务覆盖
- [x] 每个任务至少有一个测试要求
- [x] 任务依赖关系形成有效的DAG（无循环依赖）
- [x] 任务粒度一致（每个任务预计2-4小时完成）
- [x] Programmatic 和 Human-judgment 验证方式正确保留
- [x] 包含了具体的技术实现细节和代码示例方向
