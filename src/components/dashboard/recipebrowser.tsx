import { createResource, For, Show } from "solid-js";
import Plate from "~/assets/food-plate.jpg";

export default function RecipeBrowser(props: { onSelect: (id: number | null) => void, selected: number | null }) {

    const [headers] = createResource(
        () => typeof window !== "undefined",
        async () => {
            const res = await fetch("/api/recipes");
            return res.json();
        }
    );

    const selectedId = () =>
        props.selected !== null ? Number(props.selected) : null;

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
                                        selectedId() === Number(r.recipe_id)
                                            ? "2px solid #FF6F61"
                                            : "2px solid transparent",
                                }}
                                onClick={() =>
                                    props.onSelect(
                                        selectedId() === Number(r.recipe_id)
                                            ? null
                                            : Number(r.recipe_id)
                                    )
                                }
                            >
                                <img src={r.image_url ? `/api/public-thumbnail?path=${encodeURIComponent(r.image_url)}`: Plate} alt="Recipe preview" />
                                <div class="browsing-item-text">
                                    <h3>{r.recipe_title}</h3>
                                    {r.author_username && <p>{`Author: ${r.author_username}`}</p>}
                                </div>
                            </div>
                        )}
                    </For>
                </Show>
            </div>
        </div>
    );
}
