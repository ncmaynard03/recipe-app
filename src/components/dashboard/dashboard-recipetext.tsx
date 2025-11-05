import "../../styling/dashboard/dashboard-recipeviewer.css";

export default function RecipeText() {
    return (
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
    );
}