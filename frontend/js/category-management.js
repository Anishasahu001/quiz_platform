const API_URL = "https://quiz-platform-backend-h8av.onrender.com/api";

const token = localStorage.getItem("token");


// ==========================================
// CHECK LOGIN
// ==========================================

if (!token) {

    alert("Please login as admin first.");

    window.location.href = "/";

}


// ==========================================
// CREATE CATEGORY
// ==========================================

document
    .getElementById("categoryForm")
    .addEventListener("submit", async (event) => {

        event.preventDefault();

        const name =
            document.getElementById(
                "categoryName"
            ).value;

        const description =
            document.getElementById(
                "categoryDescription"
            ).value;


        try {

            const response = await fetch(
                `${API_URL}/categories`,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        description
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                document
                    .getElementById("message")
                    .textContent =
                    data.message ||
                    "Failed to create category";

                return;

            }


            document
                .getElementById("message")
                .textContent =
                "Category created successfully!";


            document
                .getElementById("categoryForm")
                .reset();


            loadCategories();


        } catch (error) {

            console.error(
                "Create category error:",
                error
            );

        }

    });


// ==========================================
// GET CATEGORIES
// ==========================================

async function loadCategories() {

    try {

        const response = await fetch(
            `${API_URL}/categories`,
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


        if (!response.ok) {

            console.error(
                data.message
            );

            return;

        }


        displayCategories(
            data.categories
        );


    } catch (error) {

        console.error(
            "Get categories error:",
            error
        );

    }

}


// ==========================================
// DISPLAY CATEGORIES
// ==========================================

function displayCategories(
    categories
) {

    const tableBody =
        document.getElementById(
            "categoryTableBody"
        );


    tableBody.innerHTML = "";


    categories.forEach(
        (category) => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${category.id}
                </td>

                <td>
                    ${category.name}
                </td>

                <td>
                    ${category.description || ""}
                </td>

                <td>

                    <button
                        onclick="editCategory(
                            ${category.id},
                            '${escapeQuotes(category.name)}',
                            '${escapeQuotes(category.description || "")}'
                        )"
                    >
                        Edit
                    </button>


                    <button
                        onclick="deleteCategory(
                            ${category.id}
                        )"
                    >
                        Delete
                    </button>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

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
// EDIT CATEGORY
// ==========================================

function editCategory(
    id,
    name,
    description
) {

    document
        .getElementById("editSection")
        .style.display = "block";


    document
        .getElementById("editCategoryId")
        .value = id;


    document
        .getElementById("editCategoryName")
        .value = name;


    document
        .getElementById("editCategoryDescription")
        .value = description;

}


// ==========================================
// UPDATE CATEGORY
// ==========================================

document
    .getElementById("editCategoryForm")
    .addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const id =
                document.getElementById(
                    "editCategoryId"
                ).value;


            const name =
                document.getElementById(
                    "editCategoryName"
                ).value;


            const description =
                document.getElementById(
                    "editCategoryDescription"
                ).value;


            try {

                const response =
                    await fetch(
                        `${API_URL}/categories/${id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Authorization":
                                    `Bearer ${token}`,

                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name,
                                description
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Failed to update category"
                    );

                    return;

                }


                alert(
                    "Category updated successfully!"
                );


                document
                    .getElementById(
                        "editCategoryForm"
                    )
                    .reset();


                document
                    .getElementById(
                        "editSection"
                    )
                    .style.display = "none";


                loadCategories();

            } catch (error) {

                console.error(
                    "Update category error:",
                    error
                );

            }

        }
    );


// ==========================================
// CANCEL EDIT
// ==========================================

document
    .getElementById("cancelEdit")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "editSection"
                )
                .style.display = "none";

        }
    );


// ==========================================
// DELETE CATEGORY
// ==========================================

async function deleteCategory(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this category?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/categories/${id}`,
                {
                    method: "DELETE",

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


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to delete category"
            );

            return;

        }


        alert(
            "Category deleted successfully!"
        );


        loadCategories();


    } catch (error) {

        console.error(
            "Delete category error:",
            error
        );

    }

}


// ==========================================
// START
// ==========================================

loadCategories();