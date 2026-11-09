const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
  { code: "AUD", symbol: "A$" },
  { code: "CAD", symbol: "C$" },
  { code: "CHF", symbol: "CHF" },
  { code: "CNY", symbol: "¥" },
  { code: "INR", symbol: "₹" },
  { code: "NGN", symbol: "₦" },
  { code: "NZD", symbol: "NZ$" },
  { code: "SEK", symbol: "kr" },
  { code: "MXN", symbol: "MX$" },
  { code: "SGD", symbol: "S$" },
  { code: "HKD", symbol: "HK$" },
  { code: "NOK", symbol: "kr" },
  { code: "DKK", symbol: "kr" },
  { code: "ZAR", symbol: "R" },
  { code: "TRY", symbol: "₺" },
  { code: "RUB", symbol: "₽" },
  { code: "BRL", symbol: "R$" },
  { code: "KRW", symbol: "₩" },
  { code: "PLN", symbol: "zł" },
  { code: "CZK", symbol: "Kč" },
  { code: "HUF", symbol: "Ft" },
  { code: "ILS", symbol: "₪" },
  { code: "THB", symbol: "฿" },
  { code: "IDR", symbol: "Rp" },
  { code: "MYR", symbol: "RM" },
  { code: "PHP", symbol: "₱" },
  { code: "RON", symbol: "lei" }
];

const SYMBOLS = Object.fromEntries(CURRENCIES.map(c => [c.code, c.symbol]));

const API_BASE = (window.__API_BASE__ || "http://localhost:3000").replace(/\/$/, "");

const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const swapBtn = document.getElementById("swap");
const convertBtn = document.getElementById("convert");
const resultEl = document.getElementById("result");
const errorEl = document.getElementById("error");
const fromSymbol = document.getElementById("from-symbol");

let isConverting = false;

function populateSelects() {
  CURRENCIES.forEach(({ code, symbol }) => {
    const opt1 = document.createElement("option");
    opt1.value = code;
    opt1.textContent = `${code} ${symbol}`;
    fromSelect.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = code;
    opt2.textContent = `${code} ${symbol}`;
    toSelect.appendChild(opt2);
  });
  fromSelect.value = "USD";
  toSelect.value = "NGN";
  updateFromSymbol();
}

function updateFromSymbol() {
  fromSymbol.textContent = SYMBOLS[fromSelect.value] || "";
}

function setLoading(loading) {
  isConverting = loading;
  convertBtn.disabled = loading;
  amountInput.disabled = loading;
  fromSelect.disabled = loading;
  toSelect.disabled = loading;
  swapBtn.disabled = loading;
  convertBtn.querySelector("span").textContent = loading ? "Converting…" : "Convert";
}

function showError(msg) {
  errorEl.textContent = msg;
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

    const fromSym = SYMBOLS[from] || "";
    const toSym = SYMBOLS[to] || "";
    showResult(`${fromSym}${Number(data.amount).toLocaleString()} = ${toSym}${Number(data.converted).toLocaleString(undefined, { maximumFractionDigits: 4 })}`);
  } catch (err) {
    showError("Could not reach the conversion service. Check your connection.");
  } finally {
    setLoading(false);
  }
}

swapBtn.addEventListener("click", () => {
  const tmp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = tmp;
  updateFromSymbol();
});

convertBtn.addEventListener("click", convert);

document.getElementById("converter-form").addEventListener("submit", (e) => {
  e.preventDefault();
  convert();
});

fromSelect.addEventListener("change", updateFromSymbol);

amountInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    convert();
  }
});

populateSelects();