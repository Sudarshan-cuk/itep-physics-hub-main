import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import About from "./pages/About";
import Notes from "./pages/Notes";
import Blog from "./pages/Blog";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { GalleryPage } from "./pages/GalleryPage";
import { GalleryDetail } from "./pages/GalleryDetail";
import { Galleries as AdminGalleries } from "./pages/admin/Galleries";
import { ResearchPapers } from "./pages/ResearchPapers";
import { LabReports } from "./pages/LabReports";
import { Assignments } from "./pages/Assignments";
import MyAccount from "./pages/MyAccount"; // Import the new MyAccount page
import { FollowUs } from "./pages/FollowUs"; // Import the FollowUs page
import WriteBlog from "./pages/WriteBlog"; // Import the WriteBlog page
import { BlogManagement } from "./pages/admin/BlogManagement"; // Import the BlogManagement page
import { Layout } from "./components/layout/Layout"; // Import the Layout component

const queryClient = new QueryClient();

const App = () => (
  <>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
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
                <Route path="/follow-us" element={<FollowUs />} />
                <Route path="/write-blog" element={<ProtectedRoute><WriteBlog /></ProtectedRoute>} />
                <Route path="/my-account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} /> {/* New MyAccount route */}
                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                <Route path="/admin/galleries" element={<ProtectedRoute><AdminGalleries /></ProtectedRoute>} />
                <Route path="/admin/blogs" element={<ProtectedRoute><BlogManagement /></ProtectedRoute>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
    <SpeedInsights />
  </>
);

export default App;
