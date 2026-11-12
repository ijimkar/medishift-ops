/* ==========================================================
   chatbot.js
   MediShift Ops - 24/7 Clinical Protocol Assistant Chatbot
   Loaded with "defer" in home.html
   ========================================================== */

// ---------- 1. Grab the HTML elements ----------
const chatFab = document.getElementById("chatFab");         // floating chat button
const chatPanel = document.getElementById("chatPanel");     // chat window
const chatClose = document.getElementById("chatClose");     // close button in header
const chatMessages = document.getElementById("chatMessages"); // scrollable message log
const chatInput = document.getElementById("chatInput");     // text box
const chatSend = document.getElementById("chatSend");       // send button

// ---------- 2. Chatbot knowledge base ----------
// Each entry has a list of keywords and the reply for them.
// The first entry that matches is used, so the order matters.
const responses = [
  {
    keywords: ["hi", "hello"],
    reply: "Hello! Welcome to MediShift Ops. I can help with ward beds, shifts, pharmacy and more. Type \"help\" to see what I can answer."
  },
  {
    keywords: ["emergency"],
    reply: "EMERGENCY PROTOCOL: Alert the Emergency Department immediately using the red emergency line. Keep the patient stable, note the time, and inform the duty doctor and charge nurse. Do not leave the patient alone."
  },
  {
    keywords: ["icu"],
    reply: "ICU admissions need approval from the duty intensivist. Check the ward dashboard for free ICU beds, then contact the ICU charge nurse to arrange the transfer."
  },
  {
    keywords: ["beds", "bed"],
    reply: "Bed occupancy is shown on the Ward Dashboard. Receptionists should update a bed to \"Occupied\" at admission and to \"Available\" after discharge and cleaning is done."
  },
  {
    keywords: ["pharmacy", "medicine"],
    reply: "The pharmacy is open 24/7. Send medicine requests with the patient ID and a signed prescription. Controlled drugs need a doctor's counter-signature."
  },
  {
    keywords: ["shift"],
    reply: "Shifts run as Morning (7 AM - 3 PM), Evening (3 PM - 11 PM) and Night (11 PM - 7 AM). Shift swaps must be approved by the ward in-charge at least 24 hours ahead."
  },
  {
    keywords: ["doctor"],
    reply: "The duty doctor roster is available on the portal. For urgent cases, page the on-call doctor through the front desk. Specialist doctors can be reached through the ward in-charge."
  },
  {
    keywords: ["nurse"],
    reply: "Each ward has a charge nurse per shift. Nurses should complete handover notes before leaving, listing patient status, pending medicines and any alerts."
  },
  {
    keywords: ["lab", "diagnostics"],
    reply: "Lab and Diagnostics accepts sample requests round the clock. Label every sample with the patient ID and time of collection. Urgent reports are marked \"STAT\" and are prioritized."
  },
  {
    keywords: ["calculator"],
    reply: "Use the Ward Supply & Billing Calculator on this page to add supply costs and patient bills. Use + - * / and press = for the total. Press C to clear."
  },
  {
    keywords: ["help"],
    reply: "I can help with these keywords: emergency, icu, bed, beds, pharmacy, medicine, shift, doctor, nurse, lab, diagnostics, calculator, help, hi, hello."
  }
];

// Reply used when no keyword is found
const fallbackReply =
  "Sorry, I did not understand that. Please try one of these keywords: " +
  "emergency, icu, bed, beds, pharmacy, medicine, shift, doctor, nurse, lab, " +
  "diagnostics, calculator, help, hi, hello.";

// ---------- 3. Helper functions ----------

// Adds a message bubble to the chat log
// type is "user-msg" or "bot-msg" (CSS classes from styles.css)
function addMessage(text, type) {
  const bubble = document.createElement("div");
  bubble.className = type;
  bubble.textContent = text; // textContent is safe (it will not run HTML)
  chatMessages.appendChild(bubble);

  // Always scroll down to the newest message
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Checks whether a keyword appears as a whole word in the text
// Example: "hi" matches "hi there" but NOT "this"
function containsWord(text, keyword) {
  const pattern = new RegExp("\\b" + keyword + "\\b", "i");
  return pattern.test(text);
}

// Finds the best reply for the user's text
function getBotReply(userText) {
  const text = userText.toLowerCase();

  for (const item of responses) {
    for (const keyword of item.keywords) {
      if (containsWord(text, keyword)) {
        return item.reply;
      }
    }
  }

  // No keyword matched
  return fallbackReply;
}

// Reads the input, shows the user message and then the bot reply
function sendMessage() {
  const userText = chatInput.value.trim();

  // Do nothing if the box is empty
  if (userText === "") {
    return;
  }

  addMessage(userText, "user-msg"); // show the user's message
  chatInput.value = "";             // clear the text box

  addMessage(getBotReply(userText), "bot-msg"); // show the bot's answer
  chatInput.focus();
}

// ---------- 4. Event listeners ----------
if (chatFab && chatPanel && chatClose && chatMessages && chatInput && chatSend) {

  // Chat button: open or close the panel
  chatFab.addEventListener("click", function () {
    chatPanel.hidden = !chatPanel.hidden;

    // When the panel opens, show a welcome message (only the first time)
    // and put the cursor in the text box
    if (!chatPanel.hidden) {
      if (chatMessages.children.length === 0) {
        addMessage("Hi! I am the MediShift Ops assistant. Ask me about beds, shifts, pharmacy or emergencies. Type \"help\" for all topics.", "bot-msg");
      }
      chatInput.focus();
    }
  });

  // Close button: hide the panel
  chatClose.addEventListener("click", function () {
    chatPanel.hidden = true;
  });

  // Send button: send the message
  chatSend.addEventListener("click", sendMessage);

  // Enter key in the text box: send the message
  chatInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });
}