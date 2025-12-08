import { createSignal, For, Show, createResource, Suspense, createMemo, onMount } from "solid-js";
import { supabase } from "~/supabase/supabase-client";
import "~/styling/screens/export-screen.css"
import Plate from "~/assets/food-plate.jpg";

export default function ExportPDF() {
    const [selectedIds, setSelectedIds] = createSignal<number[]>([]);
    const [userId, setUserId] = createSignal<string | null>(null);

    onMount(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUserId(user?.id || null);
    });

    const [headers] = createResource(
        () => typeof window !== "undefined",
        async () => {
            const res = await fetch("/api/recipes");
            return res.json();
        }
    );

    const userHeaders = createMemo(() => {
        if (!userId()) return [];
        const data = headers() || [];
        return data.filter((r: any) => r.author_id === userId());
    });

    const selectRecipes = (recipeID: number) => {
        const recipesToExport = selectedIds();
        let alreadySelected = false;
        let exportList: number[] = [];

        for (let i = 0; i < recipesToExport.length; i++){
            if (recipesToExport[i] === recipeID){
                alreadySelected = true;
            }
            else {
                exportList.push(recipesToExport[i]);
            }
        }

        if (!alreadySelected){
            exportList.push(recipeID)
        }

        setSelectedIds(exportList);
    };

    return (
        <Suspense fallback={<div>Loading recipes...</div>}>
            <div class="export-screen-cont">
                <div class="screen-lbl">
                    <p>Choose the Recipe(s) You Wish To Download</p>
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
                                )
                            }}
                        </For>
                    </Show>
                </div>

                <div class="selected-lbl">
                    <p>{selectedIds().length} Recipe(s) Selected</p>
                </div>

                <div class="btn-cont">
                    <div class="export-select-btn" onClick={() => setSelectedIds([])}>
                        <button>Clear Selection</button>
                    </div>

                    <div class="export-recipe-btn">
                        <button>Download Recipes</button>
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
