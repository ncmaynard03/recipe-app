import { createSignal, For, Show, createResource, Suspense, createMemo, onMount } from "solid-js";
import { supabase } from "~/supabase/supabase-client";
import "~/styling/screens/delete-screen.css";
import Plate from "~/assets/food-plate.jpg";

export default function DeleteRecipe() {
  const [selectedIds, setSelectedIds] = createSignal<number[]>([]);
  const [userId, setUserId] = createSignal<string | null>(null);
  const [isLoading, setLoading] = createSignal(false);
  const [errorMsg, setErrorMsg] = createSignal<string | null>(null);

  // Signal to trigger resource refresh
  const [refresh, setRefresh] = createSignal(0);

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user?.id || null);
  });

  // Fetch all recipes
  const [headers] = createResource(refresh, async () => {
    const res = await fetch("/api/recipes");
    return res.json();
  });

  // Filter recipes to only those authored by current user
  const userHeaders = createMemo(() => {
    if (!userId()) return [];
    const data = headers() || [];
    return data.filter((r: any) => r.author_id === userId());
  });

  // Toggle selection of a recipe
  const selectRecipes = (recipeID: number) => {
    const recipesToDelete = selectedIds();
    if (recipesToDelete.includes(recipeID)) {
      setSelectedIds(recipesToDelete.filter(id => id !== recipeID));
    } else {
      setSelectedIds([...recipesToDelete, recipeID]);
    }
  };

  // Delete selected recipes with browser confirmation
  const deleteSelectedRecipes = async () => {
    const ids = selectedIds();
    if (ids.length === 0) {
      alert("No recipes selected.");
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete ${ids.length} recipe(s)? This CANNOT be undone.`);
    if (!confirmed) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase
        .from("recipes")
        .delete()
        .in("recipe_id", ids);

      if (error) throw error;

      alert("Recipes deleted successfully!");
      setSelectedIds([]);
      setRefresh(x => x + 1);
    } catch (err: unknown) {
      if (err instanceof Error) setErrorMsg(err.message);
      else setErrorMsg("Unknown error occurred.");
      alert(errorMsg() || "Failed to delete recipes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading recipes...</div>}>
      <div class="delete-screen-cont">
        <div class="delete-lbl">
          <p>Choose the Recipe(s) You Wish To Delete</p>
        </div>

        <div class="user-recipe">
          <Show when={userHeaders().length > 0} fallback={<div>Loading Your Recipes...</div>}>
            <For each={userHeaders()}>
              {(r) => {
                const recipeID = Number(r.recipe_id);
                return (
                  <div
                    class="recipe-tile"
                    style={{
                      border: selectedIds().includes(recipeID) ? "5px solid red" : "5px solid transparent",
                      "box-shadow": selectedIds().includes(recipeID) ? "" : "1px 1.5px 5px 1.5px"
                    }}
                    onClick={() => selectRecipes(recipeID)}
                  >
                    <img src={r.image_url ? `/api/public-thumbnail?path=${encodeURIComponent(r.image_url)}` : Plate} alt="Recipe preview" />
                    <h3>{r.recipe_title}</h3>
                  </div>
                );
              }}
            </For>
          </Show>
        </div>

        <div class="selected-lbl">
          <p>{selectedIds().length} Recipe(s) Selected</p>
        </div>

        <div class="btn-cont">
          <div class="clear-select-btn">
            <button onClick={() => setSelectedIds([])}>Clear Selection</button>
          </div>

          <div class="delete-recipe-btn">
            <button
              onClick={deleteSelectedRecipes}
              disabled={selectedIds().length === 0 || isLoading()}
            >
              {isLoading() ? "Deleting…" : "Delete Recipes"}
            </button>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
