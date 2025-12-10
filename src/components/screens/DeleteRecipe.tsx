import { createSignal, For, Show, createResource, Suspense, createMemo, onMount } from "solid-js";
import { supabase } from "~/supabase/supabase-client";
import { fetchRecipesWithUser, getPublicThumbnailUrl } from "~/supabase/recipe-client";
import "~/styling/screens/delete-screen.css"
import Plate from "~/assets/food-plate.jpg";

export default function DeleteRecipe() {
    const [selectedIds, setSelectedIds] = createSignal<number[]>([]);
    const [userId, setUserId] = createSignal<string | null>(null);

    onMount(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUserId(user?.id || null);
    });

    const [headers] = createResource(() => userId(), async (uid) => {
        if (!uid) return [];
        return fetchRecipesWithUser(uid);
    });

    const userHeaders = createMemo(() => {
        if (!userId()) return [];
        const data = headers() || [];
        return data.filter((r: any) => r.author_id === userId());
    });

    const selectRecipes = (recipeID: number) => {
        const recipesToDelete = selectedIds();
        let alreadySelected = false;
        let deleteList: number[] = [];

        for (let i = 0; i < recipesToDelete.length; i++){
            if (recipesToDelete[i] === recipeID){
                alreadySelected = true;
            }
            else {
                deleteList.push(recipesToDelete[i]);
            }
        }

        if (!alreadySelected){
            deleteList.push(recipeID)
        }

        setSelectedIds(deleteList);
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
                                        <img src={getPublicThumbnailUrl(r.image_url) || Plate} alt="Recipe preview" />
                                        <h3>{r.recipe_title}</h3>
                                    </div>
                                )
                            }}
                        </For>
                    </Show>
                </div>

                <div class="selected-lbl">
                    <p>{selectedIds().length} Recipe(s) Selected</p>
                </div>

                <div class="btn-cont">
                    <div class="clear-select-btn" onClick={() => setSelectedIds([])}>
                        <button>Clear Selection</button>
                    </div>

                    <div class="delete-recipe-btn">
                        <button>Delete Recipes</button>
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
