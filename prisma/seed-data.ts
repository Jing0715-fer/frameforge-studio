export interface StyleSeed {
  slug: string
  name: string
  nameEn: string
  category: string
  description: string
  tags: string
  palette: string
  sourceRepo: string
  difficulty: string
  starterPrompt: string
}

export const styleSeeds: StyleSeed[] = [
  {
    slug: 'cinematic-film',
    name: '电影胶片质感',
    nameEn: 'Cinematic Film',
    category: '电影质感',
    description: '35mm 胶片颗粒叠加暖调琥珀光晕，暗部沉稳、高光泛金，适合人物纪实与品牌故事片。',
    tags: '胶片,颗粒感,暖调,电影感',
    palette: '#181210,#b45309,#fbbf24,#0c0a09',
    sourceRepo: 'lemo-opuscar',
    difficulty: '专业',
    starterPrompt: '用 HTML+CSS 制作一段 6 秒电影胶片质感片头：背景使用深棕黑 #181210，主标题用琥珀金 #fbbf24 的衬线字体（Playfair Display），入场时文字自下方 40px 淡入上移，时长 1.2 秒，缓动 cubic-bezier(0.22,1,0.36,1)；随后叠加 8% 透明度噪点纹理与四周暗角，一束 #b45309 暖光自左上角缓慢扫过（2 秒），整体节奏舒缓庄重，如老电影在暗房里显影。'
  },
  {
    slug: 'cyberpunk-neon',
    name: '赛博朋克霓虹',
    nameEn: 'Cyberpunk Neon',
    category: '电影质感',
    description: '深夜霓虹雨街的青粉双色光，湿润反光与全息投影质感，适合科技产品与未来都市题材。',
    tags: '霓虹,科幻,夜色,高对比',
    palette: '#0d0221,#ff2a6d,#d1f7ff,#05d9e8',
    sourceRepo: 'lemo-opuscar',
    difficulty: '专业',
    starterPrompt: '制作一支赛博朋克霓虹风格短视频：背景为深紫黑 #0d0221，标题文字交替使用品红 #ff2a6d 与青色 #05d9e8 双色发光（双层 text-shadow 辉光），字体选用 Orbitron；文字先做 1.5 秒霓虹闪烁（透明度 0 与 1 交替三次），再以 0.8 秒 glitch 横向错位抖动收尾；前景持续飘落 1px 细雨线条，地面保留湿滑反光渐变，整体迷离、高对比，充满未来都市的电子味。'
  },
  {
    slug: 'neo-noir',
    name: '新黑色侦探',
    nameEn: 'Neo Noir',
    category: '电影质感',
    description: '高反差黑白光影配一线暗红点缀，百叶窗阴影与雨夜氛围，适合悬疑叙事与罪案题材。',
    tags: '黑白,高反差,悬疑,阴影',
    palette: '#0a0a0a,#e5e5e5,#7f1d1d,#404040',
    sourceRepo: 'lemo-opuscar',
    difficulty: '进阶',
    starterPrompt: '用 HTML+CSS 制作新黑色侦探风格片头：背景纯黑 #0a0a0a，标题用银灰 #e5e5e5 冷调衬线字（Didot），画面斜向铺三条 45 度百叶窗式阴影条纹（#404040 半透明）缓缓横移；标题以打字机方式逐字浮现，每字间隔 0.12 秒；其中关键词用暗红 #7f1d1d 标注并以 2 秒周期轻微闪烁；整体节奏克制断续，如雨夜路灯下的罪案档案。'
  },
  {
    slug: 'aerial-epic',
    name: '航拍史诗',
    nameEn: 'Aerial Epic',
    category: '电影质感',
    description: '俯瞰视角的山海大地色系，晨雾光带与宏大构图，适合风光纪录片与开场大场景。',
    tags: '航拍,俯瞰,自然,纪录片',
    palette: '#1c2b33,#7c9d96,#e8e4d8,#caa472',
    sourceRepo: 'lemo-opuscar',
    difficulty: '专业',
    starterPrompt: '制作一支航拍史诗风格开场：背景深青灰 #1c2b33，三层山峦剪影分别用 #7c9d96、#caa472、#e8e4d8 由深至浅叠放，以不同速度缓慢上移（视差 8/14/20px 每 6 秒）模拟穿越云层的爬升感；主标题用米白 #e8e4d8 特大号衬线字，在画面稳定 1.5 秒后淡入（缓动 cubic-bezier(0.22,1,0.36,1)）；顶部加一道晨光光带 3 秒内自左向右扫过，气势恢宏，节奏绵长。'
  },
  {
    slug: 'silent-film',
    name: '黑白默片',
    nameEn: 'Silent Film',
    category: '电影质感',
    description: '高对比黑白画面配胶片划痕与跳动帧率，插卡字幕复古味十足，适合怀旧短片与喜剧。',
    tags: '黑白,复古,默片,划痕',
    palette: '#0a0a0a,#f5f5f5,#a3a3a3,#262626',
    sourceRepo: 'lemo-opuscar',
    difficulty: '入门',
    starterPrompt: '用 HTML+CSS 制作黑白默片风格短视频：背景深黑 #0a0a0a，插卡字幕用米白 #f5f5f5 居中衬线大字，四角加装饰花边框线；画面整体每 0.3 秒随机位移 1 至 2px 模拟老放映机抖动，并叠加竖向划痕细线随机闪现；字幕卡切换用 0.25 秒圆形遮罩收放过渡；全程动画按 16fps 阶梯感处理（用 steps(16) 切帧），复古而诙谐。'
  },
  {
    slug: 'sunlit-film',
    name: '日系清新胶片',
    nameEn: 'Japanese Film',
    category: '电影质感',
    description: '柔和奶咖色调与过曝高光，逆光光斑与细腻颗粒，适合旅拍 Vlog 与青春情绪短片。',
    tags: '日系,清新,逆光,柔光',
    palette: '#f5efe6,#d9c5b2,#8fa396,#3f4a3c',
    sourceRepo: 'lemo-opuscar',
    difficulty: '进阶',
    starterPrompt: '制作一支日系清新胶片风短视频：背景米白 #f5efe6，主体色调用浅褐 #d9c5b2 与灰绿 #8fa396 叠出通透低饱和渐变；文字用细圆体，随 15% 透明度的圆形光斑自右上角缓慢漂移（6 秒循环）；画面边缘做轻微暗角，并每 4 秒来一次 0.5 秒过曝白闪模拟逆光；镜头切换统一用 0.4 秒叠化，节奏轻盈，像午后微风翻动相册。'
  },
  {
    slug: 'ink-wash',
    name: '中国水墨',
    nameEn: 'Ink Wash',
    category: '艺术风格',
    description: '宣纸留白与浓淡五色墨韵，笔触边缘自然晕染，适合诗词意境与东方品牌短片。',
    tags: '水墨,留白,东方,晕染',
    palette: '#f8f7f2,#1c1c1c,#5c6b63,#9aa8a0',
    sourceRepo: 'huashu-art-motion',
    difficulty: '进阶',
    starterPrompt: '用 HTML+CSS 制作中国水墨风格动画：背景宣纸白 #f8f7f2 叠加细微纸纹，远山以浓淡三层墨色（#1c1c1c 透明度 100%、70%、40%）横向晕染展开，每层 2 秒、缓动 cubic-bezier(0.22,1,0.36,1)；墨色边缘用 blur(4px) 柔化出水迹感；结尾一枚朱红印章以 0.6 秒盖下并轻微回弹（scale 1.1 到 1）；整体节奏如运笔般从容，意境悠远。'
  },
  {
    slug: 'oil-painting',
    name: '厚涂油画',
    nameEn: 'Oil Painting',
    category: '艺术风格',
    description: '厚重笔触堆叠与哑光画布质感，暖褐主调点缀钴蓝，适合艺术讲解与展览宣传。',
    tags: '油画,厚涂,笔触,古典',
    palette: '#2b1b12,#c1440e,#e0a458,#1f4e5f',
    sourceRepo: 'huashu-art-motion',
    difficulty: '专业',
    starterPrompt: '制作一支厚涂油画风格短视频：背景深褐 #2b1b12，主体以赭红 #c1440e 与暖黄 #e0a458 的大色块笔触堆叠呈现，边缘叠加 SVG turbulence 滤镜模拟颜料肌理；镜头做 8 秒线性缓慢推近 5%；标题用古典衬线字 #e0a458，在第 2 秒以画笔擦除方式显现（clip-path 自左向右 1.5 秒揭开）；阴影处点缀 #1f4e5f 钴蓝冷色，整体如凝视一幅正在完成的画作。'
  },
  {
    slug: 'woodcut',
    name: '木刻版画',
    nameEn: 'Woodcut Print',
    category: '艺术风格',
    description: '粗犷刀痕线条与黑白红三色套印，民间质朴力量感，适合节庆主题与文化海报动画。',
    tags: '版画,木刻,民间,高对比',
    palette: '#f4ead5,#17130c,#b3402a,#5b4a3a',
    sourceRepo: 'huashu-art-motion',
    difficulty: '进阶',
    starterPrompt: '用 HTML+CSS 制作木刻版画风格动画：背景米黄 #f4ead5，主体图形用炭黑 #17130c 粗轮廓勾勒，内部填充 45 度斜线排刻痕纹理（repeating-linear-gradient）；点缀砖红 #b3402a 大色块与 #5b4a3a 灰褐过渡；图形以逐层雕刻方式显现，clip-path 自下而上 1.2 秒揭开，缓动 steps(8) 制造刀刻顿挫；标题用仿宋粗体压在画面右下，整体粗犷有力。'
  },
  {
    slug: 'silkscreen',
    name: '丝网印刷海报',
    nameEn: 'Silkscreen Poster',
    category: '艺术风格',
    description: '大色块套印错位与网点肌理，色彩饱满明快，适合音乐节海报与潮流活动宣传。',
    tags: '丝网印刷,色块,错位,海报',
    palette: '#f2e8cf,#1b998b,#ee6c4d,#2d3047',
    sourceRepo: 'huashu-art-motion',
    difficulty: '入门',
    starterPrompt: '制作一支丝网印刷海报风格动画：背景米色 #f2e8cf，标题用无衬线特粗黑体，按 #1b998b、#ee6c4d、#2d3047 三层色板套印，各层依次 0.15 秒延迟入场，并永久保留 3px 随机错位偏移模拟印刷偏差；色块交叠处用 mix-blend-mode: multiply 混出第三色；背景平铺 20% 透明度的网点纹理；整体以 0.9 秒一拍的节奏逐层揭示，直给而明快。'
  },
  {
    slug: 'bauhaus',
    name: '包豪斯构成',
    nameEn: 'Bauhaus',
    category: '艺术风格',
    description: '红黄黑三原色的几何构成，圆方三角的理性秩序，适合设计展览与极简品牌形象。',
    tags: '包豪斯,几何,构成,极简',
    palette: '#eae2d7,#d93025,#1a1a1a,#f4b400',
    sourceRepo: 'huashu-art-motion',
    difficulty: '进阶',
    starterPrompt: '用 HTML+CSS 制作包豪斯构成风格动画：背景暖白 #eae2d7，画面以正圆（红 #d93025）、矩形（黄 #f4b400）、粗横线（黑 #1a1a1a）做非对称构成，全部元素吸附 8px 网格；依次入场：圆滚动平移 0.6 秒、方块自左滑入 0.5 秒、线条自中心伸展 0.4 秒，缓动统一 cubic-bezier(0.22,1,0.36,1)；标题用无衬线大写并拉开字距，整体理性严谨，如一座会动的构成主义雕塑。'
  },
  {
    slug: 'pop-art',
    name: '波普艺术',
    nameEn: 'Pop Art',
    category: '艺术风格',
    description: '高饱和撞色与网点渐变，漫画分格与对话气泡，适合潮流营销与音乐 MV 片段。',
    tags: '波普,撞色,漫画,网点',
    palette: '#ffd23f,#ee6c4d,#3f88c5,#f7f7ff',
    sourceRepo: 'huashu-art-motion',
    difficulty: '进阶',
    starterPrompt: '制作一支波普艺术风格短视频：背景亮黄 #ffd23f，主体用橘红 #ee6c4d 与钴蓝 #3f88c5 撞色色块，画面切为四格漫画布局，格子依次 0.3 秒弹入（scale 0.8 到 1，缓动 cubic-bezier(0.34,1.56,0.64,1)）；每格叠加 halftone 网点纹理与放射状爆炸星形背景；对话气泡以弹簧感弹出，「POP!」字样随机砸入并旋转 8 度；节奏欢脱跳跃，充满复古波普活力。'
  },
  {
    slug: 'nouveau',
    name: '新艺术运动',
    nameEn: 'Art Nouveau',
    category: '艺术风格',
    description: '缠绕藤蔓曲线与金线勾勒，对称花卉装饰边框，适合高端香水与珠宝艺术宣传。',
    tags: '新艺术,藤蔓,装饰,曲线',
    palette: '#101d19,#c9a66b,#3e5c50,#e8dcc0',
    sourceRepo: 'huashu-art-motion',
    difficulty: '专业',
    starterPrompt: '用 HTML+CSS 制作新艺术运动风格动画：背景墨绿 #101d19，装饰边框用金色 #c9a66b 细线勾勒对称藤蔓与花卉曲线（SVG path），以 stroke-dashoffset 动画在 3 秒内自两端向中心生长；中央徽章底衬深绿 #3e5c50 叶片纹样，标题用装饰衬线字体 #e8dcc0，在边框生长至 70% 时淡入 1 秒；整体节奏优雅缓慢，如藤蔓在月光下悄然缠绕。'
  },
  {
    slug: 'collage-mixed',
    name: '拼贴混合媒介',
    nameEn: 'Mixed Collage',
    category: '艺术风格',
    description: '撕纸边缘与胶带贴片层叠混排，手写与印刷碰撞，适合文创品牌与展览预告。',
    tags: '拼贴,混合媒介,撕纸,手作',
    palette: '#ece5d8,#c8522e,#4a5859,#d8b26e',
    sourceRepo: 'huashu-art-motion',
    difficulty: '进阶',
    starterPrompt: '制作一支拼贴混合媒介风格动画：背景做旧米色 #ece5d8，照片、票据、手写便签等纸片元素以 -8 至 8 度的随机角度散落层叠；入场时各纸片在 0.4 秒内从 scale 1.3 落下并带回旋 2 度的旋转回正，缓动 cubic-bezier(0.34,1.56,0.64,1)；纸片边缘用不规则 clip-path 模拟撕边，点缀 #c8522e 半透明胶带条与 #d8b26e 图钉；整体轻快随性，像一阵风吹乱了手账桌。'
  },
  {
    slug: 'handdrawn-cartoon',
    name: '美式手绘卡通',
    nameEn: 'Hand-drawn Cartoon',
    category: '手绘动画',
    description: '粗描边与跳帧动画，夸张的挤压拉伸形变，适合儿童内容与趣味科普短视频。',
    tags: '手绘,卡通,跳帧,夸张',
    palette: '#fffbe6,#ff9f1c,#2ec4b8,#e71d36',
    sourceRepo: 'ClaudeAnimationBase',
    difficulty: '入门',
    starterPrompt: '用 HTML+CSS 制作美式手绘卡通风格动画：背景奶油黄 #fffbe6，角色与图形统一 4px 黑色粗描边，填色用亮橙 #ff9f1c、水鸭绿 #2ec4b8 与正红 #e71d36；所有动画以 12fps 跳帧播放（animation-timing-function: steps(12)）；角色入场做挤压与拉伸，scaleY 从 1.2 压到 0.9 再弹回 1，全程 0.5 秒；对话气泡以弹簧感弹出，整体滑稽欢快，像橡皮管动画复活。'
  },
  {
    slug: 'watercolor',
    name: '水彩晕染',
    nameEn: 'Watercolor',
    category: '手绘动画',
    description: '透明水色与湿润边界晕染，留白呼吸感强，适合婚礼邀请与治愈系内容。',
    tags: '水彩,晕染,透明,治愈',
    palette: '#fdfcf8,#7fa8c9,#e8b4b8,#8fc1a9',
    sourceRepo: 'huashu-art-motion',
    difficulty: '进阶',
    starterPrompt: '制作一支水彩晕染风格动画：背景纸白 #fdfcf8，色块使用雾蓝 #7fa8c9、樱粉 #e8b4b8、豆绿 #8fc1a9，均以 60% 透明度多层叠加以呈现通透水色；主体图形以 2 秒径向展开（scale 0 到 1，缓动 cubic-bezier(0.22,1,0.36,1)），边缘叠加 blur(6px) 模拟湿润晕染边界；文字用细手写体随墨迹淡入（1.2 秒）；整体舒缓治愈，如颜料在湿纸上慢慢开花。'
  },
  {
    slug: 'sketch-line',
    name: '铅笔速写',
    nameEn: 'Pencil Sketch',
    category: '手绘动画',
    description: '素描排线与橡皮修改痕迹，纸张肌理明显，适合手账教学与创意草图花絮。',
    tags: '素描,排线,手绘,纸感',
    palette: '#f5f5f0,#3a3a3a,#8c8c8c,#c9c2b8',
    sourceRepo: 'ClaudeAnimationBase',
    difficulty: '入门',
    starterPrompt: '用 HTML+CSS 制作铅笔速写风格动画：背景纸灰白 #f5f5f0 叠加细噪点纸纹，线条统一用炭灰 #3a3a3a 的 2px 描边并加 0.3px 轻微模糊制造铅粉感；主体轮廓以 SVG stroke-dashoffset 1.8 秒描绘成形（缓动 cubic-bezier(0.22,1,0.36,1)），随后 0.5 秒内快速铺出 45 度排线阴影（斜线纹理淡入）；局部保留 #8c8c8c 的橡皮擦痕与辅助线，像一本正在被速写的笔记本。'
  },
  {
    slug: 'claymation',
    name: '黏土定格',
    nameEn: 'Claymation',
    category: '手绘动画',
    description: '黏土质感与指纹按压痕迹，定格式逐帧运动，适合儿童 IP 与吉祥物短片。',
    tags: '黏土,定格,逐帧,吉祥物',
    palette: '#e8b4a0,#c97b5d,#6b8f71,#f0dcc8',
    sourceRepo: 'PDoomVideo',
    difficulty: '专业',
    starterPrompt: '制作一支黏土定格动画风格短视频：背景陶土粉 #f0dcc8，角色主体用黏土橙 #e8b4a0 与赤陶 #c97b5d，表面叠加 SVG 位移滤镜模拟指纹按压痕迹，阴影处衬苔绿 #6b8f71；所有运动以 steps(6, end) 逐帧播放（每帧 0.15 秒），角色眨眼、抬手各占 4 帧；镜头每 2 秒轻微跳切一次机位（位移 5%）；整体如逐格拍下的黏土偶动画，质朴笨拙而生动。'
  },
  {
    slug: 'cutout-paper',
    name: '剪纸分层',
    nameEn: 'Paper Cutout',
    category: '手绘动画',
    description: '多层彩纸景深叠放，边缘投影营造立体剪纸舞台，适合节日祝福与民俗故事。',
    tags: '剪纸,分层,投影,民俗',
    palette: '#f7f2e7,#d64541,#2f6690,#f2c14e',
    sourceRepo: 'huashu-art-motion',
    difficulty: '入门',
    starterPrompt: '用 HTML+CSS 制作剪纸分层风格动画：背景暖白 #f7f2e7，前景剪纸用正红 #d64541、深蓝 #2f6690 与明黄 #f2c14e，分五层沿 Z 轴错开，每层配 box-shadow: 0 6px 12px rgba(0,0,0,0.25) 制造纸层投影；镜头横移时各层以不同速度位移形成视差（前景 60px 每秒、背景 12px 每秒）；云纹与花朵 1.5 秒依次展开，缓动 cubic-bezier(0.22,1,0.36,1)，像缓缓拉开的纸艺舞台。'
  },
  {
    slug: 'flat-mg',
    name: '扁平MG动画',
    nameEn: 'Flat Motion Graphics',
    category: 'MG 动效',
    description: '明快扁平色块与简约图形语言，动作干脆利落，适合产品演示与知识科普。',
    tags: '扁平,MG,色块,演示',
    palette: '#f4f4f6,#ff6b6b,#4ecdc4,#45b7d1',
    sourceRepo: 'mg-styles-15',
    difficulty: '入门',
    starterPrompt: '制作一支扁平 MG 动画风格短视频：背景浅灰 #f4f4f6，图形元素用珊瑚红 #ff6b6b、青绿 #4ecdc4 与天蓝 #45b7d1 纯色扁平色块，无渐变无描边；元素入场统一 0.5 秒（translateY 30px 到 0 加淡入，缓动 cubic-bezier(0.22,1,0.36,1)）；图形间以 0.3 秒形变衔接（圆变方用 border-radius 过渡）；每个动作严格落在 0.5 秒节拍上，节奏明快，适合 15 秒产品功能讲解。'
  },
  {
    slug: 'line-draw-mg',
    name: '描边手绘MG',
    nameEn: 'Line Draw Motion',
    category: 'MG 动效',
    description: '单线描边自绘成形，线端圆点强调重点，黑底亮线对比强，适合流程图解。',
    tags: '描边,线稿,图解,黑底',
    palette: '#101014,#f5f5f5,#ffd166,#06d6a0',
    sourceRepo: 'mg-styles-15',
    difficulty: '入门',
    starterPrompt: '用 HTML+CSS 制作描边手绘 MG 风格动画：背景近黑 #101014，所有图形以 3px 亮白 #f5f5f5 描边呈现，重点节点用明黄 #ffd166 圆点标记，完成态路径用薄荷绿 #06d6a0 点亮；流程各节点线条依次以 stroke-dashoffset 0.8 秒描绘显现，节点间连线 0.4 秒延伸补齐；文字标签在所属节点完成后 0.3 秒淡入；整体一气呵成，像有人在黑板上边画边讲。'
  },
  {
    slug: 'geo-shapes',
    name: '几何图形律动',
    nameEn: 'Geometric Rhythm',
    category: 'MG 动效',
    description: '圆方三角随节拍旋转缩放，三色循环律动，适合音乐可视化与节奏感开场。',
    tags: '几何,律动,节拍,阵列',
    palette: '#111114,#f94144,#f9c74f,#43aa8b',
    sourceRepo: 'mg-styles-15',
    difficulty: '入门',
    starterPrompt: '制作一支几何图形律动风格短视频：背景炭黑 #111114，用红 #f94144、黄 #f9c74f、绿 #43aa8b 三色的圆、方、三角组成 4x4 阵列；每 0.5 秒节拍随机一组图形做 rotate(90deg) 与 scale(1.2) 的弹性变换（0.45 秒，缓动 cubic-bezier(0.34,1.56,0.64,1)），颜色同时在三色间轮转；每 4 拍阵列整体做一次自左向右的波浪缩放；节奏如电子鼓点般精准，适合音乐可视化。'
  },
  {
    slug: 'dataviz-motion',
    name: '数据可视化动效',
    nameEn: 'Data Viz Motion',
    category: 'MG 动效',
    description: '深色看板与发光数据流，图表随数字滚动生长，适合年度报告与数据宣传。',
    tags: '数据可视化,图表,深色,增长',
    palette: '#0f1117,#00c48c,#ffd166,#7a5cff',
    sourceRepo: 'mg-styles-15',
    difficulty: '进阶',
    starterPrompt: '用 HTML+CSS 制作数据可视化动效短视频：背景深蓝黑 #0f1117，图表主色用荧光绿 #00c48c 与紫罗兰 #7a5cff，关键数值用明黄 #ffd166 强调；柱状图各柱依次在 1 秒内从零高度生长（每柱延迟 0.12 秒，缓动 cubic-bezier(0.22,1,0.36,1)），柱顶数字同步滚动累加；折线以 stroke-dashoffset 1.5 秒描画，末端做发光脉冲；整体如一块呼吸着的数据大屏。'
  },
  {
    slug: 'icon-rhythm',
    name: '图标律动',
    nameEn: 'Icon Rhythm',
    category: 'MG 动效',
    description: '线性图标逐个弹入并随节拍微动，撞色明快，适合功能列表与 App 宣传。',
    tags: '图标,弹入,节拍,列表',
    palette: '#12141c,#ff7847,#3ddc97,#f5d33c',
    sourceRepo: 'mg-styles-15',
    difficulty: '入门',
    starterPrompt: '制作一支图标律动风格短视频：背景深蓝 #12141c，六枚 2.5px 描边的线性图标横向排布，分别以橘 #ff7847、绿 #3ddc97、黄 #f5d33c 轮转着色；图标依次弹入（scale 0 到 1.15 再回 1，0.35 秒，间隔 0.2 秒，缓动 cubic-bezier(0.34,1.56,0.64,1)）；整排落定后随节拍做 4% 幅度的呼吸缩放；对应功能文字在图标落定 0.2 秒后上滑淡入，节奏轻快如指尖敲击键盘。'
  },
  {
    slug: 'liquid-morph',
    name: '液态形变',
    nameEn: 'Liquid Morph',
    category: 'MG 动效',
    description: '有机 blob 形态流动融合，色彩如液体相互渗透，适合音乐可视化与潮流转场。',
    tags: '液态,形变,有机,流动',
    palette: '#0b0e14,#ff5e78,#5ee7df,#c084fc',
    sourceRepo: 'mg-styles-15',
    difficulty: '专业',
    starterPrompt: '用 HTML+CSS 制作液态形变风格短视频：背景深墨蓝 #0b0e14，主体为三枚大尺寸不规则 blob，分别使用品红 #ff5e78、水青 #5ee7df 与雾紫 #c084fc；用 8 值 border-radius 动画在 4 秒内循环改变形态，各 blob 相位错开 0.7 秒形成流动感；两两交叠区域用 mix-blend-mode: screen 融合出新色彩；整体运动缓慢粘稠，如三股颜料在水中缓缓交融。'
  },
  {
    slug: 'isometric-3d',
    name: '等距3D城市',
    nameEn: 'Isometric 3D',
    category: '三维立体',
    description: '45 度轴测视角的微缩城市街区，模块化积木建筑，适合园区展示与游戏叙事。',
    tags: '等距,轴测,微缩,城市',
    palette: '#1a2035,#ff9770,#68c4c9,#ffd670',
    sourceRepo: 'lemo-opuscar',
    difficulty: '专业',
    starterPrompt: '制作一支等距 3D 城市风格短视频：背景藏青 #1a2035，建筑模块用珊瑚橙 #ff9770、青蓝 #68c4c9 与暖黄 #ffd670，以 transform: rotateX(60deg) rotateZ(45deg) 搭建 6x6 轴测网格；城市按街区依次生长，每栋楼 0.6 秒从 scale 0 弹起（缓动 cubic-bezier(0.34,1.56,0.64,1)，按距离递增 0.1 秒延迟）；小车辆沿街道匀速循环穿行，路灯逐盏点亮，如一座苏醒的积木微缩世界。'
  },
  {
    slug: 'glass-3d',
    name: '玻璃拟态3D',
    nameEn: 'Glassmorphism 3D',
    category: '三维立体',
    description: '半透明磨砂玻璃层与柔和光晕折射，紫青渐变，适合科技发布会与 UI 概念展示。',
    tags: '玻璃拟态,磨砂,光晕,科技',
    palette: '#111119,#c4b5fd,#f0abfc,#67e8f9',
    sourceRepo: 'lemo-opuscar',
    difficulty: '专业',
    starterPrompt: '用 HTML+CSS 制作玻璃拟态 3D 风格短视频：背景深紫黑 #111119，叠加 #c4b5fd 到 #67e8f9 的径向渐变光斑；多层玻璃卡片（backdrop-filter: blur(20px)，1px 半透明白描边）在 3D 空间错落排布，入场时各自 0.8 秒从 rotateY(35deg) 归位浮起（缓动 cubic-bezier(0.22,1,0.36,1)）；卡片整体以 6 秒周期做 6px 幅度上下悬浮，边缘高光以 #f0abfc 流动扫过，通透而未来。'
  },
  {
    slug: 'low-poly',
    name: '低多边形几何',
    nameEn: 'Low Poly',
    category: '三维立体',
    description: '三角面片拼接的棱角质感，受光面深浅分明，适合游戏宣发与几何风科普。',
    tags: '低多边形,三角面,棱角,游戏',
    palette: '#141b24,#e76f51,#2a9d8f,#e9c46a',
    sourceRepo: 'lemo-opuscar',
    difficulty: '进阶',
    starterPrompt: '制作一支低多边形几何风格短视频：背景深蓝灰 #141b24，主体山体与动物由三角面片拼接，用陶红 #e76f51、青绿 #2a9d8f、沙黄 #e9c46a 三色系渲染，每个三角面按受光角度在 60% 至 100% 透明度间分四档；主体以 3 秒逐批点亮成形（每批 12 个面，间隔 0.12 秒淡入）；完成后镜头 4 秒环绕 15 度展示棱角切面，节奏干脆利落，游戏宣发味十足。'
  },
  {
    slug: 'clay-3d',
    name: '软萌3D渲染',
    nameEn: 'Soft 3D Render',
    category: '三维立体',
    description: '圆润软材质与奶油漫反射，柔软哑光质感，适合母婴品牌与治愈系 IP 展示。',
    tags: '软萌,圆润,哑光,治愈',
    palette: '#f7e8d5,#f4a259,#5b8e7d,#bc4b51',
    sourceRepo: 'lemo-opuscar',
    difficulty: '专业',
    starterPrompt: '用 HTML+CSS 制作软萌 3D 渲染风格动画：背景奶油米 #f7e8d5，主体角色用杏橙 #f4a259 的圆润造型，配鼠尾草绿 #5b8e7d 与砖红 #bc4b51 小物件点缀；所有圆形元素叠加多层柔和投影（box-shadow: 0 10px 30px rgba(0,0,0,0.12)）与顶部椭圆高光，模拟软质漫反射；角色入场做 0.8 秒果冻弹跳（scale 从 0.6 弹到 1.15 再回 1），随后每 3 秒做 6% 幅度呼吸，软糯治愈。'
  },
  {
    slug: 'vaporwave',
    name: '蒸汽波',
    nameEn: 'Vaporwave',
    category: '复古怀旧',
    description: '紫粉霓虹网格地平线与石膏雕像，复古界面混搭，适合电子音乐与潮流内容。',
    tags: '蒸汽波,霓虹,网格,复古未来',
    palette: '#1a0b2e,#ff71ce,#01cdfe,#05ffa1',
    sourceRepo: 'lemo-opuscar',
    difficulty: '进阶',
    starterPrompt: '制作一支蒸汽波风格短视频：背景深紫 #1a0b2e，向地平线透视延伸的网格线用亮粉 #ff71ce 与电蓝 #01cdfe 发光呈现（perspective: 600px，网格间距 60px，8 秒匀速向观察者滚动）；中央希腊柱剪影以薄荷绿 #05ffa1 描边并缓慢自转；画面混入一个 Windows 95 风格小窗口 0.3 秒弹入；标题文字用衬线体水平拉伸 120%，慵懒迷幻。'
  },
  {
    slug: 'pixel-art',
    name: '像素艺术',
    nameEn: 'Pixel Art',
    category: '复古怀旧',
    description: '8-bit 像素颗粒与有限调色板，逐帧跳跃动画，适合独立游戏宣发与街机复古内容。',
    tags: '像素,8bit,复古,游戏',
    palette: '#1a1c2c,#ffcd75,#ef7d57,#38b764',
    sourceRepo: 'ClaudeAnimationBase',
    difficulty: '入门',
    starterPrompt: '用 HTML+CSS 制作像素艺术风格动画：背景深夜蓝 #1a1c2c，所有图形以 16x16 像素网格绘制（每像素渲染为 12px 方块，image-rendering: pixelated），主要使用沙金 #ffcd75、赤陶 #ef7d57 与草绿 #38b764 有限调色板；角色行走以 steps(4) 每 0.2 秒切帧；跳跃做 0.5 秒抛物线位移（上升 48px 后落下）；背景云朵缓慢平移、星星 1 秒周期闪烁，复古街机味十足。'
  },
  {
    slug: 'crt-tv',
    name: '老式CRT电视',
    nameEn: 'Retro CRT',
    category: '复古怀旧',
    description: '荧光绿单色屏与扫描线，画面曲率与频闪噪点，适合黑客题材与复古监控叙事。',
    tags: 'CRT,扫描线,荧光绿,频闪',
    palette: '#0a0f0a,#33ff66,#1a3d1f,#c0c8c0',
    sourceRepo: 'lemo-opuscar',
    difficulty: '进阶',
    starterPrompt: '制作一支老式 CRT 电视风格动画：屏幕底色深黑绿 #0a0f0a，文字与图形用荧光绿 #33ff66 并叠加 text-shadow: 0 0 8px 同色辉光；全屏覆盖 repeating-linear-gradient 扫描线（2px 间隔、50% 透明度），一条 8% 亮度的水平亮带 4 秒循环下滚；开场做 0.4 秒「中央亮线撑开全屏」的开机动画；内容以终端逐行输出、光标 1 秒周期闪烁，80 年代机房味拉满。'
  },
  {
    slug: 'vhs',
    name: 'VHS录像带',
    nameEn: 'VHS Tape',
    category: '复古怀旧',
    description: '色度漂移与磁带噪点条纹，画面撕裂抖动，适合怀旧 MV 与录像风 Vlog 片头。',
    tags: 'VHS,色偏,噪点,怀旧',
    palette: '#0f0f14,#ff3864,#3dcd58,#ffd6e0',
    sourceRepo: 'lemo-opuscar',
    difficulty: '进阶',
    starterPrompt: '用 HTML+CSS 制作 VHS 录像带风格短视频：背景暗黑 #0f0f14，主体画面做 RGB 色度分离，红 #ff3864 与绿 #3dcd58 图层各偏移 2px 混合；水平噪点条纹带每 0.8 秒随机改变高度滚动一次，画面整体每 2 秒垂直跳动 3px；左上角显示粉白 #ffd6e0 的 PLAY 三角与闪烁 REC 红点，底部时间码逐秒跳动；磁带画质与怀旧氛围直接拉满。'
  },
  {
    slug: 'kinetic-typography',
    name: '动态文字版式',
    nameEn: 'Kinetic Typography',
    category: '版式文字',
    description: '文字本身即主角，大小粗细随语义节奏变化，适合金句传播与歌词 MV 宣传。',
    tags: '动态文字,版式,节奏,金句',
    palette: '#0c0c0d,#f8f8f2,#f5d90a,#ff4d3d',
    sourceRepo: 'awesome-opus5-5-videos',
    difficulty: '入门',
    starterPrompt: '制作一支动态文字版式短视频：背景炭黑 #0c0c0d，正文用米白 #f8f8f2 的无衬线特粗黑体，强调词用亮黄 #f5d90a 或警报红 #ff4d3d；文字逐词入场，普通词 0.3 秒淡入上移，关键词 0.25 秒砸入（scale 1.6 到 1，缓动 cubic-bezier(0.22,1,0.36,1)）并带整行 1 度倾斜；每 2 秒完成一行，行间以 0.15 秒快切转换；节奏如演讲般抑扬顿挫，适合金句传播。'
  },
  {
    slug: 'editorial-type',
    name: '杂志编辑排版',
    nameEn: 'Editorial Layout',
    category: '版式文字',
    description: '大标题衬线与小号注释混排，网格分栏与大量留白，适合人文访谈与品牌年报。',
    tags: '编辑排版,衬线,分栏,留白',
    palette: '#f6f3ee,#171717,#c8331f,#8a8578',
    sourceRepo: 'lemo-opuscar',
    difficulty: '进阶',
    starterPrompt: '用 HTML+CSS 制作杂志编辑排版风格动画：背景纸白 #f6f3ee，超大衬线标题用墨黑 #171717（96px，Playfair Display），首字下沉以红 #c8331f 强调；正文双栏排布，注释用灰褐 #8a8578 小号字；元素如翻页般入场，标题 0.8 秒自左上裁切显现，双栏文本 1 秒逐段淡入（每段延迟 0.15 秒），一幅配图 0.5 秒淡入收尾；整体优雅克制，像一本缓缓打开的人文杂志。'
  },
  {
    slug: 'terminal-hacker',
    name: '终端代码风',
    nameEn: 'Terminal Hacker',
    category: '版式文字',
    description: '黑客帝国式绿字终端与逐行命令输出，光标闪烁，适合极客内容与发布倒计时。',
    tags: '终端,代码,绿字,极客',
    palette: '#050807,#00ff41,#0fd714,#c0c8c0',
    sourceRepo: 'hyperframes',
    difficulty: '入门',
    starterPrompt: '制作一支终端代码风短视频：背景纯黑 #050807，全部文字用黑客绿 #00ff41 的等宽字体（JetBrains Mono），提示符与高亮用亮绿 #0fd714，注释用灰绿 #c0c8c0；模拟终端逐行输出，每条命令 0.4 秒打字机输入后 0.2 秒回车执行；进度条 2 秒从 0% 走到 100%（每 5% 一格）；结尾光标以 1 秒周期持续闪烁，叠加扫描线微光，极客感直接拉满。'
  }
]

export interface PromptSeed {
  title: string
  category: string
  content: string
  tags: string
  sourceRepo: string
  useCase: string
}

export const promptSeeds: PromptSeed[] = [
  {
    title: '硬币坠落转场灵感',
    category: '一句话灵感',
    content: '硬币从特写坠落，落地弹起的瞬间切换至产品特写，音效与弹跳严格卡点。',
    tags: '转场,卡点,特写,开场',
    sourceRepo: 'awesome-opus5-5-videos',
    useCase: '需要一个惊艳的开场转场钩子时直接取用改造。'
  },
  {
    title: '咖啡倒流悬念开场',
    category: '一句话灵感',
    content: '咖啡打翻瞬间画面倒放，液体回流成杯，字幕「如果一切可以重来」引出产品。',
    tags: '倒放,悬念,开场,反转',
    sourceRepo: 'awesome-opus5-5-videos',
    useCase: '适合悬念向品牌片与反转类短视频的开场。'
  },
  {
    title: '城市延时日夜轮回',
    category: '一句话灵感',
    content: '固定机位延时浓缩昼夜循环，霓虹亮起的刹那品牌 logo 随之浮现于天际线。',
    tags: '延时,城市,logo,氛围',
    sourceRepo: 'awesome-opus5-5-videos',
    useCase: '适合城市宣传与时间概念类短片的意象开场。'
  },
  {
    title: '拆快递第一视角开场',
    category: '一句话灵感',
    content: '第一视角双手拆开快递纸箱，掀盖瞬间高光爆发，产品悬浮缓缓升起亮相。',
    tags: '第一视角,开箱,产品亮相',
    sourceRepo: 'awesome-opus5-5-videos',
    useCase: '适合开箱测评与电商种草视频的开场设计。'
  },
  {
    title: '掌心宇宙无限缩放',
    category: '一句话灵感',
    content: '镜头从摊开的掌心特写无限缩小，皮肤纹理化作星云，散成品牌色粒子。',
    tags: '缩放,宇宙,概念,粒子',
    sourceRepo: 'awesome-opus5-5-videos',
    useCase: '适合科技品牌宏观叙事与概念片的开场。'
  },
  {
    title: '键盘卡点闪白开场',
    category: '一句话灵感',
    content: '特写镜头逐键敲击卡点，回车键落下时全屏闪白，标题伴随重音砸入画面。',
    tags: '卡点,闪白,节奏,开场',
    sourceRepo: 'awesome-opus5-5-videos',
    useCase: '适合效率工具类产品与节奏感强的开场。'
  },
  {
    title: '白纸折叠功能变形记',
    category: '一句话灵感',
    content: '一张白纸连续对折翻面，每次展开都变成新的产品功能示意图，最终折成产品。',
    tags: '折纸,变形,功能演示',
    sourceRepo: 'awesome-opus5-5-videos',
    useCase: '适合功能清单展示与轻量交互演示短片。'
  },
  {
    title: '影子先行悬念开场',
    category: '一句话灵感',
    content: '人物尚未入画，影子已先斜投进空镜头，脚步声渐近制造悬念后主角入镜。',
    tags: '影子,悬念,叙事,开场',
    sourceRepo: 'awesome-opus5-5-videos',
    useCase: '适合剧情短片与悬疑氛围的开场铺陈。'
  },
  {
    title: '雨滴冲刷logo揭示',
    category: '一句话灵感',
    content: '蒙尘玻璃上雨滴汇聚滑落，冲刷出的轨迹恰好勾勒出 logo 轮廓，随即点亮。',
    tags: 'logo揭示,雨水,氛围',
    sourceRepo: 'awesome-opus5-5-videos',
    useCase: '适合品牌 logo 揭示与雨天情绪短片。'
  },
  {
    title: '月台离别一镜到底',
    category: '一句话灵感',
    content: '空旷车站月台一镜到底，全景缓推至车窗，主角侧脸倒影与飞逝风景重叠。',
    tags: '一镜到底,月台,情感',
    sourceRepo: 'awesome-opus5-5-videos',
    useCase: '适合情感叙事与离别主题的文艺短片。'
  },
  {
    title: '产品发布三幕递进模板',
    category: '完整模板',
    content: '开场 3 秒呈现{痛点场景}的抓马画面后黑场，打出问题句「{核心疑问}」；中段 8 秒用三个快切镜头演示{产品名}逐一化解{痛点一}{痛点二}{痛点三}，每个镜头配一句不超过 12 字的大字卖点；结尾 4 秒{产品名} logo 弹入（scale 1.6 到 1，0.4 秒），配行动号召「{cta 文案}」。节奏先抑后扬，音乐在第二幕起扬。',
    tags: '产品发布,三幕式,模板',
    sourceRepo: 'shipvideo',
    useCase: '新品发布视频可直接填空成片，适合 15 秒竖屏。'
  },
  {
    title: '一镜到底空间漫游模板',
    category: '完整模板',
    content: '制作一支{时长}秒一镜到底短片：镜头从{起点场景}出发，以约每秒 1 米的速度前推，途中依次经过{场景A}{场景B}{场景C}，每个场景停留约 2 秒并让一个细节元素（{元素一}{元素二}{元素三}）动起来充当路标；镜头运动匀滑，缓动统一 cubic-bezier(0.4,0,0.2,1)；最终停在{终点主体}特写上，浮现{主题文案}，全程无硬切。',
    tags: '一镜到底,漫游,运镜',
    sourceRepo: 'onetake',
    useCase: '园区、门店或品牌空间的沉浸式介绍短片。'
  },
  {
    title: '品牌宣传情绪曲线模板',
    category: '完整模板',
    content: '一支{时长}秒品牌情绪片：前 25% 用冷色调呈现{现实困境}，配低沉环境音；25% 至 60% 处{品牌符号}首次出现，色温由 #1c2b33 渐变至 #caa472 转暖；60% 至 85% 蒙太奇快剪{使用场景一}{使用场景二}{使用场景三}，每个 1.5 秒；最后定格{品牌名}与{slogan}，配一记定音鼓。音乐从 60 BPM 渐升至 120 BPM，情绪随速度爬坡。',
    tags: '品牌片,情绪曲线,蒙太奇',
    sourceRepo: 'opus-video-prompts',
    useCase: '品牌形象片与年度主题宣传片的骨架模板。'
  },
  {
    title: '知识科普问题解答模板',
    category: '完整模板',
    content: '制作{主题}科普短视频：开场 3 秒抛出反常识问题「{问题}」并给出 A、B 两个选项悬停；正片分三段解释，每段配一个手绘图标动画与一句不超过 15 字的结论字幕；中段插入 5 秒生活案例（{案例场景}）；结尾用一张对比表总结{要点一}{要点二}{要点三}，最后反转揭示正确答案是{答案}，并留一句引导关注的钩子。',
    tags: '科普,设问,反转,模板',
    sourceRepo: 'opus-video-prompts',
    useCase: '知识类账号做单点科普的通用结构。'
  },
  {
    title: '用户证言前后对比模板',
    category: '完整模板',
    content: '一支 30 秒用户故事片：前 10 秒{用户身份}在{旧方案}下的困扰（手持晃动镜头、冷色 #404040 调）；中 10 秒切换{产品名}后的改变（稳定滑轨镜头、暖色 #fbbf24 高光）；后 10 秒用户面对镜头说出金句「{证言金句}」，底部滚动{数据指标一}{数据指标二}{数据指标三}三组增长数字。剪辑点全部落在节拍上，冷暖对比即叙事。',
    tags: '用户证言,对比,故事',
    sourceRepo: 'shipvideo',
    useCase: '客户案例与转化导向的用户见证短片。'
  },
  {
    title: '功能演示三步上手模板',
    category: '完整模板',
    content: '制作{功能名}演示短视频：第一步 5 秒演示{操作一}，光标以 1.5 倍放大高亮圈引导；第二步 5 秒演示{操作二}，步骤列表以描边动画逐项打勾；第三步 5 秒展示{最终成果}，画面缩放庆祝动效加彩带粒子；结尾出{产品名}与「三步搞定」字样。每步转场用 0.3 秒左滑过渡，屏幕操作速度提升 1.2 倍避免拖沓。',
    tags: '功能演示,分步,录屏',
    sourceRepo: 'opus-video-prompts',
    useCase: 'SaaS 新功能上线与教程视频的演示骨架。'
  },
  {
    title: '活动预告倒数开场模板',
    category: '完整模板',
    content: '制作{活动名}预告片：开场 5 秒快速闪回往届精彩瞬间，每帧 0.4 秒硬切；随后黑场出现数字倒数 3、2、1，每个数字 0.8 秒弹跳缩放（scale 0.5 到 1.2 再回 1，缓动 cubic-bezier(0.34,1.56,0.64,1)）；倒数结束闪白切至{活动名}主视觉，底部浮现{时间}与{地点}信息条，配一记重低音收尾。',
    tags: '活动预告,倒数,闪白',
    sourceRepo: 'onetake',
    useCase: '大会、发布会与直播活动的倒计时预热片。'
  },
  {
    title: '数据故事增长叙事模板',
    category: '完整模板',
    content: '一支{时长}秒数据故事片：开场巨大数字「{核心数据}」砸入画面（scale 1.8 到 1，0.3 秒）；镜头拉近数字内部，粒子流重组为{增长曲线}描边动画（2 秒）；中段三个数据节点依次点亮，各配一句解读字幕；结尾曲线冲出画面右缘，出{品牌名}与{slogan}。背景保持深色 #0f1117，数据线用荧光绿 #00c48c，强调节点用 #ffd166。',
    tags: '数据故事,增长,深色',
    sourceRepo: 'shipvideo',
    useCase: '年度总结、融资战报与增长发布场景。'
  },
  {
    title: '参考图风格分析指令',
    category: '参考图驱动',
    content: '请分析这张参考图：1. 提取 4 个主色 hex 值并说明明暗面积占比；2. 描述构图方式（三分法、居中或对角线）与视觉焦点位置；3. 判断光线方向与软硬、阴影浓度；4. 总结质感关键词（颗粒、磨砂、玻璃、哑光等）。输出一份可直接用于视频制作的风格卡片，注明每个结论的置信度。',
    tags: '风格分析,配色,构图',
    sourceRepo: 'ReelMimic',
    useCase: '拿到心仪参考图后先跑一遍，输出风格拆解。'
  },
  {
    title: '参考图配色复刻指令',
    category: '参考图驱动',
    content: '以这张{参考图类型}为风格基准制作 10 秒短视频：严格沿用其主色{主色一}{主色二}{主色三}与光线氛围，主体替换为{新主体}；首帧复刻参考图构图，随后镜头 4 秒内缓慢推近 8%，主体做一次符合原画气质的微动作；全程保持与原图一致的颗粒度与景深虚化，不得引入调色板之外的新颜色。',
    tags: '配色复刻,参考图,风格迁移',
    sourceRepo: 'ReelMimic',
    useCase: '需要对标某张图气质做同风格新内容时。'
  },
  {
    title: '参考视频运镜拆解指令',
    category: '参考图驱动',
    content: '请逐镜头拆解这条参考视频：标出每个镜头的时长、景别（特写、中景、全景）、运镜方式（推、拉、摇、移、环绕）与速度曲线；分析转场点与音乐节拍的对应关系（预判、同步或滞后几帧）；统计全片平均镜头长度与最快剪辑段。最后输出一张分镜表，供我在新题材中复用这套节奏骨架。',
    tags: '运镜拆解,分镜,节奏',
    sourceRepo: 'ReelMimic',
    useCase: '想复刻爆款视频节奏但换题材拍摄时。'
  },
  {
    title: '海报版式动态迁移指令',
    category: '参考图驱动',
    content: '参照这张海报的版式制作动态版：保留其标题字号层级（主标题约占画面高度 30%）、字体气质与留白比例；静态图形元素转为 2 秒入场动效（自下方 40px 淡入上移，缓动 cubic-bezier(0.22,1,0.36,1)）；色彩沿用原图 hex 值，仅在循环节点加入 10% 亮度的微光呼吸，不得破坏原海报的视觉重心。',
    tags: '版式迁移,海报,动态化',
    sourceRepo: 'ReelMimic',
    useCase: '把品牌主视觉海报升级为动态物料时。'
  },
  {
    title: '名画风格转视频指令',
    category: '参考图驱动',
    content: '以{画作名}（{画家}）的视觉语言制作 8 秒短视频：提取画作的{主色描述}三色作为唯一调色板，笔触方向遵循原画的{笔触特征}；镜头以 5% 幅度缓慢推近模拟观展视角，画面边缘保留画框式暗角；中段让画中{动态主体}做一次 2 秒局部动效（风吹、水波或发丝），其余区域保持静止，尊重原画气质。',
    tags: '名画,艺术风格,复刻',
    sourceRepo: 'huashu-art-motion',
    useCase: '美术馆导览、艺术科普与文创联名内容。'
  },
  {
    title: '照片转手绘动画指令',
    category: '参考图驱动',
    content: '将这张{照片主题}照片转化为手绘动画开场：先用铅笔描边风格重绘照片主体轮廓（3px 炭灰线条，SVG 描边动画 2 秒成形），随后色块以水彩晕染方式逐层填充（每层 0.8 秒径向展开）；保留照片原构图与光位，叠加 8% 透明度手绘噪点；结尾定格为完整彩绘，浮现{标题文案}手写字。',
    tags: '照片转绘,手绘,水彩',
    sourceRepo: 'huashu-art-motion',
    useCase: '婚礼、纪念与品牌故事的手绘开场。'
  },
  {
    title: '深夜便利店独白场景',
    category: '长提示词',
    content: '凌晨两点的便利店，主角穿米色风衣独自站在关东煮柜台前。暖黄灯光（#fbbf24）从头顶洒下，冷蓝夜色（#1c2b33）透过起雾的玻璃门渗入，形成冷暖对峙的光影格局。镜头先在店外隔着雾玻璃缓慢推近，入店后切 35mm 中景，在主角抬头的瞬间抓拍特写。货架灯管轻微频闪，蒸汽从热柜袅袅升起。节奏前缓后急：前 4 秒环境铺垫，后 4 秒主角独白金句以逐字浮现的动态字幕呈现。收尾定格在热柜腾起的蒸汽里，字幕「城市再大，总有一盏灯为你亮着」缓缓显影。',
    tags: '便利店,夜景,冷暖对比,独白',
    sourceRepo: 'awesome-opus5-5-videos',
    useCase: '城市情绪短片与深夜食堂类内容的完整场景。'
  },
  {
    title: '清晨城市苏醒延时',
    category: '长提示词',
    content: '黎明时分的城市天际线延时，主体是层叠的楼宇剪影与初升的太阳。环境色从靛蓝 #1c2b33 渐变为金橙 #caa472，云层以 8 倍速流动，街道车灯拉出红色光轨。光影是唯一主角：太阳跃出地平线的 0.5 秒内全画面亮度提升 40%，楼宇玻璃幕墙依次反射金光（每栋错峰 0.2 秒）。镜头固定全景，仅靠画面内部运动推进，营造上帝视角的静穆。节奏舒缓，配 60 BPM 环境音乐，每隔 2 秒完成一次亮度阶梯递进。收尾：镜头缓慢上摇至纯色天空，城市名与日期字幕淡入。',
    tags: '延时,日出,城市,光影',
    sourceRepo: 'awesome-opus5-5-videos',
    useCase: '城市宣传片与自然纪录片的开场大场景。'
  },
  {
    title: '未来实验室产品亮相',
    category: '长提示词',
    content: '洁白无尘的未来实验室，中央悬浮一枚哑光金属产品，四周环绕全息数据环缓慢旋转。环境以冷白 #d1f7ff 为基调，产品轮廓被青色 #05d9e8 的轮廓光勾勒，地面倒影随悬浮微微波动。运镜：开场 2 秒为俯视全景环绕（orbit 30 度），随后 1 秒急速推近至产品 45 度特写（crash zoom），急停带 0.2 秒镜头回弹。节奏卡点：全息环每旋转 90 度释放一圈粒子脉冲，伴随低频音效。收尾：品牌 logo 以激光蚀刻效果出现在金属表面，青光一闪，画面切入黑场出主标语。',
    tags: '实验室,悬浮,环绕,卡点',
    sourceRepo: 'awesome-opus5-5-videos',
    useCase: '科技产品发布与概念机的亮相场景。'
  },
  {
    title: '海边日落告白长镜头',
    category: '长提示词',
    content: '黄昏海滩，两位主角并肩坐在细沙上，远处海面碎金浮动。主体在暖调 #e0a458 的逆光中沐浴，发丝镶上金边，长投影拖向镜头方向。环境：海浪以 0.75 倍速轻缓拍岸，两三只飞鸟剪影横穿画面。运镜：从两人背影全景开始，镜头以 8 秒完成 90 度弧形环绕，过渡到侧脸中景，最终停在四目相对的过肩特写。光影随时间推移：太阳每 2 秒下沉一格，色温从 4000K 滑向 2500K。节奏克制，只保留海浪声与呼吸声。收尾：剪影相拥瞬间画面过曝白闪 0.3 秒，手写体片名浮现。',
    tags: '海边,逆光,长镜头,告白',
    sourceRepo: 'awesome-opus5-5-videos',
    useCase: '情感短片与文旅浪漫题材的核心场景。'
  },
  {
    title: '雪夜列车归途场景',
    category: '长提示词',
    content: '大雪夜的绿皮火车车厢，主角呵着白气靠窗而坐，窗外雪片被车速拉成斜线。主体处于冷蓝夜色 #0d0221 之中，车厢内钨丝灯投下暖橘 #b45309 的光池，主角半张脸恰好落在明暗交界处。运镜：从车厢尽头纵深推近（dolly in，6 秒），穿过晃动的车厢连接处时光影两次明暗交替，最终停在主角凝视窗外的侧脸特写。雪花偶尔贴上玻璃又融成水痕。节奏：铁轨哐当声构成隐含节拍，每 1.5 秒一次轻微镜头晃动与之呼应。收尾：车窗倒影中浮现站名，画面渐隐，字幕「下一站，家」。',
    tags: '雪夜,列车,归途,冷暖',
    sourceRepo: 'awesome-opus5-5-videos',
    useCase: '春运、归乡与情感品牌片的完整场景。'
  },
  {
    title: '木工坊匠心特写场景',
    category: '长提示词',
    content: '老城区的木工坊，六十岁匠人在台灯下雕刻一件榫卯。主体为布满老茧的双手与木屑纷飞的刻刀，浅景深让背景工具墙化为一串暖褐色光斑（#b3402a）。环境音只有刻刀与木头的沙沙声。光影：一盏侧上方暖光（#f4ead5）打出伦勃朗式明暗，木屑在光柱中悬浮飞舞。运镜：开场微距特写刀刃入木 2 秒，随后镜头沿木纹缓慢横移（truck，3 秒）揭示器物全貌，最后拉远（pull out，2 秒）展现匠人专注的神态。节奏缓慢如呼吸。收尾：器物落成瞬间匠人抬头浅笑，背景光斑虚化为片尾字幕的底色。',
    tags: '匠人,特写,微距,暖光',
    sourceRepo: 'awesome-opus5-5-videos',
    useCase: '非遗手艺与品牌匠心叙事的成片级场景。'
  },
  {
    title: '体育馆赛事热血开场',
    category: '长提示词',
    content: '万人体育馆的夜晚赛事开场，主体为球场中央缓缓升起的主队队徽。环境：看台人浪此起彼伏，手机灯光连成星海（#f5d90a 明灭），烟雾在地板低处漫开。光影：顶部灯组一列列逐组点亮（每组 0.2 秒），最终全场爆亮，一束追光锁定队徽。运镜：开场为高空俯瞰全景，5 秒内垂直俯冲至场地中央（crash zoom），急停后环绕队徽一周（orbit，2 秒）。节奏：每次亮灯与鼓点一一对应，一拍一亮。收尾：全场骤暗只留队徽逆光剪影，倒计时 3、2、1 归零，开场哨声与欢呼声同时炸响。',
    tags: '体育,俯冲,灯光,热血',
    sourceRepo: 'awesome-opus5-5-videos',
    useCase: '赛事转播垫片与运动品牌的开场大片。'
  },
  {
    title: '数据中心科技巡礼',
    category: '长提示词',
    content: '深夜的数据中心机房，成千上万台服务器的指示灯如繁星明灭。主体为中央走廊与尽头的主机柜，冷青指示灯 #05d9e8 与深蓝环境 #0f1117 构成一片科技光海。运镜：一镜到底，镜头以恒定速度沿走廊推进（dolly，10 秒），途经的机柜指示灯依次由绿转蓝，仿佛数据被逐一唤醒；最终镜头穿入机柜内部，以微距展示主板上的电光脉冲。节奏：服务器风扇的低频嗡鸣为底，每 2 秒一次灯光波浪式闪烁从走廊头扫到尾。收尾：镜头抵达核心处理器，一次白光爆发，字幕「每秒九万亿次运算」浮现。',
    tags: '机房,一镜到底,科技,低频',
    sourceRepo: 'awesome-opus5-5-videos',
    useCase: '云厂商与算力品牌的科技感叙事场景。'
  },
  {
    title: '咖啡品牌品宣四镜脚本',
    category: '分镜脚本',
    content: '镜头一（特写）：咖啡豆从高处坠入磨豆机，慢动作激起粉末云雾；镜头二（中景）：热水以 120 帧慢速注入滤杯，萃出琥珀色漩涡；镜头三（特写）：液面微距波纹倒映清晨窗光；镜头四（全景）：都市人捧杯微笑，窗外城市苏醒。每镜 3 秒，转场用液体形变衔接，收尾品牌名随最后一缕蒸汽浮现。',
    tags: '咖啡,分镜,慢动作',
    sourceRepo: 'opus-video-prompts',
    useCase: '咖啡与饮品品牌品宣短片直接套用。'
  },
  {
    title: '运动鞋产品五镜脚本',
    category: '分镜脚本',
    content: '镜头一（特写）：鞋底纹路微距呈现，如峡谷地貌起伏；镜头二（中景）：鞋子旋转 180 度，缓动 cubic-bezier(0.22,1,0.36,1)；镜头三（特写）：鞋带自动系紧的机械感动画；镜头四（全景）：跑者起跑瞬间尘土飞扬，低角度仰拍；镜头五（特写）：落地时鞋底回弹的慢动作定格。每镜卡重鼓点切换，收尾出品牌 slogan。',
    tags: '运动鞋,产品,卡点',
    sourceRepo: 'opus-video-prompts',
    useCase: '电商产品大片与球鞋种草视频脚本。'
  },
  {
    title: '街区穿越一镜到底脚本',
    category: '分镜脚本',
    content: '全片一镜到底共 12 秒：镜头从清晨的咖啡杯特写拉起，穿过厨房窗口（速度渐增）；横移掠过晾晒的床单，借床单飘动做遮挡转场；下降汇入街道人流，与人流同速跟拍；跟随一名跑者拐入巷口；最终垂直上升定格在城市全景与朝阳。运镜速度遵循缓入缓出，中途三次借遮挡物自然切换景深，无一次硬切。',
    tags: '一镜到底,街区,遮挡转场',
    sourceRepo: 'onetake',
    useCase: '城市宣传片与生活方式品牌的漫游叙事。'
  },
  {
    title: '新品预热悬念四镜脚本',
    category: '分镜脚本',
    content: '镜头一（特写）：黑暗中一点微光亮起，映出金属边缘的反光；镜头二（特写）：0.5 秒快切三个局部细节，均打高斯光斑遮挡；镜头三（中景）：轮廓光下产品剪影缓慢旋转 90 度；镜头四（全景）：黑场中浮现发布日期倒计时数字，伴随逐渐加速的心跳声。全程不露产品全貌，节奏由慢渐快，悬念拉满后戛然而止。',
    tags: '悬念,预热,倒计时',
    sourceRepo: 'opus-video-prompts',
    useCase: '新品发布会前的预热悬念短片。'
  },
  {
    title: '美食探店种草五镜脚本',
    category: '分镜脚本',
    content: '镜头一（全景）：门头招牌入镜，镜头轻微上摇；镜头二（特写）：招牌菜出锅瞬间热气腾腾的慢动作；镜头三（特写）：筷子夹起拉丝的浅景深画面；镜头四（中景）：店内烟火气与用餐人群氛围；镜头五（特写）：第一口咬下的满足表情与竖起的大拇指。每镜 2 秒，卡轻快 BGM 节拍切换，结尾压店名与定位。',
    tags: '探店,美食,种草',
    sourceRepo: 'pdoom-video',
    useCase: '本地生活探店号与餐饮商家短视频。'
  },
  {
    title: '知识科普图解四镜脚本',
    category: '分镜脚本',
    content: '镜头一（特写）：提问句以动态文字砸入画面，问号图标弹跳；镜头二（中景）：手绘示意图逐笔描绘原理，线条以描边动画成形；镜头三（特写）：三个关键数据以计数器滚动方式依次点亮；镜头四（全景）：结论金句全屏定格，配对勾动效与轻快音效。每镜 4 秒，背景保持浅灰 #f4f4f6，重点色统一用 #ff6b6b。',
    tags: '科普,图解,手绘',
    sourceRepo: 'opus-video-prompts',
    useCase: '图解类知识短视频的分镜骨架。'
  },
  {
    title: '宠物日常治愈四镜脚本',
    category: '分镜脚本',
    content: '镜头一（全景）：午后阳光斜照进客厅，猫在光斑里伸懒腰；镜头二（特写）：猫爪轻拍毛线球，慢动作里毛发飘动；镜头三（中景）：猫追逐光影跳跃，镜头低角度随动；镜头四（特写）：猫蜷缩入睡，呼吸微微起伏，画面渐暗出字幕「和它在一起的第三百六十五天」。全程暖调 #f4a259 氛围光，配轻柔钢琴。',
    tags: '宠物,治愈,日常',
    sourceRepo: 'pdoom-video',
    useCase: '宠物账号日常更新与品牌温情向植入。'
  },
  {
    title: '确定性逐帧渲染指令',
    category: '技术实现',
    content: '使用 Hyperframes 以确定性模式渲染输出 MP4：所有动画时间 t 由帧号驱动（t = frame / fps），严禁 Date.now() 与 Math.random()；需要随机的地方用固定种子伪随机（如 mulberry32(42)）；画布 1080x1920、30fps、共 150 帧；每帧渲染完成后自动截图，最终合成视频，确保在任何机器重跑结果逐像素一致。',
    tags: '确定性,逐帧渲染,可复现',
    sourceRepo: 'hyperframes',
    useCase: '需要可复现、可审计的批量视频渲染任务。'
  },
  {
    title: '可复现时间轴动画指令',
    category: '技术实现',
    content: '用 Hyperframes 搭建时间轴动画：将 6 秒内容拆为 intro、middle、outro 三段，每段声明起止帧号；所有元素属性用纯函数 valueAt(t) 计算而非状态机补间，缓动统一封装 easeOutCubic(t) = 1 - (1-t)^3；在第 0、60、120、179 帧断言关键属性快照一致，保证任意机器渲染结果可复现，最后导出 60fps 序列帧。',
    tags: '时间轴,纯函数,快照',
    sourceRepo: 'hyperframes',
    useCase: '结构化长动画的分段驱动与回归校验。'
  },
  {
    title: 'Remotion卡点视频指令',
    category: '技术实现',
    content: '用 Remotion 实现卡点缩放视频：注册 1920x1080、30fps、时长 8 秒（240 帧）的 composition；定义节拍帧号数组 beats = [15, 45, 75, 105, 135, 165, 195, 225]，在组件里用 useCurrentFrame() 计算与最近节拍的帧差 d，令 scale = 1 + 0.15 * Math.exp(-Math.abs(d) / 6) 得到指数衰减脉冲；节拍命中即弹起约 1.15 倍并在 6 帧内回落，用 npx remotion render 导出 MP4。',
    tags: 'Remotion,卡点,指数衰减',
    sourceRepo: 'remotion-skills',
    useCase: '音乐卡点混剪与节奏化产品演示视频。'
  },
  {
    title: 'Remotion逐字字幕指令',
    category: '技术实现',
    content: '用 Remotion 制作逐字高亮字幕：字幕数据为 [{start, duration, text}] 数组，用 useCurrentFrame() 与 useVideoConfig() 换算当前秒；当前句内按进度计算应亮字符数 n = Math.floor(progress * text.length)，已亮部分用 #00c48c、未亮用 #404040（以 span 切分）；每句入场用 spring({frame, fps, config: {damping: 12}}) 做弹性位移，预览用 npx remotion studio。',
    tags: 'Remotion,字幕,高亮',
    sourceRepo: 'remotion-skills',
    useCase: '歌词视频与课程字幕的逐字着色渲染。'
  },
  {
    title: 'p5.js生成艺术循环指令',
    category: '技术实现',
    content: '用 p5.js 制作 60 秒无缝循环生成艺术：画布 1080x1080，noiseSeed(7) 固定种子保证可复现；绘制 800 个粒子沿柏林噪声场流动，颜色在 #05d9e8 与 #ff2a6d 之间按粒子索引线性插值，透明度随速度变化；phase = (frameCount % 1800) / 1800，让 1800 帧恰好一个相位周期实现首尾无缝；用 saveFrame() 逐帧导出后合成 30fps 视频。',
    tags: 'p5js,生成艺术,无缝循环',
    sourceRepo: 'ClaudeAnimationBase',
    useCase: '背景视觉、展陈屏保与音乐可视化生成。'
  },
  {
    title: '卡拉OK歌词MV实现指令',
    category: '技术实现',
    content: '用 HTML+CSS+JS 实现卡拉OK歌词 MV：将 LRC 歌词解析为 [{time, text}] 数组，audio 元素提供 currentTime 驱动；当前句置顶并整行淡入，已唱部分用 #f5d90a、未唱用 #8a8578，通过 background-clip: text 的渐变宽度每帧更新实现扫色；句末 0.3 秒整行上滑淡出、下一句补位；副歌处歌词随节拍做 scale 1 到 1.08 的脉冲。',
    tags: '卡拉OK,歌词,扫色',
    sourceRepo: 'pdoom-video',
    useCase: '音乐类账号做歌词 MV 与唱跳应援视频。'
  }
]

export interface EffectSeed {
  name: string
  nameEn: string
  category: string
  description: string
  codeSnippet: string
  prompt: string
  sourceRepo: string
  demo: string
}

export const effectSeeds: EffectSeed[] = [
  {
    name: '推近',
    nameEn: 'Push In',
    category: '运镜',
    description: '镜头向主体匀速推进，制造聚焦与轻微压迫感，适合开场引题与重点强调。',
    codeSnippet: '.push-in {\n  animation: pushIn 1.2s cubic-bezier(0.22,1,0.36,1) forwards;\n}\n@keyframes pushIn {\n  from { transform: scale(1); }\n  to { transform: scale(1.15); }\n}',
    prompt: '为容器添加推近运镜：从 scale(1) 推进到 scale(1.15)，时长 1.2 秒，缓动 cubic-bezier(0.22,1,0.36,1)，结束保持末态；将 transform-origin 设在 50% 40% 对准视觉主体，配合轻微透明度渐显，用作开场引题。',
    sourceRepo: 'lemo-opuscar',
    demo: 'zoom'
  },
  {
    name: '拉远',
    nameEn: 'Pull Out',
    category: '运镜',
    description: '镜头缓缓远离主体、揭示全局环境，适合结尾收束与场景全貌交代。',
    codeSnippet: '.pull-out {\n  animation: pullOut 1.5s cubic-bezier(0.22,1,0.36,1) forwards;\n}\n@keyframes pullOut {\n  from { transform: scale(1.25); }\n  to { transform: scale(1); }\n}',
    prompt: '实现拉远运镜：容器从 scale(1.25) 平滑缩回 scale(1)，时长 1.5 秒，缓动 cubic-bezier(0.22,1,0.36,1) 并停在 1；同步叠加透明度 0.85 到 1 的渐显与四周暗角淡出，营造片尾揭示全景的呼吸感。',
    sourceRepo: 'lemo-opuscar',
    demo: 'zoom'
  },
  {
    name: '环绕运镜',
    nameEn: 'Orbit',
    category: '运镜',
    description: '镜头绕主体公转一周做立体展示，适合 3D 物件与角色全方位亮相。',
    codeSnippet: '.orbit-scene {\n  perspective: 900px;\n}\n.orbit-item {\n  animation: orbit 6s linear infinite;\n}\n@keyframes orbit {\n  from { transform: rotateY(0deg) rotateX(-10deg); }\n  to { transform: rotateY(360deg) rotateX(-10deg); }\n}',
    prompt: '父容器设 perspective: 900px，子元素以 6 秒周期做 rotateY 0 到 360 度的匀速环绕并固定 rotateX(-10deg) 俯角；地面投影随旋转同步镜像偏移，营造镜头绕主体公转的立体展示，用于产品全方位亮相。',
    sourceRepo: 'lemo-opuscar',
    demo: 'orbit'
  },
  {
    name: '横移跟拍',
    nameEn: 'Truck',
    category: '运镜',
    description: '镜头横向平稳移动并带动多层视差，营造空间纵深，适合场景漫游叙事。',
    codeSnippet: '.truck-layer { animation: truck 8s linear infinite; }\n.layer-far { animation-duration: 10s; }\n.layer-mid { animation-duration: 6s; }\n.layer-near { animation-duration: 3.5s; }\n@keyframes truck {\n  from { transform: translateX(0); }\n  to { transform: translateX(-120px); }\n}',
    prompt: '实现横移跟拍：远中近三层背景同向 translateX 平移 -120px 但周期不同（10、6、3.5 秒），近层快远层慢形成视差；层间穿插 5% 速度差的过渡层，整体 linear 无限循环，模拟镜头匀速横移的空间感。',
    sourceRepo: 'lemo-opuscar',
    demo: 'parallax'
  },
  {
    name: '手持晃动感',
    nameEn: 'Handheld',
    category: '运镜',
    description: '模拟手持摄影的随机微抖，赋予画面呼吸与纪实感，适合 Vlog 与纪实片段。',
    codeSnippet: '@keyframes handheld {\n  0% { transform: translate(0, 0) rotate(0deg); }\n  25% { transform: translate(3px, -2px) rotate(0.4deg); }\n  50% { transform: translate(-2px, 2px) rotate(-0.3deg); }\n  75% { transform: translate(2px, 1px) rotate(0.2deg); }\n  100% { transform: translate(0, 0) rotate(0deg); }\n}\n.handheld { animation: handheld 0.45s infinite; }',
    prompt: '给画面容器加 0.45 秒循环的手持抖动：位移控制在 3px 内、旋转 0.4 度内，用 5 个错落关键帧模拟掌机不稳感；可再叠 0.2px 轻微模糊与 8% 暗角，纪实感镜头的标配处理。',
    sourceRepo: 'awesome-opus5-5-videos',
    demo: 'shake'
  },
  {
    name: '急速变焦',
    nameEn: 'Crash Zoom',
    category: '运镜',
    description: '极速推进的暴力变焦，一瞬抓住注意力，适合喜剧节拍与悬念揭晓时刻。',
    codeSnippet: '.crash-zoom {\n  animation: crashZoom 0.35s cubic-bezier(0.7,0,0.84,0) forwards;\n}\n@keyframes crashZoom {\n  from { transform: scale(1); }\n  to { transform: scale(1.8); }\n}',
    prompt: '实现急速变焦：0.35 秒内从 scale(1) 冲到 scale(1.8)，缓动用先极快后急停的 cubic-bezier(0.7,0,0.84,0)；结束帧追加 0.1 秒 5% 回弹缩放模拟镜头急停惯性，务必与一记重音效同帧触发。',
    sourceRepo: 'lemo-opuscar',
    demo: 'punch'
  },
  {
    name: '形变转场',
    nameEn: 'Morph',
    category: '转场',
    description: '图形轮廓平滑变形为另一形状完成转场，流畅有机，适合章节切换与话题过渡。',
    codeSnippet: '.morph-blob {\n  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;\n  transition: border-radius 0.8s cubic-bezier(0.22,1,0.36,1),\n    transform 0.8s cubic-bezier(0.22,1,0.36,1);\n}\n.morph-blob.active {\n  border-radius: 30% 70% 70% 30% / 50% 60% 30% 70%;\n  transform: scale(1.05);\n}',
    prompt: '制作形变转场：满屏色块用 8 值 border-radius 在 0.8 秒内从一种有机形态过渡到另一种，缓动 cubic-bezier(0.22,1,0.36,1)；转场中点（约 0.4 秒处）切换底层画面内容并让色块 scale(1.05) 外扩后回收，实现无缝形变切换。',
    sourceRepo: 'mg-styles-15',
    demo: 'morph'
  },
  {
    name: '变焦打击',
    nameEn: 'Zoom Punch',
    category: '转场',
    description: '节拍上的快速缩放冲击，打击感十足，适合卡点混剪与高能时刻强调。',
    codeSnippet: '.zoom-punch {\n  animation: zoomPunch 0.5s cubic-bezier(0.34,1.56,0.64,1);\n}\n@keyframes zoomPunch {\n  0% { transform: scale(1); }\n  40% { transform: scale(1.35); }\n  100% { transform: scale(1); }\n}',
    prompt: '实现变焦打击：每个节拍触发一次 0.5 秒动画，scale 从 1 冲至 1.35（40% 处）再回弹到 1，缓动 cubic-bezier(0.34,1.56,0.64,1)；用 JS 按节拍时间戳移除并重加 class 触发重播，确保每次打击严格压在鼓点上。',
    sourceRepo: 'mg-styles-15',
    demo: 'punch'
  },
  {
    name: '故障切换',
    nameEn: 'Glitch Cut',
    category: '转场',
    description: 'RGB 错位与撕裂噪点的数字故障感，适合科技、电竞与潮流内容转场。',
    codeSnippet: '.glitch { position: relative; animation: glitchShake 0.3s steps(2) infinite; }\n.glitch .layer-red {\n  position: absolute; inset: 0;\n  mix-blend-mode: screen;\n  background: #ff2a6d;\n  transform: translateX(-4px);\n}\n.glitch .layer-cyan {\n  position: absolute; inset: 0;\n  mix-blend-mode: screen;\n  background: #05d9e8;\n  transform: translateX(4px);\n}',
    prompt: '实现故障切换：转场瞬间让主体闪烁 0.3 秒 glitch，红 #ff2a6d 与青 #05d9e8 两层分别偏移 4px 做 screen 混合，容器用 steps(2) 横向撕裂抖动；随机插入 2 帧 clip-path 条带错位切片，科技感与危险感拉满。',
    sourceRepo: 'mg-styles-15',
    demo: 'glitch'
  },
  {
    name: '擦除揭示',
    nameEn: 'Wipe Reveal',
    category: '转场',
    description: '遮罩沿直线扫过揭示新画面，干净利落的经典转场，适合场景与列表切换。',
    codeSnippet: '.wipe {\n  clip-path: inset(0 100% 0 0);\n  animation: wipeIn 0.7s cubic-bezier(0.22,1,0.36,1) forwards;\n}\n@keyframes wipeIn {\n  to { clip-path: inset(0 0 0 0); }\n}',
    prompt: '制作擦除转场：新画面初始 clip-path: inset(0 100% 0 0) 全遮，0.7 秒内右边界扫至 0 完全揭示，缓动 cubic-bezier(0.22,1,0.36,1)；擦除前沿叠一条 8px 亮色高亮描边跟随扫动，增强轨迹感，适合列表项切换。',
    sourceRepo: 'mg-styles-15',
    demo: 'wipe'
  },
  {
    name: '匹配剪辑',
    nameEn: 'Match Cut',
    category: '转场',
    description: '借形状或动作的相似性衔接两个场景，高级感转场，适合创意混剪与场景跳跃。',
    codeSnippet: '.match-cut {\n  transform-style: preserve-3d;\n  animation: matchFlip 0.6s cubic-bezier(0.22,1,0.36,1);\n}\n@keyframes matchFlip {\n  0% { transform: rotateY(0deg); }\n  50% { transform: rotateY(90deg); }\n  100% { transform: rotateY(0deg); }\n}',
    prompt: '实现匹配剪辑：两个场景共用的相似元素（圆形钟面与圆形车轮等）在 0.6 秒内做 rotateY 0 至 90 至 0 度翻面，翻至 90 度侧面不可见时切换场景内容，缓动 cubic-bezier(0.22,1,0.36,1)；切换前后元素位置与尺寸保持像素级一致。',
    sourceRepo: 'awesome-opus5-5-videos',
    demo: 'flip'
  },
  {
    name: '亮度闪白',
    nameEn: 'Flash Cut',
    category: '转场',
    description: '高亮白闪一瞬掩盖剪辑点，情绪爆发的强力分隔，适合高潮切换与回忆闪回。',
    codeSnippet: '.flash-overlay {\n  position: fixed;\n  inset: 0;\n  background: #ffffff;\n  opacity: 0;\n  pointer-events: none;\n}\n.flash-overlay.on {\n  animation: flash 0.28s ease-out;\n}\n@keyframes flash {\n  0% { opacity: 0.95; }\n  100% { opacity: 0; }\n}',
    prompt: '制作闪白转场：全屏白色遮罩在剪辑点触发，透明度 0.28 秒内从 0.95 衰减到 0（ease-out）；在前 0.1 秒内完成场景硬切，让白闪峰值掩盖切换痕迹；可叠加 5% 高斯模糊同步衰减，模拟过曝余晖。',
    sourceRepo: 'awesome-opus5-5-videos',
    demo: 'flash'
  },
  {
    name: '打字机',
    nameEn: 'Typewriter',
    category: '文字动效',
    description: '文字逐字符键入并伴随光标闪烁，终端既视感，适合代码演示与悬疑叙事。',
    codeSnippet: 'let i = 0;\nconst text = el.dataset.text;\nconst timer = setInterval(() => {\n  i++;\n  el.textContent = text.slice(0, i);\n  if (i >= text.length) clearInterval(timer);\n}, 80);',
    prompt: '实现打字机效果：每 80ms 显示一个字符，用 textContent = text.slice(0, i) 递增更新；句尾跟随 1 秒周期闪烁的竖线光标（透明度 0 与 1 切换）；整句打完停 0.5 秒再开始下一句，多行时保留既有内容向下追加。',
    sourceRepo: 'awesome-opus5-5-videos',
    demo: 'typewriter'
  },
  {
    name: '逐字弹跳',
    nameEn: 'Kinetic Pop',
    category: '文字动效',
    description: '每个字符弹性依次跳入画面，活泼吸睛，适合标题展示与儿童向内容。',
    codeSnippet: '.pop span {\n  display: inline-block;\n  opacity: 0;\n  animation: popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards;\n  animation-delay: calc(var(--i) * 0.05s);\n}\n@keyframes popIn {\n  from { transform: translateY(24px) scale(0.6); opacity: 0; }\n  to { transform: translateY(0) scale(1); opacity: 1; }\n}',
    prompt: '实现逐字弹跳：标题拆成 span 并按序号设 --i 变量，每字符延迟 0.05 秒入场，0.45 秒内从 translateY(24px) scale(0.6) 弹到原位，缓动 cubic-bezier(0.34,1.56,0.64,1)；关键词字符放大 1.3 倍并换强调色。',
    sourceRepo: 'mg-styles-15',
    demo: 'bounce'
  },
  {
    name: '手写描边',
    nameEn: 'Handwriting',
    category: '文字动效',
    description: 'SVG 路径按笔画顺序描绘成形，如真人书写，适合信件旁白与文艺片头。',
    codeSnippet: '.stroke-path {\n  stroke-dasharray: 600;\n  stroke-dashoffset: 600;\n  fill: transparent;\n  animation: draw 2.4s cubic-bezier(0.22,1,0.36,1) forwards;\n}\n@keyframes draw {\n  to { stroke-dashoffset: 0; }\n}',
    prompt: '实现手写描边：文字转为 SVG path 后，设 stroke-dasharray 与 dashoffset 同为路径总长（约 600），2.4 秒内将 offset 归零完成描绘，缓动 cubic-bezier(0.22,1,0.36,1)；多笔画按书写顺序做 0.15 秒级联延迟，笔尖加跟随小圆点。',
    sourceRepo: 'huashu-art-motion',
    demo: 'stroke'
  },
  {
    name: '逐行高亮',
    nameEn: 'Line Highlight',
    category: '文字动效',
    description: '随阅读进度逐行扫亮文字，如荧光笔划重点，适合教程图文与歌词滚动。',
    codeSnippet: '.line { color: #8a8578; transition: color 0.3s ease, background 0.3s ease; }\n.line.lit {\n  color: #171717;\n  background: linear-gradient(transparent 55%, #f5d90a 55%);\n}',
    prompt: '实现逐行高亮：初始文字灰 #8a8578，随朗读进度逐行点亮为 #171717，并在行高 55% 以下叠加 #f5d90a 荧光笔底（linear-gradient 半覆盖实现）；每行 0.3 秒过渡，读完成一行亮一行，节奏与音频时间轴对齐。',
    sourceRepo: 'huashu-art-motion',
    demo: 'highlight'
  },
  {
    name: '3D翻转文字',
    nameEn: 'Flip Text',
    category: '文字动效',
    description: '文字绕轴立体翻转入场，空间感强烈，适合榜单揭晓与数字倒计时。',
    codeSnippet: '.flip-scene { perspective: 800px; }\n.flip-text {\n  backface-visibility: hidden;\n  animation: flipIn 0.7s cubic-bezier(0.22,1,0.36,1) forwards;\n}\n@keyframes flipIn {\n  from { transform: rotateX(-90deg); opacity: 0; }\n  to { transform: rotateX(0deg); opacity: 1; }\n}',
    prompt: '实现 3D 翻转文字：父容器 perspective: 800px，文字从 rotateX(-90deg) 以 0.7 秒翻正到 0 度并淡入，缓动 cubic-bezier(0.22,1,0.36,1)；做数字倒计时时每秒翻面一次，在旋转至 90 度的切换点更换内容并加 backface-visibility: hidden 防穿帮。',
    sourceRepo: 'mg-styles-15',
    demo: 'flip'
  },
  {
    name: '卡点缩放',
    nameEn: 'Beat Zoom',
    category: '节奏',
    description: '画面随音乐节拍同步缩放脉冲，如呼吸般律动，适合混剪与氛围烘托。',
    codeSnippet: 'function beatZoom(beats, frame) {\n  const near = beats.reduce((a, b) =>\n    Math.abs(b - frame) < Math.abs(a - frame) ? b : a);\n  const d = frame - near;\n  const scale = 1 + 0.12 * Math.exp(-Math.abs(d) / 5);\n  return scale;\n}',
    prompt: '实现卡点缩放：预先标注节拍帧号数组，每帧计算与最近节拍的差值 d，按 scale = 1 + 0.12 * Math.exp(-Math.abs(d)/5) 得到峰值 1.12 倍的指数衰减脉冲；节拍命中即弹起、约 5 帧内回落，整段画面随鼓点呼吸。',
    sourceRepo: 'awesome-opus5-5-videos',
    demo: 'pulse'
  },
  {
    name: '呼吸缩放',
    nameEn: 'Breathing',
    category: '节奏',
    description: '极缓的缩放往复如静息呼吸，赋予静帧生命感，适合空镜与冥想氛围。',
    codeSnippet: '.breathing {\n  animation: breathe 3.2s ease-in-out infinite;\n}\n@keyframes breathe {\n  0%, 100% { transform: scale(1); opacity: 0.92; }\n  50% { transform: scale(1.05); opacity: 1; }\n}',
    prompt: '实现呼吸缩放：元素以 3.2 秒周期在 scale(1) 与 scale(1.05) 间往复，缓动 ease-in-out 无限循环；同步叠加透明度 0.92 到 1 的微幅起伏，可在放大相位叠加从 3px 模糊到清晰的过渡，让空镜画面拥有生命感。',
    sourceRepo: 'mg-styles-15',
    demo: 'pulse'
  },
  {
    name: '弹跳入场',
    nameEn: 'Bounce Entry',
    category: '节奏',
    description: '元素从画外坠落触地回弹落定，物理感十足，适合图标与角色入场。',
    codeSnippet: '.bounce-entry {\n  animation: bounceIn 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards;\n}\n@keyframes bounceIn {\n  0% { transform: translateY(-120px); opacity: 0; }\n  60% { transform: translateY(0); opacity: 1; }\n  75% { transform: translateY(-14px); }\n  100% { transform: translateY(0); }\n}',
    prompt: '实现弹跳入场：元素从上方 -120px 坠落，0.8 秒内触底回弹 -14px 再落定，缓动 cubic-bezier(0.34,1.56,0.64,1)；落地瞬间做 scale(1.1, 0.85) 挤压形变并扬起 3 粒尘土圆点淡出，物理感即刻成立。',
    sourceRepo: 'mg-styles-15',
    demo: 'bounce'
  },
  {
    name: '多层视差',
    nameEn: 'Parallax Layers',
    category: '视觉效果',
    description: '多层元素以不同速度随镜头位移，营造 2.5D 纵深，适合漫游与鼠标交互。',
    codeSnippet: '.parallax { perspective: 1000px; }\n.layer { position: absolute; inset: 0; }\n.layer-far { transform: translateZ(-300px); }\n.layer-mid { transform: translateZ(-100px); }\n.layer-near { transform: translateZ(0px); }',
    prompt: '实现多层视差：远中近三层分别设 translateZ(-300px)、(-100px)、(0)，父容器 perspective: 1000px，镜头横移时近快远慢自然成纵深；做鼠标交互版时用 mousemove 位移量乘各层系数 0.2、0.5、1 驱动，限幅 30px。',
    sourceRepo: 'ReelMimic',
    demo: 'parallax'
  },
  {
    name: '粒子漂浮',
    nameEn: 'Particle Drift',
    category: '视觉效果',
    description: '大量微粒随机漂浮明灭，营造氛围与空间感，适合背景烘托与雪絮星尘。',
    codeSnippet: 'const parts = Array.from({ length: 60 }, (_, i) => ({\n  x: (i * 97) % 100,\n  y: (i * 61) % 100,\n  r: 2 + (i % 3),\n  speed: 0.2 + (i % 5) * 0.08\n}));\nfunction drift(p, t) {\n  return { x: p.x + Math.sin(t * p.speed) * 8, y: p.y - t * p.speed };\n}',
    prompt: '实现确定性粒子漂浮：用 (i*97)%100 一类确定性公式生成 60 个粒子（禁用 Math.random），每帧按时间 t 更新，y 匀速上浮、x 做 8px 正弦摆动，透明度随生命周期淡入淡出，出界后从底部重生，保证逐帧渲染可复现。',
    sourceRepo: 'hyperframes',
    demo: 'particles'
  },
  {
    name: '遮罩揭示',
    nameEn: 'Mask Reveal',
    category: '视觉效果',
    description: '以图形轮廓为遮罩逐帧揭示内容，惊喜感十足，适合 logo 亮相与图片揭示。',
    codeSnippet: '.mask-reveal {\n  -webkit-mask-image: radial-gradient(circle at 50% 50%, #000 0%, #000 60%, transparent 72%);\n  -webkit-mask-size: 0% 0%;\n  -webkit-mask-repeat: no-repeat;\n  animation: maskGrow 1.2s cubic-bezier(0.22,1,0.36,1) forwards;\n}\n@keyframes maskGrow {\n  to { -webkit-mask-size: 300% 300%; }\n}',
    prompt: '实现遮罩揭示：内容层用 radial-gradient 圆形遮罩，初始 mask-size 为 0%，1.2 秒内生长到 300% 完整露出，缓动 cubic-bezier(0.22,1,0.36,1)；遮罩圆心锚定 logo 中心，边缘保留 12% 径向羽化，让揭示边界柔和不生硬。',
    sourceRepo: 'mg-styles-15',
    demo: 'wipe'
  },
  {
    name: '动感拖影',
    nameEn: 'Motion Trail',
    category: '视觉效果',
    description: '高速运动物体拖出残影轨迹，强调速度与方向，适合运动集锦与快速转场。',
    codeSnippet: 'const trail = Array.from({ length: 5 }, (_, i) => ({\n  opacity: 0.35 - i * 0.06,\n  offset: (i + 1) * 18,\n  blur: 1 + i * 1.5\n}));',
    prompt: '实现动感拖影：为主运动元素克隆 5 个副本垫在其后方，各副本沿运动反方向偏移 18、36、54、72、90px，透明度从 0.35 依次递减 0.06，模糊从 1px 递增至 7px；每帧更新副本位置紧跟主体，速度感残影即刻成立。',
    sourceRepo: 'remotion-skills',
    demo: 'trail'
  }
]
