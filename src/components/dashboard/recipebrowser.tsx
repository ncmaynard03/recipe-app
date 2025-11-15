import { createResource, For, Show } from "solid-js";
import "../../styling/dashboard/dashboard-recipebrowser.css";
import WHPhoto from "~/assets/dashboard/waffle-house-allstarspecial.jpg";

export default function RecipeBrowser(props: { onSelect: (id: string | null) => void, selected: number | null }) {

    const [headers] = createResource(
        () => typeof window !== "undefined",
        async () => {
            const res = await fetch("/api/recipes");
            return res.json();
        }
    );


    return (
        <div class="browsing-container">
            <div class="browsing-container-content">
                <Show when={headers()} fallback={<div>Loading Recipes...</div>}>
                    <For each={headers()}>
                        {(r) => (
                            <div
                                class="browsing-item-content"
                                style={{
                                    border:
                                        r.recipe_id === props.selected
                                            ? "2px solid #FF6F61"
                                            : "2px solid transparent",
                                }}
                                onClick={() =>
                                    props.onSelect(
                                        r.recipe_id === props.selected ? null : r.recipe_id
                                    )
                                }
                            >
                                <img src={WHPhoto} alt="Recipe preview" />
                                <div class="browsing-item-text">
                                    <h3>{r.recipe_title}</h3>
                                    <p>{r.author_id}</p>
                                </div>
                            </div>
                        )}
                    </For>
                </Show>
            </div>
        </div>
    );
}
