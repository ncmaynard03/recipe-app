import { createSignal } from "solid-js";
import "../../styling/dashboard/dashboard-taskbar.css";
import { redirect, useNavigate } from "@solidjs/router";

export default function TaskBar() {
    const navigate = useNavigate();
    return (
        <div class="task-bar">
            <div class="task-bar-buttons" >
                <button onClick={() => navigate("/add-recipe")}>new recipe</button>
                <button>toggle edit</button>
                <button>edit tags</button>
                <button>toggle markdown</button>
                <button>toggle public</button>
                <button>export</button>
                <button>delete</button>
            </div>
        </div>
    );
}
