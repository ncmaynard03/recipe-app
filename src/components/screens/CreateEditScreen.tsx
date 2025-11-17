import { loadAllRecipes, recipes } from "~/stores/recipes";
import { For, createEffect } from "solid-js";
import { supabase } from "~/supabase/supabase-client";

export function CreateEditScreen(){

    createEffect(async () => {
        console.log("Checking user auth status...");
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            console.log("User is logged in, loading recipes...");
            await loadAllRecipes();
        } else {
            console.log("User does not exist! No recipes to load!");
        }
    })


    return(
        <div class="ce-screen">
            <div class="top-half">
                <p>Choose A Recipe Below to Edit</p>
                <div class="existing-recipe-tile">
                    <For each={recipes}>{
                    (r, index) => {
                        console.log(r.recipe_title);
                        return (
                            <div class="recipe-tile">
                                <div class="recipe-tile-content">
                                    <img src={r.imageUrl} alt="Recipe preview" />
                                    <div class="recipe-tile-text">
                                        <h3>{r.recipe_title}</h3>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                }
                </For>
                </div>
            </div>
            <div class="separator">
                <p>or</p>
            </div>
            <div class="bottom-half">
                <div class="new-recipe-tile">
                    <button>+</button>
                    <p>New Recipe</p>
                </div>
                <p>Click The Box Above to Create a New Recipe</p>
            </div>
        </div>
    );

}