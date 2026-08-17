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
// VARIABLES
// ==========================================

let attempts = [];

let performanceChart;


// ==========================================
// LOAD DASHBOARD
// ==========================================

async function loadDashboard() {

    try {

        const response = await fetch(
            `${API_URL}/results/student/history`,
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
            "DASHBOARD RESPONSE:",
            data
        );


        if (!response.ok) {

            document.getElementById(
                "message"
            ).textContent =
                data.message ||
                "Failed to load dashboard";

            return;
        }


        attempts =
            data.attempts || [];


        // ==========================================
        // STATISTICS
        // ==========================================

        calculateStatistics();


        // ==========================================
        // HISTORY
        // ==========================================

        displayHistory();


        // ==========================================
        // CHART
        // ==========================================

        createPerformanceChart();


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        document.getElementById(
            "message"
        ).textContent =
            "Unable to load dashboard.";

    }

}


// ==========================================
// CALCULATE STATISTICS
// ==========================================

function calculateStatistics() {

    const totalAttempts =
        attempts.length;


    document.getElementById(
        "totalAttempts"
    ).textContent =
        totalAttempts;


    // ==========================================
    // UNIQUE QUIZZES
    // ==========================================

    const uniqueQuizzes =
        new Set(
            attempts.map(
                attempt =>
                    attempt.quiz_title
            )
        );


    document.getElementById(
        "completedQuizzes"
    ).textContent =
        uniqueQuizzes.size;


    // ==========================================
    // AVERAGE SCORE
    // ==========================================

    if (attempts.length === 0) {

        document.getElementById(
            "averageScore"
        ).textContent =
            "0%";

        document.getElementById(
            "bestScore"
        ).textContent =
            "0%";

        return;
    }


    const totalPercentage =
        attempts.reduce(
            (sum, attempt) =>
                sum +
                Number(attempt.percentage || 0),
            0
        );


    const average =
        totalPercentage /
        attempts.length;


    document.getElementById(
        "averageScore"
    ).textContent =
        average.toFixed(2) + "%";


    // ==========================================
    // BEST SCORE
    // ==========================================

    const best =
        Math.max(
            ...attempts.map(
                attempt =>
                    Number(
                        attempt.percentage || 0
                    )
            )
        );


    document.getElementById(
        "bestScore"
    ).textContent =
        best.toFixed(2) + "%";

}


// ==========================================
// DISPLAY QUIZ HISTORY
// ==========================================

function displayHistory() {

    const tableBody =
        document.getElementById(
            "historyTableBody"
        );


    if (attempts.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="4">
                    No quiz attempts found.
                </td>
            </tr>
        `;

        return;
    }


    // Show latest 5 attempts

    const recentAttempts =
        attempts.slice(0, 5);


    tableBody.innerHTML =
        recentAttempts.map(
            attempt => `

                <tr>

                    <td>
                        ${attempt.quiz_title}
                    </td>

                    <td>
                        ${attempt.score}
                        /
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

                </tr>

            `
        ).join("");

}


// ==========================================
// PERFORMANCE CHART
// ==========================================

function createPerformanceChart() {

    const canvas =
        document.getElementById(
            "performanceChart"
        );


    if (!canvas) {
        return;
    }


    const labels =
        attempts
            .slice()
            .reverse()
            .map(
                attempt =>
                    attempt.quiz_title
            );


    const scores =
        attempts
            .slice()
            .reverse()
            .map(
                attempt =>
                    Number(
                        attempt.percentage || 0
                    )
            );


    if (performanceChart) {

        performanceChart.destroy();

    }


    performanceChart =
        new Chart(
            canvas,
            {
                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label:
                                "Quiz Percentage",

                            data:
                                scores,

                            borderWidth: 2,

                            tension: 0.3

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    scales: {

                        y: {

                            beginAtZero: true,

                            max: 100

                        }

                    }

                }

            }
        );

}


// ==========================================
// LOGOUT
// ==========================================

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "attemptId"
            );

            localStorage.removeItem(
                "selectedQuizId"
            );

            window.location.href =
                "/";

        }
    );


// ==========================================
// START
// ==========================================

loadDashboard();