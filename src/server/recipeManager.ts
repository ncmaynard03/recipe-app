import { Recipe } from "~/stores/recipes";
import { supabase } from "~/supabase/supabase-client";


export class RecipeManager {
    async create(data: Recipe) {
        const { error } = await supabase.from('recipes').insert({
            author_id: data.author_id,
            recipe_title: data.recipe_title,
            prep_time: data.prep_time,
            cook_time: data.cook_time,
            ingredients: data.ingredients,
            // instructions: data.instructions,
            // notes: data.notes,
            image_url: data.imageUrl
        });

        if (error) { throw error; }
        return true;
    };

    async getAllRecipes() {
        const { data, error } = await supabase.from('recipes').select('*');

        if (error) { throw error; }
        return data || [];
    }
}