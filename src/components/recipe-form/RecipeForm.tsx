import { IngredientsForm } from "./IngredientsForm"
import { InstructionsForm } from "./InstructionsForm"
import EmptyPlate from "~/assets/empty-plate-2.jpg"

import "../../styling/recipe-form/recipe-form.css"

export function RecipeForm(){

    async function submitRecipe(e: Event){

    }
    
    return (
        <form onSubmit={submitRecipe}>
            <div id="form-title">
                <p>New Recipe</p>
            </div>
            <div class="recipe-image">
                <div class="recipe-img-cont">
                    <img src={EmptyPlate} class="def-img"/>
                </div>
                
                <label id="image-label">Recipe Image</label>
                <div class='choose-file-cont'>
                    <input type="file" accept="image/*"/>
                </div>
                {/* Code for user to upload image in form */}
            </div>
            <div class="recipe-title-section">
                <input type="text" id="recipe-title" name="title"/>
                <label>(Recipe Title)</label>
            </div>
            <div class="time-fields">
                <div class="prep-time">
                    <label>Prep Time:</label>
                    <input type="text" id="prep-time" name="prep-time"/>
                    <label>mins</label>
                </div>
                <div class="cook-time">
                    <label>Cook Time:</label>
                    <input type="text" id="cook-time" name="cook-time"/>
                    <label>mins</label>
                </div>
            </div>
            <IngredientsForm/>
            <InstructionsForm />
            <div class="recipe-notes">
                <label>Recipe Notes</label>
                <textarea></textarea>
            </div>
            <div id="save-recipe-btn">
                <button type="button">Save Recipe</button>
            </div>
        </form>
    )
}
