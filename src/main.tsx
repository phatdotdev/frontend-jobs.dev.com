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
import ChatView from "./pages/ChatView.tsx";
import JobSeekerPageView from "./pages/JobSeeker/JobSeekerPageView.tsx";
import RecruiterPageView from "./pages/Recruiter/RecruiterPageView.tsx";
import RecruiterRoute from "./components/Authentication/RecruiterRoute.tsx";
import CreateJobPostView from "./pages/Recruiter/CreateJobPostView.tsx";
import JobPostingListView from "./pages/Recruiter/JobPostingListView.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";

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
        <Route path="chat" element={<ChatView />} />
      </Route>

      <Route path="profile" element=<ProfileBasedRole /> />

      {/* job seeker routes */}
      <Route path="/job-seeker" element={<JobSeekerRoute />}>
        <Route path="" element={<JobSeekerPageView />} />
      </Route>

      {/* recruiter routes */}
      <Route path="/recruiter" element={<RecruiterRoute />}>
        <Route path="" element={<RecruiterPageView />} />
        <Route path="post" element={<CreateJobPostView />} />
        <Route path="list" element={<JobPostingListView />} />
      </Route>

      {/* expert routes */}

      {/* admin routes */}

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
