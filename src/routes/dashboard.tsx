import { Title } from "@solidjs/meta";
import { onMount, createSignal } from "solid-js";
import { supabase } from "~/supabase/supabase-client";
import * as supabaseFn from "~/supabase/supabase-queries";
import "../styling/dashboard/dashboard.css";

import TaskBar from "~/components/dashboard/dashboard-taskbar";
import RecipeViewer from "~/components/dashboard/dashboard-recipeviewer";
import RecipeSearchbar from "~/components/dashboard/dashboard-searchbar";
import RecipeBrowser from "~/components/dashboard/dashboard-recipebrowser";
import { setUserId, userId } from "~/stores/user";

export default function Dashboard() {

  console.log("User id: ", userId());

  const [username, setUsername] = createSignal("")
  onMount(async () => {
    const currUN = await supabaseFn.ensureUserExists();
    setUsername(currUN);

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      console.log(user.id)
      setUserId(user.id);
      console.log("User id: ", userId());
    }
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