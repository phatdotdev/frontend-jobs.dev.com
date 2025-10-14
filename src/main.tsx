import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

// Public route
import Login from "./pages/Authentication/Login.tsx";
import Register from "./pages/Authentication/Register.tsx";
import { store } from "./redux/features/store.ts";
import { Provider } from "react-redux";
import JobSeekerRoute from "./components/Authentication/JobSeekerRoute.tsx";
import JobView from "./pages/JobView.tsx";
import HomeView from "./pages/HomeView.tsx";
import PublicLayout from "./components/Layout/PublicLayout.tsx";
import CompanyView from "./pages/CompanyView.tsx";
import ProfileBasedRole from "./components/Authentication/ProfileBasedRole.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* public routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="" element={<HomeView />} />
        <Route path="jobs" element={<JobView />} />
        <Route path="companies" element={<CompanyView />} />
      </Route>

      <Route path="profile" element=<ProfileBasedRole /> />

      {/* protected routes */}
      <Route element={<JobSeekerRoute />}></Route>

      {/* expert routes */}

      {/* admin routes */}
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
