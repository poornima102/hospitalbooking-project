import { createBrowserRouter } from "react-router-dom";

import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import Doctors from "./Doctors";
import Doctorprofile from "./Doctorprofile";
import Appointment from "./Appointment";
import Myappointments from "./Myappointments";
import Profile from "./Profile";
import LandingPage from "./LandingPage";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  // Public routes
  { path: "/", element: <LandingPage /> },
  { path: "register", element: <Register /> },
  { path: "login", element: <Login /> },

  // Protected routes
  {
    path: "home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "doctorslist",
    element: (
      <ProtectedRoute>
        <Doctors />
      </ProtectedRoute>
    ),
  },
  {
    path: "doctorprofile/:doctor_id",
    element: (
      <ProtectedRoute>
        <Doctorprofile />
      </ProtectedRoute>
    ),
  },
  {
    path: "appointment",
    element: (
      <ProtectedRoute>
        <Appointment />
      </ProtectedRoute>
    ),
  },
  {
    path: "myappointments",
    element: (
      <ProtectedRoute>
        <Myappointments />
      </ProtectedRoute>
    ),
  },
  {
    path: "profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
]);

export default router;