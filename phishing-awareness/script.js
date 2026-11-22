// Mobile navigation
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  document.body.classList.toggle("menu-open", isOpen);
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("menu-open");
  });
});

// Highlight the active section in the desktop navigation.
const sections = document.querySelectorAll("main section[id]");
const navigationLinks = document.querySelectorAll(".nav-links a");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navigationLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  sections.forEach((section) => sectionObserver.observe(section));
}

// Quiz data and reusable rendering functions
const quizQuestions = [
  {
    question: "Which sender detail is the strongest reason to investigate an email?",
    answers: ["The email uses a logo", "The full domain does not match the organization", "The email has a professional tone", "The message includes a greeting"],
    correct: 1,
    explanation: "An organization's logo can be copied easily. Always verify the complete sender domain, not just the display name."
  },
  {
    question: "You receive an unexpected text saying a package needs redelivery payment. What should you do first?",
    answers: ["Open the link immediately", "Reply with your card number", "Track it through the carrier's official app or website", "Forward it to every contact"],
    correct: 2,
    explanation: "Use a trusted official app or type the carrier's known address yourself rather than following an unexpected link."
  },
  {
    question: "Which URL is most suspicious?",
    answers: ["https://login.example-bank.com", "https://examplebank.com/login", "https://examplebank.example.com/login", "https://www.examplebank.com/account"],
    correct: 2,
    explanation: "In examplebank.example.com, the domain is example.com, not examplebank.com. Read the domain carefully and avoid acting on look-alike domains."
  },
  {
    question: "A caller claims to be from IT and asks for your password. What is the safest response?",
    answers: ["Give the password if the caller sounds professional", "Provide a one-time password", "Never share it; verify through an official channel", "Ask for their personal phone number"],
    correct: 2,
    explanation: "Passwords and OTPs should never be provided to callers. Verify identity independently using a known official number or channel."
  },
  {
    question: "Which message uses urgency as a social engineering tactic?",
    answers: ["Your invoice is attached for your records.", "Please review this at your convenience.", "Your account will close in 10 minutes unless you act now.", "The team meeting has been moved to Friday."],
    correct: 2,
    explanation: "Short deadlines and threats are designed to reduce careful thinking and trigger an impulsive response."
  },
  {
    question: "What is spear phishing?",
    answers: ["A harmless email with an advertisement", "A targeted phishing attack aimed at a particular person or organization", "A virus that attacks every shared folder", "A fake Wi-Fi network with no message"],
    correct: 1,
    explanation: "Spear phishing uses personal or organizational information to make a targeted message appear convincing."
  },
  {
    question: "Which attachment type should raise extra caution if unexpected?",
    answers: ["A normal text document requested in advance", "An invoice you asked the sender to provide", "A password-protected archive or executable file", "A PDF from a known verified supplier"],
    correct: 2,
    explanation: "Unexpected executable files, scripts, or password-protected archives can hide malicious content and should be confirmed before opening."
  },
  {
    question: "Which is the best additional protection for an account?",
    answers: ["Using the same password everywhere", "Disabling login alerts", "Using a unique password and multi-factor authentication", "Sharing the password with a coworker"],
    correct: 2,
    explanation: "Unique passwords limit reused-credential exposure, while MFA adds a second proof that makes account takeover much harder."
  },
  {
    question: "A prize offer asks you to sign in through a page reached by a social media post. What should you do?",
    answers: ["Enter a password to claim the prize", "Open the page and keep the window private", "Ignore and visit the official platform directly", "Send payment to reserve the prize"],
    correct: 2,
    explanation: "Legitimate prizes do not require credentials through a random page. Open the official platform in a new window you navigate to yourself."
  },
  {
    question: "What is clone phishing?",
    answers: ["Creating a copy of a real operating system", "Duplicating a legitimate message and replacing content with a malicious link or attachment", "Scanning a website for security flaws", "Backing up a mailbox before deleting it"],
    correct: 1,
    explanation: "Clone phishing copies a real-looking or previously received message and modifies it to send the victim toward an attacker-controlled destination."
  },
  {
    question: "Which response is appropriate after accidentally entering credentials on a suspicious page?",
    answers: ["Ignore it and hope no action is taken", "Change the affected password, enable MFA, and report the incident", "Delete the browser history only", "Reuse the same password on another account"],
    correct: 1,
    explanation: "Act quickly: change credentials, secure any reused accounts, enable MFA, and notify the relevant organization or IT/security team."
  },
  {
    question: "What does authority manipulation use in a phishing attempt?",
    answers: ["The target's love of free games", "An impersonation of a leader, official, or technical authority", "Strong antivirus software", "A publicly known password"],
    correct: 1,
    explanation: "Authority manipulation pressures the victim to comply because a message appears to come from someone senior or officially trusted."
  }
];

let currentQuestion = 0;
let score = 0;
let answerLocked = false;

const quizContent = document.getElementById("quiz-content");
const questionCounter = document.getElementById("question-counter");
const scoreLabel = document.getElementById("score-label");
const progressBar = document.getElementById("progress-bar");

function renderQuestion() {
  answerLocked = false;
  const item = quizQuestions[currentQuestion];

  questionCounter.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
  scoreLabel.textContent = `Score: ${score}`;
  progressBar.style.width = `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;

  const answerMarkup = item.answers.map((answer, index) => `
    <button class="answer-button" type="button" data-index="${index}">
      <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
      <span>${answer}</span>
    </button>
  `).join("");

  quizContent.innerHTML = `
    <h3 class="question-title">${item.question}</h3>
    <div class="answers">${answerMarkup}</div>
    <div class="feedback" id="feedback" role="status"></div>
    <div class="quiz-actions">
      <button class="next-button" type="button" id="next-button" disabled>
        ${currentQuestion === quizQuestions.length - 1 ? "View Score" : "Next Question"}
      </button>
    </div>
  `;

  quizContent.querySelectorAll(".answer-button").forEach((button) => {
    button.addEventListener("click", () => selectAnswer(Number(button.dataset.index)));
  });

  document.getElementById("next-button").addEventListener("click", nextQuestion);
}

function selectAnswer(selectedIndex) {
  if (answerLocked) return;
  answerLocked = true;

  const item = quizQuestions[currentQuestion];
  const buttons = quizContent.querySelectorAll(".answer-button");
  const feedback = document.getElementById("feedback");

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === item.correct) button.classList.add("correct");
  });

  if (selectedIndex === item.correct) {
    score += 1;
    feedback.className = "feedback show correct-feedback";
    feedback.innerHTML = `<strong>Correct.</strong> ${item.explanation}`;
  } else {
    buttons[selectedIndex].classList.add("incorrect");
    feedback.className = "feedback show incorrect-feedback";
    feedback.innerHTML = `<strong>Incorrect.</strong> ${item.explanation}`;
  }

  scoreLabel.textContent = `Score: ${score}`;
  document.getElementById("next-button").disabled = false;
}

function nextQuestion() {
  if (!answerLocked) return;

  if (currentQuestion < quizQuestions.length - 1) {
    currentQuestion += 1;
    renderQuestion();
  } else {
    renderResult();
  }
}

function renderResult() {
  const percentage = Math.round((score / quizQuestions.length) * 100);
  let message = "Keep learning and review the warning signs before trying again.";
  if (percentage >= 90) message = "Excellent work. You can identify most phishing techniques and apply strong safety habits.";
  else if (percentage >= 70) message = "Good awareness. Review the missed topics and continue practicing safe verification.";

  questionCounter.textContent = "Quiz complete";
  progressBar.style.width = "100%";
  scoreLabel.textContent = `Final score: ${score}/${quizQuestions.length}`;
  quizContent.innerHTML = `
    <div class="result">
      <div class="result-score">${percentage}%</div>
      <h3>${score} out of ${quizQuestions.length} correct</h3>
      <p>${message}</p>
      <button class="restart-button" type="button" id="restart-button">Restart Quiz</button>
    </div>
  `;

  document.getElementById("restart-button").addEventListener("click", restartQuiz);
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  renderQuestion();
}

renderQuestion();

// Completion checklist
const checklistInputs = document.querySelectorAll(".checklist-card input[type='checkbox']");
const completionMessage = document.getElementById("completion-message");

checklistInputs.forEach((input) => {
  input.addEventListener("change", () => {
    const completedCount = [...checklistInputs].filter((item) => item.checked).length;
    if (completedCount === checklistInputs.length) {
      completionMessage.textContent = "Training complete: you are ready to recognize, verify, and report phishing threats.";
      completionMessage.classList.add("complete");
    } else {
      completionMessage.textContent = `${completedCount} of ${checklistInputs.length} practices completed. Keep going!`;
      completionMessage.classList.remove("complete");
    }
  });
});
