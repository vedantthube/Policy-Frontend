// import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import PolicyCalculation from "./Pages/PolicyCalculation";
import Navbar from "./components/Navbar";
import { Illustration } from "./Pages/Illustration";
import "./App.css";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          {/* Default route redirects to Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Feature Routes */}
          <Route path="/policyCalculation" element={<PolicyCalculation />} />
          <Route path="/illustration" element={<Illustration />} />
          {/* <Route path="*" element={<Navbar />} /> */}

          {/* Fallback route for 404 / Not Found */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
