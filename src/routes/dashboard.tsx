import { Title } from "@solidjs/meta";
import { onMount, createSignal } from "solid-js";
import { supabase } from "~/supabase/supabase-client";
import * as supabaseFn from "~/supabase/supabase-queries";

export default function Dashboard() {
    const [username, setUsername] = createSignal("")
  onMount(async () => {
    const currUN = await supabaseFn.ensureUserExists();
    setUsername(currUN);
  });

    
  return (
    <main>
      <Title>My Recipe Box</Title>
      <h4>Dashboard, style as needed, pushed for reroute</h4>
      <h5>Testing: Hello {username()}</h5>
    </main>
    
  );
}
