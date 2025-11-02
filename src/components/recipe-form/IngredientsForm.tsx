import { createSignal, For } from "solid-js";
import { createStore } from "solid-js/store"
import { NewIngredient } from "./newIngredient";
import "../../styling/recipe-form/ingredients-form.css";

export function IngredientsForm(){

    // const [ingredients, setIngredients] = createSignal([{quantity: "", units: "", ingredientName: ""}]);
    const [ingredients, setIngredients] = createStore([{quantity: "", units: "", ingredientName: ""}]);

    
    // Function adds new ingredient to array of ingredients already entered
    function addNewIngredient(){
        setIngredients([...ingredients, {quantity: "", units: "", ingredientName: ""}]);
    }

    //Updates the values stored in array of ingredients if user changes value in text fields or dropdown
    function updateIngredient( index: number, field: "quantity" | "units" | "ingredientName", value: string){
        setIngredients(index, field, value);
    }

    return (
        <div class="ingredients-form">
            <div class="ing-lbl-cont">
                <label>Recipe Ingredients</label>
            </div>
            <div class="def_ing">
                
                {/* Creates initial and additional row for ingredients */}
                <For each={ingredients}>
                    {(newIng, index) => (
                        <NewIngredient ingredient={newIng} index={index()} onChange={updateIngredient}/>
                    )}
                </For>

            </div>
            <button id="add-ing-btn" type="button" onClick={addNewIngredient}>+</button>
        </div>
    );

}