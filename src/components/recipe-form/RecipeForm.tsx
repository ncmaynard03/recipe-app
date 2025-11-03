import { IngredientsForm } from "./IngredientsForm"
import { InstructionsForm } from "./InstructionsForm"
import EmptyPlate from "~/assets/empty-plate-2.jpg"

import "../../styling/recipe-form/recipe-form.css"
import { Recipe } from "~/stores/recipes";
import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import "../../styling/recipe-form/ingredients-form.css";
import { getCurrentUserID } from "~/supabase/supabase-queries";
import { userId } from "~/stores/user";

const usUnitsList = [
    { value: "pounds", label: "lb(s)" },
    { value: "ounces", label: "oz" },
    { value: "gallons", label: "gal(s)" },
    { value: "quarts", label: "qt(s)" },
    { value: "pints", label: "pt(s)" },
    { value: "cups", label: "cup(s)" },
    { value: "fluid-ounces", label: "fl. oz" },
    { value: "tablespoons", label: "tbsp(s)" },
    { value: "teaspoons", label: "tsp(s)" },
    { value: "pinch", label: "pinch" },
    { value: "box", label: "box" },
    { value: "can", label: "can" },
    { value: "packet", label: "packet" },
];

export function RecipeForm() {

    const [form, setForm] = createStore<Recipe>({
        author_id: "",
        recipe_title: "",
        prep_time: 0,
        cook_time: 0,
        ingredients: [{ quantity: "", unit: "", ingredientName: "" }]
        // instructions: [""],
        // notes: ""
    });
    async function submitRecipe(e: Event) {
        e.preventDefault();

        console.log("id:::", userId())

        const uid = userId()?.toString() ?? "";
        const payload = { ...form, author_id: uid }
        console.log("Submitting recipe:", payload);

        if (!uid) {
            alert("Not logged in!");
            return;
        }
        await fetch("/api/recipes", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    // Function adds new ingredient to array of ingredients already entered
    function addNewIngredient() {
        setForm("ingredients", [...form.ingredients, { quantity: "", unit: "", ingredientName: "" }]);
    }

    //Updates the values stored in array of ingredients if user changes value in text fields or dropdown
    function updateIngredient(index: number, field: "quantity" | "unit" | "ingredientName", value: string) {
        setForm("ingredients", index, field, value);
    }

    function deleteIngredient(index: number) {
        if (form.ingredients.length > 1) {
            setForm("ingredients", form.ingredients.filter((_, ingIndex) => ingIndex !== index));
        }
        else {
            return
        }
    }

    return (
        <form onSubmit={submitRecipe}>

            <div id="form-title">
                <p>New Recipe</p>
            </div>

            <div class="recipe-image">
                <div class="recipe-img-cont">
                    <img src={EmptyPlate} class="def-img" />
                </div>

                <label id="image-label">Recipe Image</label>
                <div class='choose-file-cont'>
                    <input type="file" accept="image/*" />
                </div>
                {/* Code for user to upload image in form */}
            </div>

            <div class="recipe-title-section">
                <input
                    type="text"
                    value={form.recipe_title}
                    onInput={(e) => setForm("recipe_title", e.currentTarget.value)}
                    placeholder="Recipe Title"
                />
                <label>(Recipe Title)</label>
            </div>

            <div class="time-fields">
                <div class="prep-time">
                    <label>Prep Time:</label>
                    <input
                        type="text"
                        value={form.prep_time}
                        onInput={(e) => setForm("prep_time", parseInt(e.currentTarget.value) || 0)} />
                    <label>mins</label>
                </div>
                <div class="cook-time">
                    <label>Cook Time:</label>
                    <input
                        type="text"
                        value={form.cook_time}
                        onInput={(e) => setForm("cook_time", parseInt(e.currentTarget.value) || 0)} />
                    <label>mins</label>
                </div>
            </div>

            {/* <IngredientsForm/> */}
            <div class="ingredients-section">
                <div class="ing-lbl-cont">
                    <label>Recipe Ingredients</label>
                    {form.ingredients.map((ing, index) => (
                        <div class="ingredient-row">
                            <input type="text"
                                value={ing.quantity}
                                placeholder="Qty"
                                onInput={(e) => updateIngredient(index, "quantity", e.target.value)}
                            />
                            <select value={ing.unit} onInput={(e) => updateIngredient(index, "unit", e.currentTarget.value)}>
                                <option value="">Unit</option>
                                {usUnitsList.map((units) => (
                                    <option value={units.value}>{units.label}</option>
                                ))}
                            </select>
                            <input type="text"
                                value={ing.ingredientName}
                                placeholder="Ingredient Name"
                                onInput={(e) => updateIngredient(index, "ingredientName", e.target.value)}
                            />
                            <button class="delete-btn" onClick={(e) => deleteIngredient(index)}>-</button>

                        </div>

                    ))}
                    <button onClick={(e) => addNewIngredient()}>+</button>
                </div>
            </div>

            < InstructionsForm />
            <div class="recipe-notes">
                <label>Recipe Notes</label>
                <textarea></textarea>
            </div>
            <div id="save-recipe-btn">
                <button type="button" onClick={(e) => submitRecipe(e)}>Save Recipe</button>
            </div>
        </form>
    )
}
