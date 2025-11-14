//Libraries
import { userId } from "~/stores/user";
import WHPhoto from "~/assets/dashboard/waffle-house-allstarspecial.jpg"
import { createStore } from "solid-js/store";
import { Recipe } from "~/stores/recipes";

//Styling
import "../../styling/dashboard/dashboard-recipeviewer.css";
import "../../styling/recipe-form/recipe-form.css"
import "../../styling/recipe-form/ingredients-form.css";


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

const metricUnitsList = [
    { value: "grams", label: "g" },
    { value: "kilograms", label: "kg" },
    { value: "milliliter", label: "mL" },
    { value: "liters", label: "L" },
    { value: "pinch", label: "pinch" },
    { value: "box", label: "box" },
    { value: "can", label: "can" },
    { value: "packet", label: "packet" },
];


export default function RecipeEditor() {

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
        <div class="recipe-viewer">
            <div class="recipe-content">
                <input
                    id="form-title"
                    type="text"
                    value={form.recipe_title}
                    onInput={(e) => setForm("recipe_title", e.currentTarget.value)}
                    placeholder="Recipe Title"
                />
                {/* <h1 id="form-title">{form.recipe_title || "New Recipe"}</h1> */}
                <div class="recipe-image">
                    <img src={WHPhoto} alt="TEST" />
                </div>

                <div class="recipe-card">
                    <div class="recipe-card-contents">
                        <div class="time-fields">
                            <div class="prep-time">
                                <label>Prep Time:</label>
                                <input type="text" id="prep-time" onInput={(e) => setForm("prep_time", parseInt(e.currentTarget.value))} />
                                <label>mins</label>
                            </div>
                            <div class="cook-time">
                                <label>Cook Time:</label>
                                <input type="text" id="cook-time" onInput={(e) => setForm("cook_time", parseInt(e.currentTarget.value))} />
                                <label>mins</label>
                            </div>
                        </div>

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
                        {/* <IngredientsForm /> */}
                    </div>
                </div>

                {/* <RecipeCard /> */}
                {/* <RecipeText /> */}
                <div class="recipe-text">
                    <div class="recipe-text-toolbar">
                        <button>B</button>
                        <button>I</button>
                        <button>U</button>
                    </div>
                    <textarea
                        class="recipe-text-textarea"
                        placeholder="Write your recipe here..."
                    />
                </div>
                <button onClick={() => { console.log(JSON.stringify(form)) }}>Save Recipe</button>
            </div>
        </div>
    );
}
