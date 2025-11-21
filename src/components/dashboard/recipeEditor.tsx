import { createStore } from "solid-js/store";
import { createEffect, createSignal } from "solid-js";
import { supabase } from "~/supabase/supabase-client";

export default function RecipeEditor(props: { recipe?: any }) {
    const [form, setForm] = createStore({
        recipe_id: -1,
        author_id: "",
        recipe_title: "",
        prep_time: 0,
        cook_time: 0,
        ingredients: [{ quantity: "", unit: "", ingredientName: "" }],
        contents: "",
        image_url: ""
    });

    const [pendingImage, setPendingImage] = createSignal<File | null>(null);
    const [previewUrl, setPreviewUrl] = createSignal<string | null>(null);

    let fileInputRef: HTMLInputElement | undefined;

    createEffect(() => {
        if (props.recipe) {
            setForm({
                ...props.recipe,
                ingredients:
                    props.recipe.ingredients?.length > 0
                        ? props.recipe.ingredients
                        : [{ quantity: "", unit: "", ingredientName: "" }]
            });
        }
        if (fileInputRef) fileInputRef.value = "";
        setPendingImage(null);
        setPreviewUrl(null);
    });

    function addNewIngredient() {
        setForm("ingredients", [...form.ingredients, { quantity: "", unit: "", ingredientName: "" }]);
    }

    function updateIngredient(index: number, field: "quantity" | "unit" | "ingredientName", value: string) {
        setForm("ingredients", index, field, value);
    }

    function deleteIngredient(index: number) {
        if (form.ingredients.length > 1) {
            setForm("ingredients", form.ingredients.filter((_, i) => i !== index));
        }
    }

    async function submitRecipe(e: Event) {
        e.preventDefault();

        let finalImagePath = form.image_url;

        if (pendingImage()) {
            const file = pendingImage()!;
            const filePath = `uploads/${crypto.randomUUID()}-${file.name}`;

            const { error } = await supabase.storage
                .from("recipe_thumbnails")
                .upload(filePath, file, { upsert: false });

            if (!error) {
                finalImagePath = filePath;
            }
        }

        const send = {
            recipe_id: form.recipe_id,
            recipe_title: form.recipe_title,
            prep_time: form.prep_time,
            cook_time: form.cook_time,
            ingredients: form.ingredients,
            contents: form.contents,
            image_url: finalImagePath
        };

        await fetch("/api/recipes", {
            method: "POST",
            body: JSON.stringify(send),
            headers: { "Content-Type": "application/json" }
        });

        setPendingImage(null);
        setPreviewUrl(null);
    }

    function publicUrl(path: string | null) {
        if (!path) return null;
        return supabase.storage.from("recipe_thumbnails").getPublicUrl(path).data.publicUrl;
    }

    function handleFileSelect(e: Event) {
        const input = e.target as HTMLInputElement;
        const f = input.files?.[0];
        if (!f) return;

        setPendingImage(f);
        setPreviewUrl(URL.createObjectURL(f));
    }

    return (
        <div class="recipe-viewer">
            <div class="recipe-content">
                <input
                    id="form-title"
                    name="recipe_title"
                    type="text"
                    value={form.recipe_title}
                    onInput={(e) => setForm("recipe_title", e.currentTarget.value)}
                    placeholder="Recipe Title"
                />

                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                    />

                    {previewUrl() ? (
                        <img
                            src={previewUrl()!}
                            class="recipe-thumbnail"
                            style="margin-top: 1rem;"
                        />
                    ) : form.image_url ? (
                        <img
                            src={publicUrl(form.image_url) || ""}
                            class="recipe-thumbnail"
                            style="margin-top: 1rem;"
                        />
                    ) : null}
                </div>

                <div class="recipe-card">
                    <div class="recipe-card-contents">
                        <div class="time-fields">
                            <div class="prep-time">
                                <label for="prep_time">
                                    {"Prep Time: "}
                                    <input
                                        id="prep_time"
                                        name="prep_time"
                                        type="text"
                                        value={form.prep_time}
                                        onInput={(e) => setForm("prep_time", parseInt(e.currentTarget.value))}
                                    />
                                    {" mins"}
                                </label>
                            </div>

                            <div class="cook-time">
                                <label for="cook_time">
                                    {"Cook Time: "}
                                    <input
                                        id="cook_time"
                                        name="cook_time"
                                        type="text"
                                        value={form.cook_time}
                                        onInput={(e) => setForm("cook_time", parseInt(e.currentTarget.value))}
                                    />
                                    {" mins"}
                                </label>
                            </div>
                        </div>

                        <div class="ingredients-section">
                            <div class="ing-lbl-cont">
                                <label>Recipe Ingredients</label>
                                {form.ingredients.map((ing, index) => (
                                    <div class="ingredient-row">
                                        <input
                                            id={`qty_${index}`}
                                            name={`qty_${index}`}
                                            type="text"
                                            value={ing.quantity}
                                            placeholder="Qty"
                                            onInput={(e) => updateIngredient(index, "quantity", e.target.value)}
                                        />
                                        <select
                                            id={`unit_${index}`}
                                            name={`unit_${index}`}
                                            value={ing.unit}
                                            onInput={(e) => updateIngredient(index, "unit", e.currentTarget.value)}
                                        >
                                            <option value="">Unit</option>
                                            {[
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
                                                { value: "packet", label: "packet" }
                                            ].map((unit) => (
                                                <option value={unit.value}>{unit.label}</option>
                                            ))}
                                        </select>
                                        <input
                                            id={`name_${index}`}
                                            name={`name_${index}`}
                                            type="text"
                                            value={ing.ingredientName}
                                            placeholder="Ingredient Name"
                                            onInput={(e) => updateIngredient(index, "ingredientName", e.target.value)}
                                        />
                                        <button class="delete-btn" onClick={() => deleteIngredient(index)}>
                                            -
                                        </button>
                                    </div>
                                ))}
                                <button onClick={addNewIngredient}>+</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="recipe-text">
                    <textarea
                        id="contents"
                        name="contents"
                        class="recipe-text-textarea"
                        value={form.contents}
                        onInput={(e) => setForm("contents", e.currentTarget.value)}
                        placeholder="Write your recipe here..."
                    />
                </div>

                <button onClick={submitRecipe}>Save Recipe</button>
            </div>
        </div>
    );
}
