import { supabase } from "./supabase-client";
import { generateRandomUsername } from "~/utils/genRandomUN";

//Checks if the user already exists in Supabase (new or returning user)
export async function ensureUserExists() {
    const userID = await getCurrentUserID()

    if(!userID){
        return null;
    }
    
    const { data: existingUser, error: retrievalErr } = await supabase
    .from("users")
    .select("username")
    .eq("user_id", userID)
    .maybeSingle();

    if (retrievalErr){
        console.log("There was an error contacting Supabase:", retrievalErr.message);
    }

    if (existingUser){
        return existingUser.username;
    }

    const newUserUN = generateRandomUsername();
    const { error: userInsertError } = await supabase
    .from("users")
    .insert({"username": newUserUN, "user_id": userID});

    if (userInsertError){
        console.log("The following error occurred:", userInsertError);
    }
    return newUserUN;
}

//Retrieves username for the current user
export async function getUserName(){
    const userID = await getCurrentUserID();
    const { data: userName} = await supabase
    .from("users")
    .select("username")
    .eq("user_id", userID);

    return userName;
}

//Gets the user ID for the current user
export async function getCurrentUserID(){
    const { data: userData, error } = await supabase.auth.getUser()
    if (error){
        console.log("An error has occurred:", error.message);
        return;
    }

    const userID = userData.user.id;

    if(userData){
        console.log("User found");
    }
    return userID;
}

//Returns a litst of public recipes
export async function getPublicRecipes(){

}

//Returns a list of user-owned recipes
export async function getUserRecipes(){

}