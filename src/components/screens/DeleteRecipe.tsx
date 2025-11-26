import { createSignal, For, Show, createResource, Suspense } from "solid-js";
import "~/styling/screens/delete-screen.css"
import RecipeBrowser from "../dashboard/recipebrowser";
import WHPhoto from "~/assets/waffle-house-allstarspecial.jpg"

export default function DeleteRecipe() {
    const [selectedIds, setSelectedIds] = createSignal<number[]>([]);

    const [headers] = createResource(
        () => typeof window !== "undefined",
        async () => {
            const res = await fetch("/api/recipes");
            return res.json();
        }
    );

    const selectRecipes = (recipeID: number) => {
        const recipesToDelete = selectedIds();
        let alreadySelected = false;
        let deleteList: number[] = [];

        for (let i = 0; i < recipesToDelete.length; i++){
            if (recipesToDelete[i] === recipeID){
                alreadySelected = true;
            }
            else {
                deleteList.push(recipesToDelete[i]);
            }
        }

        if (!alreadySelected){
            deleteList.push(recipeID)
        }

        setSelectedIds(deleteList);
    };

    return(
    <Suspense fallback={
            <div class="delete-screen-cont">
                <div class="delete-lbl">
                    <p>Choose the Recipe(s) You Wish To Delete</p>
                </div>
                <div class="loading-user-recipe">
                    <p>Loading Recipes...</p>
                </div>
            </div>

    }>
        <div class="delete-screen-cont">
            <div class="delete-lbl">
                <p>Choose the Recipe(s) You Wish To Delete</p>
            </div>

            <div class="user-recipe">
                <For each={headers() || []}>
                    {(r) => {
                        const recipeID = Number(r.recipe_id);

                        return (
                            <div class="recipe-tile" style={{border: selectedIds().includes(recipeID) ? "4px solid red" : "4px solid transparent" }} onClick={() => selectRecipes(recipeID)}>
                                <img src={WHPhoto} alt="Recipe preview" />
                                <h3>{r.recipe_title}</h3>
                            </div>
                        )
                        }
                    }
                </For>
            </div>

            <div class="selected-lbl">
                <p>Recipes Selected: {selectedIds().length}</p>
            </div>

            <div class="btn-cont">
                <div class="clear-select-btn" onClick={() => setSelectedIds([])}>
                    <button>Clear Selection</button>
                </div>

                <div class="delete-recipe-btn">
                    <button>Delete Recipes</button>
                </div>
            </div>
        </div>
    </Suspense>
    );
}