import { supabase } from "~/supabase";
import "../../styling/google-btn.css"
import GoogleBtn from "~/assets/googlebtn.png"

export function GoogleOAuth(){
    
    const continueWithGoogle = async () => {
        const { data } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: "http://localhost:3000/about",
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


