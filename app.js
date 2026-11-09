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

function populateSelects() {
  CURRENCIES.forEach((code) => {
    fromSelect.innerHTML += `<option value="${code}">${code}</option>`;
    toSelect.innerHTML += `<option value="${code}">${code}</option>`;
  });
  fromSelect.value = "USD";
  toSelect.value = "EUR";
}

function showError(msg) {
  errorEl.textContent = msg;
  resultEl.textContent = "";
}

function showResult(text) {
  resultEl.textContent = text;
  errorEl.textContent = "";
}

async function convert() {
  showError("");
  showResult("");

  const from = fromSelect.value;
  const to = toSelect.value;
  const amount = amountInput.value;

  if (!amount || Number(amount) < 0) {
    showError("Please enter a valid amount.");
    return;
  }

  try {
    const res = await fetch(
      `${API_BASE}/api/convert?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${encodeURIComponent(amount)}`
    );
    const data = await res.json();
    if (!res.ok) {
      showError(data.error || "Conversion failed.");
      return;
    }
    showResult(`${data.amount} ${data.from} = ${data.converted} ${data.to}`);
  } catch (err) {
    showError("Could not reach the conversion service. Check your connection and API URL.");
  }
}

swapBtn.addEventListener("click", () => {
  const tmp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = tmp;
});

convertBtn.addEventListener("click", convert);

populateSelects();