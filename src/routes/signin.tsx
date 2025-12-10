import { Title } from "@solidjs/meta";
import SignInComp from "~/components/auth/SignInComp";
import MainImg from "~/assets/cropped-main.jpg";
import "../styling/login-page/index.css";
import { supabase } from "~/supabase/supabase-client";
import { createSignal, createEffect, onMount, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import type { Session } from "@supabase/supabase-js";

export default function SignInPage() {
    const [session, setSession] = createSignal<Session | null>(null);
    const [loading, setLoading] = createSignal(true);
    const navigate = useNavigate();

    onMount(async () => {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setLoading(false);

        supabase.auth.onAuthStateChange((_event, updatedSession) => {
            setSession(updatedSession);
        });
    });

    // If logged in, redirect to dashboard
    createEffect(() => {
        if (!loading() && session()) {
            navigate("/dashboard");
        }
    });

    return (
        <Show when={!session()} fallback={<p>Redirecting...</p>}>
            <main class="main-page">
                <Title>Capstone Cooking</Title>
                <div class="first-section-cont">
                    <div class="main-page-img">
                        <img src={MainImg} />
                    </div>
                    <div class="page-name-section">
                        <p id="page-name">capstone cooking</p>
                        <div id="signin-with-back-cont">
                            <SignInComp />
                        </div>
                    </div>
                </div>
            </main>
        </Show>
    );
}
