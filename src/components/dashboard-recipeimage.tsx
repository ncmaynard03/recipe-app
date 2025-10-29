import { createSignal } from "solid-js";
import "../styling/dashboard-recipeviewer.css";

export default function RecipeImage(){
    return(
        <div class="recipe-image">
            <img src="/assets/waffle-house-allstarspecial.jpg" alt="TEST" />
        </div>
    );
}