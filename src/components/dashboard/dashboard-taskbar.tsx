import { createSignal } from "solid-js";
import "../../styling/dashboard/dashboard-taskbar.css";

export default function TaskBar(){
    return(
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
    );
}
