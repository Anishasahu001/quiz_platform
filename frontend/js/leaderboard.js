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
// OVERALL LEADERBOARD
// ==========================================

async function loadLeaderboard() {

    try {

        const response = await fetch(
            `${API_URL}/leaderboard/overall`,
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
            "OVERALL LEADERBOARD RESPONSE:",
            data
        );


        if (!response.ok) {

            document.getElementById(
                "message"
            ).textContent =
                data.message ||
                "Failed to load leaderboard";

            return;
        }


        const leaderboard =
            data.leaderboard || [];


        const tableBody =
            document.getElementById(
                "leaderboardBody"
            );


        tableBody.innerHTML = "";


        leaderboard.forEach(student => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${student.rank}
                </td>

                <td>
                    ${student.student_name}
                </td>

                <td>
                    ${student.attempts}
                </td>

                <td>
                    ${Number(
                        student.average_score
                    ).toFixed(2)}%
                </td>

                <td>
                    ${Number(
                        student.best_score
                    ).toFixed(2)}%
                </td>

            `;


            tableBody.appendChild(row);

        });


        if (leaderboard.length === 0) {

            document.getElementById(
                "message"
            ).textContent =
                "No leaderboard data available.";

        } else {

            document.getElementById(
                "message"
            ).textContent = "";

        }

    }


    catch (error) {

        console.error(
            "Overall leaderboard error:",
            error
        );


        document.getElementById(
            "message"
        ).textContent =
            "Unable to load leaderboard.";

    }

}


// ==========================================
// LOAD CATEGORIES
// ==========================================

async function loadCategories() {

    try {

        const response = await fetch(
            `${API_URL}/categories`,
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
            "CATEGORIES RESPONSE:",
            data
        );


        if (!response.ok) {

            console.error(
                data.message ||
                "Failed to load categories"
            );

            return;
        }


        const categories =
            data.categories || [];


        const select =
            document.getElementById(
                "categorySelect"
            );


        categories.forEach(category => {

            const option =
                document.createElement("option");


            option.value =
                category.id;


            option.textContent =
                category.name;


            select.appendChild(option);

        });

    }


    catch (error) {

        console.error(
            "Load categories error:",
            error
        );

    }

}


// ==========================================
// CATEGORY LEADERBOARD
// ==========================================

async function loadCategoryLeaderboard() {

    const categoryId =
        document.getElementById(
            "categorySelect"
        ).value;


    if (!categoryId) {

        alert(
            "Please select a category."
        );

        return;

    }


    try {

        const response = await fetch(
            `${API_URL}/leaderboard/category/${categoryId}`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );


        const data =
            await response.json();


        console.log(
            "CATEGORY LEADERBOARD RESPONSE:",
            data
        );


        if (!response.ok) {

            document.getElementById(
                "categoryMessage"
            ).textContent =
                data.message ||
                "Failed to load category leaderboard";

            return;

        }


        const leaderboard =
            data.leaderboard || [];


        const tableBody =
            document.getElementById(
                "categoryLeaderboardBody"
            );


        tableBody.innerHTML = "";


        leaderboard.forEach(student => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${student.rank}
                </td>

                <td>
                    ${student.student_name}
                </td>

                <td>
                    ${student.attempts}
                </td>

                <td>
                    ${Number(
                        student.average_score
                    ).toFixed(2)}%
                </td>

                <td>
                    ${Number(
                        student.best_score
                    ).toFixed(2)}%
                </td>

            `;


            tableBody.appendChild(row);

        });


        if (leaderboard.length === 0) {

            document.getElementById(
                "categoryMessage"
            ).textContent =
                "No attempts found for this category.";

        } else {

            document.getElementById(
                "categoryMessage"
            ).textContent = "";

        }

    }


    catch (error) {

        console.error(
            "Category leaderboard error:",
            error
        );


        document.getElementById(
            "categoryMessage"
        ).textContent =
            "Unable to load category leaderboard.";

    }

}


// ==========================================
// BACK TO DASHBOARD
// ==========================================

const backBtn =
    document.getElementById("backBtn");


if (backBtn) {

    backBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "student-dashboard.html";

        }
    );

}


// ==========================================
// CATEGORY BUTTON
// ==========================================

const categoryButton =
    document.getElementById(
        "loadCategoryBtn"
    );


if (categoryButton) {

    categoryButton.addEventListener(
        "click",
        loadCategoryLeaderboard
    );

}


// ==========================================
// LOAD PAGE
// ==========================================

loadLeaderboard();

loadCategories();