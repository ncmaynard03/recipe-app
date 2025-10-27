import { Title } from "@solidjs/meta";
import { onMount, createSignal } from "solid-js";
import { supabase } from "~/supabase/supabase-client";
import * as supabaseFn from "~/supabase/supabase-queries";
import "../styling/index.css";

export default function Dashboard() {
    const [username, setUsername] = createSignal("")
  onMount(async () => {
    const currUN = await supabaseFn.ensureUserExists();
    setUsername(currUN);
  });

    
//Okay so like this is a mess atm, Ill chop this into components later
  return (
    <main class="dashboard">
      <div class="main-region">
        <div class="recipe-region">
          <div class="recipe-content">
            <div class="recipe-image">
              <img src="/assets/waffle-house-allstarspecial.jpg" alt="TEST" />
            </div>

            <div class="recipe-text">
              <div class="text-toolbar">
                <button>B</button>
                <button>I</button>
                <button>U</button>
              </div>
              <textarea class="recipe-textarea" placeholder="Write your recipe here..."></textarea>
            </div>

            <div class="recipe-card">
              <button>spice level</button>
              <button>why would you need anything but spice level</button>
            </div>
          </div>
        </div>
        

        <div class="task-bar">
          <div class="task-bar-buttons">
            <button>toggle edit</button>
            <button>edit tags</button>
            <button>toggle markdown</button>
            <button>toggle public</button>
          </div>

          <div class="task-bar-buttons">
            <button>export</button>
            <button>delete</button>
          </div>
        </div>
      </div>


      <div class="side-region">
        <div class="search-bar">
        </div>

        <div class="recipe-scrolling">
        </div>
      </div>
    </main>
  );
}
