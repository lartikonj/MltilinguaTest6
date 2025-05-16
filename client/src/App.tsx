import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Subject from "@/pages/Subject";
import Article from "@/pages/Article";
import About from "@/pages/About";
import Featured from "@/pages/Featured";
import Recent from "@/pages/Recent";
import Popular from "@/pages/Popular";
import NotFound from "@/pages/not-found";
import SignIn from "@/pages/SignIn";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/signin" component={SignIn} />
      <Route path="/subject/:subjectSlug/:articleSlug" component={Article} />
      <Route path="/subject/:slug" component={Subject} />
      <Route path="/subject" component={Subject} />
      <Route path="/about" component={About} />
      <Route path="/featured" component={Featured} />
      <Route path="/recent" component={Recent} />
      <Route path="/popular" component={Popular} />
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