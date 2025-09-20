import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import Playground from "./pages/agent/Playground";
import Activity from "./pages/agent/Activity";
import Sources from "./pages/agent/Sources";
import Actions from "./pages/agent/Actions";
import Settings from "./pages/agent/Settings";
import NotFound from "./pages/NotFound";
import EmbedChat from "./components/EmbedChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/agents" element={<Layout />}>
            <Route index element={<Agents />} />
          </Route>
          <Route path="/agent/:id/playground" element={<Layout />}>
            <Route index element={<Playground />} />
          </Route>
          <Route path="/agent/:id/activity" element={<Layout />}>
            <Route index element={<Activity />} />
          </Route>
          <Route path="/agent/:id/sources" element={<Layout />}>
            <Route index element={<Sources />} />
          </Route>
          <Route path="/agent/:id/actions" element={<Layout />}>
            <Route index element={<Actions />} />
          </Route>
          <Route path="/agent/:id/settings" element={<Layout />}>
            <Route index element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
          <Route path="/embed" element={<EmbedChat />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
