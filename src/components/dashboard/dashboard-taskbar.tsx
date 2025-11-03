import { createSignal } from "solid-js";
import "../../styling/dashboard/dashboard-taskbar.css";
<<<<<<< Updated upstream
import { redirect, useNavigate } from "@solidjs/router";
=======
import pencil from "~/assets/dashboard/pencil.png";
import globe from "~/assets/dashboard/globe.png";
import tag from "~/assets/dashboard/tag.png";
import markdown from "~/assets/dashboard/markdown.png";
import output from "~/assets/dashboard/output.png";/*export is a reserved word*/
import bin from "~/assets/dashboard/trash-can.png";
>>>>>>> Stashed changes

export default function TaskBar() {
    const navigate = useNavigate();
    return (
        <div class="task-bar">
<<<<<<< Updated upstream
            <div class="task-bar-buttons" >
                <button onClick={() => navigate("/add-recipe")}>new recipe</button>
                <button>toggle edit</button>
                <button>edit tags</button>
                <button>toggle markdown</button>
                <button>toggle public</button>
                <button>export</button>
                <button>delete</button>
=======
            <div class="task-bar-buttons">
                <button><img src={pencil}/></button>
                <button><img src={tag}/></button>
                <button><img src={markdown}/></button>
                <button><img src={globe}/></button>
            </div>

            <div class="task-bar-buttons">
                <button><img src={output}/></button>
                <button><img src={bin}/></button>
>>>>>>> Stashed changes
            </div>
        </div>
    );
}
