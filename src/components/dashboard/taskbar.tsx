import { createSignal } from "solid-js";
import pencil from "~/assets/dashboard/pencil.png";
import globe from "~/assets/dashboard/globe.png";
import tag from "~/assets/dashboard/tag.png";
import markdown from "~/assets/dashboard/markdown.png";
import output from "~/assets/dashboard/output.png";/*export is a reserved word*/
import bin from "~/assets/dashboard/trash-can.png";
import type { ActiveView } from "~/types";

type TBScreens = {
    changeScreenTo: (screen: ActiveView) => void;
};

export default function TaskBar(props: TBScreens ) {
    return (
        <div class="task-bar">
            <div class="task-bar-buttons">
                <button onClick={() => props.changeScreenTo("add")}><img src={pencil} /></button>
                <button><img src={tag} /></button>
                <button onClick={() => props.changeScreenTo("markdown")}><img src={markdown} /></button>
                <button onClick={() => props.changeScreenTo("public")}><img src={globe} /></button>
            </div>

            <div class="task-bar-buttons">
                <button onClick={() => props.changeScreenTo("pdf-export")}><img src={output} /></button>
                <button onClick={() => props.changeScreenTo("delete")}><img src={bin} /></button>
            </div>
        </div>
    );
}

//TODO on the side-bar where recipes are browsed this needs to be called on the + button at the bottom
//Also there is currently no + button at the bottom
//<button onClick={() => navigate("/add-recipe")}>new recipe</button>