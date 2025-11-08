import { Title } from "@solidjs/meta";
import { onMount, createSignal, Switch, Match, Show } from "solid-js";
import { supabase } from "~/supabase/supabase-client";
import * as supabaseFn from "~/supabase/supabase-queries";
import "../styling/dashboard/dashboard.css";

import TaskBar from "~/components/dashboard/dashboard-taskbar";
import RecipeEditor from "~/components/dashboard/recipeEditor";
import RecipeSearchbar from "~/components/dashboard/dashboard-searchbar";
import RecipeBrowser from "~/components/dashboard/dashboard-recipebrowser";
import { setUserId, userId } from "~/stores/user";
import { RecipeForm } from "~/components/recipe-form/RecipeForm";

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
        <MainArea />
        <TaskBar />
      </div>


      <div class="dashboard-side-region">
        {/* <RecipeSearchbar /> */}
        <RecipeBrowser />
      </div>
    </main>
  );
}


function MainArea() {
  const [activeView, setActiveView] = createSignal<"view" | "edit" | "add">("view");
  const [selectedRecipeId, setSelectedRecipeId] = createSignal<string | null>(null);

  function openRecipe(recipeId: string) {
    setSelectedRecipeId(recipeId);
    setActiveView("view");
  }

  return (
    <div class="main-area">
      <div class="nav-bar">
        <button onClick={() => setActiveView("add")}>Add Recipe</button>
        <button onClick={() => setActiveView("edit")}>Edit Recipe</button>
        <button onClick={() => setActiveView("view")}>View Recipe</button>
      </div>

      <Switch>
        <Match when={activeView() === "view"}>
          <RecipeEditor></RecipeEditor>
        </Match>

        <Match when={activeView() === "edit"}>
          <Show when={userId}>
            <RecipeForm></RecipeForm>
          </Show>
        </Match>

        <Match when={activeView() === "add"}>
          <Show when={userId}>
            <RecipeForm></RecipeForm>
          </Show>
        </Match>
      </Switch>
    </div>
  )
}