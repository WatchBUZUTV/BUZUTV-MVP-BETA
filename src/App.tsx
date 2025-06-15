
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Movies from "./pages/Movies";
import Series from "./pages/Series";
import MyList from "./pages/MyList";
import MovieDetail from "./pages/MovieDetail";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMovies from "./pages/admin/AdminMovies";
import AdminChannels from "./pages/admin/AdminChannels";
import AdminAddMovie from "./pages/admin/AdminAddMovie";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/series" element={<Series />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/movies" element={<AdminMovies />} />
          <Route path="/admin/channels" element={<AdminChannels />} />
          <Route path="/admin/add-movie" element={<AdminAddMovie />} />
          <Route path="/admin/add-channel" element={<AdminAddMovie />} />
          <Route path="/admin/edit-movie/:id" element={<AdminAddMovie />} />
          <Route path="/admin/edit-channel/:id" element={<AdminAddMovie />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
