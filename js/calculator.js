/* ==========================================================
   calculator.js
   MediShift Ops - Ward Supply & Billing Calculator
   Loaded with "defer" in home.html
   ========================================================== */

// ---------- 1. Grab the HTML elements ----------
const calcDisplay = document.getElementById("calcDisplay"); // the digital screen
const calcGrid = document.querySelector(".calc-grid");      // container of all keypad buttons

// ---------- 2. Constants and state ----------
const OPERATORS = ["+", "-", "*", "/"];

// justEvaluated is true right after "=" was pressed.
// A new digit then starts a fresh calculation,
// but an operator continues using the result.
let justEvaluated = false;

// ---------- 3. Small helper functions ----------

// Returns true if the display currently shows "Error"
function isErrorState() {
  return calcDisplay.textContent === "Error";
}

// Returns true if the given character is + - * /
function isOperator(char) {
  return OPERATORS.includes(char);
}

// Resets the display back to "0" and removes the red error style
function clearCalculator() {
  calcDisplay.textContent = "0";
  calcDisplay.classList.remove("calc-error");
  justEvaluated = false;
}

// Shows "Error" on the display with the error style
function showError() {
  calcDisplay.textContent = "Error";
  calcDisplay.classList.add("calc-error");
  justEvaluated = false;
}

// Gets the number currently being typed (the part after the last operator)
// Example: "12+3.5" -> "3.5"
function getLastNumber(text) {
  const parts = text.split(/[+\-*/]/);
  return parts[parts.length - 1];
}

// ---------- 4. Handle each type of key ----------

// Digits 0-9 and the decimal point
function handleDigit(key) {
  // If we are in the error state, a new digit starts fresh
  if (isErrorState()) {
    clearCalculator();
  }

  let current = calcDisplay.textContent;

  // After "=", typing a digit begins a brand new calculation
  if (justEvaluated) {
    current = "0";
    justEvaluated = false;
  }

  // Decimal point: allow only one dot per number
  if (key === ".") {
    if (getLastNumber(current).includes(".")) {
      return; // this number already has a dot
    }
    calcDisplay.textContent = current + ".";
    return;
  }

  // If the number being typed is just "0", replace it
  // (this avoids numbers like "007")
  if (getLastNumber(current) === "0") {
    current = current.slice(0, -1);
  }

  calcDisplay.textContent = current + key;
}

// Operators + - * /
function handleOperator(key) {
  // Ignore operators while "Error" is showing
  if (isErrorState()) {
    return;
  }

  const current = calcDisplay.textContent;
  const lastChar = current[current.length - 1];

  // Prevent consecutive operators like "++" or "*/"
  if (isOperator(lastChar)) {
    return;
  }

  // Prevent an operator straight after a lone dot like "5.+"
  if (lastChar === ".") {
    return;
  }

  calcDisplay.textContent = current + key;
  justEvaluated = false;
}

// Equals "="
function handleEquals() {
  // Nothing to calculate if there is an error
  if (isErrorState()) {
    return;
  }

  const expression = calcDisplay.textContent;

  // Safety check: only digits, dots and + - * / are allowed
  if (!/^[0-9+\-*/.]+$/.test(expression)) {
    showError();
    return;
  }

  try {
    // Evaluate the expression (e.g. "12+3*2" -> 18).
    // Function() is used instead of eval() and only runs
    // after the safety check above.
    const result = new Function("return " + expression)();

    // Division by zero gives Infinity, and 0/0 gives NaN
    if (!Number.isFinite(result)) {
      showError();
      return;
    }

    // Round to 8 decimals so 0.1 + 0.2 shows 0.3, not 0.30000000000000004
    const rounded = parseFloat(result.toFixed(8));
    calcDisplay.textContent = String(rounded);
    justEvaluated = true;
  } catch (error) {
    // Invalid syntax such as "5+" or "5*.": show Error
    showError();
  }
}

// ---------- 5. Listen for keypad clicks ----------
if (calcGrid && calcDisplay) {
  // One listener on the container handles every button inside it
  calcGrid.addEventListener("click", function (event) {
    // Find the button that was clicked (works even if a child element is clicked)
    const btn = event.target.closest("button");
    if (!btn) {
      return;
    }

    // Read data-key first; fall back to the button text
    const key = btn.dataset.key || btn.textContent.trim();

    if (key === "C") {
      clearCalculator();
    } else if (key === "=") {
      handleEquals();
    } else if (isOperator(key)) {
      handleOperator(key);
    } else if ((key >= "0" && key <= "9" && key.length === 1) || key === ".") {
      handleDigit(key);
    }
  });
}