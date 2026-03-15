// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.panel).classList.add('active');
  });
});

// TAX CALCULATOR
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
  r.innerHTML = `
    <div class="big">£${monthly.toLocaleString('en-GB', {minimumFractionDigits: 2, maximumFractionDigits: 2})}/month</div>
    <div>Annual take-home: £${takeHome.toLocaleString('en-GB', {minimumFractionDigits: 2})}</div>
    <div>Income tax: £${tax.toLocaleString('en-GB', {minimumFractionDigits: 2})} | NI: £${ni.toLocaleString('en-GB', {minimumFractionDigits: 2})}</div>
    <div>Effective rate: ${effective}%</div>
    <div style="margin-top:6px"><a href="https://ukcalculator.com/salary-calculator.html" target="_blank" style="color:#6B46C1;font-weight:600;text-decoration:none">Full breakdown →</a></div>`;
});

// VAT CALCULATOR
document.getElementById('addVat').addEventListener('click', () => {
  const a = parseFloat(document.getElementById('vatAmount').value);
  const rate = parseFloat(document.getElementById('vatRate').value) / 100;
  if (!a) return;
  const vat = a * rate;
  const r = document.getElementById('vatResult');
  r.style.display = 'block';
  r.innerHTML = `<div class="big">£${(a + vat).toFixed(2)}</div>
    <div>Net: £${a.toFixed(2)} + VAT: £${vat.toFixed(2)}</div>
    <div style="margin-top:6px"><a href="https://ukcalculator.com/vat-calculator.html" target="_blank" style="color:#6B46C1;font-weight:600;text-decoration:none">Full VAT calc →</a></div>`;
});

document.getElementById('removeVat').addEventListener('click', () => {
  const a = parseFloat(document.getElementById('vatAmount').value);
  const rate = parseFloat(document.getElementById('vatRate').value) / 100;
  if (!a) return;
  const net = a / (1 + rate);
  const vat = a - net;
  const r = document.getElementById('vatResult');
  r.style.display = 'block';
  r.innerHTML = `<div class="big">£${net.toFixed(2)}</div>
    <div>Gross: £${a.toFixed(2)} − VAT: £${vat.toFixed(2)}</div>`;
});

// UNIT CONVERTER
document.getElementById('doConvert').addEventListener('click', () => {
  const v = parseFloat(document.getElementById('convVal').value);
  const type = document.getElementById('convType').value;
  if (isNaN(v)) return;

  const conversions = {
    kg_st: () => `${v} kg = ${Math.floor(v / 6.35029)} st ${((v % 6.35029) * 2.20462).toFixed(1)} lbs`,
    st_kg: () => `${v} stone = ${(v * 6.35029).toFixed(2)} kg`,
    cm_in: () => `${v} cm = ${(v / 2.54).toFixed(2)} inches`,
    in_cm: () => `${v} inches = ${(v * 2.54).toFixed(2)} cm`,
    mi_km: () => `${v} miles = ${(v * 1.60934).toFixed(2)} km`,
    km_mi: () => `${v} km = ${(v / 1.60934).toFixed(2)} miles`,
    lb_kg: () => `${v} lbs = ${(v / 2.20462).toFixed(2)} kg`,
    kg_lb: () => `${v} kg = ${(v * 2.20462).toFixed(2)} lbs`,
    c_f: () => `${v}°C = ${(v * 9/5 + 32).toFixed(1)}°F`,
    f_c: () => `${v}°F = ${((v - 32) * 5/9).toFixed(1)}°C`,
    l_gal: () => `${v} litres = ${(v / 4.54609).toFixed(2)} UK gallons`,
    gal_l: () => `${v} UK gallons = ${(v * 4.54609).toFixed(2)} litres`,
  };

  const result = conversions[type] ? conversions[type]() : "Unknown";
  const r = document.getElementById('convResult');
  r.style.display = 'block';
  r.innerHTML = `<div class="big">${result.split('=')[1] || result}</div><div>${result}</div>
    <div style="margin-top:6px"><a href="https://ukcalculator.com/calculator-kg-to-stone.html" target="_blank" style="color:#6B46C1;font-weight:600;text-decoration:none">More converters →</a></div>`;
});

// BANK HOLIDAY COUNTDOWN
function updateHolidays() {
  const holidays2026 = [
    { date: "2026-01-01", name: "New Year's Day" },
    { date: "2026-04-03", name: "Good Friday" },
    { date: "2026-04-06", name: "Easter Monday" },
    { date: "2026-05-04", name: "Early May Bank Holiday" },
    { date: "2026-05-25", name: "Spring Bank Holiday" },
    { date: "2026-08-31", name: "Summer Bank Holiday" },
    { date: "2026-12-25", name: "Christmas Day" },
    { date: "2026-12-28", name: "Boxing Day (substitute)" },
  ];

  const now = new Date();
  let next = null;
  for (const h of holidays2026) {
    const d = new Date(h.date + "T00:00:00");
    if (d >= now) { next = { ...h, dateObj: d }; break; }
  }

  if (!next) {
    next = { name: "New Year's Day 2027", dateObj: new Date("2027-01-01"), date: "2027-01-01" };
  }

  const diff = Math.ceil((next.dateObj - now) / (1000 * 60 * 60 * 24));
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };

  document.getElementById('holidayCountdown').innerHTML = `
    <div class="days">${diff}</div>
    <div class="label">days until</div>
    <div class="name">${next.name}</div>
    <div style="font-size:12px;color:#888;margin-top:4px">${next.dateObj.toLocaleDateString('en-GB', options)}</div>
    <div style="margin-top:12px"><a href="https://ukcalculator.com/uk-bank-holidays-2026.html" target="_blank" style="color:#6B46C1;font-weight:600;text-decoration:none;font-size:12px">All 2026 Bank Holidays →</a></div>
    <div style="margin-top:16px;text-align:left;font-size:11px;color:#666">
      <div style="font-weight:600;margin-bottom:6px;color:#333">Remaining 2026 Holidays:</div>
      ${holidays2026.filter(h => new Date(h.date) >= now).map(h =>
        `<div style="padding:3px 0;border-bottom:1px solid #f0f0f0">${new Date(h.date).toLocaleDateString('en-GB', {day:'numeric',month:'short'})} — ${h.name}</div>`
      ).join('')}
    </div>`;
}
updateHolidays();
