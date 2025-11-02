import { createSignal, For } from "solid-js";
import "../../styling/recipe-form/instructions-form.css"

export function InstructionsForm(){

    const [instructions, setInstructions] = createSignal([""]);
    
    function addNewInstruction(){
        setInstructions([...instructions(), ""]);
    }

    function updateInstruction( index: number, value: string){
        const updatedIns = [...instructions()];
        updatedIns[index] = value;
        setInstructions(updatedIns);
    }

    return(
        <div class="instructions-form">
            <div class="instructions-lbl-cont">
                <label>Recipe Instructions</label>
            </div>

            {/* Creates inital and addtional recipe instructions/steps */}
            <div class="def_ins">
                <For each={instructions()}>
                    {(step, index) => (
                        <textarea placeholder={`Step ${index() + 1}`} value={step} onInput={(event) => updateInstruction(index(), event.currentTarget.value)}/>
                    )}
                </For>

            </div>
            <button id="add-ins-btn" type="button" onClick={addNewInstruction}>+</button>
        </div>
    );

}