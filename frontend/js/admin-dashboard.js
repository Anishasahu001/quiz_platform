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
// LOAD ADMIN ANALYTICS
// ==========================================

async function loadAnalytics() {

    try {

        const response = await fetch(
            `${API_URL}/results/admin/analytics`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = await response.json();

        console.log("ADMIN ANALYTICS RESPONSE:", data);

        if (!response.ok) {

            console.error(
                data.message || "Analytics failed"
            );

            return;
        }


        // ==========================================
        // TOTAL STUDENTS
        // ==========================================

        const analyticsStudents =
            document.getElementById("analyticsStudents");

        if (analyticsStudents) {
            analyticsStudents.textContent =
                data.students.total;
        }


        // ==========================================
        // TOTAL QUIZZES
        // ==========================================

        const analyticsQuizzes =
            document.getElementById("analyticsQuizzes");

        if (analyticsQuizzes) {
            analyticsQuizzes.textContent =
                data.quizzes.total;
        }


        // IMPORTANT:
        // Update the top "Total Quizzes" card
        // using the same working analytics API.

        const totalQuizzes =
            document.getElementById("totalQuizzes");

        if (totalQuizzes) {
            totalQuizzes.textContent =
                data.quizzes.total;
        }


        // ==========================================
        // TOTAL ATTEMPTS
        // ==========================================

        const analyticsAttempts =
            document.getElementById("analyticsAttempts");

        if (analyticsAttempts) {
            analyticsAttempts.textContent =
                data.attempts.total;
        }


        // ==========================================
        // AVERAGE SCORE
        // ==========================================

        const analyticsAverage =
            document.getElementById("analyticsAverage");

        if (analyticsAverage) {

            analyticsAverage.textContent =
                Number(
                    data.attempts.averageScore
                ).toFixed(2) + "%";

        }


        // ==========================================
        // HIGHEST SCORE
        // ==========================================

        const analyticsHighest =
            document.getElementById("analyticsHighest");

        if (analyticsHighest) {

            analyticsHighest.textContent =
                Number(
                    data.attempts.highestScore
                ).toFixed(2) + "%";

        }


        // ==========================================
        // LOWEST SCORE
        // ==========================================

        const analyticsLowest =
            document.getElementById("analyticsLowest");

        if (analyticsLowest) {

            analyticsLowest.textContent =
                Number(
                    data.attempts.lowestScore
                ).toFixed(2) + "%";

        }


        // ==========================================
        // PASSED
        // ==========================================

        const analyticsPassed =
            document.getElementById("analyticsPassed");

        if (analyticsPassed) {
            analyticsPassed.textContent =
                data.passFail.passed;
        }


        const passCount =
            document.getElementById("passCount");

        if (passCount) {
            passCount.textContent =
                data.passFail.passed;
        }


        // ==========================================
        // FAILED
        // ==========================================

        const analyticsFailed =
            document.getElementById("analyticsFailed");

        if (analyticsFailed) {
            analyticsFailed.textContent =
                data.passFail.failed;
        }


        const failCount =
            document.getElementById("failCount");

        if (failCount) {
            failCount.textContent =
                data.passFail.failed;
        }


        console.log(
            "Admin analytics loaded successfully."
        );

    }

    catch (error) {

        console.error(
            "Load analytics error:",
            error
        );

    }

}


// ==========================================
// LOAD USERS
// ==========================================

async function loadUsers() {

    try {

        const response = await fetch(
            `${API_URL}/admin/users`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );


        const data = await response.json();

        console.log("USERS RESPONSE:", data);


        if (!response.ok) {

            console.error(
                data.message ||
                "Failed to load users"
            );

            return;
        }


        const users =
            data.users || data;


        if (!Array.isArray(users)) {

            console.error(
                "Users data is not an array:",
                users
            );

            return;
        }


        // ==========================================
        // TOTAL USERS
        // ==========================================

        const totalUsers =
            document.getElementById("totalUsers");

        if (totalUsers) {

            totalUsers.textContent =
                users.length;

        }


        // ==========================================
        // TOTAL STUDENTS
        // ==========================================

        const students =
            users.filter(
                user =>
                    String(user.role).toUpperCase() ===
                    "STUDENT"
            );


        const totalStudents =
            document.getElementById("totalStudents");

        if (totalStudents) {

            totalStudents.textContent =
                students.length;

        }


        // ==========================================
        // TOTAL ADMINS
        // ==========================================

        const admins =
            users.filter(
                user =>
                    String(user.role).toUpperCase() ===
                    "ADMIN"
            );


        const totalAdmins =
            document.getElementById("totalAdmins");

        if (totalAdmins) {

            totalAdmins.textContent =
                admins.length;

        }


        // ==========================================
        // USERS TABLE
        // ==========================================

        const tableBody =
            document.getElementById(
                "usersTableBody"
            );


        if (!tableBody) {
            return;
        }


        tableBody.innerHTML = "";


        users.forEach(user => {

            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td>${user.id}</td>

                <td>${user.name}</td>

                <td>${user.email}</td>

                <td>${user.role}</td>

                <td>
                    <button
                        onclick="deleteUser(${user.id})"
                    >
                        Delete
                    </button>
                </td>
            `;


            tableBody.appendChild(row);

        });

    }

    catch (error) {

        console.error(
            "Load users error:",
            error
        );

    }

}


// ==========================================
// DELETE USER
// ==========================================

async function deleteUser(userId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this user?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/admin/users/${userId}`,
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


        console.log(
            "DELETE USER RESPONSE:",
            data
        );


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to delete user"
            );

            return;
        }


        alert(
            "User deleted successfully"
        );


        // Reload data
        loadUsers();
        loadAnalytics();

    }

    catch (error) {

        console.error(
            "Delete user error:",
            error
        );

        alert(
            "Unable to delete user"
        );

    }

}


// ==========================================
// REFRESH USERS
// ==========================================

const refreshButton =
    document.getElementById(
        "refreshUsers"
    );


if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        function () {

            loadUsers();
            loadAnalytics();

        }
    );

}


// ==========================================
// LOGOUT
// ==========================================

const logoutButton =
    document.getElementById(
        "logoutBtn"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user");

            window.location.href = "/";

        }
    );

}


// ==========================================
// START
// ==========================================

loadUsers();
loadAnalytics();