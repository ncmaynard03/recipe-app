import { Title } from "@solidjs/meta";
import { onMount, createSignal, Switch, Match, createEffect, Show } from "solid-js";
import { supabase } from "~/supabase/supabase-client";
import * as supabaseFn from "~/supabase/supabase-queries";
import "../styling/dashboard/dashboard.css";

import TaskBar from "~/components/dashboard/dashboard-taskbar";
import RecipeViewer from "~/components/dashboard/dashboard-recipeviewer";
import RecipeSearchbar from "~/components/dashboard/dashboard-searchbar";
import RecipeBrowser from "~/components/dashboard/dashboard-recipebrowser";
import { RecipeForm } from "~/components/recipe-form/RecipeForm";
import { createStore } from "solid-js/store";
import { setUserId, userId } from "~/stores/user";
// import { loadAllRecipes } from "~/stores/recipes";


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
      <aside style={{ "overflow-y": "auto" }}>
        <div class="dashboard-main-region">
          {/* <RecipeViewer />
        <TaskBar /> */}
          <MainArea></MainArea>
        </div>
      </aside>


      <div class="dashboard-side-region">
        <RecipeSearchbar />
        <Show when={userId}>
          <RecipeBrowser />
        </Show>
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
          <RecipeViewer></RecipeViewer>
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