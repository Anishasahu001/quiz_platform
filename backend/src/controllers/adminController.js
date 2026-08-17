const pool = require("../config/db");

// ==========================================
// GET ALL USERS
// ==========================================

const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role
       FROM users
       ORDER BY id DESC`
    );

    res.status(200).json({
      success: true,
      users: result.rows
    });

  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};


// ==========================================
// GET DASHBOARD STATISTICS
// ==========================================

const getDashboardStats = async (req, res) => {
  try {
    const usersResult = await pool.query(
      `SELECT
        COUNT(*) AS total_users,
        COUNT(*) FILTER (WHERE LOWER(role) = 'student') AS total_students,
        COUNT(*) FILTER (WHERE LOWER(role) = 'admin') AS total_admins
       FROM users`
    );

    const quizzesResult = await pool.query(
      `SELECT COUNT(*) AS total_quizzes
       FROM quizzes`
    );

    res.status(200).json({
      success: true,
      statistics: {
        totalUsers: Number(usersResult.rows[0].total_users),
        totalStudents: Number(usersResult.rows[0].total_students),
        totalAdmins: Number(usersResult.rows[0].total_admins),
        totalQuizzes: Number(quizzesResult.rows[0].total_quizzes)
      }
    });

  } catch (error) {
    console.error("Dashboard statistics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics"
    });
  }
};


// ==========================================
// DELETE USER
// ==========================================

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const result = await pool.query(
      `DELETE FROM users
       WHERE id = $1
       RETURNING id`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error) {
    console.error("Delete user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete user"
    });
  }
};


module.exports = {
  getUsers,
  getDashboardStats,
  deleteUser
};