import { createSignal } from "solid-js";
import "../../styling/dashboard/dashboard-taskbar.css";
import pencil from "~/assets/dashboard/pencil.png";
import globe from "~/assets/dashboard/globe.png";
import tag from "~/assets/dashboard/tag.png";
import markdown from "~/assets/dashboard/markdown.png";
import output from "~/assets/dashboard/output.png";/*export is a reserved word*/
import bin from "~/assets/dashboard/trash-can.png";

export default function TaskBar(){
    return(
        <div class="task-bar">
            <div class="task-bar-buttons">
                <button><img src={pencil}/></button>
                <button><img src={tag}/></button>
                <button><img src={markdown}/></button>
                <button><img src={globe}/></button>
            </div>

            <div class="task-bar-buttons">
                <button><img src={output}/></button>
                <button><img src={bin}/></button>
            </div>
        </div>
    );
}
//TODO on the side-bar where recipes are browsed this needs to be called on the + button at the bottom
//Also there is currently no + button at the bottom
//<button onClick={() => navigate("/add-recipe")}>new recipe</button>