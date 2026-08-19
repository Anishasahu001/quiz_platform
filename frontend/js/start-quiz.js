const API_URL = "https://quiz-platform-backend-h8av.onrender.com/api";

const token = localStorage.getItem("token");
const quizId = localStorage.getItem("selectedQuizId");

// ==========================================
// LOGIN CHECK
// ==========================================

if (!token) {
    alert("Please login first.");
    window.location.href = "/";
}

// ==========================================
// QUIZ CHECK
// ==========================================

if (!quizId) {
    alert("No quiz selected.");
    window.location.href = "student-quizzes.html";
}

// ==========================================
// VARIABLES
// ==========================================

let questions = [];
let currentQuestion = 0;
let answers = {};
let timeRemaining = 0;
let timerInterval;
let isSubmitted = false;

// ==========================================
// LOAD QUIZ
// ==========================================

async function loadQuiz() {

    try {

        const response = await fetch(
            `${API_URL}/student/quizzes/${quizId}/questions`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = await response.json();

        console.log(
            "QUESTIONS RESPONSE:",
            data
        );

        if (!response.ok) {

            document.getElementById(
                "message"
            ).textContent =
                data.message ||
                "Failed to load quiz";

            return;
        }

        questions = data.questions || [];

        document.getElementById(
            "quizTitle"
        ).textContent = data.quiz.title;

        document.getElementById(
            "quizDescription"
        ).textContent =
            data.quiz.description;

        // ==========================================
        // TIMER
        // ==========================================

        timeRemaining =
            Number(data.quiz.duration) * 60;

        startTimer();

        // ==========================================
        // SHOW FIRST QUESTION
        // ==========================================

        showQuestion();

    } catch (error) {

        console.error(
            "Load quiz error:",
            error
        );

        document.getElementById(
            "message"
        ).textContent =
            "Unable to load quiz";
    }
}

// ==========================================
// SHOW QUESTION
// ==========================================

function showQuestion() {

    const container =
        document.getElementById(
            "questionContainer"
        );

    if (questions.length === 0) {

        container.innerHTML =
            "<p>No questions available.</p>";

        return;
    }

    const question =
        questions[currentQuestion];

    const selectedAnswer =
        answers[question.id];

    container.innerHTML = `

        <h2>
            Question ${currentQuestion + 1}
            of ${questions.length}
        </h2>

        <p>
            ${question.question_text}
        </p>

        <label>

            <input
                type="radio"
                name="answer"
                value="0"

                ${selectedAnswer === "0"
                    ? "checked"
                    : ""}

                onchange="selectAnswer('0')"
            >

            ${question.option_a}

        </label>

        <br><br>

        <label>

            <input
                type="radio"
                name="answer"
                value="1"

                ${selectedAnswer === "1"
                    ? "checked"
                    : ""}

                onchange="selectAnswer('1')"
            >

            ${question.option_b}

        </label>

        <br><br>

        <label>

            <input
                type="radio"
                name="answer"
                value="2"

                ${selectedAnswer === "2"
                    ? "checked"
                    : ""}

                onchange="selectAnswer('2')"
            >

            ${question.option_c}

        </label>

        <br><br>

        <label>

            <input
                type="radio"
                name="answer"
                value="3"

                ${selectedAnswer === "3"
                    ? "checked"
                    : ""}

                onchange="selectAnswer('3')"
            >

            ${question.option_d}

        </label>

    `;

    showNavigation();
}

// ==========================================
// SELECT ANSWER
// ==========================================

function selectAnswer(answer) {

    const question =
        questions[currentQuestion];

    answers[question.id] =
        String(answer);

    console.log(
        "Selected answers:",
        answers
    );
}

// ==========================================
// NAVIGATION
// ==========================================

function showNavigation() {

    const navigation =
        document.getElementById(
            "navigation"
        );

    navigation.innerHTML = "";

    // Previous button

    if (currentQuestion > 0) {

        navigation.innerHTML += `

            <button
                onclick="previousQuestion()"
            >
                Previous
            </button>

        `;
    }

    // Next button

    if (
        currentQuestion <
        questions.length - 1
    ) {

        navigation.innerHTML += `

            <button
                onclick="nextQuestion()"
            >
                Next
            </button>

        `;

    } else {

        // Submit button

        navigation.innerHTML += `

            <button
                onclick="submitQuiz()"
            >
                Submit Quiz
            </button>

        `;
    }
}

// ==========================================
// NEXT QUESTION
// ==========================================

function nextQuestion() {

    if (
        currentQuestion <
        questions.length - 1
    ) {

        currentQuestion++;

        showQuestion();
    }
}

// ==========================================
// PREVIOUS QUESTION
// ==========================================

function previousQuestion() {

    if (currentQuestion > 0) {

        currentQuestion--;

        showQuestion();
    }
}

// ==========================================
// TIMER
// ==========================================

function startTimer() {

    updateTimer();

    timerInterval =
        setInterval(() => {

            timeRemaining--;

            updateTimer();

            if (timeRemaining <= 0) {

                clearInterval(
                    timerInterval
                );

                alert(
                    "Time is over! Quiz will be submitted automatically."
                );

                submitQuiz();
            }

        }, 1000);
}

// ==========================================
// UPDATE TIMER
// ==========================================

function updateTimer() {

    const minutes =
        Math.floor(
            timeRemaining / 60
        );

    const seconds =
        timeRemaining % 60;

    const timer =
        document.getElementById(
            "timer"
        );

    if (!timer) {
        return;
    }

    timer.textContent =
        String(minutes).padStart(
            2,
            "0"
        )
        + ":"
        +
        String(seconds).padStart(
            2,
            "0"
        );
}

// ==========================================
// SUBMIT QUIZ
// ==========================================

async function submitQuiz() {

    // Prevent double submission

    if (isSubmitted) {
        return;
    }

    isSubmitted = true;

    clearInterval(
        timerInterval
    );

    console.log(
        "Final Answers:",
        answers
    );

    try {

        const response = await fetch(
            `${API_URL}/results/${quizId}/submit`,
            {
                method: "POST",

                headers: {
                    "Authorization":
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    answers: answers
                })
            }
        );

        const data =
            await response.json();

        console.log(
            "SUBMIT RESPONSE:",
            data
        );
        if (data.attemptId) {

            localStorage.setItem(
                "attemptId",
                data.attemptId
            );

            console.log(
                "Saved attemptId:",
                data.attemptId
            );
        }

        // ==========================================
        // CHECK RESPONSE
        // ==========================================

        if (!response.ok) {

            isSubmitted = false;

            alert(
                data.message ||
                "Failed to submit quiz"
            );

            return;
        }

        // ==========================================
        // SAVE ATTEMPT ID
        // ==========================================

        if (data.attemptId) {

            localStorage.setItem(
                "attemptId",
                data.attemptId
            );

            console.log(
                "Saved attemptId:",
                data.attemptId
            );
        }

        // ==========================================
        // SAVE RESULT DATA
        // ==========================================

        localStorage.setItem(
            "quizScore",
            data.score
        );

        localStorage.setItem(
            "quizTotalQuestions",
            data.totalQuestions
        );

        localStorage.setItem(
            "quizPercentage",
            data.percentage
        );

        localStorage.setItem(
            "quizStatus",
            data.status
        );

        console.log(
            "Quiz submission completed."
        );

        // ==========================================
        // GO TO RESULT PAGE
        // ==========================================

        alert(
            "Quiz submitted successfully!"
        );

        window.location.href =
            "result.html";

    } catch (error) {

        isSubmitted = false;

        console.error(
            "Submit quiz error:",
            error
        );

        alert(
            "Unable to submit quiz."
        );
    }
}

// ==========================================
// START
// ==========================================

loadQuiz();