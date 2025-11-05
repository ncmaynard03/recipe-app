import "../../styling/dashboard/dashboard-recipeviewer.css";
import { IngredientsForm } from "../recipe-form/IngredientsForm";

export default function RecipeCard(){
    return(        
        <div class="recipe-card">
            <div class="recipe-card-contents">
                <div class="time-fields">
                    <div class="prep-time">
                        <label>Prep Time:</label>
                        <input type="text" id="prep-time" name="prep-time" />
                        <label>mins</label>
                    </div>
                    <div class="cook-time">
                        <label>Cook Time:</label>
                        <input type="text" id="cook-time" name="cook-time" />
                        <label>mins</label>
                    </div>
                </div>
                <IngredientsForm />
            </div>
        </div>
    );
}