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

async function loadAttempts() {

    try {

        const response = await fetch(
            `${API_URL}/results/my-attempts`,
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


        console.log(
            "ATTEMPT HISTORY RESPONSE:",
            data
        );


        if (!response.ok) {

            document.getElementById(
                "message"
            ).textContent =
                data.message ||
                "Failed to load attempts";

            return;

        }


        const tbody =
            document.getElementById(
                "attemptTableBody"
            );


        tbody.innerHTML = "";


        if (
            !data.attempts ||
            data.attempts.length === 0
        ) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        No attempts found.
                    </td>
                </tr>
            `;

            return;

        }


        data.attempts.forEach(
            (attempt) => {

                const row =
                    document.createElement(
                        "tr"
                    );


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
                        ${new Date(
                            attempt.attempt_date
                        ).toLocaleString()}
                    </td>

                    <td>

                        <button
                            onclick="reviewAttempt(${attempt.attempt_id})"
                        >
                            Review
                        </button>

                    </td>

                `;


                tbody.appendChild(row);

            }
        );


    } catch (error) {

        console.error(
            "Load attempts error:",
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

loadAttempts();