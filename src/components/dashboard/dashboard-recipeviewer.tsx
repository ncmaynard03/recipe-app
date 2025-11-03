import "../../styling/dashboard/dashboard-recipeviewer.css";

import RecipeImage from "./dashboard-recipeimage";
import RecipeText from "./dashboard-recipetext";
import RecipeCard from "./dashboard-recipecard";
import { RecipeForm } from "../recipe-form/RecipeForm";

export default function RecipeViewer(){
    return(
        <div class="recipe-viewer">
            <div class="recipe-content">
                <h1 id="form-title">RECIPE TITLE</h1>
                <RecipeImage />
                <RecipeText />
                <RecipeCard />
                <RecipeText />
                <RecipeCard />
                <RecipeText />
                <RecipeCard />
                <RecipeForm />
            </div>
        </div>
    );
}
        