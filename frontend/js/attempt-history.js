const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");


// ==========================================
// LOGIN CHECK
// ==========================================

if (!token) {

    alert("Please login first.");

    window.location.href = "/";

}


// ==========================================
// LOAD ATTEMPT HISTORY
// ==========================================

async function loadAttemptHistory() {

    try {

        const response = await fetch(
            `${API_URL}/results/student/history`,
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
            "ATTEMPT HISTORY RESPONSE:",
            data
        );


        if (!response.ok) {

            document.getElementById(
                "message"
            ).textContent =
                data.message ||
                "Failed to load attempt history";

            return;

        }


        const tableBody =
            document.getElementById(
                "attemptTableBody"
            );


        tableBody.innerHTML = "";


        if (
            !data.attempts ||
            data.attempts.length === 0
        ) {

            document.getElementById(
                "message"
            ).textContent =
                "No quiz attempts found.";

            return;

        }


        data.attempts.forEach(
            (attempt) => {

                const row =
                    document.createElement("tr");


                const date =
                    new Date(
                        attempt.created_at
                    ).toLocaleString();


                row.innerHTML = `

                    <td>
                        ${attempt.quiz_title}
                    </td>

                    <td>
                        ${attempt.score}
                    </td>

                    <td>
                        ${attempt.total_questions}
                    </td>

                    <td>
                        ${Number(
                            attempt.percentage
                        ).toFixed(2)}%
                    </td>

                    <td>
                        ${attempt.status}
                    </td>

                    <td>
                        ${date}
                    </td>

                    <td>

                        <button
                            onclick="reviewAttempt(${attempt.attempt_id})"
                        >
                            Review
                        </button>

                    </td>

                `;


                tableBody.appendChild(row);

            }
        );


    } catch (error) {

        console.error(
            "Attempt history error:",
            error
        );


        document.getElementById(
            "message"
        ).textContent =
            "Unable to load attempt history.";

    }

}


// ==========================================
// REVIEW ATTEMPT
// ==========================================

function reviewAttempt(attemptId) {

    localStorage.setItem(
        "attemptId",
        attemptId
    );


    window.location.href =
        "answer-review.html";

}


// ==========================================
// START
// ==========================================

loadAttemptHistory();