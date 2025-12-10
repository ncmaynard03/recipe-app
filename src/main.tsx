import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { Suspense } from "solid-js";
import { render } from "solid-js/web";
import App from "./app";

render(
  () => (
    <Router
      root={props => (
        <MetaProvider>
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <App />
    </Router>
  ),
  document.getElementById("app")!
);
