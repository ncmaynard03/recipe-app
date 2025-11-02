import { createSignal } from "solid-js";
import "../../styling/recipe-form/ingredients-form.css";

export function IngredientsForm(){

    const [ingredients, setIngredients] = createSignal([{quantity: "", units: "", ingredientName: ""}]);
    
    function addNewIngredient(){
        setIngredients([...ingredients(), {quantity: "", units: "", ingredientName: ""}]);
    }

    return (
        <div class="ingredients-form">
            <div class="ing-lbl-cont">
                <label>Recipe Ingredients</label>
            </div>
            <div class="def_ing">
                <input type="text" id="quantity"/>
                <select name="units" id="units">
                    <option value="pounds">lbs</option>
                    <option value="ounces">oz</option>
                    <option value="gallons">gal</option>
                    <option value="quarts">qt</option>
                    <option value="pints">pt</option>
                    <option value="cups">cups</option>
                    <option value="fluid-ounces">fl oz</option>
                    <option value="tablespoons">tbsp</option>
                    <option value="teaspoons">tsp</option>
                    <option value="pinch">pinch</option>
                    <option value="box">box</option>
                    <option value="can">can</option>
                    <option value="packet">packet</option>
                </select>
                <input type="text" id="ingredient-name" name="Ingredient Name"/>
            </div>
            <div class="addl-ingredients">

            </div>
            <button id="add-ing-btn" onClick={addNewIngredient}>+</button>
        </div>
    );

}