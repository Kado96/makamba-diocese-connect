import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";

import Index from "./pages/Index";

// Lazy-loaded routes for better performance
const Diocese = lazy(() => import("./pages/Diocese"));
const Historique = lazy(() => import("./pages/Historique"));
const VisionMission = lazy(() => import("./pages/VisionMission"));
const Leadership = lazy(() => import("./pages/Leadership"));
const Paroisses = lazy(() => import("./pages/Paroisses"));
const Ministeres = lazy(() => import("./pages/Ministeres"));
const Actualites = lazy(() => import("./pages/Actualites"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const Ressources = lazy(() => import("./pages/Ressources"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminSermons = lazy(() => import("./pages/admin/Sermons"));
const AdminAnnouncements = lazy(() => import("./pages/admin/Announcements"));
const AdminTestimonials = lazy(() => import("./pages/admin/Testimonials"));
const AdminParishes = lazy(() => import("./pages/admin/Parishes"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminDiocese = lazy(() => import("./pages/admin/Diocese"));
const AdminMinistries = lazy(() => import("./pages/admin/Ministries"));
const AdminHomepage = lazy(() => import("./pages/admin/Homepage"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminDocumentation = lazy(() => import("./pages/admin/Documentation"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#f8fafc]">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-slate-500 font-medium">Chargement...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/diocese" element={<Diocese />} />
            <Route path="/diocese/historique" element={<Historique />} />
            <Route path="/diocese/vision-mission" element={<VisionMission />} />
            <Route path="/diocese/leadership" element={<Leadership />} />
            <Route path="/paroisses" element={<Paroisses />} />
            <Route path="/ministeres" element={<Ministeres />} />
            <Route path="/actualites" element={<Actualites />} />
            <Route path="/actualites/:id" element={<ArticleDetail />} />
            <Route path="/ressources" element={<Ressources />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/sermons" element={<AdminSermons />} />
            <Route path="/admin/announcements" element={<AdminAnnouncements />} />
            <Route path="/admin/testimonials" element={<AdminTestimonials />} />
            <Route path="/admin/parishes" element={<AdminParishes />} />
            <Route path="/admin/diocese" element={<AdminDiocese />} />
            <Route path="/admin/ministries" element={<AdminMinistries />} />
            <Route path="/admin/homepage" element={<AdminHomepage />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/documentation" element={<AdminDocumentation />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
