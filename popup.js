// ========== TAB SWITCHING ==========
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.panel).classList.add('active');
  });
});

// ========== ADVANCED CALCULATOR ==========
let cCur = '0', cPrev = '', cOp = '', cReset = false, cMem = 0, cHist = [];

function cUpdate() {
  const screen = document.getElementById('calcScreen');
  const expr = document.getElementById('calcExpr');
  screen.textContent = cCur.length > 12 ? parseFloat(cCur).toPrecision(10) : cCur;
  expr.textContent = cPrev ? `${cPrev} ${{'+':'+','-':'−','*':'×','/':'÷'}[cOp] || cOp}` : '';
  const histEl = document.getElementById('calcHistory');
  histEl.textContent = '';
  cHist.slice(-3).forEach(h => {
    const d = document.createElement('div');
    d.textContent = h;
    histEl.appendChild(d);
  });
}

// Digit buttons
document.querySelectorAll('[data-digit]').forEach(btn => {
  btn.addEventListener('click', () => {
    const d = btn.dataset.digit;
    if (cReset) { cCur = ''; cReset = false; }
    if (d === '.' && cCur.includes('.')) return;
    cCur = (cCur === '0' && d !== '.') ? d : cCur + d;
    cUpdate();
  });
});

// Operator buttons
document.querySelectorAll('[data-op]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (cPrev && !cReset) doEquals();
    cPrev = cCur;
    cOp = btn.dataset.op;
    cReset = true;
    cUpdate();
  });
});

function doEquals() {
  if (!cPrev || cReset) return;
  const a = parseFloat(cPrev), b = parseFloat(cCur);
  let r;
  switch (cOp) {
    case '+': r = a + b; break;
    case '-': r = a - b; break;
    case '*': r = a * b; break;
    case '/': r = b !== 0 ? a / b : 'Error'; break;
    default: return;
  }
  const sym = {'+':'+','-':'−','*':'×','/':'÷'}[cOp];
  cHist.push(cPrev + ' ' + sym + ' ' + cCur + ' = ' + r);
  cCur = String(r);
  cPrev = '';
  cOp = '';
  cReset = true;
  cUpdate();
}

// Action buttons
document.querySelectorAll('[data-action]').forEach(btn => {
  btn.addEventListener('click', () => {
    const a = btn.dataset.action;
    const v = parseFloat(cCur);
    switch (a) {
      case 'equals': doEquals(); break;
      case 'clear': cCur = '0'; cPrev = ''; cOp = ''; cReset = false; cUpdate(); break;
      case 'back': cCur = cCur.length > 1 ? cCur.slice(0, -1) : '0'; cUpdate(); break;
      case 'percent':
        cCur = cPrev ? String(parseFloat(cPrev) * v / 100) : String(v / 100);
        cReset = true; cUpdate(); break;
      case 'sqrt': cCur = String(Math.sqrt(v)); cReset = true; cUpdate(); break;
      case 'pow': cCur = String(v * v); cReset = true; cUpdate(); break;
      case 'inv': cCur = v !== 0 ? String(1 / v) : 'Error'; cReset = true; cUpdate(); break;
      case 'negate': cCur = String(-v); cReset = true; cUpdate(); break;
      case 'mc': cMem = 0; break;
      case 'mr': cCur = String(cMem); cReset = true; cUpdate(); break;
      case 'mplus': cMem += v; break;
      case 'mminus': cMem -= v; break;
      case 'tip':
        if (!v) return;
        const tipEl = document.getElementById('calcHistory');
        tipEl.textContent = '';
        const tipHeader = document.createElement('div');
        tipHeader.style.fontWeight = '600';
        tipHeader.textContent = 'Tip on \u00a3' + v.toFixed(2) + ':';
        tipEl.appendChild(tipHeader);
        [10, 12.5, 15, 20].forEach(p => {
          const tipRow = document.createElement('div');
          tipRow.textContent = p + '%: \u00a3' + (v * p / 100).toFixed(2) + ' \u2192 \u00a3' + (v * (1 + p / 100)).toFixed(2);
          tipEl.appendChild(tipRow);
        });
        break;
    }
  });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (!document.getElementById('calc').classList.contains('active')) return;
  if (e.key >= '0' && e.key <= '9') {
    const d = e.key;
    if (cReset) { cCur = ''; cReset = false; }
    cCur = (cCur === '0') ? d : cCur + d;
    cUpdate();
  }
  else if (e.key === '.') {
    if (cReset) { cCur = '0'; cReset = false; }
    if (!cCur.includes('.')) cCur += '.';
    cUpdate();
  }
  else if (['+', '-', '*', '/'].includes(e.key)) {
    if (e.key === '/') e.preventDefault();
    if (cPrev && !cReset) doEquals();
    cPrev = cCur; cOp = e.key; cReset = true; cUpdate();
  }
  else if (e.key === 'Enter' || e.key === '=') doEquals();
  else if (e.key === 'Escape') { cCur = '0'; cPrev = ''; cOp = ''; cReset = false; cUpdate(); }
  else if (e.key === 'Backspace') { cCur = cCur.length > 1 ? cCur.slice(0, -1) : '0'; cUpdate(); }
  else if (e.key === '%') {
    const v = parseFloat(cCur);
    cCur = cPrev ? String(parseFloat(cPrev) * v / 100) : String(v / 100);
    cReset = true; cUpdate();
  }
});

// ========== PERCENTAGE CALCULATOR ==========
// 1. X% of Y
function calcPct1() {
  const a = parseFloat(document.getElementById('pct1a').value);
  const b = parseFloat(document.getElementById('pct1b').value);
  if (isNaN(a) || isNaN(b)) { document.getElementById('pct1r').textContent = ''; return; }
  document.getElementById('pct1r').textContent = a + '% of ' + b + ' = ' + (a * b / 100).toFixed(2);
}
document.getElementById('pct1a').addEventListener('input', calcPct1);
document.getElementById('pct1b').addEventListener('input', calcPct1);

// 2. X is what % of Y
function calcPct2() {
  const a = parseFloat(document.getElementById('pct2a').value);
  const b = parseFloat(document.getElementById('pct2b').value);
  if (isNaN(a) || isNaN(b) || b === 0) { document.getElementById('pct2r').textContent = ''; return; }
  document.getElementById('pct2r').textContent = a + ' is ' + (a / b * 100).toFixed(2) + '% of ' + b;
}
document.getElementById('pct2a').addEventListener('input', calcPct2);
document.getElementById('pct2b').addEventListener('input', calcPct2);

// 3. % Change
function calcPct3() {
  const a = parseFloat(document.getElementById('pct3a').value);
  const b = parseFloat(document.getElementById('pct3b').value);
  if (isNaN(a) || isNaN(b) || a === 0) { document.getElementById('pct3r').textContent = ''; return; }
  const change = ((b - a) / a * 100).toFixed(2);
  const dir = change >= 0 ? '↑' : '↓';
  document.getElementById('pct3r').textContent = dir + ' ' + Math.abs(change) + '% change (' + a + ' → ' + b + ')';
}
document.getElementById('pct3a').addEventListener('input', calcPct3);
document.getElementById('pct3b').addEventListener('input', calcPct3);

// 4. Add/Remove % from amount
function calcPct4() {
  const a = parseFloat(document.getElementById('pct4a').value);
  const b = parseFloat(document.getElementById('pct4b').value);
  if (isNaN(a) || isNaN(b)) { document.getElementById('pct4r').textContent = ''; return; }
  const added = a * (1 + b / 100);
  const removed = a * (1 - b / 100);
  document.getElementById('pct4r').textContent = '+' + b + '%: ' + added.toFixed(2) + '  |  −' + b + '%: ' + removed.toFixed(2);
}
document.getElementById('pct4a').addEventListener('input', calcPct4);
document.getElementById('pct4b').addEventListener('input', calcPct4);

// ========== TAX CALCULATOR ==========
document.getElementById('calcTax').addEventListener('click', () => {
  const s = parseFloat(document.getElementById('taxSalary').value);
  if (!s) return;
  let pa = 12570;
  if (s > 100000) pa = Math.max(0, 12570 - (s - 100000) / 2);
  const taxable = Math.max(0, s - pa);
  let tax = 0;
  if (taxable > 0) tax += Math.min(taxable, 37700) * 0.20;
  if (taxable > 37700) tax += Math.min(taxable - 37700, 87460) * 0.40;
  if (taxable > 125140) tax += (taxable - 125140) * 0.45;
  let ni = 0;
  if (s > 12570) ni += Math.min(s - 12570, 37700) * 0.08;
  if (s > 50270) ni += (s - 50270) * 0.02;
  const takeHome = s - tax - ni;
  const monthly = takeHome / 12;
  const effective = ((tax + ni) / s * 100).toFixed(1);
  const r = document.getElementById('taxResult');
  r.style.display = 'block';
  r.textContent = '';
  const taxBig = document.createElement('div');
  taxBig.className = 'big';
  taxBig.textContent = '\u00a3' + monthly.toLocaleString('en-GB', {minimumFractionDigits:2, maximumFractionDigits:2}) + '/month';
  r.appendChild(taxBig);
  const taxAnnual = document.createElement('div');
  taxAnnual.textContent = 'Annual take-home: \u00a3' + takeHome.toLocaleString('en-GB', {minimumFractionDigits:2});
  r.appendChild(taxAnnual);
  const taxDetail = document.createElement('div');
  taxDetail.textContent = 'Tax: \u00a3' + tax.toLocaleString('en-GB', {minimumFractionDigits:2}) + ' | NI: \u00a3' + ni.toLocaleString('en-GB', {minimumFractionDigits:2});
  r.appendChild(taxDetail);
  const taxRate = document.createElement('div');
  taxRate.textContent = 'Effective rate: ' + effective + '%';
  r.appendChild(taxRate);
  const taxLink = document.createElement('div');
  taxLink.style.marginTop = '6px';
  const taxA = document.createElement('a');
  taxA.href = 'https://ukcalculator.com/salary-calculator.html';
  taxA.target = '_blank';
  taxA.style.cssText = 'color:#6B46C1;font-weight:600;text-decoration:none';
  taxA.textContent = 'Full breakdown \u2192';
  taxLink.appendChild(taxA);
  r.appendChild(taxLink);
});

// ========== VAT CALCULATOR ==========
document.getElementById('addVat').addEventListener('click', () => {
  const a = parseFloat(document.getElementById('vatAmount').value);
  const rate = parseFloat(document.getElementById('vatRate').value) / 100;
  if (!a) return;
  const vat = a * rate;
  const r = document.getElementById('vatResult');
  r.style.display = 'block';
  r.textContent = '';
  const addBig = document.createElement('div');
  addBig.className = 'big';
  addBig.textContent = '\u00a3' + (a + vat).toFixed(2);
  r.appendChild(addBig);
  const addDetail = document.createElement('div');
  addDetail.textContent = 'Net: \u00a3' + a.toFixed(2) + ' + VAT: \u00a3' + vat.toFixed(2);
  r.appendChild(addDetail);
  const addLinkDiv = document.createElement('div');
  addLinkDiv.style.marginTop = '6px';
  const addA = document.createElement('a');
  addA.href = 'https://ukcalculator.com/vat-calculator.html';
  addA.target = '_blank';
  addA.style.cssText = 'color:#6B46C1;font-weight:600;text-decoration:none';
  addA.textContent = 'Full VAT calc \u2192';
  addLinkDiv.appendChild(addA);
  r.appendChild(addLinkDiv);
});

document.getElementById('removeVat').addEventListener('click', () => {
  const a = parseFloat(document.getElementById('vatAmount').value);
  const rate = parseFloat(document.getElementById('vatRate').value) / 100;
  if (!a) return;
  const net = a / (1 + rate);
  const vat = a - net;
  const r = document.getElementById('vatResult');
  r.style.display = 'block';
  r.textContent = '';
  const rmBig = document.createElement('div');
  rmBig.className = 'big';
  rmBig.textContent = '\u00a3' + net.toFixed(2);
  r.appendChild(rmBig);
  const rmDetail = document.createElement('div');
  rmDetail.textContent = 'Gross: \u00a3' + a.toFixed(2) + ' \u2212 VAT: \u00a3' + vat.toFixed(2);
  r.appendChild(rmDetail);
});

// ========== UNIT CONVERTER ==========
document.getElementById('doConvert').addEventListener('click', () => {
  const v = parseFloat(document.getElementById('convVal').value);
  const type = document.getElementById('convType').value;
  if (isNaN(v)) return;
  const c = {
    kg_st: () => v + ' kg = ' + Math.floor(v/6.35029) + ' st ' + ((v%6.35029)*2.20462).toFixed(1) + ' lbs',
    st_kg: () => v + ' stone = ' + (v*6.35029).toFixed(2) + ' kg',
    cm_in: () => v + ' cm = ' + (v/2.54).toFixed(2) + ' inches',
    in_cm: () => v + ' inches = ' + (v*2.54).toFixed(2) + ' cm',
    mi_km: () => v + ' miles = ' + (v*1.60934).toFixed(2) + ' km',
    km_mi: () => v + ' km = ' + (v/1.60934).toFixed(2) + ' miles',
    lb_kg: () => v + ' lbs = ' + (v/2.20462).toFixed(2) + ' kg',
    kg_lb: () => v + ' kg = ' + (v*2.20462).toFixed(2) + ' lbs',
    c_f: () => v + '°C = ' + (v*9/5+32).toFixed(1) + '°F',
    f_c: () => v + '°F = ' + ((v-32)*5/9).toFixed(1) + '°C',
    l_gal: () => v + ' litres = ' + (v/4.54609).toFixed(2) + ' UK gallons',
    gal_l: () => v + ' UK gallons = ' + (v*4.54609).toFixed(2) + ' litres',
  };
  const result = c[type] ? c[type]() : 'Unknown';
  const r = document.getElementById('convResult');
  r.style.display = 'block';
  r.textContent = '';
  const convBig = document.createElement('div');
  convBig.className = 'big';
  convBig.textContent = (result.split('=')[1] || result).trim();
  r.appendChild(convBig);
  const convDetail = document.createElement('div');
  convDetail.textContent = result;
  r.appendChild(convDetail);
  const convLinkDiv = document.createElement('div');
  convLinkDiv.style.marginTop = '6px';
  const convA = document.createElement('a');
  convA.href = 'https://ukcalculator.com/calculator-kg-to-stone.html';
  convA.target = '_blank';
  convA.style.cssText = 'color:#6B46C1;font-weight:600;text-decoration:none';
  convA.textContent = 'More converters \u2192';
  convLinkDiv.appendChild(convA);
  r.appendChild(convLinkDiv);
});
