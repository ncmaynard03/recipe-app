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

    return(
        <div class="instructions-form">
            <div class="instructions-lbl-cont">
                <label>Recipe Instructions</label>
            </div>

            {/* Creates inital and addtional recipe instructions/steps */}
            <div class="def_ins">
                <Index each={instructions}>
                    {(step, index) => (
                        <textarea placeholder={`Step ${index + 1}`} value={step()} onInput={(event) => updateInstruction(index, event.currentTarget.value)}/>
                    )}
                </Index>

            </div>
            <button id="add-ins-btn" type="button" onClick={addNewInstruction}>+</button>
        </div>
    );

}