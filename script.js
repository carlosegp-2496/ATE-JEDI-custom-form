/* =========================================
   1. ATE JEDI READINESS ASSESSMENT
========================================= */

(function () {
  const root = document.getElementById("ate-jedi-assessment");

  if (!root || root.dataset.initialized === "true") return;

  root.dataset.initialized = "true";

  // B Corp journey options
  const journeyOptions = [
    "Preparing for initial B Corp Certification",
    "Preparing for B Corp recertification",
    "Already certified and working to strengthen our JEDI practices",
    "Exploring B Corp Certification for the first time",
    "Not currently pursuing certification, but interested in improving our JEDI practices",
  ];

  // Assessment questions
  const questions = [
    {
      title: "Workforce Data & Employee Feedback",
      question:
        "Has your organization gathered employee feedback or voluntary workforce demographic data to understand equity and inclusion experiences?",
      service: "Workforce Equity & Organizational Culture Assessment",
    },
    {
      title: "Identifying JEDI Priorities",
      question:
        "Has your organization identified specific JEDI priorities based on employee feedback, organizational data or an equity assessment?",
      service: "JEDI Readiness Assessment & Gap Analysis",
    },
    {
      title: "Policies & Organizational Practices",
      question:
        "Have you reviewed your workplace policies and practices to identify potential barriers to equity and inclusion?",
      service: "JEDI Policy & Practices Review",
    },
    {
      title: "Leadership Education & Accountability",
      question:
        "Have your organizational leaders received education to strengthen their understanding of JEDI and their accountability for implementation?",
      service: "JEDI Leadership Education & Capacity Building",
    },
    {
      title: "Implementation of JEDI Actions",
      question:
        "Has your organization implemented and documented meaningful JEDI actions within your workplace or broader business operations?",
      service: "JEDI Strategy & Implementation Roadmap",
    },
    {
      title: "Measurement & Continuous Improvement",
      question:
        "Does your organization have a process to measure progress, maintain supporting evidence and regularly review its JEDI commitments?",
      service: "JEDI Measurement & Progress Reporting",
    },
  ];

  // Scoring system
  const points = {
    Yes: 2,
    Partially: 1,
    No: 0,
    Unsure: 0,
  };

  // Assessment result messages
  const messages = {
    high: {
      title: "Building on Your JEDI Foundation",
      message:
        "Your responses suggest that your organization has established several foundational JEDI practices. The next step is to confirm how these practices align with applicable B Lab requirements, identify any remaining gaps, and ensure your progress is supported by appropriate documentation. All Things Equitable can help you validate your current approach and identify opportunities for continued improvement.",
    },

    medium: {
      title: "Opportunities to Strengthen Your JEDI Practices",
      message:
        "Your organization appears to have some important JEDI practices underway, with opportunities to strengthen consistency, accountability and implementation. All Things Equitable can help you assess your current state, prioritize improvements and develop a practical roadmap aligned with your organizational needs and applicable B Lab requirements.",
    },

    low: {
      title: "Establishing Your JEDI Foundation",
      message:
        "Your responses suggest that your organization may benefit from establishing or strengthening foundational JEDI practices. All Things Equitable can help you understand your current state, identify priorities and develop an achievable implementation plan that supports meaningful and sustainable progress.",
    },
  };

  // Assessment state
  let currentStep = -1;
  let journey = "";
  let answers = {};

  // DOM elements
  const welcome = root.querySelector("#ate-welcome");
  const questionsScreen = root.querySelector("#ate-questions");
  const resultsScreen = root.querySelector("#ate-results");
  const content = root.querySelector("#ate-question-content");

  // Show selected screen
  function showScreen(screen) {
    welcome.classList.add("ate-hidden");
    questionsScreen.classList.add("ate-hidden");
    resultsScreen.classList.add("ate-hidden");

    screen.classList.remove("ate-hidden");
  }

  // Render current assessment step
  function renderStep() {
    const totalSteps = questions.length + 1;

    root.querySelector("#ate-step-label").textContent =
      currentStep === 0
        ? "Your B Corp journey"
        : "Question " + currentStep + " of 6";

    const progress =
      currentStep === 0 ? 0 : ((currentStep - 1) / questions.length) * 100;

    root.querySelector("#ate-progress-fill").style.width = progress + "%";

    root.querySelector('[data-action="back"]').style.visibility =
      currentStep === 0 ? "hidden" : "visible";

    root.querySelector('[data-action="next"]').textContent =
      currentStep === totalSteps - 1 ? "See My Results" : "Continue";

    // First step: B Corp journey
    if (currentStep === 0) {
      content.innerHTML = `
        <h3>Where Are You in Your B Corp Journey?</h3>

        <p class="ate-muted">
          This question helps us understand your organization's
          current stage. It does not affect your readiness results.
        </p>

        ${journeyOptions
          .map(
            (option, index) => `
          <label class="ate-option">
            <input
              type="radio"
              name="ate-journey"
              value="${index}"
              ${journey === option ? "checked" : ""}
            >
            <span>${option}</span>
          </label>
        `,
          )
          .join("")}
      `;
    } else {
      // Remaining steps: Assessment questions
      const q = questions[currentStep - 1];
      const selected = answers[currentStep - 1] || "";

      content.innerHTML = `
        <h3>${q.title}</h3>

        <p>${q.question}</p>

        ${["Yes", "Partially", "No", "Unsure"]
          .map(
            (option) => `
          <label class="ate-option">
            <input
              type="radio"
              name="ate-answer"
              value="${option}"
              ${selected === option ? "checked" : ""}
            >
            <span>${option}</span>
          </label>
        `,
          )
          .join("")}
      `;
    }
  }

  // Calculate and display assessment results
  function showResults() {
    const score = Object.values(answers).reduce(
      (total, answer) => total + points[answer],
      0,
    );

    let category;

    if (score >= 10) {
      category = messages.high;
    } else if (score >= 6) {
      category = messages.medium;
    } else {
      category = messages.low;
    }

    root.querySelector("#ate-result-title").textContent = category.title;

    root.querySelector("#ate-score").textContent = score + " / 12";

    root.querySelector("#ate-result-message").textContent = category.message;

    // Identify areas that may need additional support
    const recommendations = questions
      .map((q, index) => ({
        question: q.title,
        service: q.service,
        answer: answers[index],
      }))
      .filter((item) => item.answer !== "Yes");

    const recommendationContainer = root.querySelector("#ate-recommendations");

    if (recommendations.length === 0) {
      recommendationContainer.innerHTML = `
        <p>
          Your responses did not identify any immediate areas
          for additional support. You may still wish to validate
          your practices and supporting documentation.
        </p>
      `;
    } else {
      recommendationContainer.innerHTML = recommendations
        .map(
          (item) => `
        <div class="ate-recommendation">
          <strong>${item.question}</strong>

          <p class="ate-muted">
            Your response: ${item.answer}
          </p>

          <strong>Potential ATE support:</strong>

          <p>${item.service}</p>
        </div>
      `,
        )
        .join("");
    }

    // Store assessment data in the root element
    root.dataset.assessmentScore = score;
    root.dataset.bcorpJourney = journey;
    root.dataset.assessmentAnswers = JSON.stringify(answers);

    showScreen(resultsScreen);
  }

  // Listen for answer selections
  root.addEventListener("change", function (event) {
    if (event.target.name === "ate-journey") {
      journey = journeyOptions[Number(event.target.value)];
    }

    if (event.target.name === "ate-answer") {
      answers[currentStep - 1] = event.target.value;
    }
  });

  // Listen for button clicks
  root.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]");

    if (!button) return;

    const action = button.dataset.action;

    // Start assessment
    if (action === "start") {
      currentStep = 0;

      showScreen(questionsScreen);
      renderStep();
    }

    // Go back one step
    if (action === "back" && currentStep > 0) {
      currentStep--;
      renderStep();
    }

    // Continue to next step
    if (action === "next") {
      if (currentStep === 0 && !journey) {
        alert("Please select your B Corp journey stage.");
        return;
      }

      if (currentStep > 0 && !answers[currentStep - 1]) {
        alert("Please select an answer before continuing.");
        return;
      }

      if (currentStep === questions.length) {
        showResults();
        return;
      }

      currentStep++;
      renderStep();
    }

    // Restart assessment
    if (action === "restart") {
      currentStep = -1;
      journey = "";
      answers = {};

      delete root.dataset.assessmentScore;
      delete root.dataset.bcorpJourney;
      delete root.dataset.assessmentAnswers;

      showScreen(welcome);
    }
  });
})();

/* =========================================
   2. DUBSADO SUBMISSION INTEGRATION
========================================= */

(function () {
  const customButton = document.getElementById("ate-submit-assessment");

  if (!customButton) return;

  customButton.addEventListener("click", function () {
    // Locate Dubsado's native submission button
    const nativeSubmit = document.querySelector(".submit-form-button");

    if (!nativeSubmit) {
      console.error("ATE: Dubsado native Submit button was not found.");

      alert(
        "We couldn't submit your assessment. Please try again or use the original Submit button.",
      );

      return;
    }

    // Trigger Dubsado's actual submission process
    nativeSubmit.click();
  });
})();
