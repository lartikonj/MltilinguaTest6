
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Subject from "@/pages/Subject";
import Article from "@/pages/Article";
import About from "@/pages/About";
import NotFound from "@/pages/not-found";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/subject/:slug" component={Subject} />
      <Route path="/subject/:subjectSlug/:slug" component={Article} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}


function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
