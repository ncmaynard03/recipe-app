import { createSignal } from "solid-js";
import "../styling/dashboard-recipeviewer.css";

import RecipeImage from "./dashboard-recipeimage";
import RecipeText from "./dashboard-recipetext";
import RecipeCard from "./dashboard-recipecard";

export default function RecipeViewer(){
    return(
        <div class="recipe-viewer">
            <div class="recipe-content">
                <RecipeImage />
                <RecipeText />
                <RecipeCard />
            </div>
        </div>
    );
}
        