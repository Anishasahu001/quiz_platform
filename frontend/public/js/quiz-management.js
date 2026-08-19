const API_URL = "https://quiz-platform-backend-h8av.onrender.com/api";

const token = localStorage.getItem("token");

if (!token) {
    alert("Please login as admin first.");
    window.location.href = "/";
}


// ==========================================
// CREATE QUIZ
// ==========================================

document
    .getElementById("quizForm")
    .addEventListener("submit", async (event) => {

        event.preventDefault();

        const title =
            document.getElementById("title").value;

        const description =
            document.getElementById("description").value;

        const duration =
            document.getElementById("duration").value;

        try {

            const response = await fetch(
                `${API_URL}/quizzes`,
                {
                    method: "POST",

                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        title,
                        description,
                        duration: Number(duration)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                document.getElementById("message").textContent =
                    data.message || "Failed to create quiz";

                return;
            }

            document.getElementById("message").textContent =
                "Quiz created successfully!";

            document
                .getElementById("quizForm")
                .reset();

            loadQuizzes();

        } catch (error) {

            console.error(
                "Create quiz error:",
                error
            );

        }
    });


// ==========================================
// GET ALL QUIZZES
// ==========================================

async function loadQuizzes() {

    try {

        const response = await fetch(
            `${API_URL}/quizzes`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            console.error(
                data.message ||
                "Failed to load quizzes"
            );

            return;
        }

        displayQuizzes(data.quizzes);

    } catch (error) {

        console.error(
            "Get quizzes error:",
            error
        );

    }
}


// ==========================================
// DISPLAY QUIZZES
// ==========================================

function displayQuizzes(quizzes) {

    const tableBody =
        document.getElementById("quizTableBody");

    tableBody.innerHTML = "";

    quizzes.forEach((quiz) => {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${quiz.id}</td>

            <td>${quiz.title}</td>

            <td>${quiz.description}</td>

            <td>${quiz.duration} minutes</td>

            <td>
                ${quiz.published ? "Published" : "Unpublished"}
            </td>

            <td>

                <button
                    onclick="editQuiz(
                        ${quiz.id},
                        '${escapeQuotes(quiz.title)}',
                        '${escapeQuotes(quiz.description)}',
                        ${quiz.duration}
                    )">
                    Edit
                </button>

                <button
                    onclick="deleteQuiz(${quiz.id})">
                    Delete
                </button>
                <button
                    onclick="togglePublish(${quiz.id})">
                    ${quiz.published ? "Unpublish" : "Publish"}
                </button>

            </td>
        `;

        tableBody.appendChild(row);

    });
}


// ==========================================
// ESCAPE QUOTES
// ==========================================

function escapeQuotes(value) {

    return value
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");

}


// ==========================================
// EDIT QUIZ
// ==========================================

function editQuiz(
    id,
    title,
    description,
    duration
) {

    document.getElementById("editSection")
        .style.display = "block";

    document.getElementById("editId")
        .value = id;

    document.getElementById("editTitle")
        .value = title;

    document.getElementById("editDescription")
        .value = description;

    document.getElementById("editDuration")
        .value = duration;

}


// ==========================================
// UPDATE QUIZ
// ==========================================

document
    .getElementById("editQuizForm")
    .addEventListener("submit", async (event) => {

        event.preventDefault();

        const id =
            document.getElementById("editId").value;

        const title =
            document.getElementById("editTitle").value;

        const description =
            document.getElementById("editDescription").value;

        const duration =
            document.getElementById("editDuration").value;

        try {

            const response = await fetch(
                `${API_URL}/quizzes/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        title,
                        description,
                        duration: Number(duration)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to update quiz"
                );

                return;
            }

            alert(
                "Quiz updated successfully!"
            );

            document
                .getElementById("editQuizForm")
                .reset();

            document
                .getElementById("editSection")
                .style.display = "none";

            loadQuizzes();

        } catch (error) {

            console.error(
                "Update quiz error:",
                error
            );

        }

    });


// ==========================================
// CANCEL EDIT
// ==========================================

document
    .getElementById("cancelEdit")
    .addEventListener("click", () => {

        document
            .getElementById("editSection")
            .style.display = "none";

    });


// ==========================================
// DELETE QUIZ
// ==========================================

async function deleteQuiz(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this quiz?"
        );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/quizzes/${id}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Failed to delete quiz"
            );

            return;
        }

        alert(
            "Quiz deleted successfully!"
        );

        loadQuizzes();

    } catch (error) {

        console.error(
            "Delete quiz error:",
            error
        );

    }

}
// ==========================================
// PUBLISH / UNPUBLISH QUIZ
// ==========================================

async function togglePublish(id) {

    try {

        const response = await fetch(
            `${API_URL}/quizzes/${id}/publish`,
            {
                method: "PATCH",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Failed to update quiz"
            );

            return;
        }

        alert(
            data.message ||
            "Quiz status updated successfully!"
        );

        loadQuizzes();

    } catch (error) {

        console.error(
            "Publish error:",
            error
        );

    }
}


// ==========================================
// START
// ==========================================

loadQuizzes();