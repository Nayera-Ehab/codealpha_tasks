'use strict';

/* ============================================================
   ProCalc — application state
   ============================================================ */
const STORAGE_KEYS = {
  history: 'procalc.history',
  theme: 'procalc.theme',
  decimals: 'procalc.decimals',
  angle: 'procalc.angle',
  mode: 'procalc.mode'
};

const state = {
  tokens: [],          // the live expression, as an array of token objects
  angleMode: localStorage.getItem(STORAGE_KEYS.angle) || 'DEG',
  decimals: parseInt(localStorage.getItem(STORAGE_KEYS.decimals) || '4', 10),
  theme: localStorage.getItem(STORAGE_KEYS.theme) || 'dark',
  mode: localStorage.getItem(STORAGE_KEYS.mode) || 'standard',
  memory: 0,
  history: [],
  lastFinalResult: null,   // number shown after "=" was pressed
  justEvaluated: false     // true right after "=" — next digit starts fresh
};

try {
  state.history = JSON.parse(localStorage.getItem(STORAGE_KEYS.history) || '[]');
} catch (e) {
  state.history = [];
}

const THEME_CYCLE = ['dark', 'light', 'emerald'];

/* ============================================================
   DOM references
   ============================================================ */
const el = {
  body: document.body,
  expression: document.getElementById('expression'),
  result: document.getElementById('result'),
  keypad: document.querySelector('.keypad'),
  sciGrid: document.getElementById('sciGrid'),
  angleMode: document.getElementById('angleMode'),
  tabStandard: document.getElementById('tab-standard'),
  tabScientific: document.getElementById('tab-scientific'),
  themeToggle: document.getElementById('themeToggle'),
  settingsToggle: document.getElementById('settingsToggle'),
  settingsPanel: document.getElementById('settingsPanel'),
  settingsScrim: document.getElementById('settingsScrim'),
  settingsClose: document.getElementById('settingsClose'),
  themeSwatches: document.getElementById('themeSwatches'),
  decimalChoice: document.getElementById('decimalChoice'),
  historyToggle: document.getElementById('historyToggle'),
  historyPanel: document.getElementById('historyPanel'),
  historyClose: document.getElementById('historyClose'),
  historyScrim: document.getElementById('historyScrim'),
  historyList: document.getElementById('historyList'),
  historyEmpty: document.getElementById('historyEmpty'),
  historySearch: document.getElementById('historySearch'),
  clearHistoryBtn: document.getElementById('clearHistory'),
  copyResultBtn: document.getElementById('copyResult'),
  liveAnnounce: document.getElementById('liveAnnounce')
};

/* ============================================================
   Tokenizer helpers — building the token stream from user input
   ============================================================ */
const OPERATORS = new Set(['+', '−', '×', '÷', '^']);
const FUNCTIONS = { sin: 'sin', cos: 'cos', tan: 'tan', asin: 'sin⁻¹', acos: 'cos⁻¹', atan: 'tan⁻¹', log: 'log', ln: 'ln', sqrt: '√', abs: 'abs' };

function lastToken() {
  return state.tokens[state.tokens.length - 1] || null;
}

function isCompletedValue(tok) {
  // a token that can legally be followed by an operator / postfix / implicit multiply
  return tok && (tok.type === 'num' || tok.type === 'rparen' || tok.type === 'const' || tok.type === 'postfix');
}

function pushToken(tok) {
  state.tokens.push(tok);
}

function appendNumber(digit) {
  if (state.justEvaluated) {
    state.tokens = [];
    state.justEvaluated = false;
  }
  const last = lastToken();
  if (last && last.type === 'num') {
    last.value += digit;
  } else {
    if (isCompletedValue(last)) {
      // implicit multiplication: "5" then "3" should NOT merge automatically for typed digits,
      // digits always start a new number only if previous is an operator/paren/func/nothing.
      // If previous is a completed value, insert implicit × first (e.g. after ")" or const).
      pushToken({ type: 'op', value: '×' });
    }
    pushToken({ type: 'num', value: digit });
  }
  afterChange();
}

function appendDecimal() {
  if (state.justEvaluated) {
    state.tokens = [];
    state.justEvaluated = false;
  }
  const last = lastToken();
  if (last && last.type === 'num') {
    if (!last.value.includes('.')) last.value += '.';
  } else {
    if (isCompletedValue(last)) pushToken({ type: 'op', value: '×' });
    pushToken({ type: 'num', value: '0.' });
  }
  afterChange();
}

function appendOperator(op) {
  state.justEvaluated = false;
  const last = lastToken();

  if (!last) {
    if (op === '−') { pushToken({ type: 'op', value: '−' }); afterChange(); }
    return;
  }

  if (last.type === 'op') {
    if (op === '−') {
      // allow chained unary minuses after an operator
      pushToken({ type: 'op', value: '−' });
    } else {
      last.value = op; // replace trailing operator
    }
    afterChange();
    return;
  }

  if (last.type === 'lparen' || last.type === 'func') {
    if (op === '−') pushToken({ type: 'op', value: '−' });
    afterChange();
    return;
  }

  // last is a completed value -> normal binary operator
  pushToken({ type: 'op', value: op });
  afterChange();
}

function appendParen(paren) {
  state.justEvaluated = false;
  const last = lastToken();

  if (paren === '(') {
    if (isCompletedValue(last)) pushToken({ type: 'op', value: '×' });
    pushToken({ type: 'lparen', value: '(' });
  } else {
    const open = state.tokens.filter(t => t.type === 'lparen').length;
    const close = state.tokens.filter(t => t.type === 'rparen').length;
    if (open > close && isCompletedValue(last)) {
      pushToken({ type: 'rparen', value: ')' });
    }
  }
  afterChange();
}

function appendFunction(fnKey) {
  state.justEvaluated = false;
  const last = lastToken();
  if (isCompletedValue(last)) pushToken({ type: 'op', value: '×' });
  pushToken({ type: 'func', value: fnKey, display: FUNCTIONS[fnKey] });
  pushToken({ type: 'lparen', value: '(' });
  afterChange();
}

function appendConstant(symbol) {
  if (state.justEvaluated) {
    state.tokens = [];
    state.justEvaluated = false;
  }
  const last = lastToken();
  if (isCompletedValue(last)) pushToken({ type: 'op', value: '×' });
  pushToken({ type: 'const', value: symbol });
  afterChange();
}

function appendPostfix(symbol) {
  state.justEvaluated = false;
  const last = lastToken();
  if (isCompletedValue(last) && last.type !== 'postfix') {
    pushToken({ type: 'postfix', value: symbol });
  } else if (last && last.type === 'postfix') {
    pushToken({ type: 'postfix', value: symbol }); // allow chaining e.g. 5%%
  }
  afterChange();
}

function appendPower() {
  appendOperator('^');
}

function appendSquare() {
  const last = lastToken();
  if (isCompletedValue(last)) {
    pushToken({ type: 'op', value: '^' });
    pushToken({ type: 'num', value: '2' });
    afterChange();
  }
}

function toggleSign() {
  const last = lastToken();
  if (last && last.type === 'num') {
    last.value = last.value.startsWith('-') ? last.value.slice(1) : '-' + last.value;
    afterChange();
  } else if (last && (last.type === 'rparen' || last.type === 'const')) {
    // wrap trailing value in unary minus by inserting a "× -1"
    pushToken({ type: 'op', value: '×' });
    pushToken({ type: 'num', value: '-1' });
    afterChange();
  }
}

function deleteLast() {
  state.justEvaluated = false;
  const last = lastToken();
  if (!last) return;
  if (last.type === 'num' && last.value.length > 1) {
    last.value = last.value.slice(0, -1);
  } else if (last.type === 'func') {
    state.tokens.pop(); // also drop the func, leave the '(' removal to a second press if present
  } else {
    state.tokens.pop();
  }
  afterChange();
}

function clearAll() {
  state.tokens = [];
  state.justEvaluated = false;
  afterChange();
  announce('Cleared');
}

/* ============================================================
   Parser — recursive descent, no eval()
   grammar:
     expr    := term (('+'|'−') term)*
     term    := unary (('×'|'÷') unary)*
     unary   := '−' unary | postfixExpr
     postfixExpr := power ( '!' | '%' )*
     power   := primary ('^' unary)?
     primary := NUMBER | CONST | '(' expr ')' | FUNC '(' expr ')'
   ============================================================ */
class ParseError extends Error {}

function parseTokens(tokens) {
  let pos = 0;

  function peek() { return tokens[pos]; }
  function advance() { return tokens[pos++]; }
  function expect(type) {
    const t = peek();
    if (!t || t.type !== type) throw new ParseError('Unexpected expression');
    return advance();
  }

  function parseExpr() {
    let v = parseTerm();
    while (peek() && peek().type === 'op' && (peek().value === '+' || peek().value === '−')) {
      const op = advance().value;
      const rhs = parseTerm();
      v = op === '+' ? v + rhs : v - rhs;
    }
    return v;
  }

  function parseTerm() {
    let v = parseUnary();
    while (peek() && peek().type === 'op' && (peek().value === '×' || peek().value === '÷')) {
      const op = advance().value;
      const rhs = parseUnary();
      if (op === '×') { v = v * rhs; }
      else {
        if (rhs === 0) throw new ParseError('Division by zero');
        v = v / rhs;
      }
    }
    return v;
  }

  function parseUnary() {
    if (peek() && peek().type === 'op' && peek().value === '−') {
      advance();
      return -parseUnary();
    }
    return parsePostfix();
  }

  function parsePostfix() {
    let v = parsePower();
    while (peek() && peek().type === 'postfix') {
      const sym = advance().value;
      if (sym === '%') {
        v = v / 100;
      } else if (sym === '!') {
        if (!Number.isFinite(v) || v < 0 || Math.floor(v) !== v) throw new ParseError('Invalid factorial');
        if (v > 170) throw new ParseError('Overflow');
        let r = 1;
        for (let i = 2; i <= v; i++) r *= i;
        v = r;
      }
    }
    return v;
  }

  function parsePower() {
    let v = parsePrimary();
    if (peek() && peek().type === 'op' && peek().value === '^') {
      advance();
      const rhs = parseUnary();
      v = Math.pow(v, rhs);
    }
    return v;
  }

  function toRad(v) { return state.angleMode === 'DEG' ? (v * Math.PI) / 180 : v; }
  function fromRad(v) { return state.angleMode === 'DEG' ? (v * 180) / Math.PI : v; }

  function parsePrimary() {
    const t = peek();
    if (!t) throw new ParseError('Unexpected end of expression');

    if (t.type === 'num') {
      advance();
      if (t.value === '' || t.value === '-' || t.value === '.') throw new ParseError('Incomplete number');
      const n = parseFloat(t.value);
      if (Number.isNaN(n)) throw new ParseError('Invalid number');
      return n;
    }

    if (t.type === 'const') {
      advance();
      return t.value === 'π' ? Math.PI : Math.E;
    }

    if (t.type === 'lparen') {
      advance();
      const v = parseExpr();
      expect('rparen');
      return v;
    }

    if (t.type === 'func') {
      advance();
      expect('lparen');
      const arg = parseExpr();
      expect('rparen');
      switch (t.value) {
        case 'sin': return Math.sin(toRad(arg));
        case 'cos': return Math.cos(toRad(arg));
        case 'tan': return Math.tan(toRad(arg));
        case 'asin':
          if (arg < -1 || arg > 1) throw new ParseError('Out of domain');
          return fromRad(Math.asin(arg));
        case 'acos':
          if (arg < -1 || arg > 1) throw new ParseError('Out of domain');
          return fromRad(Math.acos(arg));
        case 'atan': return fromRad(Math.atan(arg));
        case 'log':
          if (arg <= 0) throw new ParseError('Out of domain');
          return Math.log10(arg);
        case 'ln':
          if (arg <= 0) throw new ParseError('Out of domain');
          return Math.log(arg);
        case 'sqrt':
          if (arg < 0) throw new ParseError('Out of domain');
          return Math.sqrt(arg);
        case 'abs': return Math.abs(arg);
        default: throw new ParseError('Unknown function');
      }
    }

    throw new ParseError('Unexpected token');
  }

  if (!tokens.length) throw new ParseError('Empty expression');
  const result = parseExpr();
  if (pos !== tokens.length) throw new ParseError('Malformed expression');
  if (!Number.isFinite(result)) throw new ParseError('Result out of range');
  return result;
}

/**
 * Attempts evaluation, trimming trailing "incomplete" tokens (like a dangling
 * operator) so a live preview can be shown while the user is still typing.
 */
function tryEvaluate(tokens) {
  let t = tokens.slice();
  // strip a trailing binary operator / dangling open paren chain for preview purposes
  while (t.length && t[t.length - 1].type === 'op') t = t.slice(0, -1);
  if (!t.length) return { ok: false };
  const openCount = t.filter(x => x.type === 'lparen').length;
  const closeCount = t.filter(x => x.type === 'rparen').length;
  if (openCount > closeCount) {
    t = t.concat(Array(openCount - closeCount).fill({ type: 'rparen', value: ')' }));
  }
  try {
    const value = parseTokens(t);
    return { ok: true, value };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/* ============================================================
   Formatting
   ============================================================ */
function formatNumber(n) {
  if (!Number.isFinite(n)) return 'Error';
  if (Object.is(n, -0)) n = 0;
  const rounded = parseFloat(n.toFixed(state.decimals));
  if (Math.abs(rounded) >= 1e15 || (Math.abs(rounded) < 1e-9 && rounded !== 0)) {
    return rounded.toExponential(Math.min(state.decimals, 6));
  }
  let str = rounded.toFixed(state.decimals);
  // trim trailing zeros but keep at least the integer part
  if (str.includes('.')) {
    str = str.replace(/0+$/, '').replace(/\.$/, '');
  }
  // group thousands on the integer portion
  const [intPart, fracPart] = str.split('.');
  const negative = intPart.startsWith('-');
  const digits = negative ? intPart.slice(1) : intPart;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (negative ? '-' : '') + grouped + (fracPart ? '.' + fracPart : '');
}

function tokenDisplay(tok) {
  switch (tok.type) {
    case 'num': return tok.value;
    case 'op': return tok.value;
    case 'lparen': return '(';
    case 'rparen': return ')';
    case 'const': return tok.value;
    case 'postfix': return tok.value;
    case 'func': return tok.display;
    default: return '';
  }
}

function tokenClass(tok) {
  switch (tok.type) {
    case 'num': return 'tok-num';
    case 'op': return 'tok-op';
    case 'postfix': return 'tok-op';
    case 'func': return 'tok-fn';
    case 'lparen':
    case 'rparen': return 'tok-paren';
    case 'const': return 'tok-const';
    default: return '';
  }
}

/* ============================================================
   Rendering
   ============================================================ */
function renderExpression() {
  if (!state.tokens.length) {
    el.expression.innerHTML = '&nbsp;';
    return;
  }
  el.expression.innerHTML = state.tokens
    .map(t => `<span class="${tokenClass(t)}">${escapeHtml(tokenDisplay(t))}</span>`)
    .join(' ');
  el.expression.scrollLeft = el.expression.scrollWidth;
}

function renderResult(text, mode) {
  el.result.textContent = text;
  el.result.classList.remove('is-preview', 'is-error', 'is-final');
  if (mode) el.result.classList.add(mode);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function afterChange() {
  renderExpression();
  if (!state.tokens.length) {
    renderResult('0');
    return;
  }
  const evalResult = tryEvaluate(state.tokens);
  if (evalResult.ok) {
    renderResult(formatNumber(evalResult.value), 'is-preview');
  } else {
    renderResult('—', 'is-preview');
  }
}

function announce(msg) {
  el.liveAnnounce.textContent = msg;
}

/* ============================================================
   Equals / history
   ============================================================ */
function computeEquals() {
  if (!state.tokens.length) return;
  try {
    const value = parseTokens(state.tokens);
    const formatted = formatNumber(value);
    renderResult(formatted, 'is-final');
    const exprText = state.tokens.map(tokenDisplay).join(' ');
    addToHistory(exprText, formatted);
    state.lastFinalResult = value;
    state.tokens = [{ type: 'num', value: String(value) }];
    state.justEvaluated = true;
    renderExpression();
    announce(`Result ${formatted}`);
  } catch (e) {
    renderResult('Error', 'is-error');
    announce('Error in expression');
  }
}

function addToHistory(expression, result) {
  const item = {
    id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
    expression,
    result,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  state.history.unshift(item);
  if (state.history.length > 100) state.history.length = 100;
  persistHistory();
  renderHistory();
}

function persistHistory() {
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(state.history));
}

function renderHistory(filter) {
  const q = (filter || '').trim().toLowerCase();
  const items = q
    ? state.history.filter(h => h.expression.toLowerCase().includes(q) || h.result.toLowerCase().includes(q))
    : state.history;

  el.historyList.innerHTML = '';
  el.historyEmpty.classList.toggle('is-visible', state.history.length === 0);

  items.forEach(item => {
    const li = document.createElement('li');
    li.className = 'history-item';
    li.tabIndex = 0;
    li.setAttribute('role', 'button');
    li.setAttribute('aria-label', `Load calculation ${item.expression} equals ${item.result}`);
    li.innerHTML = `
      <div class="history-expr">${escapeHtml(item.expression)}</div>
      <div class="history-result-row">
        <span class="history-result">= ${escapeHtml(item.result)}</span>
        <span class="history-time">${escapeHtml(item.time)}</span>
      </div>
      <button type="button" class="history-remove" aria-label="Delete this calculation">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
    `;
    li.addEventListener('click', (ev) => {
      if (ev.target.closest('.history-remove')) return;
      loadHistoryItem(item);
    });
    li.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); loadHistoryItem(item); }
    });
    li.querySelector('.history-remove').addEventListener('click', (ev) => {
      ev.stopPropagation();
      removeHistoryItem(item.id);
    });
    el.historyList.appendChild(li);
  });
}

function loadHistoryItem(item) {
  state.tokens = [{ type: 'num', value: item.result.replace(/,/g, '') }];
  state.justEvaluated = true;
  afterChange();
  if (window.matchMedia('(max-width: 900px)').matches) closeHistoryPanel();
}

function removeHistoryItem(id) {
  state.history = state.history.filter(h => h.id !== id);
  persistHistory();
  renderHistory(el.historySearch.value);
}

function clearHistory() {
  state.history = [];
  persistHistory();
  renderHistory();
  announce('History cleared');
}

/* ============================================================
   Theme / mode / settings
   ============================================================ */
function applyTheme(theme) {
  state.theme = theme;
  el.body.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEYS.theme, theme);
  el.themeSwatches.querySelectorAll('.swatch').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.theme === theme);
  });
}

function cycleTheme() {
  const idx = THEME_CYCLE.indexOf(state.theme);
  applyTheme(THEME_CYCLE[(idx + 1) % THEME_CYCLE.length]);
}

function applyMode(mode) {
  state.mode = mode;
  el.body.setAttribute('data-mode', mode);
  localStorage.setItem(STORAGE_KEYS.mode, mode);
  el.tabStandard.classList.toggle('is-active', mode === 'standard');
  el.tabStandard.setAttribute('aria-selected', String(mode === 'standard'));
  el.tabScientific.classList.toggle('is-active', mode === 'scientific');
  el.tabScientific.setAttribute('aria-selected', String(mode === 'scientific'));
}

function applyAngleMode(mode) {
  state.angleMode = mode;
  localStorage.setItem(STORAGE_KEYS.angle, mode);
  el.angleMode.querySelectorAll('.angle-btn').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.angle === mode);
  });
  afterChange();
}

function applyDecimals(n) {
  state.decimals = n;
  localStorage.setItem(STORAGE_KEYS.decimals, String(n));
  el.decimalChoice.querySelectorAll('button').forEach(btn => {
    btn.classList.toggle('is-active', parseInt(btn.dataset.decimals, 10) === n);
  });
  afterChange();
}

function openSettings() {
  el.settingsPanel.classList.add('is-open');
  el.settingsScrim.classList.add('is-open');
  el.settingsPanel.setAttribute('aria-hidden', 'false');
  el.settingsToggle.setAttribute('aria-expanded', 'true');
}
function closeSettings() {
  el.settingsPanel.classList.remove('is-open');
  el.settingsScrim.classList.remove('is-open');
  el.settingsPanel.setAttribute('aria-hidden', 'true');
  el.settingsToggle.setAttribute('aria-expanded', 'false');
}

function openHistoryPanel() {
  el.historyPanel.classList.add('is-open');
  el.historyScrim.classList.add('is-open');
  el.historyToggle.setAttribute('aria-expanded', 'true');
}
function closeHistoryPanel() {
  el.historyPanel.classList.remove('is-open');
  el.historyScrim.classList.remove('is-open');
  el.historyToggle.setAttribute('aria-expanded', 'false');
}

/* ============================================================
   Memory functions (MC / MR / M+ / M-)
   ============================================================ */
function currentPreviewValue() {
  const r = tryEvaluate(state.tokens);
  return r.ok ? r.value : null;
}
function memoryClear() { state.memory = 0; announce('Memory cleared'); }
function memoryRecall() {
  state.tokens = [{ type: 'num', value: String(state.memory) }];
  state.justEvaluated = true;
  afterChange();
}
function memoryAdd() {
  const v = currentPreviewValue();
  if (v !== null) { state.memory += v; announce('Added to memory'); }
}
function memorySubtract() {
  const v = currentPreviewValue();
  if (v !== null) { state.memory -= v; announce('Subtracted from memory'); }
}

/* ============================================================
   Button click handling (event delegation)
   ============================================================ */
function flashKey(button) {
  button.classList.add('is-pressed');
  setTimeout(() => button.classList.remove('is-pressed'), 120);
}

function handleKeyAction(button) {
  if (!button) return;
  flashKey(button);

  if (button.dataset.num !== undefined) return appendNumber(button.dataset.num);
  if (button.dataset.op !== undefined) return appendOperator(button.dataset.op);
  if (button.dataset.paren !== undefined) return appendParen(button.dataset.paren);
  if (button.dataset.fn !== undefined) return appendFunction(button.dataset.fn);
  if (button.dataset.const !== undefined) return appendConstant(button.dataset.const);
  if (button.dataset.square !== undefined) return appendSquare();
  if (button.dataset.power !== undefined) return appendPower();
  if (button.dataset.factorial !== undefined) return appendPostfix('!');
  if (button.dataset.percent !== undefined) return appendPostfix('%');

  const action = button.dataset.action;
  switch (action) {
    case 'clear': return clearAll();
    case 'delete': return deleteLast();
    case 'decimal': return appendDecimal();
    case 'sign': return toggleSign();
    case 'equals': return computeEquals();
    case 'memclear': return memoryClear();
    case 'memrecall': return memoryRecall();
    case 'memadd': return memoryAdd();
    case 'memsub': return memorySubtract();
    default: return;
  }
}

el.keypad.addEventListener('click', (ev) => handleKeyAction(ev.target.closest('.key')));
el.sciGrid.addEventListener('click', (ev) => handleKeyAction(ev.target.closest('.key')));

/* ============================================================
   Keyboard support
   ============================================================ */
function flashByPredicate(predicate) {
  const btn = Array.from(document.querySelectorAll('.key')).find(predicate);
  if (btn) flashKey(btn);
}

window.addEventListener('keydown', (ev) => {
  if (ev.target.tagName === 'INPUT') return; // don't hijack the history search box

  const key = ev.key;

  if (/^[0-9]$/.test(key)) {
    appendNumber(key);
    flashByPredicate(b => b.dataset.num === key);
    return;
  }
  switch (key) {
    case '+': appendOperator('+'); flashByPredicate(b => b.dataset.op === '+'); return;
    case '-': appendOperator('−'); flashByPredicate(b => b.dataset.op === '−'); return;
    case '*': appendOperator('×'); flashByPredicate(b => b.dataset.op === '×'); return;
    case '/': ev.preventDefault(); appendOperator('÷'); flashByPredicate(b => b.dataset.op === '÷'); return;
    case '%': appendPostfix('%'); flashByPredicate(b => b.dataset.percent !== undefined); return;
    case '.': appendDecimal(); flashByPredicate(b => b.dataset.action === 'decimal'); return;
    case '(': appendParen('('); flashByPredicate(b => b.dataset.paren === '('); return;
    case ')': appendParen(')'); flashByPredicate(b => b.dataset.paren === ')'); return;
    case '^': appendPower(); return;
    case '!': appendPostfix('!'); return;
    case 'Enter':
    case '=': ev.preventDefault(); computeEquals(); flashByPredicate(b => b.dataset.action === 'equals'); return;
    case 'Backspace': deleteLast(); flashByPredicate(b => b.dataset.action === 'delete'); return;
    case 'Escape': clearAll(); flashByPredicate(b => b.dataset.action === 'clear'); return;
    default: return;
  }
});

/* ============================================================
   Header / mode / theme / settings wiring
   ============================================================ */
el.tabStandard.addEventListener('click', () => applyMode('standard'));
el.tabScientific.addEventListener('click', () => applyMode('scientific'));

el.themeToggle.addEventListener('click', cycleTheme);
el.settingsToggle.addEventListener('click', openSettings);
el.settingsClose.addEventListener('click', closeSettings);
el.settingsScrim.addEventListener('click', closeSettings);

el.themeSwatches.addEventListener('click', (ev) => {
  const btn = ev.target.closest('.swatch');
  if (btn) applyTheme(btn.dataset.theme);
});

el.decimalChoice.addEventListener('click', (ev) => {
  const btn = ev.target.closest('button');
  if (btn) applyDecimals(parseInt(btn.dataset.decimals, 10));
});

el.angleMode.addEventListener('click', (ev) => {
  const btn = ev.target.closest('.angle-btn');
  if (btn) applyAngleMode(btn.dataset.angle);
});

el.historyToggle.addEventListener('click', () => {
  if (el.historyPanel.classList.contains('is-open')) closeHistoryPanel();
  else openHistoryPanel();
});
el.historyClose.addEventListener('click', closeHistoryPanel);
el.historyScrim.addEventListener('click', closeHistoryPanel);

el.clearHistoryBtn.addEventListener('click', clearHistory);
el.historySearch.addEventListener('input', () => renderHistory(el.historySearch.value));

el.copyResultBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(el.result.textContent);
    announce('Result copied to clipboard');
  } catch (e) {
    announce('Could not copy result');
  }
});

/* ============================================================
   Init
   ============================================================ */
function init() {
  applyTheme(state.theme);
  applyMode(state.mode);
  applyAngleMode(state.angleMode);
  applyDecimals(state.decimals);
  renderHistory();
  afterChange();
}

init();
