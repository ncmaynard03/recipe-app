import { json } from '@solidjs/router';
import { RecipeManager } from '~/server/recipeManager';

export async function POST({ request }: { request: Request }) {
    const body = await request.json();
    const rmgr = new RecipeManager();

    try {
        await rmgr.create(body);
        return json({ ok: true });
    } catch (error: any) {
        console.error("Error creating recipe:", error);
        return json({ error: "Failed to save recipe: " + error.message }, { status: 500 });
    }
}

export async function GET() {
    const rmgr = new RecipeManager();
    console.log("Fetching all recipes...");
    try {
        const rs = await rmgr.getAllRecipes();
        console.log(`Fetched ${rs.length} recipes.`);
        for (const r of rs) {
            console.log(`Recipe: ${r.recipe_title}, Prep Time: ${r.prep_time}, Cook Time: ${r.cook_time}`);
        }
        return json(rs || []);
    } catch (error: any) {
        console.error("Error fetching recipes: ", error);
        return json({ error: "Failed to fetch recipes: " + error.message }, { status: 500 });
    }
}