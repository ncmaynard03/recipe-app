import { Route } from "@solidjs/router";
import "./app.css";

import About from "./routes/about";
import AccountDelete from "./routes/accountdelete";
import DashboardRedirect from "./routes/dashboard";
import IndexPage from "./routes/index";
import NotFound from "./routes/[...404]";
import SignInPage from "./routes/signin";

export default function App() {
  return (
    <>
      <Route path="/" component={IndexPage} />
      <Route path="/signin" component={SignInPage} />
      <Route path="/dashboard" component={DashboardRedirect} />
      <Route path="/accountdelete" component={AccountDelete} />
      <Route path="/about" component={About} />
      <Route path="*" component={NotFound} />
    </>
  );
}
