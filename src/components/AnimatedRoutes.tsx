import { useLocation, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "../pages/Index";
import Auth from "../pages/Auth";
import ForgotPassword from "../pages/ForgotPassword";
import UpdatePassword from "../pages/UpdatePassword";
import About from "../pages/About";
import Notes from "../pages/Notes";
import Blog from "../pages/Blog";
import Gallery from "../pages/Gallery";
import Contact from "../pages/Contact";
import Admin from "../pages/Admin";
import NotFound from "../pages/NotFound";
import { GalleryPage } from "../pages/GalleryPage";
import { GalleryDetail } from "../pages/GalleryDetail";
import { Galleries as AdminGalleries } from "../pages/admin/Galleries";
import { ResearchPapers } from "../pages/ResearchPapers";
import { BatchmatesPage } from "../pages/BatchmatesPage";
import { LabReports } from "../pages/LabReports";
import { Assignments } from "../pages/Assignments";
import MyAccount from "../pages/MyAccount";
import { FollowUs } from "../pages/FollowUs";
import WriteBlog from "../pages/WriteBlog";
import { BlogManagement } from "../pages/admin/BlogManagement";
import { SiteStatistics } from "../pages/admin/SiteStatistics"; // Import the new admin page
import { ProtectedRoute } from "./ProtectedRoute";

export const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/gallery/:id" element={<GalleryDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/research-papers" element={<ResearchPapers />} />
        <Route path="/lab-reports" element={<LabReports />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/batchmates" element={<BatchmatesPage />} />
        <Route path="/follow-us" element={<FollowUs />} />
        <Route path="/write-blog" element={<ProtectedRoute><WriteBlog /></ProtectedRoute>} />
        <Route path="/my-account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
        <Route path="/admin/galleries" element={<ProtectedRoute requireAdmin><AdminGalleries /></ProtectedRoute>} />
        <Route path="/admin/blogs" element={<ProtectedRoute requireAdmin><BlogManagement /></ProtectedRoute>} />
        <Route path="/admin/site-statistics" element={<ProtectedRoute requireAdmin><SiteStatistics /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};