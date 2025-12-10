import { createSignal, onMount, createEffect, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { supabase } from "~/supabase/supabase-client";
import type { Session } from "@supabase/supabase-js";

// Import your dashboard component
import Dashboard from "~/components/dashboard/Dashboard";

export default function IndexPage() {
  const [session, setSession] = createSignal<Session | null>(null);
  const [loading, setLoading] = createSignal(true);
  const navigate = useNavigate();

  // Load session once page loads
  onMount(async () => {
    const { data } = await supabase.auth.getSession();

    setSession(data.session);
    setLoading(false);

    // Listen to auth state changes
    supabase.auth.onAuthStateChange((_event, updatedSession) => {
      setSession(updatedSession);
    });
  });

  // Redirect if NOT logged in
  createEffect(() => {
    if (!loading() && !session()) {
      navigate("/signin");
    }
  });

  return (
    <Show
      when={!loading() && session()}
      fallback={<p style="padding: 2rem;">Loading...</p>}
    >
      <Dashboard />
    </Show>
  );
}
