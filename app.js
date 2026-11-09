const CURRENCIES = [
  { code: "USD", symbol: "$" }, { code: "EUR", symbol: "€" }, { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" }, { code: "AUD", symbol: "A$" }, { code: "CAD", symbol: "C$" },
  { code: "CHF", symbol: "CHF" }, { code: "CNY", symbol: "¥" }, { code: "INR", symbol: "₹" },
  { code: "NGN", symbol: "₦" }, { code: "NZD", symbol: "NZ$" }, { code: "SEK", symbol: "kr" },
  { code: "MXN", symbol: "MX$" }, { code: "SGD", symbol: "S$" }, { code: "HKD", symbol: "HK$" },
  { code: "NOK", symbol: "kr" }, { code: "DKK", symbol: "kr" }, { code: "ZAR", symbol: "R" },
  { code: "TRY", symbol: "₺" }, { code: "RUB", symbol: "₽" }, { code: "BRL", symbol: "R$" },
  { code: "KRW", symbol: "₩" }, { code: "PLN", symbol: "zł" }, { code: "CZK", symbol: "Kč" },
  { code: "HUF", symbol: "Ft" }, { code: "ILS", symbol: "₪" }, { code: "THB", symbol: "฿" },
  { code: "IDR", symbol: "Rp" }, { code: "MYR", symbol: "RM" }, { code: "PHP", symbol: "₱" },
  { code: "RON", symbol: "lei" }
];

const CRYPTOS = [
  { id: "bitcoin", symbol: "₿", name: "Bitcoin (BTC)" },
  { id: "ethereum", symbol: "Ξ", name: "Ethereum (ETH)" },
  { id: "tether", symbol: "₮", name: "Tether (USDT)" },
  { id: "binancecoin", symbol: "BNB", name: "BNB (BNB)" },
  { id: "solana", symbol: "SOL", name: "Solana (SOL)" },
  { id: "ripple", symbol: "XRP", name: "XRP (XRP)" },
  { id: "usd-coin", symbol: "USDC", name: "USD Coin (USDC)" },
  { id: "staked-ether", symbol: "stETH", name: "Staked Ether (stETH)" },
  { id: "dogecoin", symbol: "Ð", name: "Dogecoin (DOGE)" },
  { id: "cardano", symbol: "ADA", name: "Cardano (ADA)" },
  { id: "tron", symbol: "TRX", name: "TRON (TRX)" },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche (AVAX)" },
  { id: "polkadot", symbol: "DOT", name: "Polkadot (DOT)" },
  { id: "polygon", symbol: "MATIC", name: "Polygon (MATIC)" },
  { id: "chainlink", symbol: "LINK", name: "Chainlink (LINK)" },
  { id: "near", symbol: "NEAR", name: "NEAR Protocol (NEAR)" },
  { id: "uniswap", symbol: "UNI", name: "Uniswap (UNI)" },
  { id: "litecoin", symbol: "Ł", name: "Litecoin (LTC)" },
  { id: "bitcoin-cash", symbol: "BCH", name: "Bitcoin Cash (BCH)" },
  { id: "stellar", symbol: "XLM", name: "Stellar (XLM)" }
];

const ENERGY_UNITS = [
  { code: "J", label: "Joule (J)" },
  { code: "kJ", label: "Kilojoule (kJ)" },
  { code: "MJ", label: "Megajoule (MJ)" },
  { code: "GJ", label: "Gigajoule (GJ)" },
  { code: "cal", label: "Calorie (cal)" },
  { code: "kcal", label: "Kilocalorie (kcal)" },
  { code: "Wh", label: "Watt-hour (Wh)" },
  { code: "kWh", label: "Kilowatt-hour (kWh)" },
  { code: "MWh", label: "Megawatt-hour (MWh)" },
  { code: "BTU", label: "British Thermal Unit (BTU)" },
  { code: "therm", label: "Therm" },
  { code: "eV", label: "Electronvolt (eV)" },
  { code: "erg", label: "Erg" },
  { code: "ft_lbf", label: "Foot-pound (ft·lbf)" }
];

const RATE_UNITS = [
  { code: "per_second", label: "Per second (/s)" },
  { code: "per_minute", label: "Per minute (/min)" },
  { code: "per_hour", label: "Per hour (/hr)" },
  { code: "per_day", label: "Per day (/day)" },
  { code: "per_week", label: "Per week (/wk)" },
  { code: "per_month", label: "Per month (/mo)" },
  { code: "per_year", label: "Per year (/yr)" }
];

const CRYPTO_SYMBOLS = Object.fromEntries(CRYPTOS.map(c => [c.id, c.symbol]));
const CURRENCY_SYMBOLS = Object.fromEntries(CURRENCIES.map(c => [c.code, c.symbol]));

const API_BASE = (window.__API_BASE__ || "http://localhost:3000").replace(/\/$/, "");

const state = {
  currency: { from: "USD", to: "NGN", amount: "1", loading: false },
  crypto: { from: "bitcoin", to: "usd-coin", amount: "1", loading: false },
  energy: { from: "J", to: "kWh", amount: "1", loading: false },
  rate: { from: "per_second", to: "per_hour", amount: "1", loading: false }
};

function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return root.querySelectorAll(sel); }

function populateSelect(selectEl, items, getValue, getLabel, selectedValue) {
  selectEl.innerHTML = "";
  items.forEach(item => {
    const opt = document.createElement("option");
    opt.value = getValue(item);
    opt.textContent = getLabel(item);
    selectEl.appendChild(opt);
  });
  selectEl.value = selectedValue;
}

function initCurrencySelects() {
  populateSelect(qs("#currency-from"), CURRENCIES, c => c.code, c => `${c.code} ${c.symbol}`, state.currency.from);
  populateSelect(qs("#currency-to"), CURRENCIES, c => c.code, c => `${c.code} ${c.symbol}`, state.currency.to);
  updateCurrencySymbol("currency");
}

async function initCryptoSelects() {
  try {
    const res = await fetch(`${API_BASE}/api/cryptos`);
    if (res.ok) {
      const data = await res.json();
      const cryptos = Object.entries(data).map(([id, sym]) => ({ id, symbol: sym }));
      populateSelect(qs("#crypto-from"), cryptos, c => c.id, c => `${c.symbol} (${c.id})`, state.crypto.from);
      populateSelect(qs("#crypto-to"), cryptos, c => c.id, c => `${c.symbol} (${c.id})`, state.crypto.to);
    } else {
      populateSelect(qs("#crypto-from"), CRYPTOS, c => c.id, c => `${c.symbol} ${c.name}`, state.crypto.from);
      populateSelect(qs("#crypto-to"), CRYPTOS, c => c.id, c => `${c.symbol} ${c.name}`, state.crypto.to);
    }
  } catch {
    populateSelect(qs("#crypto-from"), CRYPTOS, c => c.id, c => `${c.symbol} ${c.name}`, state.crypto.from);
    populateSelect(qs("#crypto-to"), CRYPTOS, c => c.id, c => `${c.symbol} ${c.name}`, state.crypto.to);
  }
  updateCryptoSymbol("crypto");
}

function initEnergySelects() {
  populateSelect(qs("#energy-from"), ENERGY_UNITS, u => u.code, u => u.label, state.energy.from);
  populateSelect(qs("#energy-to"), ENERGY_UNITS, u => u.code, u => u.label, state.energy.to);
}

function initRateSelects() {
  populateSelect(qs("#rate-from"), RATE_UNITS, u => u.code, u => u.label, state.rate.from);
  populateSelect(qs("#rate-to"), RATE_UNITS, u => u.code, u => u.label, state.rate.to);
}

function updateCurrencySymbol(type) {
  const fromSel = qs(`#${type}-from`);
  const symbolEl = qs(`#${type}-from-symbol`);
  if (fromSel && symbolEl) {
    const code = fromSel.value;
    symbolEl.textContent = CURRENCY_SYMBOLS[code] || "";
  }
}

function updateCryptoSymbol(type) {
  const fromSel = qs(`#${type}-from`);
  const symbolEl = qs(`#${type}-from-symbol`);
  if (fromSel && symbolEl) {
    const id = fromSel.value;
    symbolEl.textContent = CRYPTO_SYMBOLS[id] || "";
  }
}

function getFormData(type) {
  const form = qs(`.converter-form[data-type="${type}"]`);
  return {
    from: form.querySelector('[name="from"]').value,
    to: form.querySelector('[name="to"]').value,
    amount: form.querySelector('[name="amount"]').value
  };
}

function setLoading(type, loading) {
  state[type].loading = loading;
  const form = qs(`.converter-form[data-type="${type}"]`);
  const btn = form.querySelector(".convert-btn");
  const amountInput = form.querySelector('[name="amount"]');
  const fromSel = form.querySelector('[name="from"]');
  const toSel = form.querySelector('[name="to"]');
  const swapBtn = form.querySelector(".swap-btn");

  btn.disabled = loading;
  amountInput.disabled = loading;
  fromSel.disabled = loading;
  toSel.disabled = loading;
  swapBtn.disabled = loading;

  btn.querySelector("span").textContent = loading ? "Converting…" : "Convert";
}

function showError(form, msg) {
  const errorEl = form.querySelector(".error");
  const resultEl = form.querySelector(".result");
  errorEl.textContent = msg;
  errorEl.style.display = "flex";
  resultEl.style.display = "none";
}

function clearError(form) {
  const errorEl = form.querySelector(".error");
  errorEl.textContent = "";
  errorEl.style.display = "none";
}

function showResult(form, text) {
  const resultEl = form.querySelector(".result");
  const errorEl = form.querySelector(".error");
  resultEl.textContent = text;
  resultEl.style.display = "flex";
  errorEl.style.display = "none";
}

async function convert(type) {
  const form = qs(`.converter-form[data-type="${type}"]`);
  clearError(form);

  const { from, to, amount } = getFormData(type);

  if (!amount || Number(amount) < 0) {
    showError(form, "Please enter a valid amount.");
    form.querySelector('[name="amount"]').focus();
    return;
  }

  if (from === to) {
    showError(form, "Please select different units.");
    return;
  }

  setLoading(type, true);

  try {
    const res = await fetch(
      `${API_BASE}/api/convert/${type}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${encodeURIComponent(amount)}`
    );
    const data = await res.json();

    if (!res.ok) {
      showError(form, data.error || "Conversion failed. Please try again.");
      return;
    }

    let formattedResult;
    if (type === "currency") {
      const fromSym = CURRENCY_SYMBOLS[from] || "";
      const toSym = CURRENCY_SYMBOLS[to] || "";
      formattedResult = `${fromSym}${Number(data.amount).toLocaleString()} = ${toSym}${Number(data.converted).toLocaleString(undefined, { maximumFractionDigits: 4 })}`;
    } else if (type === "crypto") {
      const fromSym = CRYPTO_SYMBOLS[from] || "";
      const toSym = CRYPTO_SYMBOLS[to] || "";
      formattedResult = `${fromSym}${Number(data.amount).toLocaleString()} = ${toSym}${Number(data.converted).toLocaleString(undefined, { maximumFractionDigits: 8 })}`;
    } else {
      formattedResult = `${Number(data.amount).toLocaleString()} ${from} = ${Number(data.converted).toLocaleString(undefined, { maximumFractionDigits: 6 })} ${to}`;
    }

    showResult(form, formattedResult);
  } catch (err) {
    showError(form, "Could not reach the conversion service. Check your connection.");
  } finally {
    setLoading(type, false);
  }
}

function setupSwap(type) {
  const swapBtn = qs(`.swap-btn[data-type="${type}"]`);
  swapBtn.addEventListener("click", () => {
    const form = qs(`.converter-form[data-type="${type}"]`);
    const fromSel = form.querySelector('[name="from"]');
    const toSel = form.querySelector('[name="to"]');
    const tmp = fromSel.value;
    fromSel.value = toSel.value;
    toSel.value = tmp;
    if (type === "currency") updateCurrencySymbol(type);
    else if (type === "crypto") updateCryptoSymbol(type);
  });
}

function setupForm(type) {
  const form = qs(`.converter-form[data-type="${type}"]`);
  form.addEventListener("submit", (e) => { e.preventDefault(); convert(type); });

  form.querySelector('[name="from"]').addEventListener("change", () => {
    if (type === "currency") updateCurrencySymbol(type);
    else if (type === "crypto") updateCryptoSymbol(type);
  });

  form.querySelector('[name="amount"]').addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); convert(type); }
  });

  setupSwap(type);
}

function setupTabs() {
  const tabs = qsa(".tab");
  const panels = qsa(".panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetTab = tab.dataset.tab;

      tabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      panels.forEach(p => {
        p.classList.remove("active");
        p.hidden = true;
      });

      const targetPanel = qs(`#panel-${targetTab}`);
      targetPanel.classList.add("active");
      targetPanel.hidden = false;
    });
  });
}

async function init() {
  setupTabs();

  initCurrencySelects();
  await initCryptoSelects();
  initEnergySelects();
  initRateSelects();

  ["currency", "crypto", "energy", "rate"].forEach(setupForm);
}

init();