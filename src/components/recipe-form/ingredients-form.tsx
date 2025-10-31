

export function IngredientsForm(){

    async function addNewIngredient(){

    }
    return (
        <div class="ingredients-form">
            <label>Recipe Ingredients</label>
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