const pool = require("../config/db");

// ==========================================
// CREATE QUIZ
// ==========================================

const createQuiz = async (req, res) => {
  try {
    const { title, description, duration } = req.body;

    if (!title || !description || !duration) {
      return res.status(400).json({
        success: false,
        message: "Title, description and duration are required"
      });
    }

    const result = await pool.query(
      `INSERT INTO quizzes
       (title, description, duration, published)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, description, duration, published, created_at`,
      [title, description, duration, false]
    );

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz: result.rows[0]
    });

  } catch (error) {
    console.error("Create quiz error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create quiz"
    });
  }
};


// ==========================================
// GET ALL QUIZZES
// ==========================================

const getQuizzes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, description, duration, published, created_at
       FROM quizzes
       ORDER BY id DESC`
    );

    res.status(200).json({
      success: true,
      quizzes: result.rows
    });

  } catch (error) {
    console.error("Get quizzes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes"
    });
  }
};
// ==========================================
// EDIT QUIZ
// ==========================================

const updateQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;

    const { title, description, duration } = req.body;

    if (!title || !description || !duration) {
      return res.status(400).json({
        success: false,
        message: "Title, description and duration are required"
      });
    }

    const result = await pool.query(
      `UPDATE quizzes
       SET title = $1,
           description = $2,
           duration = $3
       WHERE id = $4
       RETURNING id, title, description, duration, published, created_at`,
      [title, description, duration, quizId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      quiz: result.rows[0]
    });

  } catch (error) {
    console.error("Update quiz error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update quiz"
    });
  }
};


// ==========================================
// DELETE QUIZ
// ==========================================

const deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;

    const result = await pool.query(
      `DELETE FROM quizzes
       WHERE id = $1
       RETURNING id`,
      [quizId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully"
    });

  } catch (error) {
    console.error("Delete quiz error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete quiz"
    });
  }
};


// ==========================================
// PUBLISH / UNPUBLISH QUIZ
// ==========================================

const togglePublishQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;

    const result = await pool.query(
      `UPDATE quizzes
       SET published = NOT published
       WHERE id = $1
       RETURNING id, title, published ,created_at`,
      [quizId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });

      
    res.json({
      success: true,
      message: "Quiz publish status updated",
      quiz: result.rows[0]
    });
    }

    res.status(200).json({
      success: true,
      message: result.rows[0].published
        ? "Quiz published successfully"
        : "Quiz unpublished successfully",
      quiz: result.rows[0]
    });

  } catch (error) {
    console.error("Publish quiz error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update quiz"
    });
  }
};


module.exports = {
  createQuiz,
  getQuizzes,
  updateQuiz,
  deleteQuiz,
  togglePublishQuiz
};