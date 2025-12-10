import { onMount, createSignal, Switch, Match, Show, createResource, createEffect } from "solid-js";
import { supabase } from "~/supabase/supabase-client";
import * as supabaseFn from "~/supabase/supabase-queries";
import type { ActiveView } from "~/types";
import "~/styling/dashboard.css";
import "~/styling/recipe-browser.css";
import "~/styling/recipe-editor.css";
import "~/styling/taskbar.css";

import Settings from "~/components/screens/Settings";
import DeleteRecipe from "~/components/screens/DeleteRecipe";
import TaskBar from "~/components/dashboard/taskbar";
import RecipeEditor from "~/components/dashboard/recipeEditor";
import RecipeViewer from "~/components/dashboard/recipeViewer";
import RecipeBrowser from "~/components/dashboard/recipebrowser";
import { setUserId, userId } from "~/stores/user";
import SearchRecipe from "~/components/screens/SearchRecipe";
import ExportPDF from "~/components/screens/ExportPDF";
import { fetchRecipeById, fetchSavedRecipes, toggleSavedRecipe } from "~/supabase/recipe-client";

function displayDelay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Dashboard() {
  const [selectedRecipeId, setSelectedRecipeId] = createSignal<number | null>(null);
  const [currentRecipe, setCurrentRecipe] = createSignal<any>(null);
  const [savedRecipes, setSavedRecipes] = createSignal<any[]>([]);
  const [activeView, setActiveView] = createSignal<ActiveView>("add");

  onMount(async () => {
    await supabaseFn.ensureUserExists();

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      setUserId(user.id);
      await loadSavedRecipes(user.id);
    }
  });

  const handleSelectRecipe = (id: number | null) => {
    setSelectedRecipeId(id);
    setCurrentRecipe(null);
    if (id !== null) {
      setActiveView("view");
    }
  };

  const handleNewRecipe = () => {
    setSelectedRecipeId(null);
    setCurrentRecipe(null);
    setActiveView("add");
  };

  const handleEditRecipe = () => {
    if (selectedRecipeId()) {
      setActiveView("edit");
    }
  };

  const loadSavedRecipes = async (uid: string) => {
    try {
      const saved = await fetchSavedRecipes(uid);
      setSavedRecipes(saved || []);
    } catch (err) {
      console.error("Failed to load saved recipes", err);
      setSavedRecipes([]);
    }
  };

  const handleToggleSave = async (recipeId: number, save: boolean) => {
    if (!userId()) return;
    try {
      await toggleSavedRecipe(userId()!, recipeId, save);
      await loadSavedRecipes(userId());
    } catch (err) {
      console.error("Failed to toggle save", err);
    }
  };

  return (
    <main class="dashboard">
      <div class="dashboard-main-region">
        <TaskBar
          changeScreenTo={setActiveView}
          onNewRecipe={handleNewRecipe}
          onEditRecipe={handleEditRecipe}
          currentRecipe={currentRecipe()}
          userId={userId()}
          onToggleSave={handleToggleSave}
          savedRecipes={savedRecipes()}
        />
        <MainArea
          selectedRecipeId={selectedRecipeId}
          setSelectedRecipeId={setSelectedRecipeId}
          setActiveView={setActiveView}
          activeView={activeView}
          onRecipeLoaded={setCurrentRecipe}
        />
      </div>

      <div class="dashboard-side-region">
        <RecipeBrowser
          onSelect={handleSelectRecipe}
          selected={selectedRecipeId()}
          userId={userId()}
          savedRecipes={savedRecipes()}
        />

      </div>
    </main>
  );
}

function MainArea(props: {
  selectedRecipeId: () => number | null,
  setSelectedRecipeId: (v: number | null) => void,
  setActiveView: (v: ActiveView) => void,
  activeView: () => ActiveView,
  onRecipeLoaded: (r: any) => void
}) {

  const [fullRecipe, { refetch }] = createResource(props.selectedRecipeId, async (id) => {
    if (!id) {
      return null;
    }

    try {
      const data = await fetchRecipeById(id);
      await displayDelay(400);
      return data;
    } catch (err) {
      console.error("Failed to load recipe", err);
      return null;
    }
  });

  createEffect(() => {
    if (!fullRecipe.loading) {
      props.onRecipeLoaded(fullRecipe() || null);
    }
  });
  return (
    <div class="main-area">

      <Switch>
        <Match when={props.activeView() === "add"}>
          <RecipeEditor />
        </Match>

        <Match when={props.activeView() === "view"}>
          <Show when={!fullRecipe.loading && fullRecipe()}
            fallback={
              <div class="load-recipe-screen">
                <p>Loading Recipe...</p>
                <div class='loading-circle' />
              </div>
            }>
            {(recipe) => <RecipeViewer recipe={recipe()} />}
          </Show>
        </Match>

        <Match when={props.activeView() === "edit"}>
          <Show when={props.selectedRecipeId()} fallback={
            <div class="load-recipe-screen">
              <p>Select a recipe to edit</p>
            </div>
          }>
            <Show when={!fullRecipe.loading && fullRecipe()}
              fallback={
                <div class="load-recipe-screen">
                  <p>Loading Recipe...</p>
                  <div class='loading-circle' />
                </div>
              }>
              {(recipe) => (
                <RecipeEditor
                  recipe={recipe()}
                  onSaveSuccess={() => {
                    refetch();
                    props.setActiveView("view");
                  }}
                />
              )}
            </Show>
          </Show>
        </Match>

        <Match when={props.activeView() === "pdf-export"}>
          <ExportPDF />
        </Match>

        <Match when={props.activeView() === "delete"}>
          <DeleteRecipe />
        </Match>

        <Match when={props.activeView() === "search"}>
          <SearchRecipe />
        </Match>

        <Match when={props.activeView() === "settings"}>
          <Settings />
        </Match>
      </Switch>
    </div>
  );
}
