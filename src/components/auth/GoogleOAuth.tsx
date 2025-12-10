import { supabase } from "~/supabase/supabase-client";
import GoogleBtn from "~/assets/web_dark_sq_ctn@2x.png"


export function GoogleOAuth() {

    const continueWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google"
        });


    };

    return (
        <img src={GoogleBtn} onClick={continueWithGoogle} />
    );
}