import { Title } from "@solidjs/meta";
import { onMount, createSignal } from "solid-js";
import { supabase } from "~/supabase/supabase-client";
import * as supabaseFn from "~/supabase/supabase-queries";
import "../styling/dashboard.css";

export default function Dashboard() {
    const [username, setUsername] = createSignal("")
  onMount(async () => {
    const currUN = await supabaseFn.ensureUserExists();
    setUsername(currUN);
  });

    
  return (
    <main class="dashboard">
      <div class="main-region">
        <div class="recipe-content">
        </div>
        <div class="task-bar">
        </div>
      </div>
      <div class="side-region">
        <div class="search-bar">
        </div>
        <div class="recipe-scrolling">
        </div>
      </div>
    </main>
  );
}
