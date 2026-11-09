const CURRENCIES = [
  "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR", "NZD",
  "SEK", "MXN", "SGD", "HKD", "NOK", "DKK", "ZAR", "TRY", "RUB", "BRL",
  "KRW", "PLN", "CZK", "HUF", "ILS", "THB", "IDR", "MYR", "PHP", "RON"
];

const API_BASE = (window.__API_BASE__ || "http://localhost:3000").replace(/\/$/, "");

const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const swapBtn = document.getElementById("swap");
const convertBtn = document.getElementById("convert");
const resultEl = document.getElementById("result");
const errorEl = document.getElementById("error");
const rateHint = document.getElementById("rate-hint");

let isConverting = false;

function populateSelects() {
  const fragment = document.createDocumentFragment();
  CURRENCIES.forEach((code) => {
    const opt1 = document.createElement("option");
    opt1.value = code;
    opt1.textContent = code;
    fragment.appendChild(opt1);
  });
  fromSelect.appendChild(fragment.cloneNode(true));
  toSelect.appendChild(fragment);
  fromSelect.value = "USD";
  toSelect.value = "EUR";
}

function setLoading(loading) {
  isConverting = loading;
  convertBtn.disabled = loading;
  amountInput.disabled = loading;
  fromSelect.disabled = loading;
  toSelect.disabled = loading;
  swapBtn.disabled = loading;

  if (loading) {
    convertBtn.querySelector(".btn-label").textContent = "Converting…";
  } else {
    convertBtn.querySelector(".btn-label").textContent = "Convert";
  }
}

function showError(msg) {
  errorEl.textContent = msg;
  resultEl.textContent = "";
  errorEl.style.display = "flex";
  resultEl.style.display = "none";
}

function clearError() {
  errorEl.textContent = "";
  errorEl.style.display = "none";
}

function showResult(text) {
  resultEl.textContent = text;
  resultEl.style.display = "flex";
  errorEl.style.display = "none";
}

function updateRateHint(rate) {
  if (rate) {
    const from = fromSelect.value;
    const to = toSelect.value;
    rateHint.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
  } else {
    rateHint.textContent = "—";
  }
}

async function fetchRate(from, to) {
  try {
    const res = await fetch(
      `${API_BASE}/api/convert?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=1`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.rate;
  } catch {
    return null;
  }
}

async function convert() {
  clearError();

  const from = fromSelect.value;
  const to = toSelect.value;
  const amount = amountInput.value;

  if (!amount || Number(amount) < 0) {
    showError("Please enter a valid amount.");
    amountInput.focus();
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(
      `${API_BASE}/api/convert?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${encodeURIComponent(amount)}`
    );
    const data = await res.json();

    if (!res.ok) {
      showError(data.error || "Conversion failed. Please try again.");
      return;
    }

    showResult(`${Number(data.amount).toLocaleString()} ${data.from} = ${Number(data.converted).toLocaleString(undefined, { maximumFractionDigits: 6 })} ${data.to}`);
    updateRateHint(data.rate);
  } catch (err) {
    showError("Could not reach the conversion service. Check your connection.");
  } finally {
    setLoading(false);
  }
}

async function onCurrencyChange() {
  const from = fromSelect.value;
  const to = toSelect.value;
  if (from !== to) {
    const rate = await fetchRate(from, to);
    updateRateHint(rate);
  } else {
    updateRateHint(null);
  }
}

swapBtn.addEventListener("click", () => {
  const tmp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = tmp;
  onCurrencyChange();
});

convertBtn.addEventListener("click", convert);

fromSelect.addEventListener("change", onCurrencyChange);
toSelect.addEventListener("change", onCurrencyChange);

amountInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    convert();
  }
});

populateSelects();
onCurrencyChange();