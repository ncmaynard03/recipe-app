import { supabase } from "./supabase-client";

type RecipeInput = {
    recipe_id?: number;
    author_id?: string;
    recipe_title: string;
    prep_time: number;
    cook_time: number;
    servings: number;
    ingredients: { quantity: string; unit: string; ingredientName: string }[];
    contents?: string;
    image_url?: string;
    is_public?: boolean;
};

export type RecipeWithAuthor = {
    recipe_id: number;
    author_id: string;
    recipe_title: string;
    image_url?: string | null;
    author_username?: string | null;
    is_public?: boolean | null;
    servings?: number | null;
    ingredients?: RecipeInput["ingredients"];
    contents?: string | null;
    created_at?: string | null;
};

export function getPublicThumbnailUrl(path?: string | null) {
    if (!path) return null;
    return supabase.storage.from("recipe_thumbnails").getPublicUrl(path).data.publicUrl;
}

export async function fetchRecipesWithUser(authorId?: string) {
    let query = supabase.from("recipes_with_username").select("*");

    if (authorId) {
        query = query.eq("author_id", authorId);
    }

    const { data, error } = await query.order("recipe_title", { ascending: true });
    if (error) throw error;
    return data ?? [];
}

export async function fetchAllRecipes() {
    return fetchRecipesWithUser();
}

export async function fetchRecipeById(id: number) {
    const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("recipe_id", Number(id))
        .maybeSingle();

    if (error) throw error;
    return data ?? null;
}

export async function fetchSavedRecipes(userId: string) {
    const { data: savedRows, error: savedErr } = await supabase
        .from("saved_recipes")
        .select("recipe_id")
        .eq("user_id", userId);

    if (savedErr) throw savedErr;

    const recipeIds = savedRows?.map((r) => r.recipe_id).filter(Boolean) ?? [];
    if (recipeIds.length === 0) return [];

    const { data, error } = await supabase
        .from("recipes_with_username")
        .select("*")
        .in("recipe_id", recipeIds);

    if (error) throw error;
    return data ?? [];
}

export async function toggleSavedRecipe(userId: string, recipeId: number, save: boolean) {
    if (save) {
        const { error } = await supabase
            .from("saved_recipes")
            .upsert({ user_id: userId, recipe_id: recipeId }, { onConflict: "user_id,recipe_id" });

        if (error) throw error;
        return true;
    }

    const { error } = await supabase
        .from("saved_recipes")
        .delete()
        .eq("user_id", userId)
        .eq("recipe_id", recipeId);

    if (error) throw error;
    return false;
}

export async function saveRecipe(input: RecipeInput) {
    const recipeId = Number.isFinite(input.recipe_id) ? Number(input.recipe_id) : undefined;
    const { data: userData } = await supabase.auth.getUser();
    const authorId = input.author_id || userData.user?.id;

    const payload = {
        author_id: authorId,
        recipe_title: input.recipe_title,
        prep_time: input.prep_time,
        cook_time: input.cook_time,
        servings: input.servings,
        ingredients: input.ingredients,
        contents: input.contents,
        image_url: input.image_url,
        is_public: Boolean(input.is_public),
    };

    if (recipeId) {
        const { data, error } = await supabase
            .from("recipes")
            .update(payload)
            .eq("recipe_id", recipeId)
            .select()
            .maybeSingle();

        if (error) throw error;
        return data ?? null;
    }

    if (!authorId) {
        throw new Error("Missing author ID; please sign in again.");
    }

    const { data, error } = await supabase
        .from("recipes")
        .insert({ ...payload, author_id: authorId })
        .select()
        .maybeSingle();

    if (error) throw error;
    return data ?? null;
}
