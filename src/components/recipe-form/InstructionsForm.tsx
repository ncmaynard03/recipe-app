import { createSignal, For, Index } from "solid-js";
import { createStore } from "solid-js/store"
import "../../styling/recipe-form/instructions-form.css"

export function InstructionsForm(){

    // const [instructions, setInstructions] = createSignal([""]);
    const [instructions, setInstructions] = createStore([""]);
    
    function addNewInstruction(){
        setInstructions(instructions.length, "");
    }

    function updateInstruction( index: number, value: string){
        setInstructions(index, value);
    }

    function deleteInstruction(index: number){
        if (instructions.length > 1){
            setInstructions(instructions.filter((_, insIndex) => insIndex !== index));
        }
        else {
            return;
        }
    }

    return(
        <div class="instructions-form">
            <div class="instructions-lbl-cont">
                <label>Recipe Instructions</label>
            </div>

            {/* Creates inital and addtional recipe instructions/steps */}
            <div class="def_ins">
                <div class="ins-block">
                    <Index each={instructions}>
                        {(step, index) => (
                            <div class="new-ins">
                                <textarea placeholder={`Step ${index + 1}`} value={step()} onInput={(event) => updateInstruction(index, event.currentTarget.value)}/>
                                <div class="delete-btn">
                                    <button type="button" onClick={() => deleteInstruction(index)}>-</button>
                                </div>
                            </div>
                        )}
                    </Index>
                </div>
            </div>
            <button id="add-ins-btn" type="button" onClick={addNewInstruction}>+</button>
        </div>
    );

}