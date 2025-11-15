//src/routes/dashboard.tsx

import { Title } from "@solidjs/meta";
import { onMount, createSignal, Switch, Match, Show, createResource } from "solid-js";
import { supabase } from "~/supabase/supabase-client";
import * as supabaseFn from "~/supabase/supabase-queries";
import "~/styling/dashboard.css";
import "~/styling/recipe-browser.css"
import "~/styling/recipe-editor.css";
import "~/styling/taskbar.css"


import TaskBar from "~/components/dashboard/taskbar";
import RecipeEditor from "~/components/dashboard/recipeEditor";
import RecipeSearchbar from "~/components/dashboard/searchbar";
import RecipeBrowser from "~/components/dashboard/recipebrowser";
import { setUserId, userId } from "~/stores/user";

export default function Dashboard() {
  const [selectedRecipeId, setSelectedRecipeId] = createSignal<number | null>(null);

  const [username, setUsername] = createSignal("")

  onMount(async () => {
    const currUN = await supabaseFn.ensureUserExists();
    setUsername(currUN);

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      setUserId(user.id);
    }
  });

  return (
    <main class="dashboard">
      <div class="dashboard-main-region">
        <TaskBar />
        <MainArea
          selectedRecipeId={selectedRecipeId}
          setSelectedRecipeId={setSelectedRecipeId}
        />
      </div>

      <div class="dashboard-side-region">
        <RecipeBrowser
          onSelect={setSelectedRecipeId}
          selected={selectedRecipeId()}
        />

      </div>
    </main>
  );
}

function MainArea(props: {
  selectedRecipeId: () => number | null,
  setSelectedRecipeId: (v: number | null) => void
}) {
  const [activeView, setActiveView] = createSignal<"view" | "edit" | "add">("view");

  const [fullRecipe] = createResource(props.selectedRecipeId, (id) =>
    id ? fetch(`/api/recipes/${id}`).then(r => r.json()) : null
  );

  return (
    <div class="main-area">
      {/* <div class="nav-bar">
        <button onClick={() => setActiveView("add")}>Add Recipe</button>
        <button onClick={() => setActiveView("edit")}>Edit Recipe</button>
        <button onClick={() => setActiveView("view")}>View Recipe</button>
      </div> */}

      <Switch>
        <Match when={activeView() === "view"}>
          <RecipeEditor recipe={fullRecipe()} />
        </Match>

        {/* <Match when={activeView() === "edit"}>
          <Show when={userId()}>
          </Show>
        </Match>

        <Match when={activeView() === "add"}>
          <Show when={userId()}>
          </Show>
        </Match> */}
      </Switch>
    </div>
  )
}
