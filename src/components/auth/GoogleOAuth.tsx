import { supabase } from "~/supabase/supabase-client";
import "../../styling/google-btn.css"
import GoogleBtn from "~/assets/googlebtn.png"
import {addNewUser} from "~/supabase/supabase-queries";

export function GoogleOAuth(){
    
    const continueWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: "http://localhost:3000/dashboard",
                queryParams: {
                access_type: 'offline',
                prompt: 'consent',
                },
            },
        });

    };

    return (
        <img src={GoogleBtn} onClick={continueWithGoogle}/>
    );
}


