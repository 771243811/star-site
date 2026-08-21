/**
 * 数理星图 · 初中数学技能树数据
 * 结构：根 → 六学期（七上~九下，按教材学习顺序）→ 章节 → 技能（叶子）
 * color 定义在学期层：cyan=七年级 / violet=八年级 / amber=九年级
 */
const MATH_TREE = {
  id: 'root',
  name: '初中数学',
  en: 'JUNIOR MATH',
  desc: '初中三年数学知识体系，按教材学习顺序（七上 → 九下）横向展开，共 6 学期、27 章、56 项核心技能。',
  children: [
    /* ================= 七年级上册 ================= */
    {
      id: 't7a', name: '七年级上册', en: 'G7 · A', color: 'cyan',
      desc: '从有理数到整式与一元一次方程，完成小学到初中的衔接。',
      children: [
        {
          id: 'c7a-rational', name: '有理数', en: 'Rational', desc: '初中代数的起点：用符号表示数与运算。',
          children: [
            { id: 'rational-sign', name: '正数与负数', en: 'Sign', desc: '理解相反意义的量，掌握符号表示。' },
            { id: 'rational-axis', name: '数轴与相反数', en: 'Number Line', desc: '用数轴表示数，理解相反数的几何意义。' },
            { id: 'rational-abs', name: '绝对值', en: 'Absolute', desc: '绝对值的定义、性质与化简。' },
            { id: 'rational-op', name: '有理数的运算', en: 'Operations', desc: '四则、乘方、混合运算与科学记数法。' },
          ],
        },
        {
          id: 'c7a-expr', name: '整式的加减', en: 'Polynomials', desc: '用字母表示数，学会合并同类项。',
          children: [
            { id: 'expr-algebraic', name: '代数式与整式', en: 'Expressions', desc: '代数式、单项式、多项式与次数。' },
            { id: 'expr-add', name: '整式的加减', en: 'Combine Terms', desc: '合并同类项与去括号法则。' },
          ],
        },
        {
          id: 'c7a-equation', name: '一元一次方程', en: 'Linear Eq.', desc: '方程思想第一次登场，是应用的基石。',
          children: [
            { id: 'eq1-solve', name: '解一元一次方程', en: 'Solving', desc: '移项、去分母、合并同类项求解。' },
            { id: 'eq1-apply', name: '方程的实际应用', en: 'Modeling', desc: '用方程模型解决行程、工程等问题。' },
          ],
        },
        {
          id: 'c7a-geometry', name: '几何图形初步', en: 'Intro to Geo.', desc: '认识图形与几何语言，几何的入门。',
          children: [
            { id: 'geo-lines', name: '线段与角', en: 'Lines & Angles', desc: '直线射线线段、角的表示与度量。' },
            { id: 'geo-angles', name: '余角与补角', en: 'Complements', desc: '余角补角、对顶角与方位角。' },
          ],
        },
      ],
    },

    /* ================= 七年级下册 ================= */
    {
      id: 't7b', name: '七年级下册', en: 'G7 · B', color: 'cyan',
      desc: '从平行线到实数，从二元方程组到不等式。',
      children: [
        {
          id: 'c7b-parallel', name: '相交线与平行线', en: 'Parallel Lines', desc: '几何推理与证明语言的第一课。',
          children: [
            { id: 'para-lines', name: '相交线与三线八角', en: 'Transversals', desc: '对顶角、邻补角与同位角、内错角、同旁内角。' },
            { id: 'para-judge', name: '平行线的判定与性质', en: 'Parallels', desc: '平行线的判定定理与性质定理。' },
          ],
        },
        {
          id: 'c7b-real', name: '实数', en: 'Real Numbers', desc: '数的范围扩展到实数，理解无理数。',
          children: [
            { id: 'real-root', name: '平方根与立方根', en: 'Roots', desc: '算术平方根、平方根与立方根。' },
            { id: 'real-irrational', name: '无理数与实数', en: 'Irrationals', desc: '认识无理数，实数分类与数轴表示。' },
            { id: 'real-op', name: '实数的运算', en: 'Operations', desc: '实数运算、近似计算与化简。' },
          ],
        },
        {
          id: 'c7b-coord', name: '平面直角坐标系', en: 'Coordinates', desc: '数与形的第一次结合。',
          children: [
            { id: 'coord-plane', name: '坐标与位置', en: 'Plane', desc: '点的坐标、象限与图形平移。' },
          ],
        },
        {
          id: 'c7b-system', name: '二元一次方程组', en: 'Systems', desc: '消元思想的诞生地。',
          children: [
            { id: 'sys-substitute', name: '代入消元法', en: 'Substitution', desc: '代入消元解二元一次方程组。' },
            { id: 'sys-eliminate', name: '加减消元法', en: 'Elimination', desc: '加减消元与整体思想。' },
          ],
        },
        {
          id: 'c7b-ineq', name: '不等式与不等式组', en: 'Inequalities', desc: '比较与约束的数学表达。',
          children: [
            { id: 'ineq-basic', name: '不等式的性质与解集', en: 'Properties', desc: '不等式基本性质与解集表示。' },
            { id: 'ineq-group', name: '不等式组与应用', en: 'Systems', desc: '解不等式组与方案设计问题。' },
          ],
        },
      ],
    },

    /* ================= 八年级上册 ================= */
    {
      id: 't8a', name: '八年级上册', en: 'G8 · A', color: 'violet',
      desc: '几何证明全面展开，代数进入因式分解与分式。',
      children: [
        {
          id: 'c8a-triangle', name: '三角形', en: 'Triangles', desc: '初中几何的核心图形。',
          children: [
            { id: 'tri-edge', name: '三角形的边与线段', en: 'Basics', desc: '三边关系、高线、中线与角平分线。' },
            { id: 'tri-angle', name: '内角和与外角', en: 'Angles', desc: '内角和定理与外角性质。' },
          ],
        },
        {
          id: 'c8a-congruent', name: '全等三角形', en: 'Congruence', desc: '几何证明的主战场。',
          children: [
            { id: 'con-judge', name: '全等的判定与证明', en: 'SSS SAS ASA', desc: '五种判定方法与全等证明。' },
            { id: 'con-bisector', name: '角平分线的性质', en: 'Bisectors', desc: '角平分线的性质与判定。' },
          ],
        },
        {
          id: 'c8a-axis', name: '轴对称', en: 'Symmetry', desc: '对称之美与等腰三角形。',
          children: [
            { id: 'axis-sym', name: '轴对称与垂直平分线', en: 'Axis', desc: '轴对称图形与线段垂直平分线。' },
            { id: 'axis-isosceles', name: '等腰三角形', en: 'Isosceles', desc: '等边对等角、三线合一。' },
          ],
        },
        {
          id: 'c8a-factor', name: '整式的乘法与因式分解', en: 'Factorization', desc: '代数变形的两大基本功。',
          children: [
            { id: 'factor-power', name: '幂的运算与乘法公式', en: 'Power Rules', desc: '幂的运算法则、平方差与完全平方公式。' },
            { id: 'factor-split', name: '因式分解', en: 'Factor', desc: '提公因式法与公式法分解。' },
          ],
        },
        {
          id: 'c8a-fraction', name: '分式', en: 'Fractions', desc: '分母含字母的运算与方程。',
          children: [
            { id: 'frac-op', name: '分式的性质与运算', en: 'Operations', desc: '分式有意义条件、约分通分与四则运算。' },
            { id: 'frac-eq', name: '分式方程', en: 'Equations', desc: '解分式方程与增根检验。' },
          ],
        },
      ],
    },

    /* ================= 八年级下册 ================= */
    {
      id: 't8b', name: '八年级下册', en: 'G8 · B', color: 'violet',
      desc: '勾股定理、平行四边形与函数，初中数学的分水岭。',
      children: [
        {
          id: 'c8b-radical', name: '二次根式', en: 'Radicals', desc: '根号的运算规则。',
          children: [
            { id: 'radical-concept', name: '二次根式的概念', en: 'Concept', desc: '二次根式有意义条件与最简二次根式。' },
            { id: 'radical-op', name: '二次根式的运算', en: 'Operations', desc: '二次根式的乘除与加减。' },
          ],
        },
        {
          id: 'c8b-pythagoras', name: '勾股定理', en: 'Pythagoras', desc: '几何与代数的经典交汇。',
          children: [
            { id: 'pyth-thm', name: '勾股定理及其逆定理', en: 'Theorem', desc: '勾股定理与逆定理的证明和应用。' },
            { id: 'pyth-path', name: '最短路径问题', en: 'Shortest Path', desc: '展开图、将军饮马与最短路径。' },
          ],
        },
        {
          id: 'c8b-quad', name: '平行四边形', en: 'Quadrilaterals', desc: '四边形的性质与判定体系。',
          children: [
            { id: 'quad-para', name: '平行四边形的性质与判定', en: 'Parallelograms', desc: '边、角、对角线性质与判定定理。' },
            { id: 'quad-special', name: '矩形·菱形·正方形', en: 'Special Types', desc: '特殊平行四边形的性质与判定。' },
          ],
        },
        {
          id: 'c8b-linear', name: '一次函数', en: 'Linear Func.', desc: '函数思想的正式登场。',
          children: [
            { id: 'linear-concept', name: '函数与一次函数图象', en: 'Functions', desc: '函数概念与一次函数图象、性质。' },
            { id: 'linear-apply', name: '一次函数与方程不等式', en: 'Applications', desc: '用图象法解方程与不等式。' },
          ],
        },
        {
          id: 'c8b-stats', name: '数据的分析', en: 'Data Analysis', desc: '用统计量描述数据。',
          children: [
            { id: 'stats-center', name: '数据的集中与离散', en: 'Analysis', desc: '平均数、中位数、众数与方差。' },
          ],
        },
      ],
    },

    /* ================= 九年级上册 ================= */
    {
      id: 't9a', name: '九年级上册', en: 'G9 · A', color: 'amber',
      desc: '二次方程、二次函数与圆，中考的重头戏。',
      children: [
        {
          id: 'c9a-quadratic', name: '一元二次方程', en: 'Quadratic Eq.', desc: '方程升级：解法与判别式。',
          children: [
            { id: 'quad-solve', name: '解法与判别式', en: 'Solving', desc: '配方法、公式法与根的判别式。' },
            { id: 'quad-apply', name: '方程的实际应用', en: 'Applications', desc: '增长率、几何面积与方案问题。' },
          ],
        },
        {
          id: 'c9a-fn2', name: '二次函数', en: 'Quadratic Func.', desc: '初中函数的巅峰。',
          children: [
            { id: 'fn2-graph', name: '二次函数的图象与性质', en: 'Graphs', desc: '抛物线性质、顶点式与平移。' },
            { id: 'fn2-apply', name: '综合应用与最值', en: 'Optimization', desc: '最值问题与代几综合应用。' },
          ],
        },
        {
          id: 'c9a-rotate', name: '旋转', en: 'Rotation', desc: '图形的第三种变换。',
          children: [
            { id: 'rotate-center', name: '旋转与中心对称', en: 'Center', desc: '旋转性质与中心对称图形。' },
          ],
        },
        {
          id: 'c9a-circle', name: '圆', en: 'Circles', desc: '中考压轴题的主场。',
          children: [
            { id: 'circle-basic', name: '圆的基本性质与圆周角', en: 'Circles', desc: '垂径定理与圆周角定理。' },
            { id: 'circle-line', name: '直线与圆', en: 'Tangents', desc: '切线的判定与性质、切线长定理。' },
            { id: 'circle-sector', name: '弧长与扇形', en: 'Sectors', desc: '弧长公式与扇形面积。' },
          ],
        },
        {
          id: 'c9a-prob', name: '概率初步', en: 'Probability', desc: '随机世界的量化。',
          children: [
            { id: 'prob-event', name: '事件与概率', en: 'Events', desc: '必然事件、随机事件与概率定义。' },
            { id: 'prob-list', name: '列举法求概率', en: 'Listing', desc: '列表法与树状图法。' },
            { id: 'prob-freq', name: '频率估计概率', en: 'Frequency', desc: '用频率估计概率。' },
          ],
        },
      ],
    },

    /* ================= 九年级下册 ================= */
    {
      id: 't9b', name: '九年级下册', en: 'G9 · B', color: 'amber',
      desc: '反比例函数、相似与三角函数，冲刺中考。',
      children: [
        {
          id: 'c9b-inverse', name: '反比例函数', en: 'Inverse Func.', desc: '双曲线的图象与性质。',
          children: [
            { id: 'inv-graph', name: '图象与性质', en: 'Graphs', desc: '反比例函数图象与性质。' },
            { id: 'inv-k', name: 'k 的几何意义', en: 'Geometric k', desc: '|k| 与矩形面积的关系。' },
          ],
        },
        {
          id: 'c9b-similar', name: '相似', en: 'Similarity', desc: '从全等到相似的进阶。',
          children: [
            { id: 'sim-judge', name: '相似三角形的判定与性质', en: 'Similar', desc: '相似判定定理与性质应用。' },
            { id: 'sim-homothetic', name: '位似', en: 'Homothety', desc: '位似图形与坐标变换。' },
          ],
        },
        {
          id: 'c9b-trig', name: '锐角三角函数', en: 'Trigonometry', desc: '解直角三角形的工具。',
          children: [
            { id: 'trig-concept', name: '三角函数概念', en: 'Trig Ratios', desc: '正弦、余弦、正切的定义。' },
            { id: 'trig-solve', name: '解直角三角形', en: 'Solving', desc: '特殊角函数值与实际应用。' },
          ],
        },
      ],
    },
  ],
};
