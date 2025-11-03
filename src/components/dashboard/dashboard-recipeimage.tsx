import { createSignal } from "solid-js";
import "../../styling/dashboard/dashboard-recipeviewer.css";
import WHPhoto from "~/assets/waffle-house-allstarspecial.jpg"

export default function RecipeImage(){
    return(
        <div class="recipe-image">
            <img src={WHPhoto} alt="TEST" />

        </div>
    );
}