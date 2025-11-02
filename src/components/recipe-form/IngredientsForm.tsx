import { createSignal, For } from "solid-js";
import { NewIngredient } from "./newIngredient";
import "../../styling/recipe-form/ingredients-form.css";

export function IngredientsForm(){

    const [ingredients, setIngredients] = createSignal([{quantity: "", units: "", ingredientName: ""}]);
    
    function addNewIngredient(){
        setIngredients([...ingredients(), {quantity: "", units: "", ingredientName: ""}]);
    }

    function updateIngredient( index: number, field: "quantity" | "units" | "ingredientName", value: string){
        const updatedIng = [...ingredients()];
        updatedIng[index] = { ...updatedIng[index], [field]: value };
        setIngredients(updatedIng);
    }

    return (
        <div class="ingredients-form">
            <div class="ing-lbl-cont">
                <label>Recipe Ingredients</label>
            </div>
            <div class="def_ing">
                <For each={ingredients()}>
                    {(newIng, i) => (
                        <NewIngredient ingredient={newIng} index={i()} onChange={updateIngredient}/>
                    )}
                </For>

            </div>
            <button id="add-ing-btn" type="button" onClick={addNewIngredient}>+</button>
        </div>
    );

}