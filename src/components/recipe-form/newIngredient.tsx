export function NewIngredient( props: {
    ingredient: { quantity: string, units: string; ingredientName: string};
    index: number;
    onChange: (index: number, field: "quantity" | "units" | "ingredientName",
               value: string) => void;
    onDelete: (index: number) => void;

}) {
    const { ingredient, index, onChange, onDelete } = props;

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

    return (
        <div class="new-ing-row">
            
            {/*Quantity*/}
            <div class="ing-qty">
                <input type="text" value={ingredient.quantity} placeholder="Qty" onInput={(event) => onChange(index, "quantity", event.currentTarget.value)}/>
            </div>

            {/* Units */}
            <div class="ing-units">
                <select value={ingredient.units} onInput={(event) => onChange(index, "units", event.currentTarget.value)}>
                    <option value="">Unit</option>
                    {usUnitsList.map((units) => (
                        <option value={units.value}>{units.label}</option>
                    ))}
                </select>       
            </div>

            {/* Ingredient Name */}
            <div class="ing-name">
                <input type="text" value={ingredient.ingredientName} placeholder="Ingredient Name" onInput={(event) => onChange(index, "ingredientName", event.currentTarget.value)}/>
            </div>

            {/* Delete button */}
            <div class="delete-btn">
                <button type="button" onClick={() => onDelete(index)}>-</button>
            </div>
        </div>
    );
    
}
