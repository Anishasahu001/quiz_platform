const pool = require("../config/db");

// ==========================================
// CREATE QUESTION
// ==========================================

const createQuestion = async (req, res) => {
    try {

        const {
            quiz_id,
            category_id,
            question_text,
            options,
            correct_answer
        } = req.body;

        console.log("CREATE QUESTION BODY:", req.body);

        if (!quiz_id || !question_text) {
            return res.status(400).json({
                success: false,
                message: "Quiz ID and question are required"
            });
        }

        if (!Array.isArray(options) || options.length !== 4) {
            return res.status(400).json({
                success: false,
                message: "Exactly 4 options are required"
            });
        }

        if (
            !options[0] ||
            !options[1] ||
            !options[2] ||
            !options[3]
        ) {
            return res.status(400).json({
                success: false,
                message: "All 4 options are required"
            });
        }

        const quizResult = await pool.query(
            "SELECT id FROM quizzes WHERE id = $1",
            [quiz_id]
        );

        if (quizResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }

        const result = await pool.query(
            `INSERT INTO questions
            (
                quiz_id,
                question_text,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_answer,
                category_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
                Number(quiz_id),
                question_text,
                options[0],
                options[1],
                options[2],
                options[3],
                Number(correct_answer),
                category_id ? Number(category_id) : null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Question created successfully",
            question: result.rows[0]
        });

    } catch (error) {

        console.error("CREATE QUESTION ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create question"
        });
    }
};


// ==========================================
// GET ALL QUESTIONS
// ==========================================

const getQuestions = async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT *
             FROM questions
             ORDER BY id DESC`
        );

        res.json({
            success: true,
            questions: result.rows
        });

    } catch (error) {

        console.error("GET QUESTIONS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load questions"
        });
    }
};


// ==========================================
// UPDATE QUESTION
// ==========================================

const updateQuestion = async (req, res) => {
    try {

        const questionId = req.params.id;

        const {
            quiz_id,
            category_id,
            question_text,
            options,
            correct_answer
        } = req.body;

        const result = await pool.query(
            `UPDATE questions
             SET
                quiz_id = $1,
                question_text = $2,
                option_a = $3,
                option_b = $4,
                option_c = $5,
                option_d = $6,
                correct_answer = $7,
                category_id = $8
             WHERE id = $9
             RETURNING *`,
            [
                Number(quiz_id),
                question_text,
                options[0],
                options[1],
                options[2],
                options[3],
                Number(correct_answer),
                category_id ? Number(category_id) : null,
                questionId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }

        res.json({
            success: true,
            message: "Question updated successfully",
            question: result.rows[0]
        });

    } catch (error) {

        console.error("UPDATE QUESTION ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update question"
        });
    }
};


// ==========================================
// DELETE QUESTION
// ==========================================

const deleteQuestion = async (req, res) => {
    try {

        const questionId = req.params.id;

        const result = await pool.query(
            `DELETE FROM questions
             WHERE id = $1
             RETURNING id`,
            [questionId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }

        res.json({
            success: true,
            message: "Question deleted successfully"
        });

    } catch (error) {

        console.error("DELETE QUESTION ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete question"
        });
    }
};


module.exports = {
    createQuestion,
    getQuestions,
    updateQuestion,
    deleteQuestion
};