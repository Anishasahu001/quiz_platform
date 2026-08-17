import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (event) => {

    setForm({
      ...form,
      [event.target.name]: event.target.value
    });

  };


  const handleSubmit = async (event) => {

    event.preventDefault();

    setMessage("");

    try {

      const response = await api.post(
        "/auth/register",
        form
      );

      setMessage(response.data.message);

      setForm({
        name: "",
        email: "",
        password: ""
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Registration failed"
      );

    }

  };


  return (

    <div className="flex min-h-screen items-center justify-center bg-gray-100">

      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">

        <h1 className="mb-6 text-center text-3xl font-bold">
          Student Registration
        </h1>


        {message && (
          <div className="mb-4 rounded bg-blue-100 p-3 text-blue-700">
            {message}
          </div>
        )}


        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>

            <label className="mb-1 block font-medium">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded border p-3"
              placeholder="Enter your name"
              required
            />

          </div>


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


          <button
            type="submit"
            className="w-full rounded bg-blue-600 p-3
            font-semibold text-white hover:bg-blue-700"
          >
            Register
          </button>

        </form>


        <p className="mt-5 text-center">

          Already have an account?

          <button
            onClick={() => navigate("/login")}
            className="ml-2 text-blue-600"
          >
            Login
          </button>

        </p>

      </div>

    </div>

  );
}

export default Register;