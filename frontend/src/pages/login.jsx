import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    try {
      const response = await api.post("/auth/login", form);

      console.log("LOGIN RESPONSE:", response.data);

      const user = response.data.user;
      const token = response.data.token;

      // Check login response
      if (!token || !user) {
        setMessage("Invalid login response from server.");
        return;
      }

      // Get role safely
      const role = String(user.role || "")
        .trim()
        .toLowerCase();
      alert("ROLE FROM SERVER = " + role);

      console.log("USER:", user);
      console.log("USER ROLE:", user.role);
      console.log("FINAL ROLE:", role);

      // ==========================================
      // SAVE LOGIN INFORMATION
      // ==========================================

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage("Login successful!");

      // ==========================================
      // ADMIN
      // ==========================================

      if (role === "admin") {
        console.log("REDIRECTING TO ADMIN DASHBOARD");

        window.location.href = "/admin-dashboard.html";

        return;
      }

      // ==========================================
      // STUDENT
      // ==========================================

      if (role === "student") {
        console.log("REDIRECTING TO STUDENT DASHBOARD");

        window.location.href = "/student-quizzes.html";

        return;
      }

      // ==========================================
      // UNKNOWN ROLE
      // ==========================================

      console.error("UNKNOWN ROLE:", role);

      setMessage(
        `Unknown user role: ${role || "empty"}. Please contact administrator.`
      );

    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        error.response?.data?.message ||
        "Login failed. Please check your email and password."
      );
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">

      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">

        <h1 className="mb-6 text-center text-3xl font-bold">
          Login
        </h1>

        {/* MESSAGE */}

        {message && (
          <div className="mb-4 rounded bg-blue-100 p-3 text-blue-700">
            {message}
          </div>
        )}

        {/* LOGIN FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* EMAIL */}

          <div>
            <label className="mb-1 block font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded border p-3"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* PASSWORD */}

          <div>
            <label className="mb-1 block font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded border p-3"
              placeholder="Enter password"
              required
            />
          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="w-full rounded bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700"
          >
            Login
          </button>

        </form>

        {/* REGISTER */}

        <p className="mt-5 text-center">
          Don't have an account?

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="ml-2 text-blue-600"
          >
            Register
          </button>
        </p>

      </div>

    </div>
  );
}

export default Login;