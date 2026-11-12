/* =========================================================
   MediShift Ops — js/validation.js
   FR-02: Staff Registration  (#registerForm)
   FR-03: Quick Sign-Up       (#signupForm)
   FR-04: Staff Sign-In       (#signinForm)
   Each form is checked for existence first, so this one file
   can safely be loaded on register, signup and signin pages.
   ========================================================= */
"use strict";

/* ---------------------------------------------------------
   Regular expressions
   --------------------------------------------------------- */
const NAME_REGEX = /^[a-zA-Z\s]{2,50}$/;
const EMP_ID_REGEX = /^[A-Z0-9]{6,12}$/i;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const PASSWORD_HELP =
  "Use at least 8 characters with an uppercase letter, a lowercase letter, a number and one symbol (@$!%*?&).";

/* ---------------------------------------------------------
   Shared helper functions
   --------------------------------------------------------- */

// Find the <span class="error-msg"> that belongs to a field
function getErrorSpan(field) {
  const group = field.closest(".form-group");
  return group ? group.querySelector(".error-msg") : null;
}

// Mark a field as invalid and show its message
function showError(field, message) {
  field.classList.add("invalid");
  field.classList.remove("valid");
  const span = getErrorSpan(field);
  if (span) span.textContent = message;
}

// Mark a field as valid and clear its message
function showValid(field) {
  field.classList.add("valid");
  field.classList.remove("invalid");
  const span = getErrorSpan(field);
  if (span) span.textContent = "";
}

// Remove both states (neutral look)
function clearState(field) {
  field.classList.remove("valid", "invalid");
  const span = getErrorSpan(field);
  if (span) span.textContent = "";
}

/*
  Run one rule against its field.
  rule = { id, empty, message, check(value, field) }
  showUI = true  -> update the field's colours and message
  showUI = false -> only return true/false (used to update the submit button silently)
*/
function runRule(rule, showUI) {
  const field = document.getElementById(rule.id);
  if (!field) return false;

  // Checkboxes use .checked, everything else uses .value
  const value = field.type === "checkbox" ? field.checked : field.value;
  const isEmpty = field.type === "checkbox" ? !field.checked : value.trim() === "";

  let message = "";
  if (isEmpty) {
    message = rule.empty;
  } else if (!rule.check(value, field)) {
    message = rule.message;
  }

  const isValid = message === "";

  if (showUI) {
    if (isValid) {
      showValid(field);
    } else {
      showError(field, message);
    }
  }
  return isValid;
}

// Show a green confirmation banner above a form
function showFormMessage(form, text) {
  let banner = form.parentElement.querySelector(".form-success");
  if (!banner) {
    banner = document.createElement("div");
    banner.className = "alert-banner success form-success";
    banner.setAttribute("role", "status");
    form.parentElement.insertBefore(banner, form);
  }
  banner.textContent = text;
}

// Wait a moment so the user can read the message, then change page
function redirectAfterDelay(url, delay) {
  setTimeout(function () {
    window.location.href = url;
  }, delay);
}

/* =========================================================
   FR-02: REGISTRATION FORM
   ========================================================= */
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  const registerBtn = document.getElementById("registerBtn");

  const registerRules = [
    {
      id: "fullName",
      empty: "Full name is required.",
      message: "Use letters and spaces only (2 to 50 characters).",
      check: function (value) { return NAME_REGEX.test(value.trim()); }
    },
    {
      id: "empId",
      empty: "Employee / Register ID is required.",
      message: "Use 6 to 12 letters or numbers (no spaces or symbols).",
      check: function (value) { return EMP_ID_REGEX.test(value.trim()); }
    },
    {
      id: "email",
      empty: "Email address is required.",
      message: "Enter a valid email, e.g. name@hospital.org.",
      check: function (value) { return EMAIL_REGEX.test(value.trim()); }
    },
    {
      id: "mobile",
      empty: "Mobile number is required.",
      message: "Enter a 10-digit mobile number starting with 6, 7, 8 or 9.",
      check: function (value) { return MOBILE_REGEX.test(value.trim()); }
    },
    {
      id: "dept",
      empty: "Please select your hospital division.",
      message: "Please select your hospital division.",
      check: function (value) { return value.trim() !== ""; }
    },
    {
      id: "password",
      empty: "Password is required.",
      message: PASSWORD_HELP,
      check: function (value) { return PASSWORD_REGEX.test(value); }
    },
    {
      id: "confirmPassword",
      empty: "Please confirm your password.",
      message: "Passwords do not match.",
      check: function (value) {
        return value === document.getElementById("password").value;
      }
    }
  ];

  // Enable the submit button only when all 7 fields are valid
  function updateRegisterButton() {
    const allValid = registerRules.every(function (rule) {
      return runRule(rule, false);
    });
    registerBtn.disabled = !allValid;
  }

  // Attach blur / input (and change for the dropdown) listeners
  registerRules.forEach(function (rule) {
    const field = document.getElementById(rule.id);
    if (!field) return;

    const check = function () {
      runRule(rule, true);

      // If the password changes, re-check Confirm Password (once the user has typed in it)
      if (rule.id === "password") {
        const confirmField = document.getElementById("confirmPassword");
        if (confirmField && confirmField.value !== "") {
          runRule(registerRules[6], true);
        }
      }
      updateRegisterButton();
    };

    field.addEventListener("input", check);
    field.addEventListener("blur", check);
    if (field.tagName === "SELECT") field.addEventListener("change", check);
  });

  // Submit
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Validate every field and show all errors at once
    let allValid = true;
    registerRules.forEach(function (rule) {
      if (!runRule(rule, true)) allValid = false;
    });

    updateRegisterButton();
    if (!allValid) return;

    registerBtn.disabled = true; // stop double submits
    showFormMessage(registerForm, "Staff account registered! Redirecting to Sign-In...");
    redirectAfterDelay("signin.html", 1500);
  });

  // Make sure the button state is right on load
  updateRegisterButton();
}

/* =========================================================
   FR-03: SIGN-UP FORM
   ========================================================= */
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  const signupBtn = document.getElementById("signupBtn");

  const signupRules = [
    {
      id: "signupEmail",
      empty: "Email address is required.",
      message: "Enter a valid email, e.g. name@hospital.org.",
      check: function (value) { return EMAIL_REGEX.test(value.trim()); }
    },
    {
      id: "signupPassword",
      empty: "Password is required.",
      message: PASSWORD_HELP,
      check: function (value) { return PASSWORD_REGEX.test(value); }
    },
    {
      id: "termsCheck",
      empty: "You must accept the Terms of Service and Data Privacy policy.",
      message: "You must accept the Terms of Service and Data Privacy policy.",
      check: function (checked) { return checked === true; }
    }
  ];

  signupRules.forEach(function (rule) {
    const field = document.getElementById(rule.id);
    if (!field) return;

    const check = function () { runRule(rule, true); };

    if (field.type === "checkbox") {
      field.addEventListener("change", check);
    } else {
      field.addEventListener("input", check);
      field.addEventListener("blur", check);
    }
  });

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let allValid = true;
    signupRules.forEach(function (rule) {
      if (!runRule(rule, true)) allValid = false;
    });
    if (!allValid) return;

    signupBtn.disabled = true;
    showFormMessage(signupForm, "Account created! Opening the ward dashboard...");
    redirectAfterDelay("home.html", 1200);
  });
}

/* =========================================================
   FR-04: SIGN-IN FORM
   ========================================================= */
const signinForm = document.getElementById("signinForm");

if (signinForm) {
  const signinEmail = document.getElementById("signinEmail");
  const signinPassword = document.getElementById("signinPassword");
  const togglePassword = document.getElementById("togglePassword");
  const signinAlert = document.getElementById("signinAlert");
  const MIN_SIGNIN_PASSWORD = 8;

  // --- Password show / hide eye toggle ---
  if (togglePassword && signinPassword) {
    togglePassword.addEventListener("click", function () {
      const isHidden = signinPassword.type === "password";
      signinPassword.type = isHidden ? "text" : "password";
      togglePassword.textContent = isHidden ? "Hide" : "Show";
      togglePassword.setAttribute("aria-pressed", String(isHidden));
    });
  }

  // --- Dynamic alert banner helpers ---
  function showSigninAlert(message) {
    if (!signinAlert) return;
    signinAlert.textContent = message;
    signinAlert.hidden = false;
  }

  function hideSigninAlert() {
    if (!signinAlert) return;
    signinAlert.textContent = "";
    signinAlert.hidden = true;
  }

  // Clear the red state while the user is correcting a field
  [signinEmail, signinPassword].forEach(function (field) {
    if (!field) return;
    field.addEventListener("input", function () {
      clearState(field);
      hideSigninAlert();
    });
  });

  // --- Submit ---
  signinForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const emailOk = EMAIL_REGEX.test(signinEmail.value.trim());
    const passwordOk = signinPassword.value.length >= MIN_SIGNIN_PASSWORD;

    // Inline field feedback
    if (emailOk) {
      showValid(signinEmail);
    } else {
      showError(signinEmail, "Enter a valid staff email.");
    }

    if (passwordOk) {
      showValid(signinPassword);
    } else {
      showError(signinPassword, "Password must be at least " + MIN_SIGNIN_PASSWORD + " characters.");
    }

    // Banner at the top of the card
    if (!emailOk && !passwordOk) {
      showSigninAlert("Sign-in failed: enter a valid email and a password of at least " + MIN_SIGNIN_PASSWORD + " characters.");
      return;
    }
    if (!emailOk) {
      showSigninAlert("Sign-in failed: the email address is not valid.");
      return;
    }
    if (!passwordOk) {
      showSigninAlert("Sign-in failed: the password must be at least " + MIN_SIGNIN_PASSWORD + " characters.");
      return;
    }

    // All good: hide the banner and open the dashboard
    hideSigninAlert();
    window.location.href = "home.html";
  });
}