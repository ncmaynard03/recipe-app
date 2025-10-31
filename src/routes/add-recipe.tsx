import { Title } from "@solidjs/meta";
import { RecipeForm } from "~/components/recipe-form/recipe-form";


export default function CreateRecipe() {
    return (
        <div class="create-recipe-pane">
            <Title>Create New Recipe</Title>
            <RecipeForm />
        </div>

    );
}
