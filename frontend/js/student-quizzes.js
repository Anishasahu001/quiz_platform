const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");


// ==========================================
// CHECK LOGIN
// ==========================================

if (!token) {

    alert("Please login first.");

    window.location.href = "/";

}


// ==========================================
// LOGOUT
// ==========================================

document
    .getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.removeItem("token");

        window.location.href = "/";

    });


// ==========================================
// LOAD QUIZZES
// ==========================================

async function loadQuizzes() {

    try {

        const response = await fetch(
            `${API_URL}/student/quizzes`,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json"
                }
            }
        );


        const data = await response.json();


        console.log("QUIZ RESPONSE:", data);


        if (!response.ok) {

            document.getElementById(
                "message"
            ).textContent =
                data.message ||
                "Failed to load quizzes";

            return;
        }


        displayQuizzes(data.quizzes);


    } catch (error) {

        console.error(
            "Load quizzes error:",
            error
        );

        document.getElementById(
            "message"
        ).textContent =
            "Unable to load quizzes";

    }

}


// ==========================================
// DISPLAY QUIZZES
// ==========================================

function displayQuizzes(quizzes) {

    const quizList =
        document.getElementById(
            "quizList"
        );


    quizList.innerHTML = "";


    // Show only published quizzes

    const publishedQuizzes =
        quizzes.filter(
            quiz => quiz.published === true
        );


    if (publishedQuizzes.length === 0) {

        quizList.innerHTML =
            "<p>No quizzes are available.</p>";

        return;
    }


    publishedQuizzes.forEach((quiz) => {

        const quizCard =
            document.createElement("div");


        quizCard.innerHTML = `

            <h2>${quiz.title}</h2>

            <p>
                ${quiz.description}
            </p>

            <p>
                Duration:
                ${quiz.duration} minutes
            </p>

            <button
                onclick="viewQuiz(${quiz.id})"
            >
                View Quiz
            </button>

            <hr>

        `;


        quizList.appendChild(
            quizCard
        );

    });

}


// ==========================================
// VIEW QUIZ
// ==========================================

function viewQuiz(id) {

    localStorage.setItem(
        "selectedQuizId",
        id
    );


    window.location.href =
        "quiz-details.html";

}


// ==========================================
// START
// ==========================================

loadQuizzes();