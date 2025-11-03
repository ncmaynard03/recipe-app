import { json } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { RecipeManager } from "~/server/recipeManager";
import { supabase } from "~/supabase/supabase-client";


export interface Recipe {
    author_id: string,
    recipe_title: string,
    prep_time: number, // in minutes
    cook_time: number, // in minutes
    ingredients: { quantity: string, unit: string, ingredientName: string }[],
    // instructions: string[],
    // notes?: string,
    imageUrl?: string
}

export async function loadAllRecipes() {
    console.log("Loading all recipes from API...");
    const rs = await fetch('/api/recipes');
    setRecipes(await rs.json());
    console.log(recipes);
    return JSON.stringify(rs);
}

export const [recipes, setRecipes] = createStore<Recipe[]>([]);

export const [selectedRecipe, setSelectedRecipe] = createStore<Recipe>({
    author_id: '',
    recipe_title: '',
    prep_time: 0,
    cook_time: 0,
    ingredients: []
});
