<<<<<<< Updated upstream
import { createEffect, createSignal, For } from "solid-js";
import "../../styling/dashboard/dashboard-recipebrowser.css";
import { loadAllRecipes, Recipe, recipes, setRecipes } from "~/stores/recipes";
import { createStore } from "solid-js/store";
import { supabase } from "~/supabase/supabase-client";

export default function RecipeBrowser() {

    createEffect(async () => {
        console.log("Checking user auth status...");
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            console.log("User is logged in, loading recipes...");
            await loadAllRecipes();
        }
    })
=======
import "../../styling/dashboard/dashboard-recipebrowser.css";
import RecipeBrowsingItem from "./dashboard-recipebrowsingitem";
>>>>>>> Stashed changes

    return (
<<<<<<< Updated upstream
        <div class="recipe-browser">
            <h2>Recipe Browser</h2>
            <div class="recipe-list">
                <For each={recipes}>{
                    (r, index) => {
                        console.log(r.recipe_title);
                        return (
                            <div class="recipe-item" >
                                <p>{r.recipe_title}</p>
                                <p>prep: {r.prep_time} mins</p>
                                <p>cook: {r.cook_time} mins</p>
                                <br />
                            </div>
                        )
                    }
                }
                </For>
            </div>

=======
        <div class="browsing-container">
            <div class="browsing-container-content">
                <RecipeBrowsingItem />
                <RecipeBrowsingItem />
                <RecipeBrowsingItem />
                <RecipeBrowsingItem />
                <RecipeBrowsingItem />
                <RecipeBrowsingItem />
                <RecipeBrowsingItem />
                <RecipeBrowsingItem />
                <RecipeBrowsingItem />
                <RecipeBrowsingItem />
                <RecipeBrowsingItem />
                <RecipeBrowsingItem />
                <RecipeBrowsingItem />
                <RecipeBrowsingItem />
            </div>
>>>>>>> Stashed changes
        </div>
    );
}