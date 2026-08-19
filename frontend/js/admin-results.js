const API_URL = "https://quiz-platform-backend-h8av.onrender.com/api";

const token = localStorage.getItem("token");

if (!token) {

    alert("Please login first.");

    window.location.href = "/";

}


// ==========================================
// LOAD ALL RESULTS
// ==========================================

async function loadResults() {

    try {

        const response = await fetch(
            `${API_URL}/results/admin/all`,
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
            "ADMIN RESULTS RESPONSE:",
            data
        );


        if (!response.ok) {

            document.getElementById(
                "message"
            ).textContent =
                data.message ||
                "Failed to load results";

            return;

        }


        const results =
            data.results;


        const tableBody =
            document.getElementById(
                "resultsTableBody"
            );


        tableBody.innerHTML = "";


        if (results.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="8">
                        No quiz attempts found.
                    </td>
                </tr>
            `;

            return;

        }


        results.forEach((result) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${result.student_name}
                </td>

                <td>
                    ${result.student_email}
                </td>

                <td>
                    ${result.quiz_title}
                </td>

                <td>
                    ${result.score}
                    /
                    ${result.total_questions}
                </td>

                <td>
                    ${result.percentage}%
                </td>

                <td>
                    ${result.status}
                </td>

                <td>
                    ${new Date(
                        result.created_at
                    ).toLocaleString()}
                </td>

            `;


            tableBody.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Load results error:",
            error
        );


        document.getElementById(
            "message"
        ).textContent =
            "Unable to load results.";

    }

}


loadResults();