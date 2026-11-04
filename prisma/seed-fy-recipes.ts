// fy-code-animation《俯仰代码动画》17 篇 recipes 的提炼补充（查缺补漏）
// 来源：upload/fy-code-animation/recipes/*.md —— 参数与规则均来自原文配方表

export interface FyRecipeEffectSeed {
  name: string
  nameEn: string
  category: string
  description: string
  codeSnippet: string
  prompt: string
  sourceRepo: string
  demo: string
}

export const fyRecipeEffectSeeds: FyRecipeEffectSeed[] = [
  {
    name: '流场背景',
    nameEn: 'Flow Field',
    category: '视觉效果',
    description: '低密度底纹起势 → 方向逐渐弯转 → 主信息期间减速/停 → 流向下一镜。表示「方向、系统流动」，不是时域流体模拟。',
    codeSnippet: '// 100 条 × 35 步，步长 6px，周期 12s；每帧从同一粒子种子重建（可 seek）\n// phase = 2π*(t mod period)/period，用 sin/cos 控制位置\nfor (let i = 0; i < LINES; i++) {\n  const seed = rand(`${seedKey}:${i}`)\n  // 从画外起点沿弯转向量场积分，输出本帧完整重建\n}',
    prompt: '做一个流场背景：100 条流线×35 步、步长 6px、周期 12s；先低密度底纹，方向逐渐弯转，主体信息出现时减速或暂停，结尾流向下一镜方向。每帧从同一粒子种子重建，支持任意 seek，不用上一帧位置累加，不用 Math.random 和 Date.now。阅读区压低亮度（readingAttenuation 返回 0–1 权重抑制 alpha）。',
    sourceRepo: 'fy-code-animation',
    demo: 'particles',
  },
  {
    name: '漂浮尘点氛围',
    nameEn: 'Particle Atmosphere',
    category: '视觉效果',
    description: '预置稳定分布 → 低振幅漂移 → 保持 → 淡出。100–300 点、半径 1–3px、14s 周期、位移 18–24px，表示「空气与层深」，不宣称布朗物理。',
    codeSnippet: 'const zones = [{ x: 140, y: 700, width: 1500, height: 210, padding: 32, feather: 100, floor: 0.05 }]\n// count 100–300, r 1–3px, period 14s, drift 18–24px\n// zones 内 readingAttenuation 抑制亮度，不禁止穿过',
    prompt: '做漂浮尘点背景：100–300 个点、半径 1–3px、周期 14s、漂移位移 18–24px；分布预置稳定后低振幅漂移。阅读区（字幕带）内压低亮度到 5% 以下，羽化 100px。禁止逐字下方都有亮点，慢读段降低密度与对比。',
    sourceRepo: 'fy-code-animation',
    demo: 'particles',
  },
  {
    name: '轨道粒子群',
    nameEn: 'Orbit Groups',
    category: '视觉效果',
    description: '分散 → 环形轨道 → 聚焦中心 → 沿切线离开。轨道半径按短边 0.2–0.6、周期 8–16s，表示「环绕、中心组织」。2D 椭圆，遮挡需分前后层。',
    codeSnippet: '// 轨道半径 = 短边 * (0.2–0.6)，周期 8–16s\n// x = cx + rx*cos(θ(t)), y = cy + ry*sin(θ(t))，θ = 2π*t/period + phase_i\n// 前后遮挡：按 sin 值拆两层绘制顺序',
    prompt: '做轨道粒子群动画：粒子先分散、进入环形轨道（半径为画面短边的 0.2–0.6 倍）、随后聚焦中心、最后沿切线方向离开。周期 8–16s。轨道是 2D 椭圆，需要遮挡关系时按前后分两层，不冒称真实 3D。',
    sourceRepo: 'fy-code-animation',
    demo: 'orbit',
  },
  {
    name: '点阵网格波',
    nameEn: 'Dot Grid Ripple',
    category: '视觉效果',
    description: '静态规则网格 → 事件源发波 → 衰减 → 恢复秩序。spacing 32–56px、波幅 3–8px、传播约 500px/s，以事件时差闭式计算，不是持续弹簧仿真。',
    codeSnippet: '// spacing 32–56px；波幅 3–8px；传播 ≈500px/s\n// 每点位移 = A * exp(-dist/λ) * sin(ω(t - dist/v))，dist = |p - 事件源|',
    prompt: '做点阵网格波效果：网格间距 32–56px，事件触发后从源点向外传播波纹（波幅 3–8px、传播速度约 500px/s），波过后恢复静态秩序。位移用事件时差闭式计算（每点 = f(事件时间, 距离)），不做逐帧弹簧仿真，支持任意 seek。摩尔纹出现时增大间距。',
    sourceRepo: 'fy-code-animation',
    demo: 'pulse',
  },
  {
    name: '噪声渐变云',
    nameEn: 'Noise Gradient',
    category: '视觉效果',
    description: '基底先稳 → 色团缓移 → 阅读期降低幅差 → 收束色。cell 16–32px、octaves 2–4、period 12–24s，低分辨率 value noise/fBm 放大，不是照片级云。',
    codeSnippet: '// cell 16–32px, octaves 2–4, period 12–24s\n// 低分辨率 canvas 计算 fBm，放大绘制；细节闪动时先降 octave',
    prompt: '做噪声渐变云背景：cell 16–32px、octaves 2–4、周期 12–24s 的低分辨率 value noise/fBm 放大绘制。色团缓慢漂移，阅读区降低明暗幅差，结尾收束为单色。不是照片级云或流体，压缩后细节闪动时降低 octave。',
    sourceRepo: 'fy-code-animation',
    demo: 'morph',
  },
  {
    name: '光扫材质',
    nameEn: 'Light Sweep',
    category: '视觉效果',
    description: '光从画外进入 → 越过被强调对象 → 完全离开。opacity 0.08–0.25、0.6–1.5s、带角度，受 mask 限制才像材质，不是 bloom 后期。',
    codeSnippet: '// opacity 0.08–0.25，duration 0.6–1.5s，带角度 angle\n// 光带必须限制在被强调对象的 mask 内，整屏反复闪亮会抢字',
    prompt: '给对象做光扫效果：一道光带（opacity 0.08–0.25）用 0.6–1.5s 从画外越过被强调对象后完全离开，带角度且受对象 mask 限制。只扫一次，不做整屏反复闪亮的 bloom 后期感。',
    sourceRepo: 'fy-code-animation',
    demo: 'wipe',
  },
  {
    name: 'Ken Burns 照片活化',
    nameEn: 'Ken Burns',
    category: '视觉效果',
    description: '主体焦点先核 → 低速裁切 → 阅读暂停 → 匹配下一图。zoom 1→1.04–1.08、4–8s，必须有主体/文字保护区，不假造分层边缘。',
    codeSnippet: '// cover 基础倍率 s = max(目标宽/原宽, 目标高/原高)；最终 = s × zoom\n// zoom 1→1.04–1.08，4–8s；焦点 [x,y] 归一化，贴边图会被 coverCrop 钳位',
    prompt: '把静态照片活化：Ken Burns 式低速裁切，zoom 从 1 到 1.04–1.08、时长 4–8s，焦点取照片主体。先看图记录焦点与保护区 bbox（脸/手持产品/图内标题都可能保护），阅读字幕时暂停运动，结尾匹配下一张图的构图。',
    sourceRepo: 'fy-code-animation',
    demo: 'zoom',
  },
  {
    name: '切层视差',
    nameEn: 'Parallax Layers',
    category: '视觉效果',
    description: '真实前/中/后景遮罩 → 远层小移近层大移 → 停稳。深度比 0.15/0.5/1、位移 8–40px。遮挡空洞需补画并标来源，不能只平移整图冒充切层。',
    codeSnippet: '// 深度比 0.15 / 0.5 / 1（后/中/前），位移 8–40px\n// layer.x = base.x + depth * cameraOffset；相机停稳后各层静止',
    prompt: '做图片切层视差：先把图片真实切成前/中/后景遮罩（深度比 0.15/0.5/1），相机移动时远层位移 8px、近层 40px，到站后停稳。遮挡产生的空洞需补画并标注来源，不许整图平移冒充切层。',
    sourceRepo: 'fy-code-animation',
    demo: 'parallax',
  },
  {
    name: '群体成形（无仿真鸟群）',
    nameEn: 'Flock Without Simulation',
    category: '视觉效果',
    description: '用闭式表达式替代 boids：队形偏移 o_i + 共享路径 P(τ) + 种子扑动 + 行波。每个元素有 home，鱼由鱼群游动而成。可任意 seek。',
    codeSnippet: 'function flight(i, t) {\n  const e = EL[i], g = FIG[e.fig], tau = t - e.delay // 尾部滞后头部\n  const p = g.path(tau), th = g.heading(tau), s = g.scale(tau)\n  // 位置 = P(τ) + rotate(o_i, θ) + flutter_i(t)；flutter = Σ 2–3 个正弦（种子频率/相位）\n  // 扑翼：o_i.y += A * sin(k*o_i.x - ωt) * taper(o_i.x)\n}',
    prompt: '做群体成形动画（马赛克砖/纸屑/落叶/像素/鸟群/字母）：每个元素有固定 home 与队形偏移 o_i；群体沿一条共享样条路径 P(τ) 移动（元素 i 采样 τ = t − d_i，尾部滞后）；个体差异用 2–3 个种子正弦叠加的扑动；扑翼用行波 o_i.y += A·sin(k·o_i.x − ωt)。全部闭式可 seek，不用依赖历史的 boids 仿真。相位：分散→聚形→成形巡游→沿切线散开。',
    sourceRepo: 'fy-code-animation',
    demo: 'flip',
  },
  {
    name: '马赛克翻面',
    nameEn: 'Mosaic Flip',
    category: '视觉效果',
    description: '砖块按波前错峰翻面（翻面事件表驱动），同批元素 flip(t − dist/v)，形成横扫画面的翻面浪。gold leaf/smalti 材质按绘制拍烘焙。',
    codeSnippet: '// 翻面波前：flipDelay_i = dist(i, 源点)/v；每砖 rotateY(θ(t - flipDelay_i))\n// θ: 0→π 用 easeOutBack；材质 front/back 两面，接触声与翻面共用事件 id',
    prompt: '做马赛克翻面墙：数千块小砖（马赛克/金箔/玻璃 smalti 质感），一个事件源点触发翻面波——每块砖的翻面延迟 = 到源点距离 / 波速，翻面用 rotateY 0→π（带轻微回弹）。前后两面材质不同，声音事件与翻面共用 id。整面墙翻完形成一张图，支持 seek（闭式计算）。',
    sourceRepo: 'fy-code-animation',
    demo: 'flip',
  },
  {
    name: '纸偶定格表演',
    nameEn: 'Paper Cut-out Performance',
    category: '视觉效果',
    description: '印刷纸偶逐帧拍摄：平色域+纹理、手切抖边、纸后软接触影。绘制 fps 12、输出 60（5 帧持帧）；静止阅读不加 boil；输出帧率整除绘制帧率时持帧最均匀。',
    codeSnippet: '// 绘制 fps 12 / 输出 fps 60 → 每绘制帧持 5 输出帧\n// frame = Math.floor(t * 12)；姿势查姿势状态表（关节锚点插值按绘制拍取整）\n// 接触影：soft shadow 随纸层深度偏移，光方向一致',
    prompt: '做剪纸定格动画：角色是印刷剪纸偶（平色域+纸张纹理、手切抖边、纸后软接触影）。绘制帧率 12fps、输出 60fps，每绘制帧持 5 输出帧；关节按姿势状态表在绘制拍取整插值。静止阅读段不加 boil 抖动，走路时接触帧锁住脚点。眨眼/次要动作轮替两张。',
    sourceRepo: 'fy-code-animation',
    demo: 'shake',
  },
  {
    name: '中文意群强调',
    nameEn: 'Kinetic Type Emphasis',
    category: '文字动效',
    description: '先找真正改变句意的词：否定/条件要保全逻辑范围、转折要让关系可见、数字同基线等宽、对比双方保持字号对等。气势 = 先收副元素再放大主词。',
    codeSnippet: '// 气势词标准动作：先 0.2s 收掉副元素 → 主词从 1.5× 缩到 1（尾振上限 4%）\n// → 背景降亮度 → 落稳后保留 2s 读窗\n// 数字对比：同基线 + tabular-nums + 图形同源插值（计数器与条形共用一条 spring）',
    prompt: '做中文动态文字：先标出真正改变句意的词——「不是…才…」的否定词必须与被否定部分同现且保留静读；转折词让前后项位置互换（物件由阻挡变承载）；数字用同基线等宽数字，计数器与条形图共用同一条 spring 避免相互矛盾；对比双方字号对等。气势词出场：0.2s 收副元素→主词 1.5×缩到 1（尾振 4% 以内）→落稳保留 2s 读窗。',
    sourceRepo: 'fy-code-animation',
    demo: 'highlight',
  },
  {
    name: '卡通反应链',
    nameEn: 'Cartoon Reaction Chain',
    category: '节奏',
    description: '注意（眼睛先）→转头→身体预备→行动→接触压扁→恢复/看结果。每姿势先看剪影；主手/脸不被身体遮住。1–2px 线条 boil 表现手绘，字幕层保持稳定。',
    codeSnippet: '// 姿势表：notice → turn → anticipation → action → squash-contact → recover\n// anticipation：反向预备 0.2–0.4s；squash：接触帧 scale(1.15, 0.8)\n// boil：两张 1–2px 偏移线稿轮替（12fps），字幕层不参与',
    prompt: '做卡通角色反应链动画：顺序是「眼睛先注意→转头→身体反向预备→行动→接触瞬间压扁（scale 1.15/0.8）→恢复并看结果」。每个姿势先检查剪影可读性，主手与脸不被身体遮挡。手绘感用 1–2px 线条 boil（两张轮替、12fps），但字幕文字层保持稳定不抖。',
    sourceRepo: 'fy-code-animation',
    demo: 'bounce',
  },
  {
    name: '像素平台规范',
    nameEn: 'Pixel Stage Rules',
    category: '视觉效果',
    description: '逻辑画布 320×180、输出 1920×1080（倍率 6、最近邻）；步行 12 绘制 fps、60 输出持 5 帧；脚落地帧锁脚点；调色板 10–16 色；不用弹簧/运动模糊/小数相机。',
    codeSnippet: '// 逻辑 320×180 → 输出 ×6 最近邻；相机与坐标全整数\n// 步行 cycle 12fps；世界横移固定像素速度；金币收集在角色前缘接触帧触发\n// Bayer 抖色在道具本地坐标、整数倍缩放前计算',
    prompt: '做像素平台动作风格：逻辑画布 320×180、输出 1920×1080（整数倍率 6、最近邻采样，禁止小数相机）；角色/tile/道具全用逻辑坐标，步行动画 12 绘制 fps（60 输出时每帧持 5 拍），脚落地帧锁住脚点；调色板 10–16 色；Bayer 抖色图案在道具本地坐标计算后再缩放。不用弹簧缓动、运动模糊、粒子尾迹作为默认。',
    sourceRepo: 'fy-code-animation',
    demo: 'flip',
  },
  {
    name: '真实域图表动画',
    nameEn: 'Truthful Charts',
    category: '视觉效果',
    description: '横条按固定域从旧值到新值（domain 含 0）最后标差值；折线沿真实时间坐标、缺失留断口；堆积环角度=值/总值；排名用稳定 id。装饰动效不改变事实。',
    codeSnippet: '// 谁更大：bar 0.6–1.2s 旧值→新值，domain 固定含 0，落定后标 Δ\n// 随时间：LineReveal 1–2s 沿弧长揭示，null 保留断口，非均匀时间不等距\n// 排名：稳定 id 绑定条，0.8–1.5s 两快照间同时插值数值与位置',
    prompt: '做数据图表动画（真实优先）：条形比较用固定 domain（含 0）从旧值到新值 0.6–1.2s，落定后标出差值，不截断基线夸大差异；折线沿真实时间坐标 1–2s 弧长揭示，缺失数据保留断口不连线不填 0；构成用堆积条/环时标清总量与分母；排名变化用稳定 id 让数值与位置共同过渡 0.8–1.5s。装饰动效不得改变事实或伪造产品能力。',
    sourceRepo: 'fy-code-animation',
    demo: 'stroke',
  },
  {
    name: '运动中切换（接缝）',
    nameEn: 'Seam Handoff',
    category: '转场',
    description: '同方向离场与入场在切点保持速度：幂次曲线对（离场 t∈[C−Tout,C]，入场 t∈[C,C+Tin]），切点两侧速度匹配，行程与时长按平均速度核算。',
    codeSnippet: '// 幂次 ease：out: p(u)=(n+1)u^n(1-u)+u³ …（HeyGen Apache-2.0 接缝参考）\n// 挂载覆盖表：前场在 C 前淡出挂载，后场在 C 时已就位；同对象接力不重置',
    prompt: '做运动中切换的接缝：前后两镜有共同对象（如一个滑动的卡片），离场曲线在切点 C 前完成、入场曲线从 C 开始，两侧在切点的速度相等（用同幂次的一对 ease 曲线，行程 d = 平均速度 × 时长）。前场对象与后场对象在切点重叠挂载，不闪底色。随机 seek 到切点前后各 0.5s 检查速度连续。',
    sourceRepo: 'fy-code-animation',
    demo: 'trail',
  },
  {
    name: '镜头四段式',
    nameEn: 'Camera 4-Phase Move',
    category: '运镜',
    description: '起势（建立目标/视线线索）→移动（只改变需要解释的空间关系）→到站（结束大幅位移）→停稳（证据/文字可读）。不每段套同一个 easeInOut。',
    codeSnippet: '// 起势 0.3–0.6s：轻微反向或视线引导\n// 移动：单一空间关系解释，缓动按内容（快出慢入/匀速）\n// 到站：主动刹停；停稳：≥1.2s 阅读窗，字幕归屏幕层',
    prompt: '设计一个运镜（四段式）：起势 0.3–0.6s 建立目标或给视线线索；移动段只解释当前需要的那个空间关系；到站主动刹停结束大幅位移；停稳保留至少 1.2s 让证据/文字可读。世界层（对象/接地影/标签）与屏幕层（字幕/固定读数）分开；人物与地面接触时视差速度必须一致。中间需要多站时长镜头共享切线连续走，不每段套同一个 easeInOut。',
    sourceRepo: 'fy-code-animation',
    demo: 'zoom',
  },
  {
    name: '等宽数字滚动',
    nameEn: 'Tabular Number Roll',
    category: '文字动效',
    description: '数字/量级要让人比较：同基线、等宽数字（tabular-nums）、图形同源插值。计数器与条形共用一条 spring，避免显示相互矛盾。',
    codeSnippet: '// font-variant-numeric: tabular-nums; 同一 baseline\n// value = spring(target)；计数器文字与条形高度读同一 value 渲染',
    prompt: '做数字滚动动画：所有数字用等宽数字（tabular-nums）与同一基线；数值过渡用一条 spring 驱动，计数器文字与配套条形图读同一个 value 渲染（防止 0.4s 内两个动画显示矛盾数值）；大数滚动按位错峰（低位先动）。',
    sourceRepo: 'fy-code-animation',
    demo: 'typewriter',
  },
]

export interface FyRecipePromptSeed {
  title: string
  category: string
  content: string
  tags: string
  sourceRepo: string
  useCase: string
}

export const fyRecipePromptSeeds: FyRecipePromptSeed[] = [
  {
    title: '活背景配方总指令（11 种环境）',
    category: '技术实现',
    content:
      '为我的视频选择并实现活背景。先写背景表示什么（空间/密度/方向/材质/情绪）再选运动。配方表：流场（100条×35步、步长6px、周期12s）｜漂浮尘点（100–300点、r 1–3px、14s、位移18–24px）｜轨道群（半径=短边0.2–0.6、8–16s）｜聚字/聚形（gatherDuration 0.8–1.8s、错峰0–0.25s）｜点阵网格（spacing 32–56px、波幅3–8px、传播500px/s）｜噪声渐变（cell 16–32px、octaves 2–4、period 12–24s）｜光扫（opacity 0.08–0.25、0.6–1.5s）｜暗角（strength 0.15–0.4）｜颗粒（opacity 0.02–0.08、1800点、12 drawings/s）｜Ken Burns（zoom 1→1.04–1.08、4–8s）｜切层视差（深度比0.15/0.5/1、位移8–40px）。约束：每场最多一个主环境变化+一个低对比材质层；阅读区用 readingAttenuation 抑制亮度；循环用 phase=2π(t mod period)/period；正文阅读/静默时可冻结。',
    tags: '背景,粒子,氛围,配方',
    sourceRepo: 'fy-code-animation',
    useCase: '为讲解视频/发布片设计不抢主体的活背景',
  },
  {
    title: '群体成形与马赛克翻面指令',
    category: '技术实现',
    content:
      '用「有 home 的数千小元素」构成画面（马赛克砖/纸屑/落叶/像素/鸟群/字母/多米诺）。规则（无仿真、闭式可 seek）：队形凝聚=每元素固定队形偏移 o_i；跟随领袖=共享路径 P(τ) 与朝向 θ(τ)，元素 i 采样 τ=t−d_i（尾部滞后）；个体性=2–3 个种子正弦的扑动；游动身体=行波 o_i.y += A·sin(k·o_i.x−ωt)·taper(o_i.x)。运动词汇：lift/fly/land/flip/wave/spiral/peel/swarm。翻面用波前延迟（dist/波速）+ rotateY 0→π。可参考示例：80s 玻璃金箔马赛克墙（WebGL2 无依赖无素材）。保持图形可读：轮廓先于个体，别让群体散成噪声。',
    tags: '群体,马赛克,粒子,编队',
    sourceRepo: 'fy-code-animation',
    useCase: '大群体构成图形/马赛克墙/鸟群字',
  },
  {
    title: '纸偶定格表演指令',
    category: '技术实现',
    content:
      '做剪纸/纸偶定格表演。输入：人物身份、关节锚点、动作意图、绘制fps、输出fps、纸层深度、光方向。规则：平色域靠纹理变丰富；手切抖边；纸后软接触影；静止阅读不加 boil；输出帧率整除绘制帧率时持帧最均匀（12fps绘制/60fps输出=每帧持5拍），不整除需记录节奏选择。姿势用状态表（在绘制拍取整）。双联灯箱变体：左右两页共享中缝光源。',
    tags: '剪纸,定格,纸偶,表演',
    sourceRepo: 'fy-code-animation',
    useCase: '剪纸风 MV、纸偶剧、定格讲解',
  },
  {
    title: '图片调度与裁切指令（密集展示）',
    category: '技术实现',
    content:
      '调度多张照片前先看图：每张记录 id、宽高、焦点[x,y]（归一化）、保护 bbox、文字区、可裁区、许可。裁切：cover 基础倍率 s=max(目标宽/原宽, 目标高/原高)，最终=s×zoom（zoom≥1）；超过 1 即放大，不凭算法宣称清晰；贴边图焦点会被钳位，先留裁切余量。深度配方：轻=每图独立入场；中=按事件分组接力；重=网格+逐格揭示。脸/手持产品/图内标题都是保护对象，不能只信文件名。',
    tags: '图片,蒙太奇,裁切,密集展示',
    sourceRepo: 'fy-code-animation',
    useCase: '照片墙、盘点视频、回忆杀混剪',
  },
  {
    title: '中文动态文字·意群指令',
    category: '方法论 · fy 创作法',
    content:
      '文字先承担句意再承担动作。先标意群与强调依据：否定/条件→与被否定部分同现、保留静读、划线后替换；转折/结论→前项让位、位置转换、物件由阻挡变承载；数字/量级→同基线、等宽数字、图形同源插值；对比双方→字号对等、改变关系或分区。输入完整句子+显式意群+字体文件+画幅+事件表；输出每组的进入、读窗、退出及与主体动作的关系。错误示范：只给「但是」放大而后果不变=没讲清转折。',
    tags: '动态文字,意群,强调,中文',
    sourceRepo: 'fy-code-animation',
    useCase: '口播金句、标题党字幕、气势词出场',
  },
  {
    title: '数据图表真实性指令',
    category: '技术实现',
    content:
      '图表动画前先答「要证明什么关系」。谁更大/差多少→横条固定域（含0）旧值到新值 0.6–1.2s，落定标 Δ，不截断基线；随时间→折线沿真实时间坐标弧长揭示 1–2s，非均匀时间不等距，缺失留断口；构成→少数分类堆积条/环，角度=值/总值×2π，总量为 0 不画伪比例；排名→稳定 id，两真实快照间 0.8–1.5s 数值与位置共同过渡。产品操作界面：装饰动效不改变事实、不伪造能力。图表尺寸以最小可读为准。',
    tags: '图表,数据可视化,真实性,排名',
    sourceRepo: 'fy-code-animation',
    useCase: '数据叙事、财报视频、产品对比',
  },
  {
    title: '接缝与速度匹配指令（seek 友好）',
    category: '方法论 · fy 创作法',
    content:
      '两镜交接先写清：共同对象、切点 C（秒）、行程 d、过渡时间 T、可读区间。运动中切换：同方向离场（t∈[C−Tout,C]）与入场（t∈[C,C+Tin]）用同幂次一对曲线，切点两侧速度相等；d=平均速度×T 核算。挂载覆盖表：前场淡出挂载、后场 C 时已就位。可回放时间接口：一切状态是 t 的纯函数；随机 seek 到任意点画面确定；循环端点速度/亮度一致（不只位置相等）。禁止上一帧累加、Date.now、无种子 random。',
    tags: '接缝,转场,速度匹配,确定性',
    sourceRepo: 'fy-code-animation',
    useCase: '一镜到底内部交接、无缝转场、可回放渲染',
  },
  {
    title: '角色表演链指令（贯穿角色）',
    category: '方法论 · fy 创作法',
    content:
      '角色不是随句子换装的贴图。角色设计表：剪影/比例（头身比、主轮廓、辨识附件、正侧背面对应）；色与表情（1–2 个识别色；中性/注意/疑惑/确认的眼眉口参数）；骨架（根→躯干→头→上臂/前臂→腿的父子关系与 pivot）；接触点（脚底/手握点/坐面/视线目标，世界坐标与物件局部坐标分开）。表演有注意、因果与重量：先看目标→预备→接触→重量变化→结果。跨镜状态延续（拿的东西、站的位置不凭空变）。',
    tags: '角色,表演,骨架,表情',
    sourceRepo: 'fy-code-animation',
    useCase: '吉祥物贯穿全片、讲解小人、角色 IP 短视频',
  },
  {
    title: '导演判断与可执行深度指令',
    category: '方法论 · fy 创作法',
    content:
      '一镜先说明「观众看完后理解发生了什么变化」，再为变化找承载对象/动作/关系，最后才选效果。每镜交代：主体初末状态、背景/中景/主体/文字/前景各层作用（空层写「无」）、动作曲线、镜头坐标、进出场、文字读窗、声音事件、与下一镜接力。模糊→可执行对照：「有气势地出现」=先 0.2s 收掉副元素、主词 1.5×→1（尾振≤4%）、背景降亮度、落稳留 2s 读窗；「小人很努力」=眼先看重块、后坐预备、双手接触、块未动时身体压低、0.8s 后块动身体前倾。不把效果目录当分镜。',
    tags: '导演,分镜,可执行,深度',
    sourceRepo: 'fy-code-animation',
    useCase: '写分镜稿时防止空话、把形容词翻译成数值动作',
  },
  {
    title: '叙事结构选择指令（因果/阶梯/循环）',
    category: '方法论 · fy 创作法',
    content:
      '叙事结构是可选件，不是所有片都走「痛点→卖点→CTA」。因果解释：保留同一状态变量（原状态→触发→传播→结果→条件限制），先建对象再让变化发生最后停住；信息量大时把原因与后果分镜，用路径/颜色/物件接力；检查=去掉文字因果方向仍对。概念阶梯（点→线→面→体→场）：只有内容真有粒度/规模升级才用，每章写一个价值+一个机制，转换由物件身份相接，不做五种效果展览。人生循环/对比型按含义选，先有全文语义模型再选结构。',
    tags: '叙事,结构,因果,概念阶梯',
    sourceRepo: 'fy-code-animation',
    useCase: '科普解释视频、概念讲解、品牌故事',
  },
  {
    title: '分支实现：像素平台与卡通反应',
    category: '技术实现',
    content:
      '像素平台动作：逻辑画布 320×180、输出 1920×1080（倍率 6 最近邻）；步行 12 绘制 fps；世界横移固定像素速度；脚落地帧锁脚点；金币在角色前缘接触帧才触发；调色板 10–16 色；Bayer 图案在道具本地、缩放前算；不用弹簧/运动模糊/小数相机/粒子尾迹。卡通反应：姿势表=注意（眼睛先）→转头→身体预备→行动→接触压扁→恢复看结果；每姿势先看剪影；主手/脸不遮；1–2px 线条 boil、两三张轮替，字幕层保持稳。',
    tags: '像素,卡通,平台动作,反应链',
    sourceRepo: 'fy-code-animation',
    useCase: '复古游戏风短片、卡通角色短视频',
  },
]
