const pool = require("../config/db");

// ==========================================
// CREATE CATEGORY
// ==========================================

const createCategory = async (req, res) => {
    try {

        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const result = await pool.query(
            `INSERT INTO categories (name, description)
             VALUES ($1, $2)
             RETURNING id, name, description, created_at`,
            [name, description || null]
        );

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category: result.rows[0]
        });

    } catch (error) {

        console.error("Create category error:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "Category already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create category"
        });
    }
};


// ==========================================
// GET ALL CATEGORIES
// ==========================================

const getCategories = async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT id, name, description, created_at
             FROM categories
             ORDER BY id DESC`
        );

        res.json({
            success: true,
            categories: result.rows
        });

    } catch (error) {

        console.error("Get categories error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch categories"
        });
    }
};


// ==========================================
// UPDATE CATEGORY
// ==========================================

const updateCategory = async (req, res) => {
    try {

        const categoryId = req.params.id;

        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const result = await pool.query(
            `UPDATE categories
             SET name = $1,
                 description = $2
             WHERE id = $3
             RETURNING id, name, description, created_at`,
            [name, description || null, categoryId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.json({
            success: true,
            message: "Category updated successfully",
            category: result.rows[0]
        });

    } catch (error) {

        console.error("Update category error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update category"
        });
    }
};


// ==========================================
// DELETE CATEGORY
// ==========================================

const deleteCategory = async (req, res) => {
    try {

        const categoryId = req.params.id;

        const result = await pool.query(
            `DELETE FROM categories
             WHERE id = $1
             RETURNING id`,
            [categoryId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {

        console.error("Delete category error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete category"
        });
    }
};


module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
};