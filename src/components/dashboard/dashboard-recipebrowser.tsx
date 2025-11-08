import { createEffect, For } from "solid-js";
import "../../styling/dashboard/dashboard-recipebrowser.css";
// import RecipeBrowsingItem from "./dashboard-recipebrowsingitem";
import { supabase } from "~/supabase/supabase-client";
import { loadAllRecipes, recipes } from "~/stores/recipes";

import WHPhoto from "~/assets/dashboard/waffle-house-allstarspecial.jpg";

export default function RecipeBrowser() {
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

    return (
        <div class="browsing-container">
            <div class="browsing-container-content">
                <For each={recipes}>{
                    (r, index) => {
                        console.log(r.recipe_title);
                        return (
                            <div class="browsing-item-container">
                                <div class="browsing-item-content">
                                    <img src={WHPhoto} alt="Recipe preview" />
                                    <div class="browsing-item-text">
                                        <h3>{r.recipe_title}</h3>
                                        <p>{r.author_id}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                }
                </For>
            </div>
        </div>
    );
}



type RecipeBrowsingItem = {
    title: string;
    author: string;
    image_src: string;
}
