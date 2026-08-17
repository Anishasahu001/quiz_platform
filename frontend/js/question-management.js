const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");

if (!token) {
    alert("Please login as admin first.");
    window.location.href = "/";
}


// ==========================================
// ADD QUESTION
// ==========================================

document
    .getElementById("questionForm")
    .addEventListener("submit", async (event) => {

        event.preventDefault();

        const quiz_id =
            document.getElementById("quizId").value;

        const category_id =
            document.getElementById("categoryId").value;

        const question_text =
            document.getElementById("questionText").value;

        const options = [
            document.getElementById("option1").value,
            document.getElementById("option2").value,
            document.getElementById("option3").value,
            document.getElementById("option4").value
        ];

        const correct_answer =
            document.getElementById("correctAnswer").value;


        try {

            const response = await fetch(
                `${API_URL}/questions`,
                {
                    method: "POST",

                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        quiz_id: Number(quiz_id),
                        category_id: category_id
                            ? Number(category_id)
                            : null,
                        question_text,
                        options,
                        correct_answer: Number(correct_answer)
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                document.getElementById("message")
                    .textContent =
                    data.message ||
                    "Failed to create question";

                return;
            }


            document.getElementById("message")
                .textContent =
                "Question added successfully!";


            document.getElementById("questionForm")
                .reset();


            loadQuestions();

        } catch (error) {

            console.error(
                "Create question error:",
                error
            );

        }

    });


// ==========================================
// GET QUESTIONS
// ==========================================

async function loadQuestions() {

    try {

        const response = await fetch(
            `${API_URL}/questions`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        if (!response.ok) {

            console.error(data.message);

            return;
        }


        displayQuestions(data.questions);

    } catch (error) {

        console.error(
            "Get questions error:",
            error
        );

    }

}


// ==========================================
// DISPLAY QUESTIONS
// ==========================================

function displayQuestions(questions) {

    const tableBody =
        document.getElementById(
            "questionTableBody"
        );

    tableBody.innerHTML = "";


    questions.forEach((question) => {

        let correctText = "";


        if (Number(question.correct_answer) === 0) {
            correctText = question.option_a;
        }

        if (Number(question.correct_answer) === 1) {
            correctText = question.option_b;
        }

        if (Number(question.correct_answer) === 2) {
            correctText = question.option_c;
        }

        if (Number(question.correct_answer) === 3) {
            correctText = question.option_d;
        }


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${question.id}</td>

            <td>${question.quiz_id}</td>

            <td>${question.question_text}</td>

            <td>
                A. ${question.option_a}<br>
                B. ${question.option_b}<br>
                C. ${question.option_c}<br>
                D. ${question.option_d}
            </td>

            <td>
                ${correctText}
            </td>

            <td>

                <button
                    onclick="editQuestion(
                        ${question.id}
                    )"
                >
                    Edit
                </button>


                <button
                    onclick="deleteQuestion(
                        ${question.id}
                    )"
                >
                    Delete
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ==========================================
// EDIT QUESTION
// ==========================================

async function editQuestion(id) {

    try {

        const response = await fetch(
            `${API_URL}/questions`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        const question =
            data.questions.find(
                q => q.id === id
            );


        if (!question) {

            alert("Question not found");

            return;
        }


        document.getElementById("editSection")
            .style.display = "block";


        document.getElementById("editId")
            .value = question.id;


        document.getElementById("editQuizId")
            .value = question.quiz_id;


        document.getElementById("editCategoryId")
            .value = question.category_id || "";


        document.getElementById("editQuestionText")
            .value = question.question_text;


        document.getElementById("editOption1")
            .value = question.option_a;


        document.getElementById("editOption2")
            .value = question.option_b;


        document.getElementById("editOption3")
            .value = question.option_c;


        document.getElementById("editOption4")
            .value = question.option_d;


        document.getElementById("editCorrectAnswer")
            .value = question.correct_answer;


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        console.error(
            "Edit question error:",
            error
        );

    }

}


// ==========================================
// UPDATE QUESTION
// ==========================================

document
    .getElementById("editQuestionForm")
    .addEventListener("submit", async (event) => {

        event.preventDefault();


        const id =
            document.getElementById("editId").value;


        const quiz_id =
            document.getElementById("editQuizId").value;


        const category_id =
            document.getElementById("editCategoryId").value;


        const question_text =
            document.getElementById(
                "editQuestionText"
            ).value;


        const options = [

            document.getElementById(
                "editOption1"
            ).value,

            document.getElementById(
                "editOption2"
            ).value,

            document.getElementById(
                "editOption3"
            ).value,

            document.getElementById(
                "editOption4"
            ).value

        ];


        const correct_answer =
            document.getElementById(
                "editCorrectAnswer"
            ).value;


        try {

            const response = await fetch(
                `${API_URL}/questions/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        quiz_id:
                            Number(quiz_id),

                        category_id:
                            category_id
                                ? Number(category_id)
                                : null,

                        question_text,

                        options,

                        correct_answer:
                            Number(correct_answer)

                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to update question"
                );

                return;
            }


            alert(
                "Question updated successfully!"
            );


            document.getElementById(
                "editSection"
            ).style.display = "none";


            loadQuestions();

        } catch (error) {

            console.error(
                "Update question error:",
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

        document.getElementById(
            "editSection"
        ).style.display = "none";

    });


// ==========================================
// DELETE QUESTION
// ==========================================

async function deleteQuestion(id) {

    if (
        !confirm(
            "Are you sure you want to delete this question?"
        )
    ) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/questions/${id}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to delete question"
            );

            return;
        }


        alert(
            "Question deleted successfully!"
        );


        loadQuestions();


    } catch (error) {

        console.error(
            "Delete question error:",
            error
        );

    }

}


// ==========================================
// START
// ==========================================

loadQuestions();