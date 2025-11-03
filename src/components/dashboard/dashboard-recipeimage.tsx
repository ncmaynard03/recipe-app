import { createSignal } from "solid-js";
import "../../styling/dashboard/dashboard-recipeviewer.css";
import WHPhoto from "~/assets/dashboard/waffle-house-allstarspecial.jpg"

//this will be clickable later....
//also I forgot about when theres no image yet
export default function RecipeImage(){
    return(
        <div class="recipe-image">
            <img src={WHPhoto} alt="TEST" />
        </div>
    );
}