const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");

const attemptId = localStorage.getItem("attemptId");


if (!token) {

    alert("Please login first.");

    window.location.href = "/";

}


// ==========================================
// LOAD ANSWER REVIEW
// ==========================================

async function loadAnswerReview() {

    if (!attemptId) {

        document.getElementById(
            "message"
        ).textContent =
            "No quiz attempt found.";

        return;

    }


    try {

        const response = await fetch(
            `${API_URL}/results/attempt/${attemptId}/review`,
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


        const data =
            await response.json();


        console.log(
            "ANSWER REVIEW RESPONSE:",
            data
        );


        if (!response.ok) {

            document.getElementById(
                "message"
            ).textContent =
                data.message ||
                "Failed to load answer review";

            return;

        }


        const container =
            document.getElementById(
                "reviewContainer"
            );


        container.innerHTML = "";


        data.answers.forEach(
            (answer, index) => {

                const questionDiv =
                    document.createElement(
                        "div"
                    );


                const selectedAnswer =
                    getAnswerText(
                        answer,
                        answer.selected_answer
                    );


                const correctAnswer =
                    getAnswerText(
                        answer,
                        answer.correct_answer
                    );


                const resultText =
                    answer.is_correct
                        ? "Correct"
                        : "Incorrect";


                questionDiv.innerHTML = `

                    <hr>

                    <h2>
                        Question ${index + 1}
                    </h2>

                    <p>
                        <strong>
                            ${answer.question_text}
                        </strong>
                    </p>

                    <p>
                        Your Answer:
                        ${selectedAnswer}
                    </p>

                    <p>
                        Correct Answer:
                        ${correctAnswer}
                    </p>

                    <p>
                        Result:
                        <strong>
                            ${resultText}
                        </strong>
                    </p>

                    <p>
                        Explanation:
                        ${answer.explanation || "No explanation available."}
                    </p>

                `;


                container.appendChild(
                    questionDiv
                );

            }
        );


    } catch (error) {

        console.error(
            "Answer review error:",
            error
        );


        document.getElementById(
            "message"
        ).textContent =
            "Unable to load answer review.";

    }

}


// ==========================================
// GET ANSWER TEXT
// ==========================================

function getAnswerText(
    question,
    answer
) {

    if (
        answer === null ||
        answer === undefined
    ) {

        return "Not answered";

    }


    const value =
        String(answer);


    if (value === "0") {

        return question.option_a;

    }

    if (value === "1") {

        return question.option_b;

    }

    if (value === "2") {

        return question.option_c;

    }

    if (value === "3") {

        return question.option_d;

    }


    return value;

}


loadAnswerReview();