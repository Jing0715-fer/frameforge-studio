// ============================================================
// 创作方法论知识库
// 提炼自 fy-code-animation（俯仰代码动画 DSH 技能）+ 14 个开源项目精华
// 用途：1) /api/generate 的系统提示词素材  2) 前端「创作方法论」页展示
// ============================================================

// ---------- fy-code-animation 十步创作流程 ----------
export interface WorkflowStep {
  step: number
  title: string
  detail: string
  loads: string
}

export const FY_WORKFLOW: WorkflowStep[] = [
  { step: 1, title: '读完全文', detail: '主旨、作者目的、观众理解变化、情绪走向、事实、比喻、因果、对比、递进——先理解，再动画', loads: '语义模块 · 叙事结构' },
  { step: 2, title: '语义分段', detail: '按内容结构分段，标出重点词和气势词及其力度等级（不是每个词都放大）', loads: '语义 · 气势词与动态文字' },
  { step: 3, title: '问画风安排', detail: '全片统一画风还是分段换、几种、或交给 AI 定——先简述理解与建议，再问作者', loads: '风格模块' },
  { step: 4, title: '检索画风原文', detail: '用脚本检索并完整阅读选中的画风提示词原文，记录哈希与依赖缺项——读全文再决定', loads: '341 风格库接口' },
  { step: 5, title: '处理冲突', detail: '回读作者整体要求，处理画风、字体、角色、时长、声音、阶段之间的冲突', loads: '决定模块' },
  { step: 6, title: '设计分镜', detail: '每段讲什么、快慢、插图、留白、主体变化、镜头、转场、文字、背景、声音需求——写到「拿去就能写代码」的深度', loads: '导演与细节 · 分镜表' },
  { step: 7, title: '音乐四案', detail: '大框架定好后写四种有实质差异的音乐方案和音效表（编制/节奏/动机/能量曲线/口播关系至少三维不同）', loads: '音乐模块 · 音乐配方' },
  { step: 8, title: '生成四案', detail: '仅在授权阶段：本机音乐生成器生成四案，作者试听选择（ACE-Step 1.5 等）', loads: '本机音乐适配' },
  { step: 9, title: '落地实现', detail: '按实际成音和口播标点，用 Remotion/Canvas/HTML 落实镜头、动作、字幕、音效', loads: '实现契约 · Remotion 接入' },
  { step: 10, title: '检查返修', detail: '机器检查、实际观看聆听、作者采用分开记录；逐接缝看前后与运动中间', loads: '质量与返修' },
]

// ---------- 四个交付阶段 ----------
export interface PhaseInfo {
  key: string
  name: string
  desc: string
}

export const FY_PHASES: PhaseInfo[] = [
  { key: 'card', name: 'card · 只交任务卡', desc: '写完整设计（12 节任务卡），不生成动画、静帧、音乐，不渲染、不安装依赖' },
  { key: 'still', name: 'still · 只出静帧', desc: '只做被指定的静帧验证（构图/文字/裁切），不等四首音乐' },
  { key: 'audition', name: 'audition · 试听', desc: '写四案音乐并在授权下本机生成，作者选择后建立实际拍点' },
  { key: 'final', name: 'final · 成片', desc: '按实际声音落实镜头并做分层审片检查（结构→节奏→动作→细节→声音）' },
]

// ---------- 语义 → 可视操作映射（把关系变成动作） ----------
export interface SemanticMapping {
  relation: string
  operation: string
  evidence: string
  pitfall: string
}

export const SEMANTIC_MAPPINGS: SemanticMapping[] = [
  { relation: '因为 A 所以 B', operation: 'A 先改变，经过可见路径影响 B（触发先于反应，路径/承载对象连续）', evidence: '触发先于反应；路径与承载对象连续', pitfall: 'A/B 一起弹出只展示并列——改为共享事件和先后时序' },
  { relation: '不是 A 而是 B', operation: '保留比较维度，撤除/改写错误解释（两状态可比、差异明确）', evidence: '两状态同尺度可比', pitfall: '用炸裂掩盖解释——保留相同坐标/单位，否定词必须可读' },
  { relation: '部分组成整体', operation: '从真实分件装配到整体（数量、连接方式、归属正确）', evidence: '装配关系真实', pitfall: '随机粒子聚合不能说明功能分工' },
  { relation: '范围扩大 / 尺度变化', operation: '同一对象拉远，逐层揭示（小层仍可追踪，尺度标签真实）', evidence: '层级可追踪', pitfall: '每章换一张无关图，失去层级关系' },
  { relation: '选择、取舍', operation: '分支及代价显现，选中一条（被放弃项不是稻草人）', evidence: '所有分支真实呈现', pitfall: '所有分支都变绿——补明确选择理由' },
  { relation: '时间、累积', operation: '时间轴、留痕、层叠、增长（时点与数量有来源）', evidence: '数据有出处', pitfall: '无来源计数「制造具体感」' },
  { relation: '感受转变', operation: '姿态、空间、颜色、速度共同变化（情绪来自前因，允许停顿）', evidence: '情绪有前因', pitfall: '只换背景颜色——加入人物反应或物件状态' },
]

// ---------- 转场谱系（10 类） ----------
export interface TransitionRecipe {
  name: string
  fit: string
  construction: string
  params: string
  pitfall: string
}

export const TRANSITION_RECIPES: TransitionRecipe[] = [
  { name: '同对象接力 / 匹配剪辑', fit: '同一对象进入下一步、因果接续', construction: '记录 A 的屏幕锚点/外接框/旋转/速度，再算 B 的对应状态；切在运动中时匹配速度向量', params: '锚点误差 0–8px；交接预备 .15–.4s；接管一帧或 .08–.18s 材质交叠', pitfall: '上一镜圆缩到角落、下一镜中央重新长圆——保留同一屏幕坐标' },
  { name: '遮挡与遮罩擦除', fit: '门、纸页、前景物自然经过画面', construction: '方向擦除/圆形揭示/前景遮挡；圆心来自上一镜焦点，最终半径取到四角最远距离', params: '软边按画幅轴长 .03–.12；duration .3–.7s', pitfall: '遮罩没包住内容真实外接框，边缘被 border-box 裁掉' },
  { name: '画布扩展 / 容器替换', fit: '小对象成为章节舞台、输入框变成结果窗口', construction: '先固定内容尺寸，动画外层 clip，不拉伸文字；sharedAxis 表示同一关系的前后层级', params: '轴移动 40–100px；缩放 .88→1', pitfall: '每镜都把小圆撑成全屏——改变连接逻辑而不只是换颜色' },
  { name: '路径 / 形变 / 轮廓交换', fit: '一个形状确实能成为另一个，或路径承载因果', construction: '闭合轮廓重采样到相同点数→比较旋转索引找较短对应→固定绕向→lerp 插值', params: '64–256 个轮廓点；.5–1.2s', pitfall: '复杂汉字不默认做轮廓 morph，优先光学替换' },
  { name: '翻页 / 翻面 / 折叠', fit: '表里、不同面、材质切换', construction: '单平面 CSS 3D 翻面；背面 backfaceVisibility:hidden；A/B 同一透视空间', params: 'perspective 900–1800px；.45–.9s', pitfall: '90° 时两面同时消失——根底色必须用合适的承接色' },
  { name: '粒子与碎片重组', fit: '分散→汇聚、复杂→秩序、材料转换', construction: '目标字形/图像就绪后采样，固定粒子 ID 和 A→B 目标分配', params: '轻收拢 .12–.25s → 爆开 .2–.45s → 转向 .4–1.2s → 静读', pitfall: '随机重新分配使 seek 变化——固定 seed+id，重用映射' },
  { name: '空间穿越 / 缩放穿透', fit: '进入对象内部、局部到整体、概念到证据', construction: '设 portal 中心与入口比例 k，下一镜初始范围对应这个入口；尺度用 log 插值', params: 'factor 2–4；.4–.8s', pitfall: 'A 推近 B 却反向飞进——方向一贯、字幕独立、切换在共同锚点' },
  { name: '光、闪白与色彩接力', fit: '曝光变化、灯光开启、强能量释放', construction: 'fadeThrough 的中间态就是根底色；明暗共享 dark(t) 驱动背景、灯光、材质、雾和后期', params: '时长 .4–1.2s', pitfall: '连续重复闪烁伤害观看；优先用局部亮度和轮廓能量' },
  { name: '机械 / 格栅 / 网格与像素化', fit: '科技感揭示、像素风切换', construction: 'gridMask(cols,rows,seed,order) 用 SVG 遮罩揭示整场；顺序可列、对角或固定随机', params: '起点 12×7 网格；.35–.75s', pitfall: '网格揭示不是图像像素化滤镜——真实 pixelate 要降离屏分辨率再 nearest 放大' },
  { name: '节奏硬切 / 定格 / 甩镜', fit: '明确对比、笑点、跳跃', construction: '硬切可切在动作峰值、静止后的反差或观点转折；甩镜用同向高速位移与短时 blur', params: '甩镜 .16–.35s、blur 8–20px', pitfall: '不要对有文字阅读任务的整屏长期甩动' },
]

// ---------- 镜头运动词汇表 ----------
export interface CameraMove {
  name: string
  express: string
  steps: string
  params: string
}

export const CAMERA_MOVES: CameraMove[] = [
  { name: '推近 push-in', express: '证据变重要、进入细节', steps: '先定位焦点→保持锚点→对数缩放→到站读', params: 'zoom 1→1.04–1.08，3–6s' },
  { name: '拉远 pull-back', express: '揭示规模、关系、环境', steps: '建立局部→拉开→新层依次可见→整体停稳', params: 'zoom 1.4→1，1–2s' },
  { name: '横摇 / 横移 pan/truck', express: '并列、跟随、空间接力', steps: '先给方向线索→移至第二对象→保留部分上下文', params: '0.1–0.4W 位移，.7–1.8s' },
  { name: '升降 / 俯仰', express: '揭示层级、位置、成长', steps: '地面或参照物保留→目标进入→停稳', params: '.1–.3H；2D 是平移，真 tilt 需透视相机' },
  { name: '证据缩放', express: 'UI 按钮、图表细节', steps: '对象已出现→标记目标→zoom+逆求 center→读', params: '字与证据先达到目标屏幕字号，再定倍率' },
  { name: 'Dolly zoom', express: '主体不变而空间压缩/张开', steps: '固定主体平面→改变距离→反向改变 FOV', params: 'FOV_new = 2·atan(d_ref·tan(FOV_ref/2)/d_new)' },
  { name: '多层视差', express: '建立深度、照片活化', steps: '前中后景分层→同一 camera 驱动→不同 depth', params: '背景 .2–.4，主体 1，前景 1.1–1.4' },
  { name: 'Orbit 环绕', express: '展示体积/多面信息', steps: '先建立对象→沿弧线→遮挡正确→选面停靠', params: '.15–.5 rad/s；完整一圈有必要才做' },
  { name: '翻转 / 倾斜卡片', express: '表里、不同面、材质', steps: '轴心与透视统一→背面隐藏→承接底色', params: 'tilt 5–15°；perspective 900–1800px' },
  { name: '宏观 ↔ 微观', express: '尺度关系、结构解释', steps: '记每层入口变换→对齐锚点→交接深度', params: '每层倍率 2–4；检查原图最大放大倍率' },
  { name: '跟随', express: '角色、光标、字幕指向', steps: '显式目标轨迹→短前视→限制速度→到站保持', params: 'ahead .1–.2s；读长字幕时让相机停止追' },
  { name: 'Rack focus', express: '转移前后层注意', steps: '近层清晰→过渡→远层清晰，字幕独立', params: 'blur 0–14px，.4–.9s' },
  { name: '手持 / 震动', express: '接触、紧张、力度', steps: '命名触发→短上升包络→种子平滑噪声→归零', params: '1080p 2–8px、.2–.5s、12–24Hz 噪声采样' },
  { name: 'Whip pan', express: '快速换空间、冲击', steps: 'A 加速→同向模糊/形变→B 接管→快速清晰', params: '.16–.35s；不能承担新信息阅读' },
  { name: '多站点长镜头', express: '同一系统中解释多个位置', steps: '站点含 at/center/zoom/stop→共享切线→关键点停靠', params: 'log zoom；位置 Hermite；停靠用相同姿态两键' },
]

// ---------- 中文动态文字手法谱系 ----------
export interface TypeTechnique {
  name: string
  fit: string
  how: string
  params: string
}

export const TYPE_TECHNIQUES: TypeTechnique[] = [
  { name: '语义块遮罩上移', fit: '解释/递进（两个关键概念突出）', how: '每块独立 mask，整体行先排好；按句意进入→静读→整句退出', params: 'rise 0.2–0.6 个字高；duration 0.25–0.45s；组间错开 0.06–0.15s' },
  { name: '字重/字宽轴脉冲', fit: '呼吸、加强', how: '原字稳定→真实可变轴变化（wght 400→650→400）→稳定或回原值', params: '只在实际 fvar 范围内；需要持续加重用明确状态而非 pulse' },
  { name: '轮廓到填色', fit: '结构显现', how: '轮廓可读后加填充，短暂双层交接', params: '描线 0.5–1.2s，填色 0.2s；保留轮廓绕向/填充规则' },
  { name: '书写 / 线描', fit: '时间和手势', how: '先有真实笔顺路径，按弧长揭示，再保留成字', params: '字体轮廓扫描不是笔顺；缺笔顺时明确称「轮廓揭示」' },
  { name: '粒子聚字/散字', fit: '集合成为意义', how: '字体 ready 后取笔画点；稳定 id 对应目标，收敛后冻结', params: '目标漂移小于采样间距一半；先减 bloom 再调密度' },
  { name: '挤出字', fit: '体量、标牌', how: '先定正面阅读角，厚度缓入，稳定面留读窗', params: 'depth 4–12px 起步；CSS 阴影模拟' },
  { name: '字形变形 / 形状互换', fit: '概念接力', how: '两形同锚点、匹配轮廓顺序/洞，再插值；不匹配时光学交接', params: '0.25–0.5s 交叉淡入+位移；真轮廓 morph 需拓扑匹配' },
  { name: '拆字参与表意', fit: '结构说明', how: '使用经核对的偏旁/部件路径；先完整字→部件行动→复原', params: '部件锚点 px、角度 rad；不把视觉比喻当语言学事实' },
  { name: '打字机 / 流式', fit: '真实输入', how: '显式输入事件，标点停顿，完整文本后停留', params: '中文展示 6–12 字/s；解释字幕不用全程打字，改意群出现' },
  { name: '乱码解码', fit: '状态确认', how: '候选字闪变→逐位收敛→完整读窗', params: 'settle 0.25s、perCharacter 0.025s、seed 固定；重要信息少用' },
  { name: '高亮 / 划线 / 删改', fit: '校正', how: '先读旧状态→标记→新状态替换→读新状态', params: '总 0.4–0.8s；预留新旧最大宽度' },
  { name: '卡拉 OK 字幕', fit: '歌词同步', how: '整句先可见，实测词/意群时间改变颜色，保留已读色', params: '显式 words[] 的 start/end 秒；不用均分时间假装对齐' },
  { name: 'Slam 冲击', fit: '气势释放', how: '空间/声音蓄势→一次入场→短尾振→长读窗', params: 'startScale 1.3–1.7，overshoot ≤0.06；降级成增重/停顿也有力量' },
]

// ---------- 三级力度（气势词分级） ----------
export const EMPHASIS_LEVELS = [
  { level: '一级', usage: '用颜色或字重变化，不打断阅读', example: '关键词换强调色/加深字重' },
  { level: '二级', usage: '可加空间变化或主体回应', example: '关键词上移入画 + 背景让位降亮度' },
  { level: '三级', usage: '只给本段真正的转折/高潮：停顿后爆发，或突然安静', example: '周边全部退让→slam 入场→长读窗；或反向骤静' },
]

// ---------- 运动参数速查（弹簧与错峰） ----------
export const MOTION_PARAMS = [
  { use: '精密 UI、按钮回位', params: 'ζ 0.85–1，ω 16–24 rad/s', tip: '先定到位时间，再降过冲' },
  { use: '柔和入场', params: 'ζ 0.8–1，ω 8–14', tip: '缩短移动距离而非用大弹跳补能量' },
  { use: '聚拢', params: 'ζ 0.78，ω 7.2', tip: '末段稳定读字；不拿估计 settle 当测量' },
  { use: '爆开/快速离场', params: 'ζ 1，ω 16 或 24', tip: '离场可快，但不能遮住未读完的信息' },
  { use: '再聚合', params: 'ζ 0.62，ω 10', tip: '有表达需要才保留回弹；碰撞文字时升阻尼' },
]

export const MOTION_RULES = [
  'stagger 总长 = 单项 duration + (n−1) × delay：8 项 200ms、间隔 50ms，总长是 550ms，不是 400ms',
  'ζ=c/(2√km)、ω=√(k/m)：ζ<1 过冲，ζ=1 临界；damping=0.82 不是阻尼系数 c',
  '挤压与拉伸：二维面积守恒 sy=1/sx；球落地以接触帧为事件，音效对齐实际峰值而非文件起点',
  '删除后理解不变的动作可以省略；读文字时允许锁镜、静止、只有 opacity 淡入',
]

// ---------- 音乐四案差异矩阵 ----------
export const MUSIC_PLANS = [
  { plan: 'A 克制推进', texture: '毛毡琴+少量低音，4 拍稀疏脉冲', motive: '短双音，后半小幅增密', vocal: '句间回应，开放余音' },
  { plan: 'B 机械展开', texture: '木质敲击+干合成器，不对称分组', motive: '切分动机，密集段集中爆发', vocal: '口播段抽掉中频，短确定落点' },
  { plan: 'C 空间呼吸', texture: '弦乐泛音+空气织体，自由时间', motive: '长音变化，高潮前留空', vocal: '无抢词旋律，渐渐消隐' },
  { plan: 'D 手工叙事', texture: '拨弦+刷奏，三拍摇摆', motive: '可辨短乐句，快慢段对比', vocal: '低密度伴奏，回到开头动机收束' },
]

// ---------- 质量底线 ----------
export const QUALITY_BASELINES = [
  { title: '不做逐句贴卡的 PPT', detail: '每镜要有一个可观察的变化来承载意思（关系、动作、对象状态），而不是「标题 + 图标 + 淡入」' },
  { title: '有贯穿对象和接缝', detail: '相邻镜头写清靠什么接；无法自然接时，有理由地硬切' },
  { title: '抓住气势词', detail: '重点分级表达，不是每个都放大砸字；否定词和条件词必须可读' },
  { title: '画风真的被使用', detail: '材质、构图、运动语法、镜头语言都体现选中画风，不只是配色' },
  { title: '背景有明确设计', detail: '背景有空间、材质或氛围设计，给阅读区让位；需要时可以完全静止' },
  { title: '快慢有对比', detail: '有蓄势、有释放、有安静；时长不平均分配' },
  { title: '字体统一', detail: '不突兀插入手写字体；中文字形、断行、行距正确' },
  { title: '声音是设计出来的', detail: '四案真的不同；卡点基于实际音轨；不虚构「已卡点」' },
  { title: '确定性', detail: '任意帧可 seek 重现：不依赖 Date.now、无种子随机或累计状态' },
  { title: '诚实', detail: '不虚构素材、数据、依赖状态和验证结果；机器检查、观看、作者采用分开记录' },
]

// ---------- 返修症状速查 ----------
export const REPAIR_TABLE = [
  { symptom: '像 PPT', check: '画面是否只有名词陈列', fix: '补一个真实关系变化，不自动加镜头震动' },
  { symptom: '没讲清', check: '条件、因果方向、证据和阅读窗', fix: '先修意思，最后才调缓动' },
  { symptom: '太散', check: '同时变化的维度', fix: '固定一个贯穿对象，降低同时变化的维度' },
  { symptom: '读不完', check: '最后落字时间、总 stagger、相机移动', fix: '减同屏信息或延长静读，不机械加速旁白' },
  { symptom: '每个元素都弹', check: '材质和任务需要弹吗', fix: '静态/线性/单次 ease；保留一处真正反馈' },
  { symptom: '粒子字糊', check: '噪声/辉光/背景亮度', fix: '先关辉光降背景保证字腔，再调点径和密度' },
  { symptom: '音画整体迟', check: '原采样/编码延迟、局部与全局帧', fix: '实测对齐，不套固定偏移量' },
  { symptom: 'seek 后位置不同', check: 'wall-clock、累计状态、随机调用顺序', fix: '闭式 f(t)、每对象 seed、预计算物理缓存' },
]

// ---------- 阅读窗与排版规则 ----------
export const READING_RULES = [
  '静读窗从最后一个必要字落稳开始计算；试算区间每秒 4–7 个汉字',
  '1080p 起步：主标题 72–140px，解释正文 40–56px，手机可读信息 48–72px',
  '中文行高 1.25–1.6、字距 0–0.02em；中文负字距不默认使用',
  '字幕 safe area 未给时先用画宽 5%、画高 8% 的内框并记录假设',
  '语义分组显式传入（split(" ") 无法切中文）；竖版重新分组重排，不能只整体缩小',
  '等宽数字或 tnum 减少计数抖动；数字与图形共用同一插值数据源',
]

// ---------- 15 个项目知识地图（用于方法论页展示） ----------
export interface RepoKnowledge {
  slug: string
  name: string
  stars: string
  role: string // 在本平台中扮演的角色
  essence: string[] // 提炼的干货要点
}

export const REPO_KNOWLEDGE: RepoKnowledge[] = [
  {
    slug: 'hyperframes', name: 'heygen-com/hyperframes', stars: '7.8万', role: '渲染底座',
    essence: [
      'HTML/CSS/JS 单文件 → 确定性 MP4：动画是时间 t 的纯函数，同一 t 渲染结果完全一致',
      '动画只用 transform/opacity/clip-path 等合成器友好属性，写明关键帧时间点',
      '内置 20+ Agent Skills：把视频制作能力封装成 AI 可调用的技能',
      '剪辑窗口 data-start/duration 以秒为单位；timeline 注册后再渲染导出',
    ],
  },
  {
    slug: 'awesome-opus5-5-videos', name: 'yihui-dev/awesome-opus5-5-videos', stars: '1.3万', role: '案例弹药库',
    essence: [
      '703 条爆款视频提示词，418 个带「实时重制」演示——可以对照原片与提示词学习写法',
      '提示词分类学：一句话灵感 / 完整模板 / 参考图驱动 / 长提示词，不同精度匹配不同场合',
      '爆款结构规律：前 2 秒钩子 → 反差/递进 → 高潮释放 → 记忆点收尾',
    ],
  },
  {
    slug: 'lemo-opuscar', name: 'lemomo-ai/lemo-opuscar', stars: '1.15万', role: '风格体系',
    essence: [
      '66 种可复用影片风格：每种含纯代码样片 + 导演指南（DIRECTOR）+ 技术指南（TECHNIQUE）',
      '风格不只是配色：材质、构图、运动语法、镜头语言四件套都写死才能复现',
      '装成 Claude Code Skill 即用；本平台 L 系列 59 种风格即来自该项目',
    ],
  },
  {
    slug: 'remotion-skills', name: 'remotion-dev/skills', stars: '6.0千', role: 'React 视频引擎',
    essence: [
      '用 React 组件写视频：useCurrentFrame()/useVideoConfig() 驱动、spring()/interpolate() 计算动画',
      '<Sequence> 编排时序；<Composition fps={30}> 注册后 CLI 渲染导出',
      'Sequence 内部是局部帧，全片事件必须加回 offset，禁止同一 offset 加两次',
    ],
  },
  {
    slug: 'huashu-art-motion', name: 'alchaincyf/huashu-art-motion', stars: '6.0千', role: '艺术风格×解说语法',
    essence: [
      '35 种艺术风格 × 9 种解说语法的组合矩阵：画面风格与文案语调分开选择再组合',
      '静态画面代码动效化：给任何静图选择合适的动效语法（晕染/漂浮/扫光/生长）',
    ],
  },
  {
    slug: 'pdoom-video', name: 'mexicat/pdoom-video', stars: '3.8千', role: '完整 MV 工程',
    essence: [
      '完整歌词卡拉 OK MV 工程：本地可渲 4K60 的端到端参考实现',
      '卡拉 OK 字幕正确做法：整句先可见，实测词时间逐字上色，保留已读色',
    ],
  },
  {
    slug: 'onetake', name: 'feitangyuan/onetake', stars: '3.3千', role: '一镜到底 + 数学验收',
    essence: [
      '一镜到底产品发布片 Skill：每个场景从上一个场景里「长」出来（形变/展开/铺色切换）',
      '用数学指标自动验收镜头连贯度：相邻镜头主体屏幕位置衔接、运动方向一致、色温统一',
      '禁淡入淡出、禁模糊、禁无动机硬切；每个场景镜头只做一次缓动',
    ],
  },
  {
    slug: 'PDoomVideo', name: 'JohnHeibel/PDoomVideo', stars: '2.7千', role: '手绘 MV 对照',
    essence: [
      '同一首歌的另一支手绘风 MV 源码——可与 pdoom-video 对照拆解「同曲不同视觉方案」',
    ],
  },
  {
    slug: 'mg-styles-15', name: 'Vincentwei1021/mg-styles-15', stars: '2.5千', role: 'MG 动效三位一体',
    essence: [
      '15 种 MG 动效风格：成片、提示词、源码全开源——看片→读词→抄码的学习闭环',
      '「成片+prompt+源码」三位一体拆解法：任何效果都能定位到代码与提示词的对应关系',
    ],
  },
  {
    slug: 'ClaudeAnimationBase', name: 'JohnHeibel/ClaudeAnimationBase', stars: '2.2千', role: '手绘角色起步包',
    essence: [
      'p5.js + p5.brush 手绘卡通角色动画起步包，自带 31 种表情系统',
      '角色表演链：注意到→反应→采取动作→结果；眼睛/头先指向目标，手与身体跟随，衣角/头发延迟',
      '卡通快动作用一张 smear 或三张关键姿势，不连续插值拖出橡皮人',
    ],
  },
  {
    slug: 'ReelMimic', name: 'edenfunf/ReelMimic', stars: '1.4千', role: '参考视频逆向',
    essence: [
      '分析参考视频的镜头、节奏、配色，再产出一支同风格新片',
      '逆向四步：镜头切分统计→节奏标定（每镜时长分布）→配色提取→按新内容重排',
    ],
  },
  {
    slug: 'awesome-claude-5-5-videos', name: 'athemeroy/awesome-claude-5-5-videos', stars: '750', role: '来源索引核验',
    essence: [
      '对 1000+ 支视频做抽样核验的来源索引，标注每支视频由谁完成渲染',
      '核验方法论：不只收藏链接，标注「渲染归属」——谁生成的、能不能复现',
    ],
  },
  {
    slug: 'opus-video-prompts', name: 'joeseesun/opus-video-prompts', stars: '520', role: '中文案例库',
    essence: [
      '中文案例 + 可直接复制的提示词，按「一句话/模板/参考图/长提示词」四分类',
      '中文提示词写法：写死颜色 hex、时间秒数、镜头走法，不同模型做出来越接近',
    ],
  },
  {
    slug: 'shipvideo', name: 'diggerhq/shipvideo', stars: '340', role: '端到端自动化',
    essence: [
      '丢一个网址或描述 → 自动产出 20~40 秒产品发布片，含完整服务端渲染 Agent',
      '产品发布片四段式：痛点钩子 → 产品亮相 → 功能证明 → CTA 收尾',
    ],
  },
  {
    slug: 'fy-code-animation', name: 'Akillll-DuoHe/fy-code-animation', stars: '新', role: '创作方法论大脑',
    essence: [
      '把中文文案、画风提示词和声音做成前后连贯代码动画的完整方法论（本平台 AI 能力的骨架）',
      '核心流程：读懂全文→语义分镜→选画风→镜头/转场/动作/字体/声音→Remotion 落地→检查返修',
      '14 个方法模块 + 16 个配方 + 12 节任务卡 + 逐镜分镜表模板，覆盖从语义到实现的全链路',
      '反「逐句贴卡 PPT」：每镜有一个可观察的变化承载意思；语义关系→可视操作映射表',
      '四级交付：card 任务卡 / still 静帧 / audition 试听 / final 成片——按授权分阶段推进',
    ],
  },
]

// ---------- 附件《代码动画》风格库系列说明 ----------
export interface SeriesMeta {
  key: string
  label: string
  desc: string
}

export const ATTACHMENT_SERIES: SeriesMeta[] = [
  { key: 'AG', label: 'A–G 代码样片', desc: '字、粒子、线与墨、光与天气、图形与纸、讲解、质感——每种附参考实现代码' },
  { key: 'M', label: 'M 动态风格', desc: '整段视频怎么动、怎么剪、怎么讲的结构性风格（一镜到底/五幕讲解/歌词卡点…）' },
  { key: 'K', label: 'K 卡通画风', desc: '角色和画面长什么样（扁平矢量/Q版/像素/粘土/皮克斯式 3D…）' },
  { key: 'Z', label: 'Z 中国风', desc: '水墨、工笔、写意、山水、剪纸、年画、皮影、敦煌、青花、书法…' },
  { key: 'H', label: 'H 现成版式', desc: '配色加字体的整套现成搭配（Biennale Yellow / Capsule / Cobalt Grid…）' },
  { key: 'L', label: 'L Lemo-Opuscar', desc: '开源项目 Lemo-Opuscar 的 59 种风格，每种有完整做法与视觉语法' },
  { key: 'V', label: 'V mg-styles-15', desc: '开源项目 mg-styles-15 的 15 种 MG 动效风格（成片+提示词+源码三位一体）' },
  { key: 'X', label: 'X code-video', desc: '开源项目 code-video 的 31 种风格（手绘/沙画/翻牌/霓虹/侦探线索板…）' },
  { key: 'R', label: 'R 照参考学来的', desc: '照参考学着用代码画的赛博朋克等风格' },
  { key: 'O', label: 'O 奥斯卡 98 部', desc: '98 部奥斯卡最佳影片，每部提炼一种画风（乱世佳人厚涂/卡萨布兰卡黑白…）' },
]
