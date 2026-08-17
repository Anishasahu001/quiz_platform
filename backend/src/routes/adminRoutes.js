const express = require("express");

const router = express.Router();

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const {
    getUsers,
    getDashboardStats,
    deleteUser
} = require("../controllers/adminController");

const pool = require("../config/db");


// ==========================================
// ADMIN DASHBOARD
// ==========================================

router.get(
    "/dashboard",
    authenticateToken,
    authorizeRoles("admin"),
    (req, res) => {

        res.json({
            success: true,
            message: "Admin dashboard loaded successfully",
            admin: req.user
        });

    }
);


// ==========================================
// ADMIN STATISTICS
// ==========================================

router.get(
    "/statistics",
    authenticateToken,
    authorizeRoles("admin"),
    getDashboardStats
);


// ==========================================
// ADMIN STATS
// Used by admin-dashboard.js
// ==========================================

router.get(
    "/stats",
    authenticateToken,
    authorizeRoles("admin"),
    async (req, res) => {

        try {

            // ==========================================
            // TOTAL USERS
            // ==========================================

            const usersResult = await pool.query(
                `SELECT COUNT(*) AS total
                 FROM users`
            );


            // ==========================================
            // TOTAL STUDENTS
            // ==========================================

            const studentsResult = await pool.query(
                `SELECT COUNT(*) AS total
                 FROM users
                 WHERE UPPER(role) = 'STUDENT'`
            );


            // ==========================================
            // TOTAL ADMINS
            // ==========================================

            const adminsResult = await pool.query(
                `SELECT COUNT(*) AS total
                 FROM users
                 WHERE UPPER(role) = 'ADMIN'`
            );


            // ==========================================
            // TOTAL QUIZZES
            // ==========================================

            const quizzesResult = await pool.query(
                `SELECT COUNT(*) AS total
                 FROM quizzes`
            );


            // ==========================================
            // CONVERT VALUES TO NUMBERS
            // ==========================================

            const totalUsers =
                Number(usersResult.rows[0].total);

            const totalStudents =
                Number(studentsResult.rows[0].total);

            const totalAdmins =
                Number(adminsResult.rows[0].total);

            const totalQuizzes =
                Number(quizzesResult.rows[0].total);


            // ==========================================
            // RESPONSE
            // ==========================================

            res.json({

                success: true,

                totalUsers: totalUsers,

                totalStudents: totalStudents,

                totalAdmins: totalAdmins,

                totalQuizzes: totalQuizzes

            });

        }

        catch (error) {

            console.error(
                "Admin stats error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to load admin statistics"

            });

        }

    }
);


// ==========================================
// GET ALL USERS
// ==========================================

router.get(
    "/users",
    authenticateToken,
    authorizeRoles("admin"),
    getUsers
);


// ==========================================
// DELETE USER
// ==========================================

router.delete(
    "/users/:id",
    authenticateToken,
    authorizeRoles("admin"),
    deleteUser
);


module.exports = router;