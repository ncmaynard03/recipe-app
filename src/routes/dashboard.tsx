import { Title } from "@solidjs/meta";
import { onMount, createSignal } from "solid-js";
import { supabase } from "~/supabase/supabase-client";
import * as supabaseFn from "~/supabase/supabase-queries";
import "../styling/index.css";

import TaskBar from "~/components/dashboard-taskbar";
import RecipeViewer from "~/components/dashboard-recipeviewer";
import RecipeSearchbar from "~/components/dashboard-searchbar";
import RecipeBrowser from "~/components/dashboard-recipebrowser";

export default function Dashboard() {
  const [username, setUsername] = createSignal("")
  onMount(async () => {
    const currUN = await supabaseFn.ensureUserExists();
    setUsername(currUN);
  });

  return (
    <main class="dashboard">
      <div class="dashboard-main-region">
        <RecipeViewer />
        <TaskBar />
      </div>


      <div class="dashboard-side-region">
        <RecipeSearchbar />
        <RecipeBrowser />
      </div>
    </main>
  );
}