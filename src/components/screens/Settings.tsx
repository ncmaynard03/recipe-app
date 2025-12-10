import "~/styling/screens/settings-screen.css"
import { onMount, createSignal } from "solid-js";
import * as supabaseFn from "~/supabase/supabase-queries";

export default function Settings() {
    const [username, setUsername] = createSignal("");

    onMount(async () => {
        const currUN = await supabaseFn.ensureUserExists();
        setUsername(currUN || "");
    });

    return (
        <div class="settings-page-cont">
            <div class="settings-pane">
                <div class="pane-title-cont">
                    <h2>Account Settings</h2>
                </div>
                <div class="pane-content-cont">
                    <p>Username</p>

                    <input type="text" value={username()} 
                        onInput={(e) => setUsername(e.currentTarget.value)} 
                    />
                    <div class="save-btn">
                        <button
  onClick={async () => {
    try {
      await supabaseFn.updateUsername(username());
      alert("Username updated!");
      // Refresh so settings are reflected everywhere.
      window.location.reload();
    } catch (err) {
  if (err instanceof Error) {
    alert("Failed to update username: " + err.message);
  } else {
    alert("Unknown error");
  }
}
  }}
>
  Save Username
</button>

                    </div>
                    <div class="delete-acct-btn">
                        <button>Delete Account</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
