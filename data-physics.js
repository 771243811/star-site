/**
 * 物理星图 · 初中物理技能树数据
 * 结构：根 → 四学期（八上~九下，按教材学习顺序）→ 章节 → 技能（叶子）
 * color 定义在学期层：cyan=八上 / violet=八下 / amber=九上 / pink=九下
 */
const PHYSICS_TREE = {
  id: 'root',
  name: '初中物理',
  en: 'JUNIOR PHYSICS',
  desc: '初中物理知识体系，按教材学习顺序（八上 → 九下）横向展开，共 4 学期、22 章、77 项核心技能。',
  children: [
    /* ================= 八年级上册 ================= */
    {
      id: 't8a', name: '八年级上册', en: 'G8 · A', color: 'cyan',
      desc: '从机械运动到质量密度，认识物质世界的基本规律。',
      children: [
        {
          id: 'c8a-motion', name: '机械运动', en: 'Motion', desc: '物理学从运动开始：测量与速度。',
          children: [
            { id: 'motion-measure', name: '长度与时间的测量', en: 'Measurement', desc: '刻度尺与秒表的使用、误差与估读。' },
            { id: 'motion-reference', name: '参照物与运动描述', en: 'Reference', desc: '机械运动、参照物与相对运动。' },
            { id: 'motion-speed', name: '速度与匀速直线运动', en: 'Speed', desc: '速度公式 v=s/t 与匀速直线运动。' },
            { id: 'motion-average', name: '平均速度的测量', en: 'Avg Speed', desc: '测量物体运动的平均速度。' },
          ],
        },
        {
          id: 'c8a-sound', name: '声现象', en: 'Sound', desc: '声音的产生、传播与特性。',
          children: [
            { id: 'sound-produce', name: '声音的产生与传播', en: 'Produce', desc: '振动发声、声速与回声。' },
            { id: 'sound-feature', name: '声音的特性', en: 'Features', desc: '音调、响度与音色。' },
            { id: 'sound-use', name: '声的利用', en: 'Uses', desc: '超声波、次声波与回声定位。' },
            { id: 'sound-noise', name: '噪声的危害与控制', en: 'Noise', desc: '噪声来源与三种控制途径。' },
          ],
        },
        {
          id: 'c8a-state', name: '物态变化', en: 'State Changes', desc: '温度与物质的三种状态转变。',
          children: [
            { id: 'state-temperature', name: '温度与温度计', en: 'Temperature', desc: '摄氏温度与温度计的使用。' },
            { id: 'state-melt', name: '熔化和凝固', en: 'Melt & Freeze', desc: '晶体与非晶体、熔点凝固点。' },
            { id: 'state-vapor', name: '汽化和液化', en: 'Vaporize', desc: '蒸发、沸腾与液化方式。' },
            { id: 'state-sublime', name: '升华与凝华', en: 'Sublimation', desc: '升华凝华现象与吸放热。' },
          ],
        },
        {
          id: 'c8a-light', name: '光现象', en: 'Light', desc: '光的传播、反射、折射与色散。',
          children: [
            { id: 'light-line', name: '光的直线传播', en: 'Straight Line', desc: '光沿直线传播与光速。' },
            { id: 'light-reflect', name: '光的反射与平面镜', en: 'Reflection', desc: '反射定律与平面镜成像。' },
            { id: 'light-refract', name: '光的折射', en: 'Refraction', desc: '折射规律与生活中的折射现象。' },
            { id: 'light-disperse', name: '光的色散', en: 'Dispersion', desc: '白光的色散与物体的颜色。' },
          ],
        },
        {
          id: 'c8a-lens', name: '透镜及其应用', en: 'Lenses', desc: '透镜成像规律及其应用。',
          children: [
            { id: 'lens-basic', name: '透镜与三条特殊光线', en: 'Lens Basics', desc: '凸透镜凹透镜与光路作图。' },
            { id: 'lens-image', name: '凸透镜成像规律', en: 'Imaging', desc: '物距像距与成像性质的关系。' },
            { id: 'lens-eye', name: '眼睛与眼镜', en: 'Eyes & Glasses', desc: '近视眼远视眼及其矫正。' },
          ],
        },
        {
          id: 'c8a-density', name: '质量与密度', en: 'Mass & Density', desc: '质量、密度及其测量。',
          children: [
            { id: 'density-mass', name: '质量与天平', en: 'Mass', desc: '质量概念与天平的使用。' },
            { id: 'density-concept', name: '密度', en: 'Density', desc: '密度公式 ρ=m/V 及其应用。' },
            { id: 'density-measure', name: '密度的测量', en: 'Measure', desc: '测量固体与液体的密度。' },
            { id: 'density-life', name: '密度与社会生活', en: 'In Life', desc: '密度在生活中的应用。' },
          ],
        },
      ],
    },

    /* ================= 八年级下册 ================= */
    {
      id: 't8b', name: '八年级下册', en: 'G8 · B', color: 'violet',
      desc: '力与运动、压强浮力、功与机械，力学世界的全面展开。',
      children: [
        {
          id: 'c8b-force', name: '力', en: 'Force', desc: '力的概念与三种常见力。',
          children: [
            { id: 'force-basic', name: '力与力的作用效果', en: 'Basics', desc: '力的概念、三要素与作用效果。' },
            { id: 'force-elastic', name: '弹力与测力计', en: 'Elasticity', desc: '弹力与弹簧测力计的使用。' },
            { id: 'force-gravity', name: '重力', en: 'Gravity', desc: '重力大小 G=mg 与方向。' },
          ],
        },
        {
          id: 'c8b-motion', name: '运动和力', en: 'Motion & Force', desc: '力与运动的关系，惯性与平衡。',
          children: [
            { id: 'motion-newton', name: '牛顿第一定律与惯性', en: 'Newton 1st', desc: '牛顿第一定律与惯性现象。' },
            { id: 'motion-balance', name: '二力平衡', en: 'Balance', desc: '二力平衡条件与应用。' },
            { id: 'motion-friction', name: '摩擦力', en: 'Friction', desc: '摩擦力的大小与影响因素。' },
          ],
        },
        {
          id: 'c8b-pressure', name: '压强', en: 'Pressure', desc: '固体、液体与气体压强。',
          children: [
            { id: 'pressure-solid', name: '压强与压力作用效果', en: 'Solid Pressure', desc: '压强公式 p=F/S 与增大减小压强。' },
            { id: 'pressure-liquid', name: '液体的压强', en: 'Liquid', desc: '液体压强特点与连通器。' },
            { id: 'pressure-air', name: '大气压强', en: 'Atmosphere', desc: '大气压的存在与测量（托里拆利）。' },
            { id: 'pressure-flow', name: '流体压强与流速', en: 'Fluid Flow', desc: '流速与压强的关系（飞机升力）。' },
          ],
        },
        {
          id: 'c8b-buoyancy', name: '浮力', en: 'Buoyancy', desc: '浮力、阿基米德原理与浮沉。',
          children: [
            { id: 'buoyancy-basic', name: '浮力与阿基米德原理', en: 'Archimedes', desc: '浮力产生原因与阿基米德原理。' },
            { id: 'buoyancy-float', name: '物体的浮沉条件', en: 'Float & Sink', desc: '浮沉条件与受力分析。' },
            { id: 'buoyancy-use', name: '浮力的应用', en: 'Applications', desc: '轮船、潜水艇与密度计。' },
          ],
        },
        {
          id: 'c8b-energy', name: '功和机械能', en: 'Work & Energy', desc: '功、功率与机械能。',
          children: [
            { id: 'energy-work', name: '功', en: 'Work', desc: '做功的两个必要因素与 W=Fs。' },
            { id: 'energy-power', name: '功率', en: 'Power', desc: '功率 P=W/t 与常见功率。' },
            { id: 'energy-kepe', name: '动能与势能', en: 'Kinetic & Potential', desc: '动能、重力势能与弹性势能。' },
            { id: 'energy-convert', name: '机械能及其转化', en: 'Conversion', desc: '动能势能相互转化与守恒。' },
          ],
        },
        {
          id: 'c8b-machine', name: '简单机械', en: 'Simple Machines', desc: '杠杆、滑轮与机械效率。',
          children: [
            { id: 'machine-lever', name: '杠杆', en: 'Lever', desc: '杠杆五要素与平衡条件。' },
            { id: 'machine-pulley', name: '滑轮', en: 'Pulley', desc: '定滑轮动滑轮与滑轮组。' },
            { id: 'machine-efficiency', name: '机械效率', en: 'Efficiency', desc: '有用功总功与机械效率。' },
          ],
        },
      ],
    },

    /* ================= 九年级上册 ================= */
    {
      id: 't9a', name: '九年级上册', en: 'G9 · A', color: 'amber',
      desc: '从热学到电学，进入能量与电路的世界。',
      children: [
        {
          id: 'c9a-internal', name: '内能', en: 'Internal Energy', desc: '分子动理论与内能。',
          children: [
            { id: 'internal-molecule', name: '分子热运动', en: 'Molecules', desc: '扩散现象与分子动理论。' },
            { id: 'internal-energy', name: '内能与热传递', en: 'Energy', desc: '内能、热量与改变内能的方式。' },
            { id: 'internal-capacity', name: '比热容', en: 'Specific Heat', desc: '比热容与 Q=cmΔt 计算。' },
          ],
        },
        {
          id: 'c9a-thermal', name: '内能的利用', en: 'Thermal Use', desc: '热机与能量的转化。',
          children: [
            { id: 'thermal-engine', name: '热机', en: 'Heat Engines', desc: '四冲程汽油机的工作过程。' },
            { id: 'thermal-efficiency', name: '热机的效率', en: 'Efficiency', desc: '热值、热机效率与燃料利用。' },
            { id: 'thermal-conserve', name: '能量的转化与守恒', en: 'Conservation', desc: '能量守恒定律。' },
          ],
        },
        {
          id: 'c9a-circuit', name: '电流和电路', en: 'Circuits', desc: '电荷、电路与电流。',
          children: [
            { id: 'circuit-charge', name: '两种电荷', en: 'Charges', desc: '摩擦起电与电荷相互作用。' },
            { id: 'circuit-current', name: '电流与电路', en: 'Current', desc: '电路组成、电流方向与电路图。' },
            { id: 'circuit-serial', name: '串联与并联', en: 'Series & Parallel', desc: '串并联电路的特点与识别。' },
            { id: 'circuit-measure', name: '电流的测量与规律', en: 'Ammeter', desc: '电流表使用与串并联电流规律。' },
          ],
        },
        {
          id: 'c9a-voltage', name: '电压与电阻', en: 'Voltage & Resistance', desc: '电压、电阻与变阻器。',
          children: [
            { id: 'voltage-basic', name: '电压与电压表', en: 'Voltage', desc: '电压概念与电压表使用。' },
            { id: 'voltage-law', name: '串并联电压规律', en: 'Voltage Law', desc: '串并联电路的电压规律。' },
            { id: 'voltage-resistor', name: '电阻与变阻器', en: 'Resistor', desc: '电阻的影响因素与滑动变阻器。' },
          ],
        },
        {
          id: 'c9a-ohm', name: '欧姆定律', en: "Ohm's Law", desc: '电学核心：电流与电压电阻的关系。',
          children: [
            { id: 'ohm-relation', name: '电流与电压电阻的关系', en: 'Relations', desc: '控制变量法探究 I 与 U、R 的关系。' },
            { id: 'ohm-law', name: '欧姆定律及应用', en: "Ohm's Law", desc: 'I=U/R 及串并联电路计算。' },
            { id: 'ohm-measure', name: '伏安法测电阻', en: 'Measure R', desc: '伏安法测电阻与多次测量。' },
            { id: 'ohm-dynamic', name: '动态电路分析', en: 'Dynamic', desc: '滑动变阻器引起的动态变化。' },
          ],
        },
        {
          id: 'c9a-power', name: '电功率', en: 'Electric Power', desc: '电能、电功率与焦耳定律。',
          children: [
            { id: 'power-energy', name: '电能与电功', en: 'Electric Energy', desc: '电能表与 W=UIt。' },
            { id: 'power-p', name: '电功率', en: 'Power', desc: 'P=UI 与 P=W/t。' },
            { id: 'power-rated', name: '额定功率与测量', en: 'Rated Power', desc: '额定电压功率与测量小灯泡功率。' },
            { id: 'power-joule', name: '焦耳定律', en: "Joule's Law", desc: 'Q=I²Rt 与电热的应用。' },
          ],
        },
      ],
    },

    /* ================= 九年级下册 ================= */
    {
      id: 't9b', name: '九年级下册', en: 'G9 · B', color: 'pink',
      desc: '生活用电、电磁世界与能源，走向现代科技。',
      children: [
        {
          id: 'c9b-life', name: '生活用电', en: 'Household Circuits', desc: '家庭电路与安全用电。',
          children: [
            { id: 'life-circuit', name: '家庭电路', en: 'Home Wiring', desc: '家庭电路的组成与连接。' },
            { id: 'life-overload', name: '电流过大的原因', en: 'Overload', desc: '过载与短路的危害。' },
            { id: 'life-safety', name: '安全用电', en: 'Safety', desc: '触电类型与安全用电原则。' },
          ],
        },
        {
          id: 'c9b-magnet', name: '电与磁', en: 'Magnetism', desc: '磁场、电生磁与磁生电。',
          children: [
            { id: 'magnet-field', name: '磁现象与磁场', en: 'Fields', desc: '磁体、磁极与磁感线。' },
            { id: 'magnet-electric', name: '电生磁与电磁铁', en: 'Electromagnet', desc: '奥斯特实验、安培定则与电磁铁。' },
            { id: 'magnet-motor', name: '磁场对电流的作用', en: 'Motor', desc: '电动机的原理与换向器。' },
            { id: 'magnet-induction', name: '电磁感应与发电机', en: 'Generator', desc: '法拉第电磁感应与发电机原理。' },
          ],
        },
        {
          id: 'c9b-info', name: '信息的传递', en: 'Information', desc: '电话与电磁波通信。',
          children: [
            { id: 'info-telephone', name: '电话与数字通信', en: 'Telephone', desc: '电话原理与模拟、数字信号。' },
            { id: 'info-wave', name: '电磁波', en: 'EM Waves', desc: '电磁波的产生、传播与应用。' },
            { id: 'info-radio', name: '广播电视与移动通信', en: 'Wireless', desc: '广播、电视与移动通信原理。' },
          ],
        },
        {
          id: 'c9b-energy', name: '能源与可持续发展', en: 'Energy & Future', desc: '能源的分类与可持续利用。',
          children: [
            { id: 'energy-types', name: '能源的分类', en: 'Energy Types', desc: '一次能源、二次能源与可再生能源。' },
            { id: 'energy-nuclear', name: '核能与太阳能', en: 'Nuclear & Solar', desc: '裂变、聚变与太阳能利用。' },
            { id: 'energy-future', name: '能量转化与可持续发展', en: 'Sustainable', desc: '能量转化效率与环保理念。' },
          ],
        },
      ],
    },
  ],
};
