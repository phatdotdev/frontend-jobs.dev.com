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
import HomeView from "./pages/Public/HomeView.tsx";
import PublicLayout from "./components/Layout/PublicLayout.tsx";
import JobSeekerPageView from "./pages/JobSeeker/JobSeekerPageView.tsx";
import RecruiterPageView from "./pages/Recruiter/RecruiterPageView.tsx";
import RecruiterRoute from "./components/Authentication/RecruiterRoute.tsx";
import JobPostingListView from "./pages/Recruiter/JobPostingListView.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import AdminPage from "./pages/Admin/AdminPage.tsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.tsx";
import ManageUserPage from "./pages/Admin/ManageUserPage.tsx";
import ManageTagPage from "./pages/Admin/ManageTagPage.tsx";
import ManageSchoolPage from "./pages/Admin/ManageSchoolPage.tsx";
import ManageCertificatePage from "./pages/Admin/ManageCertificatePage.tsx";
import ManageResourcePage from "./pages/Admin/ManageResourcePage.tsx";
import ManageLocationPage from "./pages/Admin/ManageLocationPage.tsx";
import JobDetailView from "./pages/Public/JobDetailView.tsx";
import ResumeManager from "./pages/JobSeeker/ResumeManager.tsx";
import ResumeViewer from "./pages/JobSeeker/ResumeViewer.tsx";
import AppliedJobs from "./pages/JobSeeker/AppliedJobs.tsx";
import ApplicantsByPostView from "./pages/Recruiter/ApplicantsView.tsx";
import AccountInfo from "./components/Info/AccountInfo.tsx";
import ActivitiesView from "./pages/JobSeeker/ActivitiesView.tsx";
import HistoryView from "./pages/Recruiter/JobHistoryView.tsx";
import ExpertRoute from "./components/Authentication/ExpertRoute.tsx";
import FeedbackRequestView from "./pages/Expert/FeedbackRequestView.tsx";
import DetailedReviewForm from "./pages/Expert/DetailReviewFormView.tsx";
import ReviewHistoryPage from "./pages/Expert/ReviewHistoryView.tsx";
import DetailHistoryReviewView from "./pages/Expert/DetailHistoryReviewView.tsx";
import ResumeReviewView from "./pages/JobSeeker/ResumeReviewView.tsx";
import JobView from "./pages/Public/JobView.tsx";
import CompanyView from "./pages/Public/CompanyView.tsx";
import EditAndPreviewJobPostingView from "./pages/Recruiter/EditAndPreviewJobPostingView.tsx";
import CreateAndPreviewJobPostingView from "./pages/Recruiter/CreateAndPreviewJobPostingView.tsx";
import AppliedJobDetail from "./pages/JobSeeker/AppliedJobDetail.tsx";
import CompanyDetailPage from "./pages/Public/CompanyDetailView.tsx";
import CandidateDetailPage from "./pages/Public/CandidateDetailView.tsx";
import ExpertiseManagerView from "./pages/Expert/ExpertiseManagerView.tsx";
import ApplicantDetailView from "./pages/Recruiter/ApplicantDetailView.tsx";
import ChatView from "./pages/Protected/ChatView.tsx";
import NotificationView from "./pages/Protected/NotificationView.tsx";
import ManageJobSeekerPage from "./pages/Admin/ManageJobSeekerPage.tsx";
import ManageRecruiterPage from "./pages/Admin/ManageRecruiterPage.tsx";
import ManageExpertPage from "./pages/Admin/ManageExpertPage.tsx";
import ManagePostPage from "./pages/Admin/ManagePostPage.tsx";
import ReviewerDetailView from "./pages/Public/ReviewerDetailView.tsx";
import JobSeekerDetailPage from "./pages/Public/JobSeekerDetailView.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* public routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="" element={<HomeView />} />
        <Route path="jobs" element={<JobView />} />
        <Route path="jobs/:id" element={<JobDetailView />} />
        <Route path="companies" element={<CompanyView />} />
        <Route path="companies/:id" element={<CompanyDetailPage />} />
        <Route path="candidates/:id" element={<CandidateDetailPage />} />
        <Route path="reviewers/:id" element={<ReviewerDetailView />} />
        <Route path="chat" element={<ChatView />} />
        <Route path="notifications" element={<NotificationView />} />
      </Route>

      {/* protected routes */}
      <Route path="account" element={<AccountInfo />} />

      {/* job seeker routes */}
      <Route path="/job-seeker" element={<JobSeekerRoute />}>
        <Route path="" element={<JobSeekerPageView />} />
        <Route path="resume" element={<ResumeManager />} />
        <Route path="resume/:id" element={<ResumeViewer />} />
        <Route path="resume/:id/reviews" element={<ResumeReviewView />} />
        <Route path="applied-jobs" element={<AppliedJobs />} />
        <Route path="applied-jobs/:id" element={<AppliedJobDetail />} />
        <Route path="activities" element={<ActivitiesView />} />
      </Route>

      {/* recruiter routes */}
      <Route path="/recruiter" element={<RecruiterRoute />}>
        <Route path="" element={<RecruiterPageView />} />
        <Route path="post" element={<CreateAndPreviewJobPostingView />} />
        <Route path="jobs" element={<JobPostingListView />} />
        <Route path="jobs/:id" element={<EditAndPreviewJobPostingView />} />
        <Route path="jobs/:id/applicants" element={<ApplicantsByPostView />} />
        <Route
          path="jobs/:postId/applicants/:id"
          element={<ApplicantDetailView />}
        />
        <Route path="history" element={<HistoryView />} />
      </Route>

      {/* expert routes */}
      <Route path="/expert" element={<ExpertRoute />}>
        <Route path="requests" element={<FeedbackRequestView />} />
        <Route path="" element={<FeedbackRequestView />} />
        <Route path="requests/:id" element={<DetailedReviewForm />} />
        <Route path="reviews" element={<ReviewHistoryPage />} />
        <Route path="reviews/:id" element={<DetailHistoryReviewView />} />
        <Route path="expertises" element={<ExpertiseManagerView />} />
      </Route>

      {/* admin routes */}
      <Route path="/admin" element={<AdminPage />}>
        <Route path="" element={<AdminDashboard />} />
        <Route path="users" element={<ManageUserPage />} />

        <Route path="users/jobseeker" element={<ManageJobSeekerPage />} />
        <Route path="users/jobseeker/:id" element={<JobSeekerDetailPage />} />

        <Route path="users/recruiter" element={<ManageRecruiterPage />} />
        <Route path="users/recruiter/:id" element={<CompanyDetailPage />} />

        <Route path="users/expert" element={<ManageExpertPage />} />
        <Route path="users/expert/:id" element={<ReviewerDetailView />} />

        <Route path="posts" element={<ManagePostPage />} />

        <Route path="resource" element={<ManageResourcePage />}>
          <Route path="tags" element={<ManageTagPage />} />
          <Route path="schools" element={<ManageSchoolPage />} />
          <Route path="certificates" element={<ManageCertificatePage />} />
          <Route path="locations" element={<ManageLocationPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
