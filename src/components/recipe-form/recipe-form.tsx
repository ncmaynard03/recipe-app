import { IngredientsForm } from "./ingredients-form"

export function RecipeForm(){

    async function submitRecipe(e: Event){

    }
    
    return (
        <form onSubmit={submitRecipe}>
            <label>Recipe Image</label>
            {/* Code for user to upload image in form */}
            <label>Recipe Title</label>
            <input type="text" id="recipe-title" name="title"/>
            <label>Prep Time</label>
            <input type="text" id="prep-time" name="prep-time"/>
            <label>Cook Time</label>
            <input type="text" id="cook-time" name="cook-time"/>
            <IngredientsForm/>
        </form>
    )
}
