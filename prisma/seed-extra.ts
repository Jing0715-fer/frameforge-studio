import type { PromptSeed, EffectSeed } from './seed-data'

// ============================================================
// 15 个开源项目 + 附件《代码动画》341 风格库 + fy-code-animation
// 方法论的进一步提炼扩充（与 seed-data.ts 中的基础库合并入库）
// ============================================================

export const extraPromptSeeds: PromptSeed[] = [
  // ================ fy-code-animation 方法论 · 创作法 ================
  {
    title: 'fy 语义分镜任务卡（总指令）',
    category: '方法论 · fy 创作法',
    content:
      '你是代码动画导演。请把下面这篇文案做成一份「任务卡」设计文档（只交卡，不生成动画）：\n\n第一步 全文理解：一句话主旨；观众从什么理解变成什么理解；情绪起点→转折→落点；全文结构按「提出/解释/证据/限制或反转/落点」标注（没有反转不硬造）。\n第二步 语义分段：每段写 ID、原文范围、本段职责、与前后段的关系（因果/对比/递进/转折）、读懂的最低条件、快慢倾向。\n第三步 重点词分级：列表写出词、语义角色（结论/转折/否定/数字/对比/情绪/动作/专名）、力度等级（一级字重颜色，二级空间变化，三级只给真正高潮）、表达手段、为什么用这个手段而不是放大。否定词和条件词必须可读。\n第四步 画风安排：全片统一或分章变化及依据；每个选中风格写「风格卡」——语法（材质/构图/运动/镜头如何构成）、文字、运动、声音、依赖、内容适配。\n第五步 逐镜分镜：每镜写到拿去就能写代码的深度——画面五层（背景/中景/主体/文字/前景）各是什么怎么动、主动作曲线与参数、镜头起止取景与锚点、文字最后落字时间与静读窗、与下一镜的接缝方式（同对象接力/遮罩/翻面/粒子重组/硬切）、音效事件。\n第六步 节奏能量曲线：全片哪里蓄势、释放、安静；时长不平均分配。\n第七步 音乐四案：四案在编制/节奏/动机/能量曲线/口播关系/结尾方式至少三维实质差异，各配完整生成 caption；音效表。\n第八步 检查计划与风险缺项。\n\n文案：{{粘贴你的完整文案}}\n画风库：{{可选：从风格素材库选好的风格编号}}\n画幅/时长/引擎：{{如 1920×1080 / 30s / Remotion}}',
    tags: '任务卡,语义分镜,fy-code-animation,创作流程',
    sourceRepo: 'fy-code-animation',
    useCase: '把一篇完整文案交给 AI 做全套动画设计（最高质量模式），产出可直接开工的设计文档',
  },
  {
    title: '逐镜分镜表（shot-sheet 级深度）',
    category: '方法论 · fy 创作法',
    content:
      '请为下面这段内容写「逐镜分镜表」，每镜必须包含以下字段，禁止「酷炫转场」「有质感」这类不可执行形容词：\n\n【单镜模板】\n- 镜 ID / 语义段 / 原文范围\n- 观众理解变化（看完这一镜，观众多知道了什么）\n- 初态→主要动作→结果（可观察的变化，不是标题+图标+淡入）\n- start/end 秒、最后必要信息落稳秒、静读窗秒数（按每秒 4–7 字试算）\n- 重点词与力度等级、理由、否定范围\n- 画面五层：背景/中景/主体/文字/前景——每层内容、初末状态、起势/动作/停稳/退出秒、曲线参数、事件 ID\n- 镜头：中心/zoom/rotation 关键时刻，世界层与屏幕层归属\n- 字体/字号/断行、进入/完整阅读/退出时间\n- 声音：口播/音乐/音效/环境、接触事件与峰值偏移\n- 接下一镜：对象、方向、锚点、速度、卸载时刻\n\n【转场表】A→B 的语义关系、承载物、重叠区间、交接事件、前后锚点与速度、底色。\n【事件表】id / at秒 / planned|measured / 信息变化 / 画面动作 / 声音职责。\n\n内容：{{你的内容}}  画幅：{{如 1080×1920}}  总时长：{{秒}}',
    tags: '分镜表,逐镜深度,时间轴,fy-code-animation',
    sourceRepo: 'fy-code-animation',
    useCase: '需要工业级分镜深度（每层每秒每个事件都写清）时使用',
  },
  {
    title: '语义关系 → 可视操作映射',
    category: '方法论 · fy 创作法',
    content:
      '请把下面这段文案的每一句，先标注语义关系，再映射成可视操作（不是每个名词配一个图标）：\n\n映射表：\n- 因为A所以B → A先改变，经过可见路径影响B；触发先于反应（不能A/B一起弹出）\n- 不是A而是B → 保留比较维度，撤除/改写错误解释；否定词必须与被否定部分一起出现并保留静读\n- 部分组成整体 → 从真实分件装配到整体；数量、连接方式、归属正确（随机粒子聚合≠功能分工）\n- 范围扩大/尺度变化 → 同一对象拉远逐层揭示；小层仍可追踪，尺度标签真实\n- 选择取舍 → 分支及代价显现，选中一条；被放弃项不是稻草人\n- 时间累积 → 时间轴、留痕、层叠、增长；时点与数量有来源\n- 感受转变 → 姿态、空间、颜色、速度共同变化；情绪来自前因，允许停顿\n\n抽象主题先选一种可持续变形的载体：线、纸面、窗口、路、群体、机械件。\n输出：逐句的「原文 → 语义关系 → 可视操作 → 承载对象 → 阅读窗」表格。\n\n文案：{{粘贴文案}}',
    tags: '语义映射,反PPT,因果可视化,fy-code-animation',
    sourceRepo: 'fy-code-animation',
    useCase: '文案逻辑关系复杂（因果/对比/递进/转折多）时，先做语义映射再分镜',
  },
  {
    title: '气势词与中文动态文字指令',
    category: '方法论 · fy 创作法',
    content:
      '请为下面这句中文设计动态文字方案。先找真正改变句意的词，再选手法：\n\n【语义角色优先级】否定/条件（保全逻辑范围，与被否定部分一起出现保留静读）> 转折/结论（前项让位、位置转换）> 数字/量级（同基线、等宽数字、图形同源插值）> 对比双方（对等比较，保持字号/尺度）> 动作动词（字成为支点、牵引线、切割边）> 情绪气势词（停顿、留白、增重、周边退让）> 专名（稳定字体与位置，首次完整出现）。\n\n【手法谱系】语义块遮罩上移（每块独立mask，rise 0.2–0.6字高，组间错开0.06–0.15s）/ 字重轴脉冲（wght 400→650→400，只在实际fvar范围内）/ 轮廓到填色 / 书写揭示（需真实笔顺，没有就称轮廓揭示）/ 粒子聚字（稳定id对应目标）/ 挤出字 / 拆字表意（用经核对的部件路径）/ 打字机（中文6–12字/s，解释字幕不用全程打字）/ 乱码解码（关键事实不保留乱码）/ 高亮划线删改 / 卡拉OK逐字上色（用实测词时间，不用均分假装对齐）/ Slam冲击（startScale 1.3–1.7，只给真正高潮）。\n\n【硬规则】静读窗从最后一个必要字落稳开始算（每秒4–7字）；split(" ")无法切中文，语义分组显式传入；竖版重新分组重排不能整体缩小。\n\n句子：{{你的句子}}\n语境：{{如：知识科普高潮句 / 品牌slogan / 歌词}}',
    tags: '动态文字,气势词,中文排版,fy-code-animation',
    sourceRepo: 'fy-code-animation',
    useCase: '给关键句设计有层次的动态文字（不是每个词都放大砸屏）',
  },
  {
    title: '转场谱系应用指令（10 类接缝）',
    category: '方法论 · fy 创作法',
    content:
      '请为下面这组相邻镜头设计转场。转场的输入是一对已成立的镜头，不是效果名称。先判断两镜关系再选方案：\n\n- 同一对象进入下一步/因果接续 → 同对象接力（记录A的屏幕锚点/外接框/旋转/速度，算B的对应状态；锚点误差≤8px，交接预备.15–.4s）\n- 同一空间看另一部分 → 推移/共享轴/跟随/拉远揭示\n- 从总体进入细节 → 锚点放大/穿越（portal比例k，尺度log插值，factor 2–4）\n- 回忆/时间经过/状态消融 → 叠化/柔边遮罩/噪声溶解（.4–1.2s）\n- 明确对比/笑点/跳跃 → 有动机硬切/定格后切（切在动作峰值或静止反差）\n- 章节换画风 → 贯穿物承接/纸页前景遮挡/材料变换（字体和角色身份保留）\n- 没有可追踪共同点 → 简洁硬切或短叠化（不制造虚假物理因果）\n\n【五段时序】准备（上镜结论可读，交接对象获注意）→ 接近（向切换位置运动）→ 交接（E_HANDOFF 事件标记哪帧由下镜承担）→ 到达（延续或明确打断上镜动作）→ 阅读（新镜必要信息落稳后才开始计读窗，转场时长不能抵扣阅读窗）。\n\n输出：转场方案、承载物、重叠区间、交接事件、前后锚点与速度、底色、音效关系。\n\n镜头 A：{{描述}}\n镜头 B：{{描述}}',
    tags: '转场,接缝,匹配剪辑,fy-code-animation',
    sourceRepo: 'fy-code-animation',
    useCase: '镜头之间不知道怎么接、或者转场很生硬时使用',
  },
  {
    title: '镜头运动设计指令（四段式）',
    category: '方法论 · fy 创作法',
    content:
      '请为下面的镜头设计相机运动。相机公式：screen = viewportCenter + zoom × R(rotation) × (world − cameraCenter)。每个镜头按四段设计：起势（建立目标或给视线线索）→ 移动（只改变当前需要解释的空间关系）→ 到站（结束大幅位移）→ 停稳（让证据/文字可读）。不要每段都套 easeInOut。\n\n【词汇表】推近（zoom 1→1.04–1.08，3–6s，对数缩放）/ 拉远（1.4→1，1–2s）/ 横移（0.1–0.4W，.7–1.8s，先给方向线索）/ 升降（.1–.3H）/ 证据缩放（字与证据先达目标屏幕字号再定倍率）/ Dolly zoom（FOV_new=2·atan(d_ref·tan(FOV_ref/2)/d_new)）/ 多层视差（背景.2–.4，主体1，前景1.1–1.4）/ Orbit（.15–.5 rad/s，完整一圈有必要才做）/ 翻转卡片（tilt 5–15°）/ 宏观↔微观（每层倍率2–4）/ 跟随（ahead .1–.2s，读长字幕时相机停止追）/ Rack focus（blur 0–14px，.4–.9s，不糊字幕）/ 手持震动（2–8px，.2–.5s，12–24Hz种子噪声）/ Whip pan（.16–.35s，不承担新信息阅读）。\n\n【运动预算】同一时刻不让视线同时追三个无关目标；需要读长句时镜头可以完全静止；大标题砸字+背景旋转+相机推近同时出现时，保留承担主意义的一个动作，其他降幅或错开。\n\n【硬规则】zoom 优先 log 空间插值；世界层物件与接地影同一变换；字幕在屏幕层不被带走；像素分支按逻辑像素取整。\n\n镜头内容：{{描述}}\n观众主任务：{{读/比较/跟随/感受}}',
    tags: '运镜,相机,视差,fy-code-animation',
    sourceRepo: 'fy-code-animation',
    useCase: '设计有信息任务的镜头运动（而不是无脑推拉）',
  },
  {
    title: '音乐四案生成指令',
    category: '方法论 · fy 创作法',
    content:
      '请为下面这支代码动画写四案音乐方案与音效表。要求四案在编制、节奏结构、动机、能量曲线、口播关系、结尾方式中至少三维有实质差异（四种 seed 不是四种风格）。\n\n【参考矩阵】A 克制推进（毛毡琴+少量低音，4拍稀疏脉冲，短双音动机，句间回应开放余音）/ B 机械展开（木质敲击+干合成器，不对称分组，切分动机，口播段抽掉中频）/ C 空间呼吸（弦乐泛音+空气织体，自由时间，长音变化，高潮前留空）/ D 手工叙事（拨弦+刷奏，三拍摇摆，可辨短乐句，回到开头动机收束）。\n\n【每案输出】情绪方向、器乐声部、节拍/拍号、织体密度、动机、段落能量曲线（与全片能量表对齐）、主旋律是否让位旁白、结尾方式、避免项、完整生成 caption（器乐性质与情绪→核心编制→节奏动机→段落密度→口播空间→结尾→避免项）。\n\n【音效表】事件ID、对象和材质、力度、时长、同步关系（接触事件对齐实际峰值而非文件起点）、密度控制（连续键声限密度并轮换）。\n\n【硬规则】计划时间标 planned，不虚构「已卡点」「实测BPM」；模型只有整体 caption 接口时不伪造逐镜头事件支持；混音目标网络片 −14 LUFS / ≤−1 dBTP 起步。\n\n视频内容与能量曲线：{{描述}}\n时长：{{秒}}',
    tags: '音乐,四案,音效表,fy-code-animation',
    sourceRepo: 'fy-code-animation',
    useCase: '给视频设计真正有差异的音乐方案（AI 音乐生成器的提示词也一并产出）',
  },
  {
    title: '质量自检与返修指令',
    category: '方法论 · fy 创作法',
    content:
      '请对下面这支动画（或分镜稿）做分层审片，机器检查、实际观看、作者采用分开记录，不打混合总分：\n\n【五层审片顺序】1 结构：无声音能否看懂主要关系？否定/因果是否反了？信息是否真实？→ 2 节奏：听句读、看最后落字、停留与高潮；读不完先减信息/延长，不机械加速旁白 → 3 动作：接触、速度、连续性、视线和镜头锚点；逐接缝看前后与运动中间 → 4 细节：字体、裁切、粒子字、透视、透明度、材质 → 5 声音：分轨和合听，核接触峰值、口播让位、结尾及编码后同步。\n\n【严重度分级】P0 阻断（错误事实/句意反转、素材缺失、文件损坏→停止称可交付）/ P1 主要理解失败（核心字不可读、因果断裂、接触滑步、整体音画迟）/ P2 体验问题（次要动效机械、局部拥挤）/ P3 可选打磨。\n\n【症状速查】像PPT→补真实关系变化；没讲清→先查条件因果证据阅读窗，最后才调缓动；太散→固定贯穿对象；读不完→减同屏信息或延长静读；每个元素都弹→静态/线性/单次ease保留一处反馈；粒子字糊→先关辉光降背景保字腔；seek后位置不同→闭式f(t)每对象seed；音画迟→实测对齐不套固定偏移。\n\n【输出】每条返修写：镜头/时间范围、现象、预期、证据、根因假设、具体代码/参数、修改、实际复核范围。\n\n动画/分镜稿：{{粘贴或描述}}',
    tags: '质量检查,返修,审片,fy-code-animation',
    sourceRepo: 'fy-code-animation',
    useCase: '动画做完后的系统性自检与返修清单',
  },
  {
    title: '画风原文 → 可执行规则翻译',
    category: '方法论 · fy 创作法',
    content:
      '你是一名技术美术。请把下面这段「画风提示词原文」翻译成可直接执行的本片规则——读完原文后逐条翻译，不是只摘关键词：\n\n- 材质/媒介（蓝晒纸、木活字、像素、黏土、水墨…）→ 背景与物件的绘制方式、纹理坐标系、颜色数量、线宽规则\n- 构图与版式 → 网格、安全区、主体位置、文字区、留白比例\n- 运动语法（逐格、连续、机械、弹性、书写顺序…）→ 曲线类型、绘制频率、是否允许模糊或弹簧、动作顺序\n- 镜头（固定纸面、推拉、俯视、等轴…）→ 相机自由度、投影方式、允许的转场\n- 时代与情绪 → 色温、颗粒、声音的配器方向\n- 示例故事/品牌/人物 → 不搬运，换成本片内容\n\n输出六项风格卡：语法 / 文字 / 运动 / 声音 / 依赖（字体字形、图片、组件、许可，缺失的列明不静默替换）/ 内容适配。原文没有规定的部分按本片内容设计并标注「自定」。\n\n画风原文：{{粘贴风格提示词}}\n本片内容：{{一句话}}',
    tags: '风格翻译,技术美术,可执行规则,fy-code-animation',
    sourceRepo: 'fy-code-animation',
    useCase: '拿到一个风格提示词后，把它变成工程上可落地的规则',
  },

  // ================ 15 个仓库精华 ================
  {
    title: 'Hyperframes 确定性渲染规范（Agent Skill 调用）',
    category: '仓库精华',
    content:
      '请按 Hyperframes 规范写这段动画的 HTML 单文件实现：\n\n1. 画面是时间 t（秒）的纯函数 draw(t)：同一个 t 每次渲染结果完全一致；禁止 Date.now、无种子随机、累积状态（x+=v）和上一帧画布残留；所有随机用带种子的 PRNG（如 mulberry32(seed)）且只在启动时生成一次。\n2. requestAnimationFrame 驱动 t = 已播放秒数；默认循环播放；按空格暂停/继续；网址带 ?t=3.3 时只渲染第 3.3 秒那一帧（供 Hyperframes 逐帧截取）。\n3. CSS 动画只用 transform/opacity/clip-path 等合成器友好属性；写明关键帧时间点与缓动曲线；canvas 固定目标分辨率（如 1920×1080），CSS 等比缩放居中。\n4. 只输出一个完整 index.html 代码块，不用省略号，不写「其余同上」。\n5. 结尾注明：用 Hyperframes 以 1080p/60fps 渲染导出 MP4。\n\n动画内容：{{描述}}',
    tags: 'hyperframes,确定性渲染,纯函数,MP4',
    sourceRepo: 'hyperframes',
    useCase: '需要产出可被 Hyperframes/浏览器逐帧截取渲染成 MP4 的确定性动画',
  },
  {
    title: 'Remotion spring 缓动配方',
    category: '仓库精华',
    content:
      '请用 Remotion 实现下面的动画编排，遵循官方 skills 的最佳实践：\n\n1. 组件结构：React 函数组件，useCurrentFrame() 与 useVideoConfig() 驱动；spring({frame, fps, config:{damping, stiffness}}) 计算动画，interpolate(frame, [in0,in1],[out0,out1],{extrapolateLeft/Right:"clamp", easing}) 做区间映射。\n2. 时序编排：外层 <Composition fps={30} width={1920} height={1080}>；用 <Sequence from={秒*fps} durationInFrames> 分段；注意 Sequence 内部是局部帧，全片事件必须加回 offset，禁止同一 offset 加两次。\n3. 弹簧参数按用途选：精密UI damping≈200（临界附近）；柔和入场 damping 14–18 / stiffness 100–130；聚拢有轻微回弹 damping 12–14；急促离场 stiffness 200+。\n4. 时间以秒为交换单位，只在组件边界 frame/fps 转换一次。\n5. 注册到 Remotion Root 并注明导出命令：npx remotion render <Composition> out/video.mp4。\n\n动画需求：{{描述}}',
    tags: 'remotion,react,spring,序列编排',
    sourceRepo: 'remotion-skills',
    useCase: '用 React 组件化方式写视频动画',
  },
  {
    title: '爆款视频「实时重制」学习法',
    category: '仓库精华',
    content:
      '请扮演 awesome-opus5-5-videos 的分析引擎。我将给你一支爆款视频的描述/截图，请做四件事：\n1. 逆向拆解：按秒拆出镜头表（时间/景别/画面/动效/文字/节奏），统计每镜时长分布与切换频率。\n2. 提示词还原：为每一镜写出能复现它的提示词（写死颜色hex、秒数、镜头走法、缓动）。\n3. 结构归纳：归纳它的钩子类型（悬念/反差/冲击/共情）、递进方式、高潮位置、记忆点设计。\n4. 迁移改写：把这套结构套到我的新主题上，输出新脚本与逐镜提示词。\n\n爆款视频：{{描述或截图}}\n我的新主题：{{描述}}',
    tags: '爆款拆解,逆向工程,提示词还原,awesome-opus',
    sourceRepo: 'awesome-opus5-5-videos',
    useCase: '看到喜欢的爆款视频，想弄清它为什么好并复用到自己的主题',
  },
  {
    title: 'lemo-opuscar 导演指南（DIRECTOR 模式）',
    category: '仓库精华',
    content:
      '请以 lemo-opuscar 的 DIRECTOR 指南执导下面这支片子。风格不只是配色，四件套都写死才能复现：\n\n1. 材质：确定绘制方式（实色/渐变/噪点/纹理坐标系）、颜色数量与线宽规则。\n2. 构图：网格系统、安全区、主体位置、文字区、留白比例（负空间给关系与阅读留位置）。\n3. 运动语法：曲线类型（机械线性/弹性/逐格/书写顺序）、允许的转场、动作顺序。\n4. 镜头语言：相机自由度（固定纸面/推拉/俯视/等轴）、投影方式。\n\n再加：能量曲线（蓄势→释放→安静，时长不平均分配）、一镜一个注意目标、重复建立规则变化打破规则（每次重复带新信息）。\n\n输出：本片的四件套规格 + 逐镜执行表。\n\n片子内容：{{描述}}\n目标风格：{{风格库编号或描述}}',
    tags: '导演指南,风格复现,lemo-opuscar',
    sourceRepo: 'lemo-opuscar',
    useCase: '想让某种风格「真的像」，而不只是换了配色',
  },
  {
    title: 'huashu 35 风格 × 9 解说语法组合矩阵',
    category: '仓库精华',
    content:
      '请用「风格 × 解说语法」双轴为我的内容设计方案：画面风格与文案语调分开选择再组合。\n\n【解说语法 9 选】（决定旁白怎么写）1 平实讲述（可信、克制）/ 2 悬念设问（先抛问题）/ 3 反差对比（以前vs现在）/ 4 递进排比（一句比一句强）/ 5 情绪独白（第一人称）/ 6 数据证明（数字说话）/ 7 场景代入（你正在…）/ 8 权威引用（转述定论）/ 9 留白余韵（少即是多）。\n\n【画面风格候选】水墨/油画/版画/像素/等距2.5D/黏土/剪纸/蓝图/霓虹/胶片…（可从风格素材库选）。\n\n输出：1) 选择的解说语法及理由；2) 按该语法改写我的文案（每句标注情绪力度）；3) 匹配的 2–3 种画面风格及组合理由；4) 首镜与尾镜的具体设计。\n\n我的内容：{{描述}}\n平台/受众：{{如 抖音/年轻人}}',
    tags: '解说语法,风格组合,huashu-art-motion',
    sourceRepo: 'huashu-art-motion',
    useCase: '不知道文案该用什么语调、画面该配什么风格时',
  },
  {
    title: 'onetake 一镜到底 + 数学验收',
    category: '仓库精华',
    content:
      '请把下面内容做成「一镜到底」动画：每个场景都从上一个场景里「长」出来——文字从一条线里升起、按钮展开成页面、用一种颜色铺满画面切到下一段。禁淡入淡出、禁模糊、禁无动机硬切；每个场景镜头只做一次缓动。\n\n【数学验收标准（自动检查）】\n1. 连续性：相邻场景的主体屏幕位置差 ≤ 画幅宽的 3%；\n2. 方向一致：全片水平运动方向翻转次数 ≤ 2（有动机除外）；\n3. 色温统一：相邻场景主色在 HSL 色相环距离 ≤ 40°（风格化切换除外）；\n4. 时间覆盖：场景时间轴从 0 连续到总时长，无空隙无重叠；\n5. 缓动次数：每场景主缓动恰一次（入场），过程运动用线性或跟随。\n\n输出：场景链描述（每一环从上一环的什么元素长出来）+ 逐秒时间轴 + 验收自检表（逐条打勾并给出数值）。\n\n内容：{{描述}}  时长：{{秒}}',
    tags: '一镜到底,数学验收,连贯性,onetake',
    sourceRepo: 'onetake',
    useCase: '产品发布片/流程讲解要做一镜到底时的设计与自检',
  },
  {
    title: 'ClaudeAnimationBase 角色表情与表演链',
    category: '仓库精华',
    content:
      '请用 p5.js + p5.brush 为我的内容设计一个贯穿全片的手绘卡通角色（参考 ClaudeAnimationBase 的做法）：\n\n1. 角色设定：剪影可读、头身比（如1:3）、脸部锚点稳定（眼/嘴位置固定便于换表情）；识别色（如橘色围巾）跨画风保持。\n2. 表情系统（从31种中选需要的）：平静/好奇/惊讶/疑惑/思考/恍然大悟/开心/兴奋/骄傲/紧张/害怕/委屈/难过/生气/尴尬/害羞/坚定/犹豫/疲惫/睡着/听/说/看/指/点头/摇头/耸肩/鼓掌/挥手/奔跑/静止。\n3. 表演链：注意到（眼/头先指向目标）→ 反应（预备动作）→ 采取行动（手与身体跟随）→ 结果；衣角/头发比主动作晚一点。\n4. 分层绘制顺序：后臂/后腿→前腿→衣/躯干→头→前臂；脚固定接地点，重心移向支撑脚；拿物件时约束手掌接触点。\n5. 手绘感：轮廓 boil 用3张线稿循环（12 drawings/s），锚定角色坐标；快动作用一张 smear 或三张关键姿势，不连续插值。\n\n输出：角色设定卡 + 表情-剧情映射表 + 关键动作的 p5.js 伪代码。\n\n内容：{{描述}}  角色性格：{{如 好奇心强的小伙伴}}',
    tags: '角色动画,表情系统,p5js,ClaudeAnimationBase',
    sourceRepo: 'ClaudeAnimationBase',
    useCase: '需要一个手绘小角色贯穿全片讲故事',
  },
  {
    title: 'ReelMimic 参考视频全流程复刻',
    category: '仓库精华',
    content:
      '请扮演 ReelMimic，对我提供的参考视频做四步逆向，然后产出同风格新片：\n\n第一步 镜头切分统计：按内容变化切分镜头，输出每镜时长、景别占比、切换频率曲线。\n第二步 节奏标定：每镜时长分布（快段/慢段/停顿位置）、能量曲线、与音乐的关系（卡点/让位/留白）。\n第三步 配色提取：每镜主色/辅色/点缀色（hex）、色温走向、明度节奏；归纳全片色板策略。\n第四步 视觉语法归纳：运动语言（推拉/形变/粒子/遮罩…）、文字用法（大小/位置/出现方式）、质感（纹理/噪点/光效）。\n\n然后：保留「结构与语法」，替换「内容与品牌」，为我产出新片的完整分镜 + 逐镜实现提示词（沿用参考片的节奏与配色策略）。\n\n参考视频：{{链接或逐镜描述}}\n我的新内容：{{描述}}',
    tags: '参考逆向,风格复刻,ReelMimic',
    sourceRepo: 'ReelMimic',
    useCase: '看到一支喜欢的参考片，想要同款结构节奏的新片',
  },
  {
    title: 'shipvideo 产品发布片四段式全流程',
    category: '仓库精华',
    content:
      '请扮演 shipvideo Agent，把我的产品信息变成一支 20–40 秒的发布片全自动方案：\n\n【四段式结构】1 痛点钩子（0–15%时长）：一个具体场景里的具体挫败，不喊口号；2 产品亮相（15–30%）：一句话说清产品是什么 + 一个视觉记忆点；3 功能证明（30–75%）：2–4 个功能，每个配「操作前态→触发→结果」的界面演示，数据真实有来源；4 CTA 收尾（75–100%）：一个明确动作 + 品牌记忆点。\n\n【工程要求】界面演示忠实真实截图/录屏；前态→输入→处理→结果逐项有证据，没发生的调用不画成成功实录；操作共享事件ID（光标到达、按下、反馈、音效同一时刻）；演示倍率标实际 playbackRate。\n\n输出：脚本 + 逐镜分镜（含实现提示词）+ 素材清单（需要用户提供什么）+ 服务端渲染任务拆分。\n\n产品：{{名称+一句话}}  目标用户：{{描述}}  核心功能：{{2–4个}}',
    tags: '产品发布片,四段式,自动化,shipvideo',
    sourceRepo: 'shipvideo',
    useCase: '给产品做发布/宣传短视频',
  },
  {
    title: 'mg-styles 成片→提示词→源码三位一体拆解法',
    category: '仓库精华',
    content:
      '请用「三位一体」法为我拆解并教会 AI 复刻这个动效风格（参考 mg-styles-15 的开源方式）：\n\n1. 看片拆解：把目标效果逐秒拆成「元素清单 + 属性变化 + 时间参数」——哪些元素（图形/文字/粒子）、每个元素什么属性在变（scale/rotate/opacity/path）、关键帧在哪、缓动什么类型。\n2. 提示词化：把拆解结果写成一段可复现的提示词（写死颜色、秒数、缓动、层级），让没看过原片的 AI 也能做出同款。\n3. 源码化：给出最小可运行的实现（HTML+CSS 或 Canvas），代码里每个魔法数字都对应提示词里的参数。\n4. 交付三件套：效果演示（代码）+ 提示词（可复制）+ 参数表（可调）。\n\n目标效果：{{描述或参考链接}}',
    tags: '三位一体,效果拆解,提示词工程,mg-styles',
    sourceRepo: 'mg-styles-15',
    useCase: '看到一个动效想知道怎么拆、怎么让 AI 复刻',
  },
  {
    title: 'A–G 确定性 Canvas 样片开发约定',
    category: '仓库精华',
    content:
      '请按《代码动画》A–G 代码样片的开发约定，为我写一个 Canvas 2D 绘制函数：\n\n1. 函数签名 S.XX(c, w, h, t, s)：c 是 canvas 的 2D context，w/h 是宽高，t 是秒，s 是给函数存状态的空对象；首次调用时 s.init 初始化（带种子随机、粒子数组等），之后只读 s。\n2. 画面是 t 的纯函数：不用 Math.random（用带种子的 rng）；不在 draw 里累积状态；dt = clamp(t − (s.lt ?? t), 0, .05) 计算帧间增量。\n3. 公共工具可用：rng(seed)、vgrad(ctx,h,c1,c2) 竖向渐变、glowDot(ctx,x,y,r,col,a) 发光点、hex(col,a)、ss(a,b,x) smoothstep、eOut/eBack 缓动、nz(x,y,t) 噪声、paperTex(w,h,dpr,base,seed) 纸纹。\n4. 字体常量：SERIF 衬线 / SANS 无衬线 / MONO 等宽。\n5. 性能：控制每帧绘制次数；粒子按需开关光晕。\n\n效果需求：{{描述你的画面}}\n画幅：{{如 1920×1080}}',
    tags: 'canvas,确定性,代码样片,代码动画',
    sourceRepo: 'code-animation-pack',
    useCase: '写可复用、可确定性渲染的 Canvas 动效函数',
  },
  {
    title: 'opus-video-prompts 四分类提示词法',
    category: '仓库精华',
    content:
      '请按「四分类法」帮我为同一个创意写出四个精度等级的提示词（参考 opus-video-prompts 的中文案例库分类）：\n\n1. 一句话版（≤30字）：只说核心创意，适合快速试稿——结果随机性大，每次不一样。\n2. 模板版（80–150字）：填空式结构——主体+环境+风格+节奏+情绪，留 {{ }} 给内容。\n3. 参考图版：以某张图/某个画风为锚，描述「保留什么（构图/配色/质感）+ 改变什么（内容/文字）」。\n4. 长提示词版（300–600字）：写死一切——颜色hex、每段时间、镜头走法、缓动曲线、字体、字号、结束状态；不同模型做出来高度接近。\n\n规律：写得越细（颜色、时间、镜头都写死），不同模型做出来越接近；只给一句话也能做，但更慢且每次不同。\n\n我的创意：{{描述}}\n用途：{{如 给Claude Code做HTML动画 / 给视频生成模型}}',
    tags: '四分类,提示词精度,中文案例,opus-video-prompts',
    sourceRepo: 'opus-video-prompts',
    useCase: '同一个创意需要不同精度的提示词版本（快速试稿 vs 精确复现）',
  },
  {
    title: '卡拉OK歌词 MV 工程指令（4K60）',
    category: '仓库精华',
    content:
      '请按 pdoom-video 的工程实践，为我这首歌词做卡拉 OK MV 的完整技术方案：\n\n1. 歌词时间轴：LRC 或逐词时间戳（word-level）；每行显示窗口 = 前奏留白 + 演唱期 + 尾音延续。\n2. 卡拉OK字幕渲染：整句先可见（半透明），按逐词实测时间上色已唱部分，保留已读色；不用均分时间假装对齐；字号 1080p ≥ 72px，描边/投影保证任何背景可读。\n3. 视觉层：主视觉（风格化背景或动画）与字幕层分离；副歌可加粒子/光效但对比度让位字幕。\n4. 渲染：1920×1080@60 或 3840×2160@60；逐帧确定性渲染导出；音频与视频帧数对齐（实测采样数，不用时长估算）。\n5. 输出：工程结构（组件/资源/时间轴文件）+ 逐段视觉设计 + 导出命令。\n\n歌词：{{粘贴}}  风格：{{风格库编号或描述}}  分辨率：{{1080p/4K}}',
    tags: '卡拉OK,歌词MV,4K60,pdoom-video',
    sourceRepo: 'pdoom-video',
    useCase: '做歌词 MV / 音乐视频的完整工程方案',
  },
  {
    title: '双 MV 对照拆解法（同曲不同视觉）',
    category: '仓库精华',
    content:
      '请用「同曲对照」法帮我探索同一内容的两种视觉方案（参考 PDoomVideo 与 pdoom-video 同歌双版本的对照关系）：\n\n1. 先写歌曲/内容的「不变量」：情绪曲线、段落结构、关键转折点、每段时长。\n2. 方案 A：选一个「叙事优先」的视觉路线（如手绘角色+场景表演），逐段映射情绪。\n3. 方案 B：选一个「形式优先」的视觉路线（如纯文字动效+抽象图形），同一情绪用不同语法表达。\n4. 对照表：每段并列两案的镜头、动效密度、文字用法、颜色策略，标注「哪段谁更好、为什么」。\n5. 结论：推荐混合策略（哪些段用A的语法、哪些段用B的语法、接缝怎么处理）。\n\n歌曲/内容：{{描述}}  两种风格候选：{{风格1 / 风格2}}',
    tags: '对照拆解,视觉方案,同曲双版本,PDoomVideo',
    sourceRepo: 'PDoomVideo',
    useCase: '纠结两种视觉方向时，用对照法决策',
  },
  {
    title: '视频来源核验法（渲染归属标注）',
    category: '仓库精华',
    content:
      '请扮演 awesome-claude-5-5-videos 的核验员，对我收集的 AI 视频案例做来源核验：\n\n1. 对每支视频标注：原始链接、作者、声称的生成方式（模型/工具/提示词）、是否公开提示词、是否公开源码、是否有「实时重制」演示。\n2. 渲染归属判断：这支视频究竟由谁完成渲染——纯AI生成 / AI写代码+工具渲染 / 人工剪辑+AI素材 / 全人工？给出证据链。\n3. 可复现性评级：高（提示词+源码全公开）/ 中（有提示词无源码）/ 低（只有效果展示）。\n4. 收录建议：值得进案例库的理由或剔除理由（不可复现、来源不明、摆拍造假）。\n\n输出核验表（逐支）+ 汇总统计（来源分布/可复现率）。\n\n我的案例清单：{{链接列表}}',
    tags: '来源核验,渲染归属,可复现性,awesome-claude',
    sourceRepo: 'awesome-claude-5-5-videos',
    useCase: '收集了大量参考视频，想分清哪些真的可学习复现',
  },
]

export const extraEffectSeeds: EffectSeed[] = [
  // ================ fy 转场谱系 ================
  {
    name: '同对象接力',
    nameEn: 'Match Cut Handoff',
    category: '转场',
    description: '上一镜的对象保持屏幕锚点、外接框与速度向量，把「身份」交给下一镜——因果接续最诚实的转场。',
    codeSnippet: '.handoff-object {\n  /* A 镜末态与 B 镜初态共享同一屏幕坐标 */\n  animation: handoff .32s cubic-bezier(0.22,1,0.36,1) forwards;\n}\n@keyframes handoff {\n  0%   { transform: translate(0,0) scale(1); }\n  85%  { transform: translate(120px,-30px) scale(.92); } /* 容器收束表示提交 */\n  100% { transform: translate(120px,-30px) scale(.92); }\n}\n/* B 镜同位置以新身份接管：先一帧位置匹配，再材质交叠 .08–.18s */',
    prompt: '实现同对象接力转场：记录 A 镜对象的屏幕锚点、外接框、旋转与速度，B 镜对象以完全相同的屏幕坐标入场（锚点误差 ≤ 8px）；交接预备 .15–.4s（次要层先退、容器轻微收束 .92），交接帧 E_HANDOFF 一帧完成身份接管或 .08–.18s 材质交叠；运动中切换时匹配的是速度向量而不只是位置；禁上一镜缩到角落、下一镜中央重新长出。',
    sourceRepo: 'fy-code-animation',
    demo: 'morph',
  },
  {
    name: '圆形揭示',
    nameEn: 'Iris Reveal',
    category: '转场',
    description: '圆心取自上一镜焦点，从焦点扩张吞没全屏揭示新场景；最终半径必须取到四角最远距离。',
    codeSnippet: '.iris {\n  clip-path: circle(0% at var(--fx) var(--fy));\n  animation: iris .55s cubic-bezier(0.65,0,0.35,1) forwards;\n}\n@keyframes iris {\n  to { clip-path: circle(150% at var(--fx) var(--fy)); }\n}\n/* --fx/--fy = 上一镜焦点的百分比坐标；150% 覆盖四角 */',
    prompt: '实现圆形揭示转场：新场景作为上层，clip-path: circle() 从上一镜焦点位置（CSS 变量 --fx/--fy 传入）扩张到 150%（保证覆盖四角最远距离），时长 .35–.8s，缓动 cubic-bezier(0.65,0,0.35,1)；下层旧场景保持可读到被完全遮住再卸载；圆心不必在画面中心——来自上一镜的视觉焦点。',
    sourceRepo: 'fy-code-animation',
    demo: 'wipe',
  },
  {
    name: '前景遮挡切换',
    nameEn: 'Occluder Cut',
    category: '转场',
    description: '遮挡物（人影/纸页/色块）真实经过画面的瞬间完成切换，遮挡物宽度至少覆盖整屏。',
    codeSnippet: '.occluder {\n  position: absolute; inset: 0 auto 0 0; width: 100vw;\n  transform: translateX(-100%);\n  animation: sweep .5s cubic-bezier(0.7,0,0.3,1) forwards;\n}\n@keyframes sweep {\n  45%  { transform: translateX(0); }    /* 完全遮住：此刻换内容 */\n  100% { transform: translateX(100%); }\n}\n/* 内容切换放在 45%–55% 之间（JS 或 animation 事件） */',
    prompt: '实现前景遮挡切换：一个整屏宽的遮挡层从左滑入（transform: translateX(-100%→0)），在完全遮住画面的时刻（约 45% 进度）切换底层内容，再继续滑出到 100%；总时长 .4–.7s；遮挡物必须在切换帧真实覆盖需要切换的区域——窄人影只能做局部擦除，不能声称遮住了整屏。',
    sourceRepo: 'fy-code-animation',
    demo: 'wipe',
  },
  {
    name: '翻面转场',
    nameEn: 'Page Flip',
    category: '转场',
    description: 'CSS 3D 单平面翻面：正背面在同一透视空间接管，90° 时两面都接近消失，根底色负责承接。',
    codeSnippet: '.flip-stage { perspective: 1200px; }\n.flip-card {\n  transform-style: preserve-3d;\n  animation: flip .7s cubic-bezier(0.65,0,0.35,1) forwards;\n}\n.flip-card .back { \n  backface-visibility: hidden; \n  transform: rotateY(180deg); \n}\n@keyframes flip {\n  from { transform: rotateY(0deg); }\n  to   { transform: rotateY(180deg); }\n}',
    prompt: '实现翻面转场：父容器 perspective 900–1800px（起点 1200px），卡片 transform-style: preserve-3d，正面与背面各设 backface-visibility:hidden，背面初始 rotateY(180deg)；翻转 .45–.9s 缓动 cubic-bezier(0.65,0,0.35,1)；铰链可设左边或中央，内容主体别压在铰链上；90° 时两面接近消失——容器背后的根底色必须用合适的承接色，不能露出默认白底。',
    sourceRepo: 'fy-code-animation',
    demo: 'flip',
  },
  {
    name: '粒子聚形',
    nameEn: 'Particle Morph',
    category: '转场',
    description: '粒子散开→飞行中转向→在新位置聚成下一个形状；固定粒子 ID 与目标分配，seek 不变。',
    codeSnippet: '// 确定性粒子聚形核心（伪代码）\nconst e = smoothstep(2.4, 4.2, q);           // 形内进度\nconst C = mid(A, B) + dir(a) * (0.35 + 0.9*m); // 弧线控制点\nconst P = bezier2(A, C, B, e);                 // 二次贝塞尔\n// 微动 + 屏幕坐标 + 拖尾（t-0.045/t-0.09 重算，不存历史）\n// seed 固定：mulberry32(2026)，粒子 id 对应目标 id 稳定不变',
    prompt: '实现粒子聚形转场：几千颗带光晕的粒子先聚成形状 A 停住（0–2.4s），再沿二次贝塞尔弧线（控制点 = AB中点 + 随机方向 × 幅度）流向形状 B（2.4–4.2s 变形），落定后静读；粒子 ID 与目标分配固定（带种子随机，seek 后画面一致）；拖尾用同一位置函数在 t−0.045/t−0.09 重算三遍，不保存历史；变形时颜色在 A/B 形状色之间线性混合；globalCompositeOperation=lighter 叠加发光。',
    sourceRepo: 'fy-code-animation',
    demo: 'particles',
  },
  {
    name: '穿越缩放',
    nameEn: 'Zoom Through',
    category: '转场',
    description: '镜头对数缩放穿透某个入口进入下一层空间；portal 比例 k 决定下一镜初始取景。',
    codeSnippet: '.portal {\n  animation: zoomThrough .6s cubic-bezier(0.7,0,0.3,1) forwards;\n}\n@keyframes zoomThrough {\n  from { transform: scale(1); opacity: 1; }\n  60%  { transform: scale(2.6); }   /* factor 2–4 */\n  to   { transform: scale(2.6); opacity: 0; }\n}\n/* B 层从 scale(1/2.6) 同步放大接管，字幕在屏幕层不参与缩放 */',
    prompt: '实现穿越缩放转场：A 场景以 log 空间插值放大（factor 2–4，.4–.8s）冲向入口元素，B 场景以倒数缩放（1/factor）同步放大从同一锚点接管；字幕留在屏幕层不参与缩放；多层穿越时记录每层相对变换，第三层不凭感觉摆放；k 太小会把贴图放大到模糊——提前计算素材分辨率。',
    sourceRepo: 'fy-code-animation',
    demo: 'zoom',
  },
  {
    name: '明暗接力',
    nameEn: 'Fade Through Dark',
    category: '转场',
    description: '一个 dark(t) 同时驱动灯光、雾、背景与后期，承载物保留亮部——比单纯叠化更有「时间经过」感。',
    codeSnippet: ':root { --dark: 0; }\n.scene { \n  filter: brightness(calc(1 - var(--dark) * 0.85));\n}\n.carrier { /* 承载物不吃暗 */\n  filter: brightness(calc(1 - var(--dark) * 0.15));\n}\n/* JS 每帧更新 --dark: 0→1→0，CSS transition 不用（要逐帧同步） */',
    prompt: '实现明暗接力转场：定义一个 dark(t) 变量（0→1→0，总时长 .4–1.2s），同时驱动场景亮度（brightness 滤镜或颜色插值）、雾浓度、背景色；承载物（贯穿对象）保留亮部（只吃 15% 暗度）以维持识别；中间态颜色明确设为目标底色，不依赖浏览器默认白页；音效用上升气流提前引导，在接管事件释放。',
    sourceRepo: 'fy-code-animation',
    demo: 'flash',
  },
  {
    name: '网格揭示',
    nameEn: 'Grid Mask Reveal',
    category: '转场',
    description: 'SVG 网格遮罩按列/对角/固定随机顺序逐格揭示新场景——科技感揭示与像素风切换利器。',
    codeSnippet: '<svg width="100%" height="100%" style="position:absolute">\n  <defs><mask id="gm">\n    <!-- 12×7 个 rect，按 order 依次 scale 0→1 -->\n    <rect * ngFor x y width height>\n      <animate attributeName="opacity" begin="0.02s*i" dur="0.3s" from="0" to="1"/>\n    </rect>\n  </mask></defs>\n  <!-- 新场景应用 mask；最后一格结束才卸载旧层 */\n</svg>',
    prompt: '实现网格揭示转场：用一个 SVG mask 覆盖 12×7（起点）网格，每个格子的 rect 按顺序（列扫描/对角波前/固定随机 seed）在 .35–.75s 内依次点亮（opacity 或 scale 0→1，stagger 总长不超过重叠区间）；新场景应用该 mask 从下层显现；信息密集时减格数；最后一格结束才卸载旧场景；像素分支按逻辑格推进并与整数位置一致。',
    sourceRepo: 'fy-code-animation',
    demo: 'wipe',
  },
  {
    name: '甩镜',
    nameEn: 'Whip Pan',
    category: '转场',
    description: '同向高速位移+短时模糊完成空间跳换；切在动作峰值，不能承担新信息阅读。',
    codeSnippet: '.whip {\n  animation: whip .24s cubic-bezier(0.6,0,0.4,1) forwards;\n}\n@keyframes whip {\n  0%   { transform: translateX(0); filter: blur(0); }\n  50%  { transform: translateX(-40%); filter: blur(14px); }\n  50.1%{ transform: translateX(40%); filter: blur(14px); } /* B 镜接管 */\n  100% { transform: translateX(0); filter: blur(0); }\n}',
    prompt: '实现甩镜转场：A 场景向一侧高速位移（.16–.35s）并叠 8–20px 各向同性 blur（CSS blur 是近似，真实方向模糊需 SVG/Canvas），中点切换到 B 场景（初始反向偏移同速度接管），随后减速归零；甩镜期间不安排需要阅读的文字；像素/印刷风可关模糊改用 1–2 张 smear 姿态；音效用短 whoosh 与运动同步。',
    sourceRepo: 'fy-code-animation',
    demo: 'shake',
  },
  {
    name: '容器替换',
    nameEn: 'Container Swap',
    category: '转场',
    description: '画布扩展/收束：小对象成为章节舞台，输入框变成结果窗口——固定内容尺寸，动画外层 clip。',
    codeSnippet: '.container-swap {\n  animation: swap .55s cubic-bezier(0.65,0,0.35,1) forwards;\n}\n@keyframes swap {\n  0%   { max-width: 280px; border-radius: 24px; }\n  33%  { max-width: 240px; }               /* 先收窄 */\n  34%  { content: swap; }                   /* JS 换内容 */\n  100% { max-width: 100%; border-radius: 0; } /* 展开成舞台 */\n}',
    prompt: '实现容器替换转场：.0–.18s 框收窄（内容固定尺寸不被拉伸，只动画外层 clip/max-width）；.18s 换内容；.18–.55s 新框展开成新场景；.45s 新主体开始动作，框稳定后解释文字进入；可用 sharedAxis(x/y/z) 表达同一关系的前后层级；圆角随边界单独插值；避免每镜都把小圆撑成全屏——表达不同关系时改变连接逻辑。',
    sourceRepo: 'fy-code-animation',
    demo: 'morph',
  },
  // ================ fy 文字动效 ================
  {
    name: '意群遮罩上移',
    nameEn: 'Semantic Mask Reveal',
    category: '文字动效',
    description: '按语义意群（不是空格切分）分组，每块独立遮罩上移入场——中文动态文字的地基手法。',
    codeSnippet: '/* 每个意群一个 wrapper（overflow hidden）+ 内层上移 */\n.seg { overflow: hidden; display: inline-block; }\n.seg > span {\n  display: inline-block; transform: translateY(110%);\n  animation: rise .35s cubic-bezier(0.22,1,0.36,1) forwards;\n  animation-delay: var(--d); /* 意群间错开 .06–.15s */\n}\n@keyframes rise { to { transform: translateY(0); } }',
    prompt: '实现意群遮罩上移文字：先把句子显式切成语义块（如 ["不是等到准备充分","才开始"]，禁止用空格切中文）；每块包一个 overflow:hidden 容器，内层 translateY(110%)→0 上移入场，rise 0.2–0.6 个字高，duration 0.25–0.45s，缓动 cubic-bezier(0.22,1,0.36,1)；意群间错开 0.06–0.15s；全部落稳后开始计静读窗（每秒 4–7 字）；长意群先拆块，不许缩字塞行。',
    sourceRepo: 'fy-code-animation',
    demo: 'highlight',
  },
  {
    name: '字重轴脉冲',
    nameEn: 'Weight Axis Pulse',
    category: '文字动效',
    description: '用可变字体的真实 wght 轴做呼吸与强调（400→650→400），不用 scaleX 伪装。',
    codeSnippet: '.axis-pulse {\n  font-variation-settings: "wght" 400;\n  animation: wpulse 1.2s ease-in-out infinite;\n}\n@keyframes wpulse {\n  0%,100% { font-variation-settings: "wght" 400; }\n  50%     { font-variation-settings: "wght" 650; }\n}\n/* 仅限真实有 wght 轴的字体；最大宽度按 650 预留防挤行 */',
    prompt: '实现字重轴脉冲：选一个真实带 wght 轴的中文可变字体（如思源黑体 Variable），font-variation-settings 从 400 脉冲到 650 再回 400（1.2s 循环或单次强调）；只在字体实际 fvar 范围内变化；布局预留最大字重宽度防挤行；需要持续强调时用明确状态而非循环脉冲；不能用 scaleX 伪装轴设计。',
    sourceRepo: 'fy-code-animation',
    demo: 'pulse',
  },
  {
    name: '乱码解码',
    nameEn: 'Scramble Decode',
    category: '文字动效',
    description: '候选字符闪变后逐位收敛成目标字——科技感状态确认，关键信息不保留乱码。',
    codeSnippet: 'const CHARS = "01アイウエオｱｲｳ";\nfunction scramble(el, target, seed) {\n  // 每帧：未收敛位显示 seeded 随机字符，已收敛位显示目标字\n  // 每字符 settle 时间 0.025s 依次错开，总 settle 0.25s 后完整静读\n  // seed 固定 → 同一帧渲染结果一致\n}',
    prompt: '实现乱码解码文字：目标句先以候选字符（数字/片假名/符号，注意候选集要包含目标字防缺字）随机闪变，再逐位从左到右收敛（每字符 0.025s 错开，settle 0.25s）；随机用固定种子保证确定性；收敛完成后完整静读（关键事实不保留任何乱码）；用于「状态确认」语境，重要信息段少用。',
    sourceRepo: 'fy-code-animation',
    demo: 'typewriter',
  },
  {
    name: '卡拉OK逐字上色',
    nameEn: 'Karaoke Caption',
    category: '文字动效',
    description: '整句先可见，按逐词实测时间把已唱部分上色并保留——歌词 MV 的标准做法。',
    codeSnippet: '<span class="word" style="--p: 0">词</span>\n.word { color: rgba(255,255,255,.45); }\n.word.sung { color: #fbbf24; }\n/* JS 按实测 words[{text,start,end}] 逐词切换；\n   或用 background-clip:text + 渐变位移做扫色 */',
    prompt: '实现卡拉OK字幕：整行歌词先以半透明完整可见；按逐词时间戳（words[{text,start,end}]，来自实际音频测量）把已唱词变为高亮色并保留已读色；不用均分时间假装对齐（没实测就标 planned）；字号 1080p ≥ 72px 并加描边/投影保证任何背景可读；两行以内、位置稳定；扫色方案可用 background-clip:text + 渐变按进度位移。',
    sourceRepo: 'fy-code-animation',
    demo: 'highlight',
  },
  {
    name: '冲击落定',
    nameEn: 'Slam In',
    category: '文字动效',
    description: '蓄势→一次入场→短尾振→长读窗；每片只给真正的高潮，降级成增重/停顿也有力量。',
    codeSnippet: '.slam {\n  transform: scale(1.6); opacity: 0;\n  animation: slam .5s cubic-bezier(0.22,1.4,0.36,1) forwards;\n}\n@keyframes slam {\n  0%   { transform: scale(1.6); opacity: 0; }\n  60%  { transform: scale(0.97); opacity: 1; }\n  80%  { transform: scale(1.03); }  /* 尾振 ≤ .06 */\n  100% { transform: scale(1); }\n}',
    prompt: '实现 Slam 冲击文字：入场前 0.2s 收掉周边副元素并降低背景亮度（蓄势）；主词从 1.6 倍缩放快速砸入（0.5s，cubic-bezier(0.22,1.4,0.36,1)），过冲上限 4–6%，尾振一次即稳；落稳后保留长读窗（≥2s）；背景可以加一次轻微亮度回应；每片只用一次——滥用会伤害观看，低帧率下降级为增重+停顿。',
    sourceRepo: 'fy-code-animation',
    demo: 'punch',
  },
  // ================ fy 运镜补充 ================
  {
    name: '证据缩放',
    nameEn: 'Evidence Zoom',
    category: '运镜',
    description: '字与证据先达到目标屏幕字号，再定倍率——UI 按钮、图表细节的「看这里」镜头。',
    codeSnippet: '// cameraCenterForAnchor：让世界锚点在 zoom 后仍落在指定屏幕点\nconst zoom = 1.6;\nconst center = cameraCenterForAnchor(\n  [620, 360],        // 世界锚点（按钮/数据点）\n  [960, 540],        // 当前相机中心\n  { screen: [960, 540], zoom, rotation: 0 } // 想让它落在的屏幕位置\n);',
    prompt: '实现证据缩放：先让证据元素（按钮/图表数据点/关键数字）达到可读的目标屏幕字号，再计算需要的 zoom 倍率（1.2–1.8）与相机中心（用 cameraCenterForAnchor 逆变换保持锚点在目标屏幕位置，不分别手调 x/y/scale）；zoom 用 log 空间插值 1.2s；到位后停稳供阅读；无真实信息时不推近空白。',
    sourceRepo: 'fy-code-animation',
    demo: 'zoom',
  },
  {
    name: 'Rack Focus 变焦',
    nameEn: 'Rack Focus',
    category: '运镜',
    description: '近层清晰→过渡→远层清晰，转移前后层注意力；字幕独立不糊。',
    codeSnippet: '.layer-near,\n.layer-far { transition: filter .7s cubic-bezier(0.4,0,0.2,1); }\n.rack .layer-near { filter: blur(0); }\n.rack .layer-far  { filter: blur(12px); }\n/* 切换 .rack 类：近远层 blur 互换（0↔12px）*/\n/* 字幕层永远 blur(0)，不参与 */',
    prompt: '实现 Rack Focus：近景层与远景层的 blur(0↔14px) 在 .4–.9s 内互换（缓动 ease-in-out），转移观众注意力从近层到远层；字幕在独立屏幕层永远清晰；关闭 scale breathing（±1.5% 呼吸缩放）避免像缩放错误；blur 作用于独立景层，不糊字幕；音效用焦点切换的轻响应。',
    sourceRepo: 'fy-code-animation',
    demo: 'parallax',
  },
]
