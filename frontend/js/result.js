const API_URL = "https://quiz-platform-backend-h8av.onrender.com/api";

const token = localStorage.getItem("token");
const attemptId = localStorage.getItem("attemptId");

console.log("Attempt ID:", attemptId);


// LOGIN CHECK
if (!token) {
    alert("Please login first.");
    window.location.href = "/";
}


// ATTEMPT CHECK
if (!attemptId) {

    document.getElementById("message").textContent =
        "No quiz attempt found.";

} else {

    loadResult();

}


// LOAD RESULT
async function loadResult() {

    try {

        const response = await fetch(
            `${API_URL}/results/attempt/${attemptId}`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );


        const data = await response.json();

        console.log("RESULT RESPONSE:", data);


        if (!response.ok) {

            document.getElementById("message").textContent =
                data.message || "Failed to load result";

            return;
        }


        const result = data.result;


        document.getElementById("score").textContent =
            result.score;

        document.getElementById("totalQuestions").textContent =
            result.total_questions;

        document.getElementById("percentage").textContent =
            result.percentage;

        document.getElementById("status").textContent =
            result.status;


        document.getElementById("message").textContent =
            "";


        document.getElementById("reviewBtn").onclick =
            function () {

                window.location.href =
                    "answer-review.html";

            };


    } catch (error) {

        console.error(
            "Load result error:",
            error
        );

        document.getElementById("message").textContent =
            "Unable to load result.";

    }

}