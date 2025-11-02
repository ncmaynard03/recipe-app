import { IngredientsForm } from "./IngredientsForm"
import { InstructionsForm } from "./InstructionsForm"

import "../../styling/recipe-form/recipe-form.css"

export function RecipeForm(){

    async function submitRecipe(e: Event){

    }
    
    return (
        <form onSubmit={submitRecipe}>
            <div id="form-title">
                <p>Create New Recipe</p>
            </div>
            <div class="recipe-image">
                <label id="image-label">Recipe Image</label>
                <input type="file" accept="image/*"/>
                {/* Code for user to upload image in form */}
            </div>
            <div class="recipe-title-section">
                <label>Recipe Title</label>
                <input type="text" id="recipe-title" name="title"/>
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
        </form>
    )
}
