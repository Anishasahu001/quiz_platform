const express = require("express");

const router = express.Router();

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");


// ==========================================
// CREATE CATEGORY
// ==========================================

router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    createCategory
);


// ==========================================
// GET ALL CATEGORIES
// ==========================================

router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin", "student"),
    getCategories
);


// ==========================================
// UPDATE CATEGORY
// ==========================================

router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    updateCategory
);


// ==========================================
// DELETE CATEGORY
// ==========================================

router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    deleteCategory
);


module.exports = router;