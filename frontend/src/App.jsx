import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/login";


function Home() {

  return (

    <div className="min-h-screen bg-gray-100">

      <header className="bg-blue-600 text-white">

        <div className="mx-auto flex max-w-7xl items-center
        justify-between px-6 py-4">

          <h1 className="text-2xl font-bold">
            Quiz Platform
          </h1>


          <nav className="flex gap-6">

            <Link to="/">
              Home
            </Link>

            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>

          </nav>

        </div>

      </header>


      <main className="mx-auto max-w-7xl px-6 py-16">

        <div className="rounded-2xl bg-white p-10 text-center shadow">

          <h2 className="mb-4 text-4xl font-bold">
            Quiz Management & Online Assessment Platform
          </h2>

          <p className="mb-8 text-gray-600">
            Take quizzes, view results and track your performance.
          </p>


          <div className="flex justify-center gap-4">

            <Link
              to="/register"
              className="rounded-lg bg-blue-600 px-6 py-3
              font-semibold text-white"
            >
              Register
            </Link>


            <Link
              to="/login"
              className="rounded-lg border border-blue-600
              px-6 py-3 font-semibold text-blue-600"
            >
              Login
            </Link>

          </div>

        </div>

      </main>

    </div>

  );

}


function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

      </Routes>

    </BrowserRouter>

  );

}


export default App;