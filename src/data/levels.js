const TOTAL_LEVELS = 100;

const PATHS = [
  [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 }, { x: 8, y: 4 }, { x: 9, y: 4 }, { x: 10, y: 4 }, { x: 10, y: 3 }, { x: 10, y: 2 }, { x: 11, y: 2 }],
  [{ x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 }, { x: 6, y: 2 }, { x: 6, y: 1 }, { x: 7, y: 1 }, { x: 8, y: 1 }, { x: 9, y: 1 }, { x: 10, y: 1 }, { x: 10, y: 2 }, { x: 10, y: 3 }, { x: 11, y: 3 }],
  [{ x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 2, y: 3 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 }, { x: 8, y: 4 }, { x: 8, y: 3 }, { x: 8, y: 2 }, { x: 9, y: 2 }, { x: 10, y: 2 }, { x: 11, y: 2 }],
  [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 }, { x: 7, y: 3 }, { x: 8, y: 3 }, { x: 8, y: 4 }, { x: 9, y: 4 }, { x: 10, y: 4 }, { x: 11, y: 4 }],
];

const TOWER_POOL = [
  { x: 2, y: 1 }, { x: 5, y: 3 }, { x: 8, y: 3 }, { x: 10, y: 5 },
  { x: 3, y: 2 }, { x: 5, y: 4 }, { x: 8, y: 2 }, { x: 9, y: 0 },
  { x: 4, y: 1 }, { x: 7, y: 3 }, { x: 9, y: 3 }, { x: 2, y: 0 },
  { x: 4, y: 2 }, { x: 6, y: 2 }, { x: 8, y: 0 }, { x: 10, y: 3 },
  { x: 1, y: 0 }, { x: 1, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 },
  { x: 7, y: 0 }, { x: 7, y: 5 }, { x: 9, y: 5 }, { x: 11, y: 0 },
  { x: 11, y: 1 }, { x: 0, y: 5 }, { x: 0, y: 0 }, { x: 11, y: 5 },
];

const CHALLENGE_POOLS = {
  js: {
    beginner: [
      { id: 'js_b1', title: "Variables", desc: "Declare a variable", code: `___ damage = 10;`, answer: "let", choices: ["let", "var", "const", "int", "def", "val"] },
      { id: 'js_b2', title: "Strings", desc: "Assign a string value", code: `let name = ___;`, answer: '"Hero"', choices: ['"Hero"', "Hero", "hero", "name", '"name"', "str"] },
      { id: 'js_b3', title: "Booleans", desc: "Opposite of false", code: `let isAlive = ___;`, answer: "true", choices: ["true", "false", "0", "1", "yes", "on"] },
      { id: 'js_b4', title: "Arrays", desc: "Create an array", code: `let arr = [1, 2, ___];`, answer: "3", choices: ["3", "4", "5", "6", "7", "8"] },
      { id: 'js_b5', title: "Comments", desc: "Single-line comment", code: `___ this is a comment`, answer: "//", choices: ["//", "/*", "#", "--", "<!--", "%%"] },
    ],
    intermediate: [
      { id: 'js_i1', title: "For Loop", desc: "Loop condition", code: `for (let i = 0; i ___ 3; i++)`, answer: "<", choices: ["<", ">", "<=", ">=", "==", "!="] },
      { id: 'js_i2', title: "Array Length", desc: "Array size property", code: `enemies.___`, answer: "length", choices: ["length", "size", "count", "total", "max", "len"] },
      { id: 'js_i3', title: "If Statement", desc: "Conditional keyword", code: `___ (score > 100) {`, answer: "if", choices: ["if", "else", "for", "while", "switch", "case"] },
      { id: 'js_i4', title: "Functions", desc: "Call a function", code: `___();`, answer: "fire", choices: ["fire", "shoot", "attack", "run", "call", "go"] },
      { id: 'js_i5', title: "Returns", desc: "Return a value", code: `function add(a,b) {\n  ___ a + b;\n}`, answer: "return", choices: ["return", "send", "give", "yield", "emit", "back"] },
    ],
    advanced: [
      { id: 'js_a1', title: "Arrow Functions", desc: "Arrow syntax", code: `const fn = (x) ___ x * 2`, answer: "=>", choices: ["=>", "->", "=]", "::", "|>", "~>"] },
      { id: 'js_a2', title: "Ternary", desc: "Ternary operator", code: `let x = a > b ___ a : b`, answer: "?", choices: ["?", ":", "??", "&&", "||", "!"] },
      { id: 'js_a3', title: "Spread", desc: "Spread operator", code: `let copy = [___ arr]`, answer: "...", choices: ["...", "..", "**", "++", "--", "!!"] },
      { id: 'js_a4', title: "Destructure", desc: "Destructure array", code: `let [a, b] = ___`, answer: "arr", choices: ["arr", "obj", "list", "items", "data", "src"] },
      { id: 'js_a5', title: "Template", desc: "Template literal", code: '`Hello ${___}`', answer: "name", choices: ["name", "str", "val", "x", "text", "msg"] },
    ],
    expert: [
      { id: 'js_e1', title: "Promises", desc: "Promise resolver", code: `new Promise((___) => {`, answer: "resolve", choices: ["resolve", "reject", "then", "catch", "done", "next"] },
      { id: 'js_e2', title: "Async/Await", desc: "Async keyword", code: `___ function fetchData() {`, answer: "async", choices: ["async", "await", "sync", "defer", "delay", "wait"] },
      { id: 'js_e3', title: "Closure", desc: "Lexical scope", code: `function outer() {\n  let x = 1;\n  return function() { return ___; }\n}`, answer: "x", choices: ["x", "y", "this", "outer", "global", "null"] },
      { id: 'js_e4', title: "Reduce", desc: "Array reduce", code: `arr.___((a,b) => a + b, 0)`, answer: "reduce", choices: ["reduce", "map", "filter", "find", "sort", "forEach"] },
    ],
  },
  py: {
    beginner: [
      { id: 'py_b1', title: "Variables", desc: "Python assignment", code: `damage ___ 10`, answer: "=", choices: ["=", "==", ":=", "<-", "=>", "==="] },
      { id: 'py_b2', title: "Print", desc: "Print function", code: `___("Hello")`, answer: "print", choices: ["print", "echo", "log", "say", "write", "out"] },
      { id: 'py_b3', title: "Booleans", desc: "Opposite of False", code: `alive = ___`, answer: "True", choices: ["True", "False", "true", "false", "1", "0"] },
      { id: 'py_b4', title: "Lists", desc: "List syntax", code: `towers = [___, 'ice']`, answer: "'fire'", choices: ["'fire'", "fire", '"fire"', "fire()", "[fire]", "{fire}"] },
      { id: 'py_b5', title: "Comments", desc: "Python comment", code: `___ this is a comment`, answer: "#", choices: ["#", "//", "/*", "--", "<!--", "%%"] },
    ],
    intermediate: [
      { id: 'py_i1', title: "For Loop", desc: "For loop keyword", code: `___ i in range(3):`, answer: "for", choices: ["for", "while", "each", "loop", "def", "with"] },
      { id: 'py_i2', title: "Length", desc: "Length function", code: `___ (enemies)`, answer: "len", choices: ["len", "length", "size", "count", "max", "range"] },
      { id: 'py_i3', title: "If", desc: "If statement", code: `___ score > 100:`, answer: "if", choices: ["if", "else", "elif", "for", "while", "case"] },
      { id: 'py_i4', title: "Elif", desc: "Else if keyword", code: `___ score > 50:`, answer: "elif", choices: ["elif", "else", "elseif", "elsif", "else if", "when"] },
    ],
    advanced: [
      { id: 'py_a1', title: "Dict", desc: "Dictionary key-value", code: `d = {___: value}`, answer: "'key'", choices: ["'key'", "key", '"key"', "[key]", "{key}", "(key)"] },
      { id: 'py_a2', title: "List Comp", desc: "List comprehension", code: `[x**2 ___ x in range(5)]`, answer: "for", choices: ["for", "in", "if", "map", "filter", "from"] },
      { id: 'py_a3', title: "Lambda", desc: "Lambda keyword", code: `___ x: x * 2`, answer: "lambda", choices: ["lambda", "def", "fn", "func", "arrow", "=>"] },
      { id: 'py_a4', title: "Args", desc: "Variable args", code: `def fn(___):`, answer: "*args", choices: ["*args", "**kwargs", "args", "kwargs", "*a", "**k"] },
    ],
    expert: [
      { id: 'py_e1', title: "Decorator", desc: "Decorator syntax", code: `___my_decorator\ndef fn():`, answer: "@", choices: ["@", "#", "&", "$", "!", "%"] },
      { id: 'py_e2', title: "Generator", desc: "Yield keyword", code: `def gen():\n  ___ 1`, answer: "yield", choices: ["yield", "return", "send", "next", "emit", "give"] },
      { id: 'py_e3', title: "Context", desc: "With statement", code: `___ open('f.txt') as f:`, answer: "with", choices: ["with", "using", "open", "as", "in", "try"] },
    ],
  },
  html: {
    beginner: [
      { id: 'h_b1', title: "Paragraph", desc: "Paragraph tag", code: `<___>text</___>`, answer: "p", choices: ["p", "div", "span", "h1", "h2", "a"] },
      { id: 'h_b2', title: "Link", desc: "Anchor tag", code: `<___ href=\"url\">click</___>`, answer: "a", choices: ["a", "link", "href", "url", "ref", "src"] },
      { id: 'h_b3', title: "Image", desc: "Image tag", code: `<___ src=\"img.png\" />`, answer: "img", choices: ["img", "image", "pic", "src", "srcset", "icon"] },
      { id: 'h_b4', title: "Break", desc: "Line break", code: `text<___>`, answer: "br", choices: ["br", "hr", "p", "div", "span", "wbr"] },
    ],
    intermediate: [
      { id: 'h_i1', title: "Div", desc: "Division tag", code: `<___ class=\"container\">`, answer: "div", choices: ["div", "span", "section", "article", "main", "box"] },
      { id: 'h_i2', title: "Class", desc: "Class attribute", code: `<div ___=\"myClass\">`, answer: "class", choices: ["class", "id", "name", "style", "type", "key"] },
      { id: 'h_i3', title: "Input", desc: "Input tag", code: `<___ type=\"text\" />`, answer: "input", choices: ["input", "textarea", "select", "button", "form", "field"] },
    ],
    advanced: [
      { id: 'h_a1', title: "Flexbox", desc: "Display flex", code: `display: ___;`, answer: "flex", choices: ["flex", "block", "inline", "grid", "none", "table"] },
      { id: 'h_a2', title: "Margin", desc: "Auto margin", code: `margin: 0 ___;`, answer: "auto", choices: ["auto", "0", "10px", "center", "100%", "inherit"] },
      { id: 'h_a3', title: "Position", desc: "Position property", code: `position: ___;`, answer: "absolute", choices: ["absolute", "relative", "fixed", "static", "sticky", "float"] },
    ],
    expert: [
      { id: 'h_e1', title: "Animation", desc: "Animation name", code: `animation: ___ 2s;`, answer: "slide", choices: ["slide", "fade", "spin", "move", "grow", "bounce"] },
      { id: 'h_e2', title: "Grid", desc: "Grid template", code: `grid-template-___: 1fr 1fr;`, answer: "columns", choices: ["columns", "rows", "areas", "gap", "auto", "template"] },
    ],
  },
  sql: {
    beginner: [
      { id: 's_b1', title: "SELECT", desc: "Query keyword", code: `___ * FROM users`, answer: "SELECT", choices: ["SELECT", "GET", "FIND", "SHOW", "READ", "FETCH"] },
      { id: 's_b2', title: "FROM", desc: "From clause", code: `SELECT * ___ users`, answer: "FROM", choices: ["FROM", "IN", "AT", "OF", "ON", "TO"] },
      { id: 's_b3', title: "WHERE", desc: "Where clause", code: `WHERE id ___ 1`, answer: "=", choices: ["=", "==", "!=", "<>", "LIKE", "IN"] },
    ],
    intermediate: [
      { id: 's_i1', title: "INSERT", desc: "Insert keyword", code: `___ INTO users VALUES (1)`, answer: "INSERT", choices: ["INSERT", "ADD", "PUT", "CREATE", "MAKE", "NEW"] },
      { id: 's_i2', title: "UPDATE", desc: "Update keyword", code: `___ users SET name = 'a'`, answer: "UPDATE", choices: ["UPDATE", "SET", "ALTER", "CHANGE", "MODIFY", "EDIT"] },
      { id: 's_i3', title: "DELETE", desc: "Delete keyword", code: `___ FROM users WHERE id=1`, answer: "DELETE", choices: ["DELETE", "DROP", "REMOVE", "CLEAR", "ERASE", "KILL"] },
    ],
    advanced: [
      { id: 's_a1', title: "JOIN", desc: "Join tables", code: `SELECT * FROM users ___ orders`, answer: "JOIN", choices: ["JOIN", "MERGE", "LINK", "MATCH", "COMBINE", "UNION"] },
      { id: 's_a2', title: "ON", desc: "Join condition", code: `JOIN orders ___ user_id = id`, answer: "ON", choices: ["ON", "AT", "IN", "WHERE", "WITH", "FOR"] },
      { id: 's_a3', title: "GROUP BY", desc: "Group rows", code: `SELECT COUNT(*) ___ city`, answer: "GROUP BY", choices: ["GROUP BY", "ORDER BY", "HAVING", "SORT BY", "FILTER", "PARTITION"] },
    ],
    expert: [
      { id: 's_e1', title: "Subquery", desc: "Nested query", code: `SELECT * FROM (___) AS sub`, answer: "SELECT", choices: ["SELECT", "WHERE", "FROM", "WITH", "TABLE", "VIEW"] },
      { id: 's_e2', title: "Index", desc: "Create index", code: `CREATE ___ idx ON users(id)`, answer: "INDEX", choices: ["INDEX", "KEY", "UNIQUE", "PRIMARY", "CLUSTER", "HASH"] },
    ],
  },
  react: {
    beginner: [
      { id: 'r_b1', title: "Export", desc: "Export component", code: `___ default function App() {}`, answer: "export", choices: ["export", "import", "share", "out", "send", "expose"] },
      { id: 'r_b2', title: "JSX", desc: "JSX wrapper", code: `return <___>Hello</___>`, answer: "div", choices: ["div", "span", "p", "h1", "section", "main"] },
      { id: 'r_b3', title: "Import", desc: "Import React", code: `___ React from 'react'`, answer: "import", choices: ["import", "from", "require", "use", "get", "load"] },
    ],
    intermediate: [
      { id: 'r_i1', title: "Props", desc: "Access props", code: `function App(___) {`, answer: "props", choices: ["props", "state", "data", "args", "input", "params"] },
      { id: 'r_i2', title: "useState", desc: "State hook", code: `const [c, setC] = ___(0)`, answer: "useState", choices: ["useState", "useEffect", "useRef", "useMemo", "useCallback", "useReducer"] },
      { id: 'r_i3', title: "onClick", desc: "Click handler", code: `<button ___={handleClick}>`, answer: "onClick", choices: ["onClick", "onPress", "onTap", "onSelect", "onChange", "onSubmit"] },
    ],
    advanced: [
      { id: 'r_a1', title: "useEffect", desc: "Effect hook", code: `___(() => {}, [])`, answer: "useEffect", choices: ["useEffect", "useState", "useRef", "useRun", "useFetch", "useLoad"] },
      { id: 'r_a2', title: "Conditional", desc: "Conditional render", code: `{condition ___ <Component />}`, answer: "&&", choices: ["&&", "||", "?", ":", "??", "!"] },
      { id: 'r_a3', title: "Map", desc: "Render list", code: `items.___(item => <li>{item}</li>)`, answer: "map", choices: ["map", "forEach", "filter", "reduce", "find", "sort"] },
    ],
    expert: [
      { id: 'r_e1', title: "Context", desc: "Create context", code: `const Ctx = React.___Context()`, answer: "create", choices: ["create", "make", "new", "use", "get", "set"] },
      { id: 'r_e2', title: "Custom Hook", desc: "Hook naming", code: `function ___() { return useState(0) }`, answer: "useMyHook", choices: ["useMyHook", "myHook", "MyHook", "hookMy", "usehook", "createHook"] },
    ],
  },
};

const TOWER_TYPE_KEYS = ['normal', 'ice', 'sniper', 'mgun'];

const DIFFICULTY_TIERS = [
  { name: 'BEGINNER', maxLevel: 25, key: 'beginner', hpMin: 1, hpMax: 1, speedMin: 0.8, speedMax: 1.2, enemiesMin: 2, enemiesMax: 3, towerMin: 4, towerMax: 8, waves: 1 },
  { name: 'INTERMEDIATE', maxLevel: 50, key: 'intermediate', hpMin: 1, hpMax: 2, speedMin: 1.0, speedMax: 1.5, enemiesMin: 3, enemiesMax: 5, towerMin: 4, towerMax: 7, waves: 2 },
  { name: 'ADVANCED', maxLevel: 75, key: 'advanced', hpMin: 4, hpMax: 7, speedMin: 1.2, speedMax: 1.8, enemiesMin: 7, enemiesMax: 10, towerMin: 2, towerMax: 4, waves: 3 },
  { name: 'EXPERT', maxLevel: 100, key: 'expert', hpMin: 8, hpMax: 15, speedMin: 1.5, speedMax: 2.5, enemiesMin: 8, enemiesMax: 10, towerMin: 2, towerMax: 3, waves: 4 },
];

function getTier(levelNum) {
  for (const t of DIFFICULTY_TIERS) {
    if (levelNum <= t.maxLevel) return t;
  }
  return DIFFICULTY_TIERS[DIFFICULTY_TIERS.length - 1];
}

function lerp(min, max, t) {
  return min + (max - min) * Math.min(t, 1);
}

const ENEMY_TYPE_POOLS = {
  beginner: ['normal'],
  intermediate: ['normal', 'fast'],
  advanced: ['normal', 'fast', 'tanky'],
  expert: ['normal', 'fast', 'tanky', 'boss'],
};

export function generateLevel(techStack, levelNum) {
  const tier = getTier(levelNum);
  const tierProgress = (levelNum - (tier.maxLevel - 25)) / 25;
  let pool = CHALLENGE_POOLS[techStack.id]?.[tier.key];
  if (!pool || !pool.length) {
    const fallback = Object.values(CHALLENGE_POOLS[techStack.id] || {}).find(p => p?.length);
    pool = fallback || [{ id: 'fallback', title: 'Code', desc: 'Fill in the blank', code: '___', answer: 'a', choices: ['a', 'b', 'c', 'd', 'e', 'f'] }];
  }
  const shuffledPool = [...pool].sort(() => Math.random() - 0.5);

  const pathIdx = levelNum % PATHS.length;

  const spotCount = Math.round(lerp(tier.towerMin, tier.towerMax, tierProgress));
  const shuffled = [...TOWER_POOL].sort(() => Math.random() - 0.5);
  const towerSpots = shuffled.slice(0, spotCount).map(spot => ({
    ...spot,
    towerType: TOWER_TYPE_KEYS[Math.floor(Math.random() * TOWER_TYPE_KEYS.length)],
  }));

  const waveCount = tier.waves || 1;
  const waves = Array.from({ length: waveCount }, (_, w) => {
    const waveProgress = (w + 1) / waveCount;
    const hp = Math.round(lerp(tier.hpMin, tier.hpMax, tierProgress) * (1 + waveProgress * 0.5));
    const speed = lerp(tier.speedMin, tier.speedMax, tierProgress) * (1 + waveProgress * 0.1);
    const enemyCount = Math.round(lerp(tier.enemiesMin, tier.enemiesMax, tierProgress) * (1 + waveProgress * 0.3));
    const availableTypes = ENEMY_TYPE_POOLS[tier.key] || ['normal'];
    const enemyTypes = w === waveCount - 1 && availableTypes.length > 1
      ? [availableTypes[availableTypes.length - 1], ...availableTypes]
      : availableTypes;
    return { enemyHealth: hp, enemySpeed: speed, enemiesPerWave: enemyCount, enemyTypes };
  });

  const levelChallenges = Array.from({ length: spotCount }, (_, i) => ({
    ...shuffledPool[i % shuffledPool.length],
    reward: 50 + levelNum * 5,
  }));

  return {
    id: levelNum,
    name: `Level ${levelNum}`,
    description: `${tier.name} - ${techStack.name}`,
    tier: tier.name,
    waves,
    path: PATHS[pathIdx],
    towerSpots,
    challenges: levelChallenges,
  };
}

export function getTierLabel(levelNum) {
  return getTier(levelNum).name;
}

const TECH_STACKS = [
  { id: 'js', name: 'JavaScript', icon: '🟨', color: '#f7df1e', bgColor: 'rgba(247,223,30,0.1)', levels: TOTAL_LEVELS },
  { id: 'py', name: 'Python', icon: '🐍', color: '#3572A5', bgColor: 'rgba(53,114,165,0.1)', levels: TOTAL_LEVELS },
  { id: 'html', name: 'HTML/CSS', icon: '🌐', color: '#e34c26', bgColor: 'rgba(227,76,38,0.1)', levels: TOTAL_LEVELS },
  { id: 'sql', name: 'SQL', icon: '🗄️', color: '#00618a', bgColor: 'rgba(0,97,138,0.1)', levels: TOTAL_LEVELS },
  { id: 'react', name: 'React', icon: '⚛️', color: '#61dafb', bgColor: 'rgba(97,218,251,0.1)', levels: TOTAL_LEVELS },
];

export default TECH_STACKS;
