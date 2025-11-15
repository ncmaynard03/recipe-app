import { supabase } from "~/supabase/supabase-client";

interface RecipeHeader {
    recipe_id: number;
    author_id: string;
    recipe_title: string;
    image_url?: string;
}

interface FullRecipe extends RecipeHeader {
    prep_time: number;
    cook_time: number;
    ingredients: { quantity: string, unit: string, ingredientName: string }[];
    contents?: string;
}

export class RecipeManager {

    // -- CACHES -- stores data as it is pulled from database, reduces DB calls
    #headers = new Map<number, RecipeHeader>();
    #recipes = new Map<number, FullRecipe>();

    async create(data: FullRecipe) {
        console.log(`RMGR: Creating recipe \"${data.recipe_title}\"`);
        const { error } = await supabase.from('recipes').insert({
            author_id: data.author_id,
            recipe_title: data.recipe_title,
            prep_time: data.prep_time,
            cook_time: data.cook_time,
            ingredients: data.ingredients,
            image_url: data.image_url,
            // instructions: data.instructions,
            // notes: data.notes,
        });

        if (error) { throw error; }
        return true;
    };

    async update(id: number, data: FullRecipe) {
        console.log(`RMGR: updating recipe ${id}`);
        console.log("RMGR UPDATE CALLED");
        console.log("Passed ID:", id, "typeof:", typeof id);
        console.log("Numeric ID:", Number(id));
        console.log("Incoming update payload:", data);

        const updateData = {
            recipe_title: data.recipe_title,
            prep_time: data.prep_time,
            cook_time: data.cook_time,
            ingredients: data.ingredients,
            contents: data.contents,
            image_url: data.image_url,
        };

        const { data: updated, error } = await supabase
            .from("recipes")
            .update(updateData)
            .eq("recipe_id", Number(id))
            .select();

        console.log("UPDATED ROW:", updated);
        if (error) throw error;
    }





    // -- HEADER INFO ONLY -- basic data to display within browser
    async getAllLocalRecipeHeaders(force = false): Promise<RecipeHeader[]> {
        if (!force && this.#headers.size > 0) {
            return Array.from(this.#headers.values());
        }

        const { data, error } = await supabase
            .from("recipes")
            .select("recipe_id, author_id, recipe_title, image_url");

        if (error) throw error;
        if (!data) return [];

        data.forEach((r) => this.#headers.set(r.recipe_id, r));
        return data;
    }

    // -- FULL RECIPE -- full recipe for editing/viewing 
    async getRecipeById(id: number, force = false): Promise<FullRecipe | null> {
        if (!force && this.#recipes.has(id)) {
            console.log(`RMGR: Found cached recipe ${id}`);
            return this.#recipes.get(id)!;
        }
        if (force) {
            console.log(`RMGR: Forcing reload of recipe ${id}`);
        } else {
            console.log(`RMGR: Loading recipe ${id} from database`);
        }

        const { data, error } = await supabase
            .from("recipes")
            .select("*")
            .eq("recipe_id", Number(id))
            .single();

        if (error) throw error;
        if (!data) return null;

        this.#recipes.set(id, data);
        return data;
    }

    async getAllRecipes() {
        const { data, error } = await supabase.from('recipes').select('*');

        if (error) { throw error; }
        return data || [];
    }

}