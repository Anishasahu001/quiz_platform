const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");

const quizId = localStorage.getItem("selectedQuizId");

if (!token) {
    alert("Please login first.");
    window.location.href = "/";
}

if (!quizId) {
    alert("No quiz selected.");
    window.location.href = "student-quizzes.html";
}


async function loadQuizDetails() {

    try {

        const response = await fetch(
            `${API_URL}/student/quizzes/${quizId}`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = await response.json();

        console.log("QUIZ DETAILS:", data);

        if (!response.ok) {

            document.getElementById("message").textContent =
                data.message || "Failed to load quiz";

            return;
        }

        const quiz = data.quiz;

        document.getElementById("quizTitle").textContent =
            quiz.title;

        document.getElementById("quizDescription").textContent =
            quiz.description;

        document.getElementById("quizDuration").textContent =
            quiz.duration;

    } catch (error) {

        console.error(
            "Load quiz details error:",
            error
        );

        document.getElementById("message").textContent =
            "Unable to load quiz details";
    }
}


document
    .getElementById("startQuizBtn")
    .addEventListener("click", () => {

        window.location.href =
            "start-quiz.html";

    });


loadQuizDetails();
