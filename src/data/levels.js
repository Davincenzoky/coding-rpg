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

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rng(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function buildVars() {
  const nums = [2, 3, 5, 7, 10, 15, 20, 25, 50, 100];
  const vars = ['x', 'y', 'a', 'b', 'val', 'count', 'score', 'num', 'total', 'i'];
  const names = ['player', 'enemy', 'tower', 'hero', 'mage', 'knight', 'archer', 'boss', 'dragon', 'wizard'];
  const items = ['health', 'mana', 'attack', 'speed', 'armor', 'power', 'magic', 'gold', 'xp', 'level'];
  return { nums, vars, names, items };
}

function shuffleChoices(correct, wrongs) {
  const all = [correct, ...wrongs.filter(w => w !== correct)];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, 6);
}

function generateJSPool(tierKey) {
  const pool = [];
  const b = buildVars();
  let idx = 0;

  if (tierKey === 'beginner') {
    const declKeywords = ['let', 'var', 'const'];
    const types = ['number', 'string', 'boolean', 'undefined', 'null', 'object'];
    for (let i = 0; i < 4; i++) {
      const kw = pick(declKeywords);
      const v = pick(b.vars);
      pool.push({ id: `js_b${++idx}`, title: "Variable Decl", desc: `${kw} declaration`, code: `${kw} ${v} = ${pick(b.nums)};`, answer: kw, choices: shuffleChoices(kw, ['let', 'var', 'const', 'int', 'def', 'val']) });
    }
    const strVals = ['"hello"', "'world'", '"code"', '"bug"', '"defend"', '"attack"'];
    for (let i = 0; i < 4; i++) {
      const sv = pick(strVals);
      pool.push({ id: `js_b${++idx}`, title: "String Val", desc: "Assign string", code: `let msg = ___;`, answer: sv, choices: shuffleChoices(sv, ['"hi"', "'ok'", 'hello', 'msg', 'str', 'text']) });
    }
    for (let i = 0; i < 4; i++) {
      const boolVal = pick([true, false]);
      pool.push({ id: `js_b${++idx}`, title: "Boolean", desc: "Boolean value", code: `let active = ___;`, answer: String(boolVal), choices: shuffleChoices(String(boolVal), ['true', 'false', '0', '1', 'yes', 'no']) });
    }
    for (let i = 0; i < 4; i++) {
      const n = pick(b.nums);
      pool.push({ id: `js_b${++idx}`, title: "Number", desc: "Number value", code: `let ${pick(b.vars)} = ___;`, answer: String(n), choices: shuffleChoices(String(n), ['0', '1', '2', '3', '5', '10'].filter(x => x !== String(n))) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_b${++idx}`, title: "Comment", desc: "Single-line comment", code: `___ this is a comment`, answer: "//", choices: shuffleChoices("//", ["//", "/*", "#", "--", "<!--", "%%"]) });
    }
    const mathOps = [['+', '-', '*', '/', '%', '**'], ['+', '-', '*', '/', '%', '**']];
    ['+', '-', '*', '%', '**'].forEach((op, i) => {
      if (i >= 4) return;
      pool.push({ id: `js_b${++idx}`, title: "Math Op", desc: `${op} operator`, code: `let r = 10 ${op} ${pick(b.nums)};`, answer: op, choices: shuffleChoices(op, ['+', '-', '*', '/', '%', '**']) });
    });
    for (let i = 0; i < 4; i++) {
      const nm = pick(b.names);
      pool.push({ id: `js_b${++idx}`, title: "Alert", desc: "Alert function", code: `___("${nm} attacks!");`, answer: "alert", choices: shuffleChoices("alert", ["alert", "log", "print", "echo", "prompt", "write"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_b${++idx}`, title: "Array Init", desc: "Create array", code: `let arr = [${pick(b.nums)}, ${pick(b.nums)}, ___];`, answer: String(pick(b.nums)), choices: shuffleChoices(String(pick(b.nums)), ['1', '2', '3', '4', '5', '6']) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_b${++idx}`, title: "Concat", desc: "String concat", code: `let msg = "a" ___ "b";`, answer: "+", choices: shuffleChoices("+", ["+", "-", "*", "/", "&", "."]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_b${++idx}`, title: "typeof", desc: "Type check", code: `typeof ${pick(b.nums)}`, answer: "'number'", choices: shuffleChoices("'number'", ["'number'", "'string'", "'boolean'", "'object'", "'undefined'", "number"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_b${++idx}`, title: "Increment", desc: "Increment value", code: `${pick(b.vars)}${pick(['++', '++'])};`, answer: "++", choices: shuffleChoices("++", ["++", "--", "+=", "-=", "+=1", "=+1"]) });
    }
    for (let i = 0; i < 4; i++) {
      const op = pick(['===', '!==', '>', '<']);
      pool.push({ id: `js_b${++idx}`, title: "Compare", desc: `${op} operator`, code: `if (a ${op} b) { }`, answer: op, choices: shuffleChoices(op, ['===', '!==', '>', '<', '>=', '<=']) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_b${++idx}`, title: "Template Literal", desc: "Backtick string", code: `let msg = ___hello ${pick(b.vars)}___;`, answer: "`", choices: shuffleChoices("`", ["`", "'", '"', "(", "[", "{"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_b${++idx}`, title: "Null", desc: "Null value", code: `let x = ___;`, answer: "null", choices: shuffleChoices("null", ["null", "undefined", "0", "false", "NaN", "''"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_b${++idx}`, title: "Undefined", desc: "Undefined value", code: `let x; // x is ___`, answer: "undefined", choices: shuffleChoices("undefined", ["undefined", "null", "0", "false", "NaN", "''"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_b${++idx}`, title: "Console Log", desc: "Print to console", code: `console.___("${pick(b.names)}");`, answer: "log", choices: shuffleChoices("log", ["log", "info", "warn", "error", "debug", "table"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_b${++idx}`, title: "String Length", desc: "String property", code: `"${pick(b.names)}".___`, answer: "length", choices: shuffleChoices("length", ["length", "size", "count", "len", "total", "max"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_b${++idx}`, title: "Array Index", desc: "Access index", code: `arr[___]`, answer: "0", choices: shuffleChoices("0", ["0", "1", "2", "3", "4", "5"]) });
    }
    for (let i = 0; i < 4; i++) {
      const eq = pick(['=', '=']);
      pool.push({ id: `js_b${++idx}`, title: "Assignment", desc: "Assign value", code: `${pick(b.vars)} ___ ${pick(b.nums)};`, answer: "=", choices: shuffleChoices("=", ["=", "==", "===", "=>", ":=", "="]) });
    }
  }

  else if (tierKey === 'intermediate') {
    const funcNames = ['fire', 'attack', 'defend', 'heal', 'charge', 'shield'];
    for (let i = 0; i < 4; i++) {
      const fn = pick(funcNames);
      pool.push({ id: `js_i${++idx}`, title: "Call Func", desc: "Invoke function", code: `${fn}(${pick(b.nums)});`, answer: fn, choices: shuffleChoices(fn, funcNames.filter(f => f !== fn).slice(0, 5)) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_i${++idx}`, title: "Function Def", desc: "Define function", code: `___ ${pick(funcNames)}(x) { }`, answer: "function", choices: shuffleChoices("function", ["function", "def", "fn", "func", "=>", "void"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_i${++idx}`, title: "Return", desc: "Return keyword", code: `___ ${pick(b.vars)};`, answer: "return", choices: shuffleChoices("return", ["return", "send", "give", "yield", "back", "emit"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_i${++idx}`, title: "Parameter", desc: "Function param", code: `function fn(${pick(b.vars)}) { return ${pick(b.vars)}; }`, answer: pick(b.vars), choices: shuffleChoices(pick(b.vars), b.vars.slice(0, 5)) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_i${++idx}`, title: "If", desc: "If condition", code: `___ (health < 0) { }`, answer: "if", choices: shuffleChoices("if", ["if", "else", "for", "while", "switch", "case"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_i${++idx}`, title: "Else", desc: "Else clause", code: `if (x > 5) { } ___ { }`, answer: "else", choices: shuffleChoices("else", ["else", "elif", "else if", "then", "otherwise", "or"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_i${++idx}`, title: "For Loop", desc: "Loop init", code: `for (___ i = 0; i < 5; i++)`, answer: "let", choices: shuffleChoices("let", ["let", "var", "const", "int", "i", "index"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_i${++idx}`, title: "While", desc: "While loop", code: `___ (count > 0) { }`, answer: "while", choices: shuffleChoices("while", ["while", "for", "do", "loop", "repeat", "until"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_i${++idx}`, title: "Array Push", desc: "Add to array", code: `arr.___(${pick(b.nums)});`, answer: "push", choices: shuffleChoices("push", ["push", "pop", "shift", "unshift", "add", "append"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_i${++idx}`, title: "Array Pop", desc: "Remove from array", code: `arr.___();`, answer: "pop", choices: shuffleChoices("pop", ["pop", "push", "shift", "unshift", "remove", "delete"]) });
    }
    for (let i = 0; i < 4; i++) {
      const idxOp = pick(['indexOf', 'includes', 'find', 'findIndex']);
      pool.push({ id: `js_i${++idx}`, title: "Search", desc: `${idxOp} method`, code: `arr.___(${pick(b.nums)})`, answer: idxOp, choices: shuffleChoices(idxOp, ['indexOf', 'includes', 'find', 'findIndex', 'search', 'contains']) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_i${++idx}`, title: "Slice", desc: "Array slice", code: `arr.___(1, 3)`, answer: "slice", choices: shuffleChoices("slice", ["slice", "splice", "split", "cut", "substr", "substring"]) });
    }
    for (let i = 0; i < 4; i++) {
      const logOp = pick(['&&', '||', '!']);
      pool.push({ id: `js_i${++idx}`, title: "Logical Op", desc: `${logOp} operator`, code: `if (a ${logOp} b)`, answer: logOp, choices: shuffleChoices(logOp, ['&&', '||', '!', '&', '|', '??']) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_i${++idx}`, title: "Strict Eq", desc: "Strict equality", code: `a ___ b`, answer: "===", choices: shuffleChoices("===", ["===", "==", "=", "!=", "!==", "=>"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_i${++idx}`, title: "Object Literal", desc: "Create object", code: `let obj = {${pick(b.vars)}: ${pick(b.nums)}};`, answer: pick(b.vars), choices: shuffleChoices(pick(b.vars), b.vars.slice(0, 5)) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_i${++idx}`, title: "Dot Access", desc: "Object property", code: `obj.___`, answer: pick(b.vars), choices: shuffleChoices(pick(b.vars), b.vars.slice(0, 5)) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_i${++idx}`, title: "Break", desc: "Break loop", code: `if (x > 5) ___;`, answer: "break", choices: shuffleChoices("break", ["break", "continue", "exit", "stop", "end", "return"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_i${++idx}`, title: "Continue", desc: "Skip iteration", code: `if (x < 0) ___;`, answer: "continue", choices: shuffleChoices("continue", ["continue", "break", "skip", "next", "pass", "return"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_i${++idx}`, title: "Switch", desc: "Switch keyword", code: `___ (${pick(b.vars)}) { case 1: }`, answer: "switch", choices: shuffleChoices("switch", ["switch", "case", "if", "match", "select", "when"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_i${++idx}`, title: "Case", desc: "Switch case", code: `switch(x) { ___ 1: }`, answer: "case", choices: shuffleChoices("case", ["case", "default", "if", "when", "match", "break"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_i${++idx}`, title: "String Method", desc: "Upper case", code: `"${pick(b.names)}".___()`, answer: "toUpperCase", choices: shuffleChoices("toUpperCase", ["toUpperCase", "toLowerCase", "trim", "replace", "split", "charAt"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_i${++idx}`, title: "Math Floor", desc: "Round down", code: `Math.___(${pick([3.7, 7.2, 9.9, 1.1, 5.5, 8.3])})`, answer: "floor", choices: shuffleChoices("floor", ["floor", "ceil", "round", "trunc", "abs", "pow"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_i${++idx}`, title: "Join", desc: "Array join", code: `arr.___(", ")`, answer: "join", choices: shuffleChoices("join", ["join", "concat", "merge", "combine", "split", "toString"]) });
    }
  }

  else if (tierKey === 'advanced') {
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "Arrow", desc: "Arrow function", code: `const fn = (x) ___ x * 2`, answer: "=>", choices: shuffleChoices("=>", ["=>", "->", "=]", "::", "|>", "~>"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "Ternary", desc: "Ternary op", code: `let r = a > b ___ a : b`, answer: "?", choices: shuffleChoices("?", ["?", ":", "??", "&&", "||", "!"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "Spread", desc: "Spread array", code: `let copy = [___ arr]`, answer: "...", choices: shuffleChoices("...", ["...", "..", "**", "++", "--", "!!"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "Rest Param", desc: "Rest parameter", code: `function fn(___ args) { }`, answer: "...", choices: shuffleChoices("...", ["...", "args", "*args", "rest", "all", "etc"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "Destructure", desc: "Array destructure", code: `let [a, b] = ___`, answer: "arr", choices: shuffleChoices("arr", ["arr", "obj", "list", "items", "data", "src"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "Template Lit", desc: "Template literal", code: '`Hello ${___}`', answer: pick(b.vars), choices: shuffleChoices(pick(b.vars), b.vars.slice(0, 5)) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "Map", desc: "Array map", code: `arr.___(x => x * 2)`, answer: "map", choices: shuffleChoices("map", ["map", "filter", "reduce", "forEach", "find", "sort"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "Filter", desc: "Array filter", code: `arr.___(x => x > 0)`, answer: "filter", choices: shuffleChoices("filter", ["filter", "map", "reduce", "forEach", "find", "some"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "Reduce", desc: "Array reduce", code: `arr.___((a,b) => a + b, 0)`, answer: "reduce", choices: shuffleChoices("reduce", ["reduce", "map", "filter", "find", "sort", "forEach"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "Callback", desc: "Callback param", code: `setTimeout(___, 1000)`, answer: "fn", choices: shuffleChoices("fn", ["fn", "func", "callback", "handler", "() => {}", "action"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "SetTimeout", desc: "Delay call", code: `___(() => {}, 1000)`, answer: "setTimeout", choices: shuffleChoices("setTimeout", ["setTimeout", "setInterval", "requestAnimationFrame", "delay", "sleep", "wait"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "SetInterval", desc: "Repeat call", code: `___(() => {}, 1000)`, answer: "setInterval", choices: shuffleChoices("setInterval", ["setInterval", "setTimeout", "requestAnimationFrame", "loop", "repeat", "tick"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "Closure", desc: "Lexical scope", code: `function outer() {\n  let x = 1;\n  return function() { return ___; }\n}`, answer: "x", choices: shuffleChoices("x", ["x", "y", "this", "outer", "global", "null"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "IIFE", desc: "Immediate invoke", code: `(function() { })___`, answer: "()", choices: shuffleChoices("()", ["()", "()()", "()=>", "=>()", "!!", "~"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "Bind", desc: "Bind context", code: `fn.___(this)`, answer: "bind", choices: shuffleChoices("bind", ["bind", "call", "apply", "attach", "link", "connect"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "Call", desc: "Call with context", code: `fn.___(this, arg1)`, answer: "call", choices: shuffleChoices("call", ["call", "apply", "bind", "run", "invoke", "execute"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "Apply", desc: "Apply args", code: `fn.___(this, [arg1])`, answer: "apply", choices: shuffleChoices("apply", ["apply", "call", "bind", "run", "invoke", "spread"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "Nullish", desc: "Nullish coalescing", code: `let x = a ___ b`, answer: "??", choices: shuffleChoices("??", ["??", "||", "&&", "?:", "??=", "||="]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "Optional Chain", desc: "Optional chaining", code: `obj?.${pick(b.vars)}___.${pick(b.vars)}`, answer: "?.", choices: shuffleChoices("?.", ["?.", "?.", ".", "?..", "..", "?."]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "Object Assign", desc: "Merge objects", code: `Object.___(target, src)`, answer: "assign", choices: shuffleChoices("assign", ["assign", "merge", "copy", "extend", "spread", "concat"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "Keys", desc: "Object keys", code: `Object.___(obj)`, answer: "keys", choices: shuffleChoices("keys", ["keys", "values", "entries", "items", "props", "fields"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "Values", desc: "Object values", code: `Object.___(obj)`, answer: "values", choices: shuffleChoices("values", ["values", "keys", "entries", "items", "props", "list"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "Entries", desc: "Object entries", code: `Object.___(obj)`, answer: "entries", choices: shuffleChoices("entries", ["entries", "keys", "values", "items", "pairs", "tuples"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "Every/Some", desc: "Array check", code: `arr.___(x => x > 0)`, answer: pick(["every", "some"]), choices: shuffleChoices(pick(["every", "some"]), ["every", "some", "all", "any", "none", "includes"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_a${++idx}`, title: "Find", desc: "Find element", code: `arr.___(x => x === ${pick(b.nums)})`, answer: "find", choices: shuffleChoices("find", ["find", "filter", "indexOf", "includes", "findIndex", "search"]) });
    }
  }

  else if (tierKey === 'expert') {
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "Promise", desc: "Create promise", code: `new Promise((___) => {`, answer: "resolve", choices: shuffleChoices("resolve", ["resolve", "reject", "then", "catch", "done", "next"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "Async", desc: "Async keyword", code: `___ function fetch() {`, answer: "async", choices: shuffleChoices("async", ["async", "await", "sync", "defer", "delay", "wait"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "Await", desc: "Await keyword", code: `let res = ___ fetch(url)`, answer: "await", choices: shuffleChoices("await", ["await", "async", "then", "yield", "wait", "get"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "Then", desc: "Promise chain", code: `fetch(url).___((res) => {})`, answer: "then", choices: shuffleChoices("then", ["then", "catch", "finally", "resolve", "await", "next"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "Catch", desc: "Handle error", code: `fetch(url).___((err) => {})`, answer: "catch", choices: shuffleChoices("catch", ["catch", "then", "finally", "error", "fail", "reject"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "Finally", desc: "Promise cleanup", code: `fetch(url).___(() => {})`, answer: "finally", choices: shuffleChoices("finally", ["finally", "then", "catch", "done", "end", "complete"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "Class", desc: "Define class", code: `___ ${pick(['Player', 'Enemy', 'Tower', 'Hero'])} { }`, answer: "class", choices: shuffleChoices("class", ["class", "function", "object", "prototype", "constructor", "new"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "Constructor", desc: "Constructor method", code: `class X { ___() { } }`, answer: "constructor", choices: shuffleChoices("constructor", ["constructor", "init", "new", "build", "create", "setup"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "Extends", desc: "Inheritance", code: `class Hero ___ ${pick(['Player', 'Unit', 'Entity'])} { }`, answer: "extends", choices: shuffleChoices("extends", ["extends", "implements", "inherits", "from", "super", "prototype"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "Super", desc: "Parent call", code: `___(${pick(b.vars)}, ${pick(b.nums)});`, answer: "super", choices: shuffleChoices("super", ["super", "parent", "base", "this", "new", "prototype"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "Static", desc: "Static method", code: `___ ${pick(['type', 'version', 'config'])}() { }`, answer: "static", choices: shuffleChoices("static", ["static", "public", "private", "const", "let", "var"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "Getter", desc: "Get property", code: `___ ${pick(b.vars)}() { return this.${pick(b.items)}; }`, answer: "get", choices: shuffleChoices("get", ["get", "set", "let", "var", "const", "function"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "Setter", desc: "Set property", code: `___ ${pick(b.vars)}(val) { this.${pick(b.items)} = val; }`, answer: "set", choices: shuffleChoices("set", ["set", "get", "let", "var", "const", "function"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "Generator", desc: "Generator function", code: `function* gen() { ___ 1; }`, answer: "yield", choices: shuffleChoices("yield", ["yield", "return", "next", "send", "emit", "give"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "Proxy", desc: "Create proxy", code: `new ___(target, handler)`, answer: "Proxy", choices: shuffleChoices("Proxy", ["Proxy", "Reflect", "Object", "Function", "Symbol", "Map"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "Symbol", desc: "Unique symbol", code: `const sym = ___("desc")`, answer: "Symbol", choices: shuffleChoices("Symbol", ["Symbol", "symbol", "new Symbol", "unique", "id", "key"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "Map", desc: "Map collection", code: `new ___()`, answer: "Map", choices: shuffleChoices("Map", ["Map", "Set", "WeakMap", "WeakSet", "Array", "Object"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "Set", desc: "Set collection", code: `new ___([1,2,3])`, answer: "Set", choices: shuffleChoices("Set", ["Set", "Map", "WeakSet", "WeakMap", "Array", "Object"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "WeakMap", desc: "Weak key map", code: `new ___()`, answer: "WeakMap", choices: shuffleChoices("WeakMap", ["WeakMap", "WeakSet", "Map", "Set", "Array", "Object"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "JSON Stringify", desc: "Object to JSON", code: `JSON.___(obj)`, answer: "stringify", choices: shuffleChoices("stringify", ["stringify", "parse", "toJSON", "serialize", "encode", "format"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "JSON Parse", desc: "JSON to object", code: `JSON.___(str)`, answer: "parse", choices: shuffleChoices("parse", ["parse", "stringify", "fromJSON", "deserialize", "decode", "load"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "Memoization", desc: "Cache result", code: `if (!cache[key]) cache[key] = ___()`, answer: "fn", choices: shuffleChoices("fn", ["fn", "calc", "compute", "run", "exec", "call"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "Debounce", desc: "Debounce fn", code: `function ___${pick(['debounce', 'throttle', 'delay'])}`, answer: pick(['debounce', 'throttle']), choices: shuffleChoices(pick(['debounce', 'throttle']), ['debounce', 'throttle', 'delay', 'wait', 'buffer', 'cooldown']) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "Recursion", desc: "Recursive call", code: `function fn(n) { if (n <= 1) return 1; return n * ___(n - 1); }`, answer: "fn", choices: shuffleChoices("fn", ["fn", "call", "return", "this", "self", "recurse"]) });
    }
    for (let i = 0; i < 4; i++) {
      pool.push({ id: `js_e${++idx}`, title: "Try/Catch", desc: "Error handling", code: `___ { } catch (e) { }`, answer: "try", choices: shuffleChoices("try", ["try", "catch", "throw", "finally", "if", "while"]) });
    }
  }

  while (pool.length < 100) {
    const dup = { ...pool[idx % (pool.length || 1)], id: `js_${tierKey[0]}${++idx}` };
    dup.title = dup.title + ' ' + idx;
    pool.push(dup);
  }

  return pool.slice(0, 100);
}

function generatePyPool(tierKey) {
  const pool = [];
  const b = buildVars();
  let idx = 0;

  if (tierKey === 'beginner') {
    for (let i = 0; i < 6; i++) {
      pool.push({ id: `py_b${++idx}`, title: "Print", desc: "Print function", code: `___("${pick(b.names)}")`, answer: "print", choices: shuffleChoices("print", ["print", "echo", "log", "say", "write", "out"]) });
    }
    for (let i = 0; i < 5; i++) {
      const v = pick(b.vars);
      pool.push({ id: `py_b${++idx}`, title: "Variable", desc: "Assign value", code: `${v} ___ ${pick(b.nums)}`, answer: "=", choices: shuffleChoices("=", ["=", "==", ":=", "<-", "=>", "==="]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_b${++idx}`, title: "String", desc: "String literal", code: `name = ${pick(['"hello"', "'world'", '"code"', "'python'"])}`, answer: pick(['"hello"', "'world'", '"code"', "'python'"]), choices: shuffleChoices(pick(['"hello"', "'world'", '"code"', "'python'"]), ['"hi"', "'ok'", 'hello', 'str', 'text', 'word']) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_b${++idx}`, title: "Boolean", desc: "True/False", code: `active = ___`, answer: pick(["True", "False"]), choices: shuffleChoices(pick(["True", "False"]), ["True", "False", "true", "false", "1", "0"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_b${++idx}`, title: "Comment", desc: "Python comment", code: `___ this is a comment`, answer: "#", choices: shuffleChoices("#", ["#", "//", "/*", "--", "<!--", "%%"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_b${++idx}`, title: "List", desc: "Create list", code: `items = [${pick(b.nums)}, ${pick(b.nums)}, ___]`, answer: String(pick(b.nums)), choices: shuffleChoices(String(pick(b.nums)), ['1', '2', '3', '4', '5', '6']) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_b${++idx}`, title: "Input", desc: "Read input", code: `name = ___()`, answer: "input", choices: shuffleChoices("input", ["input", "read", "get", "scan", "prompt", "ask"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_b${++idx}`, title: "Type", desc: "Check type", code: `___(${pick(b.vars)})`, answer: "type", choices: shuffleChoices("type", ["type", "typeof", "isinstance", "check", "class", "kind"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_b${++idx}`, title: "Length", desc: "Get length", code: `___(${pick(['items', 'name', 'arr', 'list', 'msg'])})`, answer: "len", choices: shuffleChoices("len", ["len", "length", "size", "count", "max", "range"]) });
    }
    for (let i = 0; i < 5; i++) {
      const n = pick(b.nums);
      pool.push({ id: `py_b${++idx}`, title: "Number", desc: "Integer value", code: `${pick(b.vars)} = ___`, answer: String(n), choices: shuffleChoices(String(n), ['0', '1', '2', '3', '5', '10'].filter(x => x !== String(n))) });
    }
    for (let i = 0; i < 5; i++) {
      const op = pick(['+', '-', '*', '/', '//', '%']);
      pool.push({ id: `py_b${++idx}`, title: "Arith", desc: `${op} operator`, code: `r = 10 ${op} ${pick(b.nums)}`, answer: op, choices: shuffleChoices(op, ['+', '-', '*', '/', '//', '%']) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_b${++idx}`, title: "Str Mult", desc: "Repeat string", code: `"${pick(['a', 'x', 'o', '-', '*'])}" ___ 5`, answer: "*", choices: shuffleChoices("*", ["*", "+", "-", "/", "%", "**"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_b${++idx}`, title: "Not", desc: "Negation", code: `___ True`, answer: "not", choices: shuffleChoices("not", ["not", "!", "~", "opposite", "neg", "inv"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_b${++idx}`, title: "Is", desc: "Identity check", code: `a ___ None`, answer: "is", choices: shuffleChoices("is", ["is", "==", "===", "=", "!=", "is not"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_b${++idx}`, title: "In", desc: "Membership", code: `${pick(b.nums)} ___ ${pick(['arr', 'list', 'items', 'nums'])}`, answer: "in", choices: shuffleChoices("in", ["in", "not in", "is", "has", "contains", "within"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_b${++idx}`, title: "Range", desc: "Create range", code: `___(${pick(b.nums)})`, answer: "range", choices: shuffleChoices("range", ["range", "list", "xrange", "count", "loop", "interval"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_b${++idx}`, title: "Float", desc: "Float value", code: `${pick(b.vars)} = ${pick(['3.14', '2.5', '0.5', '1.0', '10.0', '0.1'])}`, answer: pick(['3.14', '2.5', '0.5', '1.0', '10.0', '0.1']), choices: shuffleChoices(pick(['3.14', '2.5', '0.5', '1.0', '10.0', '0.1']), ['3', '2', '0', '1', '10', '5']) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_b${++idx}`, title: "Help", desc: "Get help", code: `___(${pick(['print', 'len', 'range', 'type', 'input'])})`, answer: "help", choices: shuffleChoices("help", ["help", "dir", "info", "docs", "?", "man"]) });
    }
  }

  else if (tierKey === 'intermediate') {
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_i${++idx}`, title: "For", desc: "For loop", code: `___ i in range(${pick(b.nums)}):`, answer: "for", choices: shuffleChoices("for", ["for", "while", "each", "loop", "def", "with"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_i${++idx}`, title: "While", desc: "While loop", code: `___ count > 0:`, answer: "while", choices: shuffleChoices("while", ["while", "for", "if", "loop", "do", "repeat"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_i${++idx}`, title: "If", desc: "If condition", code: `___ score > ${pick(b.nums)}:`, answer: "if", choices: shuffleChoices("if", ["if", "else", "elif", "for", "while", "case"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_i${++idx}`, title: "Elif", desc: "Else if", code: `___ score > ${pick(b.nums)}:`, answer: "elif", choices: shuffleChoices("elif", ["elif", "else", "elseif", "elsif", "else if", "when"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_i${++idx}`, title: "Else", desc: "Else block", code: `if x > 0:\n  pass\n___:`, answer: "else", choices: shuffleChoices("else", ["else", "elif", "then", "otherwise", "or", "default"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_i${++idx}`, title: "Def", desc: "Define function", code: `___ ${pick(['attack', 'defend', 'heal', 'charge'])}(${pick(b.vars)}):`, answer: "def", choices: shuffleChoices("def", ["def", "function", "fn", "func", "define", "void"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_i${++idx}`, title: "Return", desc: "Return value", code: `___ ${pick(b.vars)} + ${pick(b.nums)}`, answer: "return", choices: shuffleChoices("return", ["return", "send", "give", "yield", "back", "emit"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_i${++idx}`, title: "List Append", desc: "Add to list", code: `items.___(${pick(b.nums)})`, answer: "append", choices: shuffleChoices("append", ["append", "add", "push", "insert", "extend", "put"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_i${++idx}`, title: "List Index", desc: "Access index", code: `items[___]`, answer: "0", choices: shuffleChoices("0", ["0", "1", "2", "3", "-1", ":"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_i${++idx}`, title: "Slice", desc: "List slice", code: `items[1:___]`, answer: "3", choices: shuffleChoices("3", ["3", "2", "4", "5", ":", "-1"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_i${++idx}`, title: "Dict", desc: "Create dict", code: `d = {${pick(['"key"', "'name'", "'id'", '"type"'])}: ${pick(b.nums)}}`, answer: pick(['"key"', "'name'", "'id'", '"type"']), choices: shuffleChoices(pick(['"key"', "'name'", "'id'", '"type"']), ['"key"', "'name'", "'id'", '"type"', 'key', 'val']) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_i${++idx}`, title: "Dict Access", desc: "Dict key access", code: `d[___]`, answer: pick(["'name'", '"key"', "'id'", '"type"']), choices: shuffleChoices(pick(["'name'", '"key"', "'id'", '"type"']), ["'name'", '"key"', "'id'", '"type"', 'name', 'key']) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_i${++idx}`, title: "And", desc: "Logical and", code: `if a > 0 ___ b > 0:`, answer: "and", choices: shuffleChoices("and", ["and", "or", "not", "&&", "||", "&"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_i${++idx}`, title: "Or", desc: "Logical or", code: `if a > 0 ___ b > 0:`, answer: "or", choices: shuffleChoices("or", ["or", "and", "not", "||", "&&", "|"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_i${++idx}`, title: "In", desc: "Membership", code: `if x ___ list:`, answer: "in", choices: shuffleChoices("in", ["in", "not in", "is", "has", "within", "of"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_i${++idx}`, title: "Str Format", desc: "Format string", code: `f"Hello {___}"`, answer: pick(b.vars), choices: shuffleChoices(pick(b.vars), b.vars.slice(0, 5)) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_i${++idx}`, title: "Upper", desc: "String upper", code: `"${pick(b.names)}".___()`, answer: "upper", choices: shuffleChoices("upper", ["upper", "lower", "capitalize", "title", "swapcase", "format"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_i${++idx}`, title: "Split", desc: "Split string", code: `"a,b,c".___(",")`, answer: "split", choices: shuffleChoices("split", ["split", "join", "partition", "strip", "replace", "slice"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_i${++idx}`, title: "Join", desc: "Join list", code: `",".___(items)`, answer: "join", choices: shuffleChoices("join", ["join", "split", "concat", "merge", "combine", "format"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_i${++idx}`, title: "Sort", desc: "Sort list", code: `items.___()`, answer: "sort", choices: shuffleChoices("sort", ["sort", "sorted", "reverse", "order", "arrange", "organize"]) });
    }
  }

  else if (tierKey === 'advanced') {
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_a${++idx}`, title: "List Comp", desc: "List comprehension", code: `[x**2 ___ x in range(5)]`, answer: "for", choices: shuffleChoices("for", ["for", "in", "if", "map", "filter", "from"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_a${++idx}`, title: "Lambda", desc: "Lambda keyword", code: `___ x: x * 2`, answer: "lambda", choices: shuffleChoices("lambda", ["lambda", "def", "fn", "func", "arrow", "=>"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_a${++idx}`, title: "Map", desc: "Map function", code: `___(lambda x: x*2, items)`, answer: "map", choices: shuffleChoices("map", ["map", "filter", "reduce", "apply", "transform", "each"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_a${++idx}`, title: "Filter", desc: "Filter function", code: `___(lambda x: x>0, items)`, answer: "filter", choices: shuffleChoices("filter", ["filter", "map", "reduce", "select", "where", "find"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_a${++idx}`, title: "Args", desc: "Variable args", code: `def fn(___):`, answer: "*args", choices: shuffleChoices("*args", ["*args", "**kwargs", "args", "kwargs", "*a", "**k"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_a${++idx}`, title: "Kwargs", desc: "Keyword args", code: `def fn(___):`, answer: "**kwargs", choices: shuffleChoices("**kwargs", ["**kwargs", "*args", "kwargs", "args", "**k", "*a"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_a${++idx}`, title: "Set", desc: "Create set", code: `___([1, 2, 3])`, answer: "set", choices: shuffleChoices("set", ["set", "list", "tuple", "dict", "frozenset", "array"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_a${++idx}`, title: "Tuple", desc: "Create tuple", code: `t = (1, 2, ___)`, answer: "3", choices: shuffleChoices("3", ["3", "4", "5", "6", "7", "8"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_a${++idx}`, title: "Enumerate", desc: "Indexed loop", code: `for i, val in ___(${pick(['items', 'arr', 'list'])}):`, answer: "enumerate", choices: shuffleChoices("enumerate", ["enumerate", "range", "zip", "count", "index", "iterate"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_a${++idx}`, title: "Zip", desc: "Combine iterables", code: `for a, b in ___(list1, list2):`, answer: "zip", choices: shuffleChoices("zip", ["zip", "enumerate", "map", "combine", "merge", "pair"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_a${++idx}`, title: "Any/All", desc: "Check condition", code: `${pick(['any', 'all'])}(${pick(['x > 0 for x in items', 'x%2==0 for x in nums'])})`, answer: pick(['any', 'all']), choices: shuffleChoices(pick(['any', 'all']), ['any', 'all', 'every', 'some', 'none', 'exists']) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_a${++idx}`, title: "F-String", desc: "Formatted string", code: `f"${pick(['{name}', '{score}', '{value}', '{total}'])}"`, answer: pick(['{name}', '{score}', '{value}', '{total}']), choices: shuffleChoices(pick(['{name}', '{score}', '{value}', '{total}']), ['{x}', '{val}', '{num}', '{item}', '{key}', '{data}']) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_a${++idx}`, title: "Try/Except", desc: "Exception handling", code: `___:\n  pass\nexcept:`, answer: "try", choices: shuffleChoices("try", ["try", "except", "finally", "raise", "if", "with"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_a${++idx}`, title: "Raise", desc: "Raise error", code: `___ ValueError("${pick(['bad', 'invalid', 'error', 'fail'])}")`, answer: "raise", choices: shuffleChoices("raise", ["raise", "throw", "error", "except", "try", "assert"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_a${++idx}`, title: "Pass", desc: "Do nothing", code: `def fn():\n  ___`, answer: "pass", choices: shuffleChoices("pass", ["pass", "continue", "break", "return", "skip", "none"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_a${++idx}`, title: "Global", desc: "Global keyword", code: `___ ${pick(b.vars)}`, answer: "global", choices: shuffleChoices("global", ["global", "nonlocal", "local", "public", "static", "outer"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_a${++idx}`, title: "Sorted", desc: "Sorted function", code: `___(${pick(['items', 'arr', 'list', 'nums'])})`, answer: "sorted", choices: shuffleChoices("sorted", ["sorted", "sort", "reversed", "order", "arrange", "organize"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_a${++idx}`, title: "Reversed", desc: "Reverse iterator", code: `___(items)`, answer: "reversed", choices: shuffleChoices("reversed", ["reversed", "reverse", "sorted", "sort", "invert", "backwards"]) });
    }
  }

  else if (tierKey === 'expert') {
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_e${++idx}`, title: "Decorator", desc: "Decorator syntax", code: `___my_decorator\ndef fn():`, answer: "@", choices: shuffleChoices("@", ["@", "#", "&", "$", "!", "%"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_e${++idx}`, title: "Generator Y", desc: "Yield keyword", code: `def gen():\n  ___ ${pick(b.vars)}`, answer: "yield", choices: shuffleChoices("yield", ["yield", "return", "send", "next", "emit", "give"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_e${++idx}`, title: "Context Mgr", desc: "With statement", code: `___ open('f.txt') as f:`, answer: "with", choices: shuffleChoices("with", ["with", "using", "open", "as", "in", "try"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_e${++idx}`, title: "Async Def", desc: "Async function", code: `___ def fetch():`, answer: "async", choices: shuffleChoices("async", ["async", "await", "sync", "defer", "delay", "wait"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_e${++idx}`, title: "Await", desc: "Await coroutine", code: `data = ___ fetch(url)`, answer: "await", choices: shuffleChoices("await", ["await", "async", "yield", "then", "get", "run"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_e${++idx}`, title: "Class", desc: "Define class", code: `___ ${pick(['Player', 'Enemy', 'Tower', 'Hero'])}:`, answer: "class", choices: shuffleChoices("class", ["class", "def", "type", "struct", "object", "interface"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_e${++idx}`, title: "Init", desc: "Constructor", code: `def ___${pick(['__init__', '__new__', '__call__'])}:`, answer: pick(['__init__', '__new__', '__call__']), choices: shuffleChoices(pick(['__init__', '__new__', '__call__']), ['__init__', '__new__', '__call__', 'init', 'build', 'create']) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_e${++idx}`, title: "Self", desc: "Instance param", code: `def __init__(___):`, answer: "self", choices: shuffleChoices("self", ["self", "this", "me", "instance", "obj", "cls"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_e${++idx}`, title: "Super", desc: "Parent init", code: `___().__init__()`, answer: "super", choices: shuffleChoices("super", ["super", "parent", "base", "self", "cls", "object"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_e${++idx}`, title: "Property", desc: "Property decorator", code: `___\ndef ${pick(b.vars)}(self):`, answer: "@property", choices: shuffleChoices("@property", ["@property", "@staticmethod", "@classmethod", "@abstract", "@setter", "@deleter"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_e${++idx}`, title: "Static", desc: "Static method", code: `@___\ndef ${pick(b.vars)}():`, answer: "staticmethod", choices: shuffleChoices("staticmethod", ["staticmethod", "classmethod", "property", "abstractmethod", "lru_cache", "wraps"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_e${++idx}`, title: "Iter", desc: "Make iterable", code: `def ___${pick(['__iter__', '__next__', '__getitem__'])}:`, answer: pick(['__iter__', '__next__', '__getitem__']), choices: shuffleChoices(pick(['__iter__', '__next__', '__getitem__']), ['__iter__', '__next__', '__getitem__', '__len__', '__str__', '__repr__']) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_e${++idx}`, title: "Str", desc: "String repr", code: `def ___${pick(['__str__', '__repr__', '__format__'])}:`, answer: pick(['__str__', '__repr__', '__format__']), choices: shuffleChoices(pick(['__str__', '__repr__', '__format__']), ['__str__', '__repr__', '__format__', '__len__', '__iter__', '__call__']) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_e${++idx}`, title: "Abstract", desc: "ABC decorator", code: `from abc import ABC, ___method`, answer: "abstract", choices: shuffleChoices("abstract", ["abstract", "abstractclass", "interface", "virtual", "pure", "base"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_e${++idx}`, title: "Dataclass", desc: "Data class", code: `@___\nclass Point:`, answer: "dataclass", choices: shuffleChoices("dataclass", ["dataclass", "namedtuple", "dataclasses", "attrs", "record", "struct"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_e${++idx}`, title: "Enum", desc: "Define enum", code: `from enum import ___`, answer: "Enum", choices: shuffleChoices("Enum", ["Enum", "IntEnum", "auto", "unique", "Flag", "IntFlag"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_e${++idx}`, title: "LRU", desc: "Cache decorator", code: `@___.lru_cache(maxsize=${pick([32, 64, 128, 256])})`, answer: "functools", choices: shuffleChoices("functools", ["functools", "itertools", "operator", "cachetools", "functools", "collections"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_e${++idx}`, title: "Itertools", desc: "Chain iterables", code: `itertools.___(list1, list2)`, answer: "chain", choices: shuffleChoices("chain", ["chain", "zip_longest", "product", "combinations", "permutations", "cycle"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_e${++idx}`, title: "Partial", desc: "Partial function", code: `from functools import ___`, answer: "partial", choices: shuffleChoices("partial", ["partial", "reduce", "lru_cache", "wraps", "singledispatch", "cache"]) });
    }
    for (let i = 0; i < 5; i++) {
      pool.push({ id: `py_e${++idx}`, title: "Type Hint", desc: "Type annotation", code: `def fn(x: ___) -> int:`, answer: "int", choices: shuffleChoices("int", ["int", "str", "float", "bool", "list", "dict"]) });
    }
  }

  while (pool.length < 100) {
    const dup = { ...pool[idx % (pool.length || 1)], id: `py_${tierKey[0]}${++idx}` };
    dup.title = dup.title + ' ' + idx;
    pool.push(dup);
  }
  return pool.slice(0, 100);
}

function generateHTMLPool(tierKey) {
  const pool = [];
  let idx = 0;

  const htmlTags = ['div', 'span', 'p', 'h1', 'h2', 'h3', 'a', 'img', 'ul', 'ol', 'li', 'table', 'form', 'input', 'button', 'section', 'header', 'footer', 'nav', 'main'];
  const cssProps = ['display', 'position', 'margin', 'padding', 'color', 'background', 'font-size', 'border', 'width', 'height', 'flex', 'grid', 'align-items', 'justify-content', 'gap', 'opacity', 'transform', 'transition', 'animation', 'z-index'];
  const cssVals = ['flex', 'block', 'inline', 'grid', 'absolute', 'relative', 'fixed', 'none', 'auto', 'center', '1px', '100%', '10px', '0', 'hidden', 'wrap', 'column', 'row', 'both', 'cover'];

  if (tierKey === 'beginner') {
    for (let i = 0; i < 100; i++) {
      const tag = pick(htmlTags.slice(0, 10));
      pool.push({ id: `h_b${++idx}`, title: "Tag " + tag, desc: `<${tag}> element`, code: `<___>content</___>`, answer: tag, choices: shuffleChoices(tag, pickN(htmlTags, 5, tag)) });
    }
  } else if (tierKey === 'intermediate') {
    const attrs = ['class', 'id', 'href', 'src', 'alt', 'type', 'name', 'value', 'placeholder', 'style'];
    for (let i = 0; i < 40; i++) {
      const attr = pick(attrs);
      pool.push({ id: `h_i${++idx}`, title: "Attr " + attr, desc: `${attr} attribute`, code: `<div ___="value">`, answer: attr, choices: shuffleChoices(attr, pickN(attrs, 5, attr)) });
    }
    for (let i = 0; i < 40; i++) {
      pool.push({ id: `h_i${++idx}`, title: "Input Type", desc: "Input type attribute", code: `<input ___="${pick(['text', 'number', 'email', 'password', 'submit', 'checkbox'])}" />`, answer: "type", choices: shuffleChoices("type", ["type", "kind", "format", "style", "class", "mode"]) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `h_i${++idx}`, title: "Semantic", desc: "Semantic tag", code: `<___>content</___>`, answer: pick(['section', 'article', 'nav', 'header', 'footer', 'main']), choices: shuffleChoices(pick(['section', 'article', 'nav', 'header', 'footer', 'main']), ['section', 'article', 'nav', 'header', 'footer', 'main']) });
    }
  } else if (tierKey === 'advanced') {
    for (let i = 0; i < 30; i++) {
      const prop = pick(['flex', 'grid', 'inline', 'block', 'none', 'inline-block']);
      pool.push({ id: `h_a${++idx}`, title: "Display", desc: "Display value", code: `display: ___;`, answer: prop, choices: shuffleChoices(prop, ['flex', 'grid', 'block', 'inline', 'none', 'inline-block']) });
    }
    for (let i = 0; i < 25; i++) {
      const pos = pick(['absolute', 'relative', 'fixed', 'sticky', 'static']);
      pool.push({ id: `h_a${++idx}`, title: "Position", desc: "Position value", code: `position: ___;`, answer: pos, choices: shuffleChoices(pos, ['absolute', 'relative', 'fixed', 'sticky', 'static', 'float']) });
    }
    for (let i = 0; i < 25; i++) {
      pool.push({ id: `h_a${++idx}`, title: "Flex Prop", desc: "Flex property", code: `flex-${pick(['direction', 'wrap', 'grow', 'shrink', 'basis'])}: ${pick(['row', 'column', 'wrap', '1', '0', 'auto'])};`, answer: pick(['row', 'column', 'wrap', '1', '0', 'auto']), choices: shuffleChoices(pick(['row', 'column', 'wrap', '1', '0', 'auto']), ['row', 'column', 'wrap', '1', '0', 'auto']) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `h_a${++idx}`, title: "Pseudo", desc: "Pseudo-class", code: `a:___ { color: red; }`, answer: pick(['hover', 'active', 'focus', 'visited', 'first-child', 'last-child']), choices: shuffleChoices(pick(['hover', 'active', 'focus', 'visited', 'first-child', 'last-child']), ['hover', 'active', 'focus', 'visited', 'first-child', 'last-child']) });
    }
  } else if (tierKey === 'expert') {
    for (let i = 0; i < 25; i++) {
      pool.push({ id: `h_e${++idx}`, title: "Animation", desc: "Animation property", code: `animation: ___ ${pick(['2s', '1s', '500ms', '3s'])};`, answer: pick(['slide', 'fade', 'spin', 'bounce', 'pulse', 'shake']), choices: shuffleChoices(pick(['slide', 'fade', 'spin', 'bounce', 'pulse', 'shake']), ['slide', 'fade', 'spin', 'bounce', 'pulse', 'shake']) });
    }
    for (let i = 0; i < 25; i++) {
      pool.push({ id: `h_e${++idx}`, title: "Grid", desc: "Grid property", code: `grid-template-${pick(['columns', 'rows', 'areas'])}: ${pick(['1fr 1fr', 'repeat(3,1fr)', 'auto auto', '200px 1fr'])};`, answer: pick(['columns', 'rows', 'areas']), choices: shuffleChoices(pick(['columns', 'rows', 'areas']), ['columns', 'rows', 'areas', 'gap', 'auto', 'template']) });
    }
    for (let i = 0; i < 25; i++) {
      pool.push({ id: `h_e${++idx}`, title: "Media Query", desc: "Responsive breakpoint", code: `@___ (max-width: 768px) { }`, answer: "media", choices: shuffleChoices("media", ["media", "screen", "container", "viewport", "supports", "document"]) });
    }
    for (let i = 0; i < 25; i++) {
      pool.push({ id: `h_e${++idx}`, title: "Custom Prop", desc: "CSS variable", code: `--${pick(['primary', 'bg', 'text', 'accent', 'border'])}: ${pick(['#fff', '#000', 'blue', 'red', '10px', '1rem'])};`, answer: pick(['#fff', '#000', 'blue', 'red', '10px', '1rem']), choices: shuffleChoices(pick(['#fff', '#000', 'blue', 'red', '10px', '1rem']), ['#fff', '#000', 'blue', 'red', '10px', '1rem']) });
    }
  }

  while (pool.length < 100) {
    const dup = { ...pool[idx % (pool.length || 1)], id: `h_${tierKey[0]}${++idx}` };
    pool.push(dup);
  }
  return pool.slice(0, 100);
}

function pickN(arr, n, exclude) {
  const filtered = arr.filter(x => x !== exclude);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function generateSQLPool(tierKey) {
  const pool = [];
  let idx = 0;

  if (tierKey === 'beginner') {
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `s_b${++idx}`, title: "SELECT", desc: "Select query", code: `___ * FROM ${pick(['users', 'items', 'scores', 'players', 'enemies', 'towers'])}`, answer: "SELECT", choices: shuffleChoices("SELECT", ["SELECT", "GET", "FIND", "SHOW", "READ", "FETCH"]) });
    }
    for (let i = 0; i < 20; i++) {
      const tbl = pick(['users', 'items', 'scores', 'players', 'enemies', 'towers']);
      pool.push({ id: `s_b${++idx}`, title: "FROM", desc: "From clause", code: `SELECT * ___ ${tbl}`, answer: "FROM", choices: shuffleChoices("FROM", ["FROM", "IN", "AT", "OF", "ON", "TO"]) });
    }
    for (let i = 0; i < 20; i++) {
      const op = pick(['=', '<', '>', '!=', 'LIKE', 'IN']);
      pool.push({ id: `s_b${++idx}`, title: "WHERE", desc: `${op} condition`, code: `WHERE id ___ ${pick(['1', '10', '100', '5', '50'])}`, answer: op, choices: shuffleChoices(op, ["=", "<", ">", "!=", "LIKE", "IN"]) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `s_b${++idx}`, title: "SELECT Col", desc: "Select column", code: `___ ${pick(['name', 'score', 'id', 'email', 'level', 'type'])} FROM users`, answer: "SELECT", choices: shuffleChoices("SELECT", ["SELECT", "GET", "FIND", "FETCH", "SHOW", "RETRIEVE"]) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `s_b${++idx}`, title: "Semicolon", desc: "End query", code: `SELECT * FROM users___`, answer: ";", choices: shuffleChoices(";", [";", ",", ":", ".", "!", "?"]) });
    }
  } else if (tierKey === 'intermediate') {
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `s_i${++idx}`, title: "INSERT", desc: "Insert keyword", code: `___ INTO ${pick(['users', 'items', 'scores', 'players'])} VALUES (${pick(['1', "('a',1)", '(1,2,3)'])})`, answer: "INSERT", choices: shuffleChoices("INSERT", ["INSERT", "ADD", "PUT", "CREATE", "MAKE", "NEW"]) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `s_i${++idx}`, title: "UPDATE", desc: "Update keyword", code: `___ ${pick(['users', 'items', 'scores'])} SET ${pick(['name', 'score', 'level'])} = ${pick(['1', "'a'", '10'])}`, answer: "UPDATE", choices: shuffleChoices("UPDATE", ["UPDATE", "SET", "ALTER", "CHANGE", "MODIFY", "EDIT"]) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `s_i${++idx}`, title: "DELETE", desc: "Delete keyword", code: `___ FROM ${pick(['users', 'items', 'logs', 'sessions'])} WHERE id=${pick(['1', '10', '100'])}`, answer: "DELETE", choices: shuffleChoices("DELETE", ["DELETE", "DROP", "REMOVE", "CLEAR", "ERASE", "KILL"]) });
    }
    for (let i = 0; i < 20; i++) {
      const dir = pick(['ASC', 'DESC']);
      pool.push({ id: `s_i${++idx}`, title: "ORDER BY", desc: "Sort results", code: `ORDER BY score ___`, answer: dir, choices: shuffleChoices(dir, ["ASC", "DESC", "SORT", "ORDER", "UP", "DOWN"]) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `s_i${++idx}`, title: "LIMIT", desc: "Limit results", code: `LIMIT ___`, answer: String(pick([1, 5, 10, 20, 50, 100])), choices: shuffleChoices(String(pick([1, 5, 10, 20, 50, 100])), ['1', '5', '10', '20', '50', '100']) });
    }
  } else if (tierKey === 'advanced') {
    for (let i = 0; i < 25; i++) {
      const tbl1 = pick(['users', 'orders', 'players', 'items']);
      const tbl2 = pick(['profiles', 'payments', 'inventory', 'reviews']);
      pool.push({ id: `s_a${++idx}`, title: "JOIN", desc: "Join tables", code: `SELECT * FROM ${tbl1} ___ ${tbl2}`, answer: "JOIN", choices: shuffleChoices("JOIN", ["JOIN", "MERGE", "LINK", "MATCH", "COMBINE", "UNION"]) });
    }
    for (let i = 0; i < 25; i++) {
      pool.push({ id: `s_a${++idx}`, title: "ON", desc: "Join condition", code: `JOIN orders ___ user_id = id`, answer: "ON", choices: shuffleChoices("ON", ["ON", "AT", "IN", "WHERE", "WITH", "FOR"]) });
    }
    for (let i = 0; i < 25; i++) {
      const col = pick(['city', 'type', 'status', 'category', 'level', 'department']);
      pool.push({ id: `s_a${++idx}`, title: "GROUP BY", desc: "Group rows", code: `SELECT COUNT(*) ___ ${col}`, answer: "GROUP BY", choices: shuffleChoices("GROUP BY", ["GROUP BY", "ORDER BY", "HAVING", "SORT BY", "FILTER", "PARTITION"]) });
    }
    for (let i = 0; i < 25; i++) {
      const agg = pick(['COUNT', 'SUM', 'AVG', 'MIN', 'MAX']);
      pool.push({ id: `s_a${++idx}`, title: agg, desc: `${agg} function`, code: `SELECT ___(score) FROM scores`, answer: agg, choices: shuffleChoices(agg, ["COUNT", "SUM", "AVG", "MIN", "MAX", "TOTAL"]) });
    }
  } else if (tierKey === 'expert') {
    for (let i = 0; i < 25; i++) {
      pool.push({ id: `s_e${++idx}`, title: "Subquery", desc: "Nested query", code: `SELECT * FROM (___) AS sub`, answer: "SELECT", choices: shuffleChoices("SELECT", ["SELECT", "WHERE", "FROM", "WITH", "TABLE", "VIEW"]) });
    }
    for (let i = 0; i < 25; i++) {
      pool.push({ id: `s_e${++idx}`, title: "Index", desc: "Create index", code: `CREATE ___ idx ON users(id)`, answer: "INDEX", choices: shuffleChoices("INDEX", ["INDEX", "KEY", "UNIQUE", "PRIMARY", "CLUSTER", "HASH"]) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `s_e${++idx}`, title: "View", desc: "Create view", code: `CREATE ___ AS SELECT * FROM users`, answer: "VIEW", choices: shuffleChoices("VIEW", ["VIEW", "TABLE", "INDEX", "PROCEDURE", "FUNCTION", "TRIGGER"]) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `s_e${++idx}`, title: "Transaction", desc: "Begin transaction", code: `BEGIN ___`, answer: "TRANSACTION", choices: shuffleChoices("TRANSACTION", ["TRANSACTION", "WORK", "COMMIT", "ROLLBACK", "SAVEPOINT", "LOCK"]) });
    }
    for (let i = 0; i < 10; i++) {
      pool.push({ id: `s_e${++idx}`, title: "CTE", desc: "Common Table Expression", code: `___ ${pick(['top_scores', 'recent_users', 'active_games'])} AS (`, answer: "WITH", choices: shuffleChoices("WITH", ["WITH", "AS", "TABLE", "VIEW", "FROM", "SELECT"]) });
    }
  }

  while (pool.length < 100) {
    const dup = { ...pool[idx % (pool.length || 1)], id: `s_${tierKey[0]}${++idx}` };
    pool.push(dup);
  }
  return pool.slice(0, 100);
}

function generateReactPool(tierKey) {
  const pool = [];
  let idx = 0;

  if (tierKey === 'beginner') {
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `r_b${++idx}`, title: "Export", desc: "Export component", code: `___ default function ${pick(['App', 'Game', 'Home', 'Board', 'Tower', 'Enemy'])}() {}`, answer: "export", choices: shuffleChoices("export", ["export", "import", "share", "out", "send", "expose"]) });
    }
    for (let i = 0; i < 20; i++) {
      const tag = pick(['div', 'span', 'p', 'h1', 'section', 'main']);
      pool.push({ id: `r_b${++idx}`, title: "JSX", desc: "JSX element", code: `return <___>Hello</___>`, answer: tag, choices: shuffleChoices(tag, ['div', 'span', 'p', 'h1', 'section', 'main']) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `r_b${++idx}`, title: "Import", desc: "Import React", code: `___ React from 'react'`, answer: "import", choices: shuffleChoices("import", ["import", "from", "require", "use", "get", "load"]) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `r_b${++idx}`, title: "ClassName", desc: "CSS class", code: `<div ___="${pick(['container', 'wrapper', 'card', 'box', 'flex', 'grid'])}">`, answer: "className", choices: shuffleChoices("className", ["className", "class", "classname", "css", "styles", "style"]) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `r_b${++idx}`, title: "Fragment", desc: "React fragment", code: `return <___> <div /> <div /> </___>`, answer: "Fragment", choices: shuffleChoices("Fragment", ["Fragment", "div", "span", "section", "main", "template"]) });
    }
  } else if (tierKey === 'intermediate') {
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `r_i${++idx}`, title: "Props", desc: "Component props", code: `function App(___) { }`, answer: "props", choices: shuffleChoices("props", ["props", "state", "data", "args", "input", "params"]) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `r_i${++idx}`, title: "useState", desc: "State hook", code: `const [c, setC] = ___(${pick(['0', 'false', "''", 'null', '[]', '{}'])})`, answer: "useState", choices: shuffleChoices("useState", ["useState", "useEffect", "useRef", "useMemo", "useCallback", "useReducer"]) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `r_i${++idx}`, title: "onClick", desc: "Click handler", code: `<button ___={handleClick}>`, answer: "onClick", choices: shuffleChoices("onClick", ["onClick", "onPress", "onTap", "onSelect", "onChange", "onSubmit"]) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `r_i${++idx}`, title: "onChange", desc: "Input handler", code: `<input ___={(e) => setVal(e.target.value)} />`, answer: "onChange", choices: shuffleChoices("onChange", ["onChange", "onInput", "onBlur", "onKeyDown", "onSubmit", "onSelect"]) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `r_i${++idx}`, title: "Conditional", desc: "Conditional render", code: `{condition && <___ />}`, answer: pick(['Component', 'div', 'span', 'p', 'h1']), choices: shuffleChoices(pick(['Component', 'div', 'span', 'p', 'h1']), ['Component', 'div', 'span', 'p', 'h1', 'section']) });
    }
  } else if (tierKey === 'advanced') {
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `r_a${++idx}`, title: "useEffect", desc: "Effect hook", code: `___(() => {}, [])`, answer: "useEffect", choices: shuffleChoices("useEffect", ["useEffect", "useState", "useRef", "useRun", "useFetch", "useLoad"]) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `r_a${++idx}`, title: "useRef", desc: "Ref hook", code: `const ref = ___(${pick(['null', '0', "''"])})`, answer: "useRef", choices: shuffleChoices("useRef", ["useRef", "useState", "useEffect", "useMemo", "useCallback", "useImperativeHandle"]) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `r_a${++idx}`, title: "useMemo", desc: "Memoize value", code: `const val = ___(() => compute(), [deps])`, answer: "useMemo", choices: shuffleChoices("useMemo", ["useMemo", "useCallback", "useEffect", "useRef", "useReducer", "useState"]) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `r_a${++idx}`, title: "useCallback", desc: "Memoize fn", code: `const fn = ___(() => {}, [deps])`, answer: "useCallback", choices: shuffleChoices("useCallback", ["useCallback", "useMemo", "useEffect", "useRef", "useReducer", "useState"]) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `r_a${++idx}`, title: "Map Render", desc: "Render list", code: `items.___(item => <li key={item.id}>{item.name}</li>)`, answer: "map", choices: shuffleChoices("map", ["map", "forEach", "filter", "reduce", "find", "sort"]) });
    }
  } else if (tierKey === 'expert') {
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `r_e${++idx}`, title: "Context", desc: "Create context", code: `const Ctx = React.___Context()`, answer: "create", choices: shuffleChoices("create", ["create", "make", "new", "use", "get", "set"]) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `r_e${++idx}`, title: "useContext", desc: "Use context", code: `const ctx = ___ (MyContext)`, answer: "useContext", choices: shuffleChoices("useContext", ["useContext", "useState", "useEffect", "useRef", "useMemo", "useCallback"]) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `r_e${++idx}`, title: "Custom Hook", desc: "Custom hook name", code: `function ___() { return useState(0) }`, answer: "useMyHook", choices: shuffleChoices("useMyHook", ["useMyHook", "myHook", "MyHook", "hookMy", "usehook", "createHook"]) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `r_e${++idx}`, title: "useReducer", desc: "Reducer hook", code: `const [state, dispatch] = ___ (reducer, initState)`, answer: "useReducer", choices: shuffleChoices("useReducer", ["useReducer", "useState", "useContext", "useRef", "useMemo", "useCallback"]) });
    }
    for (let i = 0; i < 20; i++) {
      pool.push({ id: `r_e${++idx}`, title: "memo", desc: "Memo component", code: `export default React.___(MyComponent)`, answer: "memo", choices: shuffleChoices("memo", ["memo", "forwardRef", "lazy", "createElement", "cloneElement", "PureComponent"]) });
    }
  }

  while (pool.length < 100) {
    const dup = { ...pool[idx % (pool.length || 1)], id: `r_${tierKey[0]}${++idx}` };
    pool.push(dup);
  }
  return pool.slice(0, 100);
}

function generateLockedStackPool(id, tierKey) {
  const pool = [];
  let idx = 0;
  const arr = Array.from({ length: 100 }, (_, i) => i + 1);
  const answers = ['a', 'b', 'c', 'd', 'e', 'f'];
  for (const n of arr) {
    pool.push({
      id: `${id}_${tierKey[0]}${n}`,
      title: `${id.toUpperCase()} ${tierKey} ${n}`,
      desc: `Fill the blank`,
      code: `___`,
      answer: pick(answers),
      choices: shuffleChoices(pick(answers), answers.filter(x => x !== pick(answers))),
    });
  }
  return pool;
}

function repairPool(pool) {
  return pool.map(c => {
    if (c.choices.includes(c.answer)) return c;
    const choices = [...c.choices];
    choices[Math.floor(Math.random() * choices.length)] = c.answer;
    return { ...c, choices };
  });
}

const CHALLENGE_POOLS = (function buildPools() {
  const tiers = ['beginner', 'intermediate', 'advanced', 'expert'];
  return {
    js: Object.fromEntries(tiers.map(t => [t, repairPool(generateJSPool(t))])),
    py: Object.fromEntries(tiers.map(t => [t, repairPool(generatePyPool(t))])),
    html: Object.fromEntries(tiers.map(t => [t, repairPool(generateHTMLPool(t))])),
    sql: Object.fromEntries(tiers.map(t => [t, repairPool(generateSQLPool(t))])),
    react: Object.fromEntries(tiers.map(t => [t, repairPool(generateReactPool(t))])),
    cpp: Object.fromEntries(tiers.map(t => [t, repairPool(generateLockedStackPool('cpp', t))])),
    go: Object.fromEntries(tiers.map(t => [t, repairPool(generateLockedStackPool('go', t))])),
    rust: Object.fromEntries(tiers.map(t => [t, repairPool(generateLockedStackPool('rust', t))])),
    ts: Object.fromEntries(tiers.map(t => [t, repairPool(generateLockedStackPool('ts', t))])),
  };
})();

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
    pool = fallback || Array.from({ length: 100 }, (_, i) => ({
      id: `fallback_${i}`, title: 'Code', desc: 'Fill in the blank', code: '___',
      answer: 'a', choices: ['a', 'b', 'c', 'd', 'e', 'f'],
    }));
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

  const levelSeed = levelNum * 7;
  const startIdx = levelSeed % shuffledPool.length;
  const levelChallenges = Array.from({ length: spotCount }, (_, i) => ({
    ...shuffledPool[(startIdx + i) % shuffledPool.length],
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
  { id: 'js', name: 'JavaScript', icon: '🟨', color: '#f7df1e', bgColor: 'rgba(247,223,30,0.1)', levels: TOTAL_LEVELS, unlockRequirement: null },
  { id: 'py', name: 'Python', icon: '🐍', color: '#3572A5', bgColor: 'rgba(53,114,165,0.1)', levels: TOTAL_LEVELS, unlockRequirement: null },
  { id: 'html', name: 'HTML/CSS', icon: '🌐', color: '#e34c26', bgColor: 'rgba(227,76,38,0.1)', levels: TOTAL_LEVELS, unlockRequirement: null },
  { id: 'sql', name: 'SQL', icon: '🗄️', color: '#00618a', bgColor: 'rgba(0,97,138,0.1)', levels: TOTAL_LEVELS, unlockRequirement: null },
  { id: 'react', name: 'React', icon: '⚛️', color: '#61dafb', bgColor: 'rgba(97,218,251,0.1)', levels: TOTAL_LEVELS, unlockRequirement: null },
  { id: 'cpp', name: 'C++', icon: '⚙️', color: '#00599C', bgColor: 'rgba(0,89,156,0.1)', levels: TOTAL_LEVELS, unlockRequirement: true },
  { id: 'go', name: 'Go', icon: '🔷', color: '#00ADD8', bgColor: 'rgba(0,173,216,0.1)', levels: TOTAL_LEVELS, unlockRequirement: true },
  { id: 'rust', name: 'Rust', icon: '🦀', color: '#DEA584', bgColor: 'rgba(222,165,132,0.1)', levels: TOTAL_LEVELS, unlockRequirement: true },
  { id: 'ts', name: 'TypeScript', icon: '🔷', color: '#3178C6', bgColor: 'rgba(49,120,198,0.1)', levels: TOTAL_LEVELS, unlockRequirement: true },
];

export default TECH_STACKS;
