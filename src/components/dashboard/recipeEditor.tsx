import { createStore } from "solid-js/store";
import { createEffect, createMemo, createSignal, For, Show } from "solid-js";
import { supabase } from "~/supabase/supabase-client";
import { saveRecipe } from "~/supabase/recipe-client";
import MarkdownIt from "markdown-it";
import "~/styling/recipe-editor.css";

const [unitsList, setUnitsList] = createSignal<"us" | "metric">("us");
const md = new MarkdownIt({
    html: false,
    breaks: true,
    linkify: true
});

const usUnitsList = [
    { value: "pounds", label: "lb(s)" },
    { value: "ounces", label: "oz" },
    { value: "gallons", label: "gal(s)" },
    { value: "quarts", label: "qt(s)" },
    { value: "pints", label: "pt(s)" },
    { value: "cups", label: "cup(s)" },
    { value: "fluid-ounces", label: "fl. oz" },
    { value: "tablespoons", label: "tbsp(s)" },
    { value: "teaspoons", label: "tsp(s)" },
    { value: "pinch", label: "pinch" },
    { value: "box", label: "box" },
    { value: "can", label: "can" },
    { value: "packet", label: "packet" }
];

const metricUnitsList = [
    { value: "grams", label: "g" },
    { value: "kilograms", label: "kg" },
    { value: "milliliters", label: "ml" },
    { value: "liters", label: "L" },
    { value: "pinch", label: "pinch" },
    { value: "box", label: "box" },
    { value: "can", label: "can" },
    { value: "packet", label: "packet" }
];


function selectUnits() {
    switch (unitsList()) {
        case "us":
            return usUnitsList;
        case "metric":
            return metricUnitsList;
        default:
            return usUnitsList;
    }
}

export default function RecipeEditor(props: { recipe?: any, onSaveSuccess?: () => void }) {
    const emptyForm = {
        recipe_id: NaN,
        author_id: "",
        recipe_title: "",
        prep_time: 0,
        cook_time: 0,
        servings: 0,
        ingredients: [{ quantity: "", unit: "", ingredientName: "" }],
        contents: "",
        image_url: "",
        is_public: false
    };

    const [form, setForm] = createStore(structuredClone(emptyForm));
    const [initialForm, setInitialForm] = createStore(structuredClone(emptyForm));

    const [pendingImage, setPendingImage] = createSignal<File | null>(null);
    const [previewUrl, setPreviewUrl] = createSignal<string | null>(null);
    const [viewMode, setViewMode] = createSignal<"plain" | "preview" | "split">("split");

    let fileInputRef: HTMLInputElement | undefined;

    function cloneRecipeState(recipe?: any) {
        const normalized = recipe
            ? {
                recipe_id: Number.isFinite(recipe.recipe_id) ? recipe.recipe_id : -1,
                author_id: recipe.author_id ?? "",
                recipe_title: recipe.recipe_title ?? "",
                prep_time: Number.isFinite(recipe.prep_time) ? recipe.prep_time : 0,
                cook_time: Number.isFinite(recipe.cook_time) ? recipe.cook_time : 0,
                servings: Number.isFinite(recipe.servings) ? recipe.servings : 0,
                ingredients:
                    recipe.ingredients?.length > 0
                        ? recipe.ingredients.map((ing: any) => ({
                            quantity: ing.quantity ?? "",
                            unit: ing.unit ?? "",
                            ingredientName: ing.ingredientName ?? ""
                        }))
                        : structuredClone(emptyForm.ingredients),
                contents: recipe.contents ?? "",
                image_url: recipe.image_url ?? "",
                is_public: Boolean(recipe.is_public)
            }
            : structuredClone(emptyForm);

        return structuredClone(normalized);
    }

    function markSavedState(snapshot: typeof form) {
        setInitialForm(snapshot);
    }

    function isDirty(path: (string | number)[]) {
        const getValue = (obj: any, p: (string | number)[]) =>
            p.reduce((acc, key) => (acc === undefined ? acc : acc[key]), obj);

        const current = getValue(form, path);
        const initial = getValue(initialForm, path);
        return current !== initial;
    }

    createEffect(() => {
        const next = cloneRecipeState(props.recipe);
        setForm(next);
        markSavedState(next);
        if (fileInputRef) fileInputRef.value = "";
        setPendingImage(null);
        setPreviewUrl(null);
    });

    function addNewIngredient() {
        setForm("ingredients", [...form.ingredients, { quantity: "", unit: "", ingredientName: "" }]);
    }

    function updateIngredient(index: number, field: "quantity" | "unit" | "ingredientName", value: string) {
        setForm("ingredients", index, field, value);
    }

    function deleteIngredient(index: number) {
        if (form.ingredients.length > 1) {
            setForm("ingredients", form.ingredients.filter((_, i) => i !== index));
        }
    }

    async function submitRecipe(e: Event) {
        e.preventDefault();

        let finalImagePath = form.image_url;

        if (pendingImage()) {
            const file = pendingImage()!;
            const filePath = `uploads/${crypto.randomUUID()}-${file.name}`;

            const { error } = await supabase.storage
                .from("recipe_thumbnails")
                .upload(filePath, file, { upsert: false });

            if (!error) {
                finalImagePath = filePath;
            }
        }

        const send = {
            recipe_title: form.recipe_title,
            prep_time: Number.isFinite(form.prep_time) ? form.prep_time : 0,
            cook_time: Number.isFinite(form.cook_time) ? form.cook_time : 0,
            servings: Number.isFinite(form.servings) ? form.servings : 0,
            ingredients: form.ingredients,
            contents: form.contents,
            image_url: finalImagePath,
            is_public: Boolean(form.is_public)
        };

        const saved = await saveRecipe({
            ...send,
            recipe_id: Number.isFinite(form.recipe_id) ? Number(form.recipe_id) : undefined,
            author_id: form.author_id
        });

        if (saved?.recipe_id && saved.recipe_id !== form.recipe_id) {
            setForm("recipe_id", saved.recipe_id);
        }

        setPendingImage(null);
        setPreviewUrl(null);
        markSavedState(cloneRecipeState(saved ?? { ...form, image_url: finalImagePath, recipe_id: form.recipe_id }));
        props.onSaveSuccess?.();
    }



    function TitleSection() {
        return (
            <input
                id="form-title"
                name="recipe_title"
                type="text"
                value={form.recipe_title}
                classList={{ "dirty-input": isDirty(["recipe_title"]) }}
                onInput={(e) => setForm("recipe_title", e.currentTarget.value)}
                placeholder="Recipe Title"
            />
        );
    }

    function ThumbnailSection() {

        function publicUrl(path: string | null) {
            if (!path) return null;
            return supabase.storage.from("recipe_thumbnails").getPublicUrl(path).data.publicUrl;
        }

        function handleFileSelect(e: Event) {
            const input = e.target as HTMLInputElement;
            const f = input.files?.[0];
            if (!f) return;

            setPendingImage(f);
            setPreviewUrl(URL.createObjectURL(f));
        }

        return (
            <div>
                {previewUrl() ? (
                    <img
                        src={previewUrl()!}
                        class="recipe-thumbnail"
                        style="margin-top: 1rem;"
                    />
                ) : form.image_url ? (
                    <img
                        src={publicUrl(form.image_url) || ""}
                        class="recipe-thumbnail"
                        style="margin-top: 1rem;"
                    />
                ) : null}

                <div class="image-upload">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                    />
                </div>
            </div>
        );
    }

    function RecipeCardSection() {
        return (
            <div class="recipe-card">
                <div class="recipe-card-contents">

                    {/*Publicity Toggle*/}
                    <label class="toggle-cont">
                        <input
                            type="checkbox"
                            checked={form.is_public}
                            classList={{ "dirty-input": isDirty(["is_public"]) }}
                            onChange={(e) => setForm("is_public", e.currentTarget.checked)}
                        />
                        <span class="toggle">
                            <span class="toggle-text private">Private</span>
                            <span class="toggle-text public">Public</span>
                        </span>
                    </label>

                    <div class="serving-size">
                        <label>Servings: </label>
                        <input
                            id="serving-size"
                            type='text'
                            value={form.servings}
                            classList={{ "dirty-input": isDirty(["servings"]) }}
                            onInput={(e) =>
                                setForm(
                                    "servings",
                                    Number.isNaN(parseInt(e.currentTarget.value))
                                        ? 0
                                        : parseInt(e.currentTarget.value)
                                )
                            }
                        />
                    </div>

                    <div class="time-fields">
                        <div class="prep-time">
                            <label for="prep_time">
                                {"Prep Time: "}
                                <input
                                    id="prep_time"
                                    name="prep_time"
                                    type="text"
                                    value={form.prep_time}
                                    classList={{ "dirty-input": isDirty(["prep_time"]) }}
                                    onInput={(e) =>
                                        setForm(
                                            "prep_time",
                                            Number.isNaN(parseInt(e.currentTarget.value))
                                                ? 0
                                                : parseInt(e.currentTarget.value)
                                        )
                                    }
                                />
                                {" mins"}
                            </label>
                        </div>

                        <div class="cook-time">
                            <label for="cook_time">
                                {"Cook Time: "}
                                <input
                                    id="cook_time"
                                    name="cook_time"
                                    type="text"
                                    value={form.cook_time}
                                    classList={{ "dirty-input": isDirty(["cook_time"]) }}
                                    onInput={(e) =>
                                        setForm(
                                            "cook_time",
                                            Number.isNaN(parseInt(e.currentTarget.value))
                                                ? 0
                                                : parseInt(e.currentTarget.value)
                                        )
                                    }
                                />
                                {" mins"}
                            </label>
                        </div>
                    </div>

                    <div class="unit-sys-toggle">
                        <label><input type="radio" checked={unitsList() == "us"} onChange={() => setUnitsList("us")} />US Customary</label>
                        <label><input type="radio" checked={unitsList() == "metric"} onChange={() => setUnitsList("metric")} />Metric</label>
                    </div>

                    <div class="ingredients-section">
                        <div class="ing-lbl-cont">
                            <label>Recipe Ingredients</label>
                            {form.ingredients.map((ing, index) => (
                                <div class="ingredient-row">
                                    <input
                                        id={`qty_${index}`}
                                        name={`qty_${index}`}
                                        type="text"
                                        value={ing.quantity}
                                        placeholder="Qty"
                                        classList={{ "dirty-input": isDirty(["ingredients", index, "quantity"]) }}
                                        onInput={(e) => updateIngredient(index, "quantity", e.target.value)}
                                    />
                                    <select
                                        id={`unit_${index}`}
                                        name={`unit_${index}`}
                                        value={ing.unit}
                                        classList={{ "dirty-input": isDirty(["ingredients", index, "unit"]) }}
                                        onInput={(e) => updateIngredient(index, "unit", e.currentTarget.value)}
                                    >
                                        <option value="">Unit</option>
                                        {selectUnits().map((unit) => (
                                            <option value={unit.value}>{unit.label}</option>
                                        ))}
                                    </select>
                                    <input
                                        id={`name_${index}`}
                                        name={`name_${index}`}
                                        type="text"
                                        value={ing.ingredientName}
                                        placeholder="Ingredient Name"
                                        classList={{ "dirty-input": isDirty(["ingredients", index, "ingredientName"]) }}
                                        onInput={(e) => updateIngredient(index, "ingredientName", e.target.value)}
                                    />
                                    <button class="delete-btn" onClick={() => deleteIngredient(index)}>
                                        -
                                    </button>
                                </div>
                            ))}
                            <button onClick={addNewIngredient}>+</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function MarkdownEditorSection() {
        const [tagHighlights, setTagHighlights] = createSignal<{ start: number; end: number }[]>([]);
        const [highlightScroll, setHighlightScroll] = createSignal({ top: 0, left: 0 });
        const previewHtml = createMemo(() => md.render(form.contents || ""));

        type TextRange = { start: number; end: number };
        type TagMatch = { startTag: TextRange; endTag: TextRange; body: TextRange };

        let contentsInputRef: HTMLTextAreaElement | undefined;

        function clampSelectionRange(text: string, start?: number | null, end?: number | null): TextRange {
            const len = text.length;
            const safeStart = Math.max(0, Math.min(start ?? 0, len));
            const safeEnd = Math.max(0, Math.min(end ?? safeStart, len));
            return safeStart <= safeEnd
                ? { start: safeStart, end: safeEnd }
                : { start: safeEnd, end: safeStart };
        }

        function findTagPairs(text: string): TagMatch[] {
            const matches: TagMatch[] = [];
            for (const m of text.matchAll(/\*\*([\s\S]*?)\*\*/g)) {
                const start = m.index ?? 0;
                const fullLen = m[0].length;
                const openEnd = start + 2;
                const closeStart = start + fullLen - 2;
                matches.push({
                    startTag: { start, end: openEnd },
                    endTag: { start: closeStart, end: closeStart + 2 },
                    body: { start: openEnd, end: closeStart }
                });
            }

            for (const m of text.matchAll(/(?<![\w])_([\s\S]*?)_(?![\w])/g)) {
                const start = m.index ?? 0;
                const fullLen = m[0].length;
                const openEnd = start + 1;
                const closeStart = start + fullLen - 1;
                matches.push({
                    startTag: { start, end: openEnd },
                    endTag: { start: closeStart, end: closeStart + 1 },
                    body: { start: openEnd, end: closeStart }
                });
            }

            return matches;
        }

        function rangesOverlap(a: TextRange, b: TextRange) {
            return a.start < b.end && a.end > b.start;
        }

        function containsInclusive(range: TextRange, pos: number) {
            return pos >= range.start && pos <= range.end;
        }

        function findActiveTagRanges(text: string, selection: TextRange): TextRange[] {
            const pairs = findTagPairs(text);
            let best: TagMatch | null = null;

            for (const pair of pairs) {
                const touchesTags = rangesOverlap(selection, pair.startTag) || rangesOverlap(selection, pair.endTag);
                const selectionInsideBody =
                    selection.start !== selection.end && rangesOverlap(selection, pair.body);
                const cursorInsideBody =
                    selection.start === selection.end && containsInclusive(pair.body, selection.start);
                const cursorNextToTag =
                    selection.start === selection.end &&
                    (selection.start === pair.startTag.start ||
                        selection.start === pair.startTag.end ||
                        selection.start === pair.endTag.start ||
                        selection.start === pair.endTag.end);

                if (touchesTags || selectionInsideBody || cursorInsideBody || cursorNextToTag) {
                    if (!best || pair.body.end - pair.body.start < best.body.end - best.body.start) {
                        best = pair;
                    }
                }
            }

            return best ? [best.startTag, best.endTag] : [];
        }

        function recomputeTagHighlights() {
            const el = contentsInputRef;
            const text = form.contents || "";
            if (!el) {
                setTagHighlights([]);
                return;
            }

            const selection = clampSelectionRange(text, el.selectionStart, el.selectionEnd);
            setTagHighlights(findActiveTagRanges(text, selection));
        }

        const highlightSegments = createMemo(() => {
            const text = form.contents || "";
            const ranges = [...tagHighlights()]
                .map((r) => ({
                    start: Math.max(0, Math.min(r.start, text.length)),
                    end: Math.max(0, Math.min(r.end, text.length))
                }))
                .filter((r) => r.end > r.start)
                .sort((a, b) => a.start - b.start);

            const segments: { text: string; highlight: boolean }[] = [];
            let cursor = 0;

            for (const range of ranges) {
                if (range.start > cursor) {
                    segments.push({ text: text.slice(cursor, range.start), highlight: false });
                }
                segments.push({ text: text.slice(range.start, range.end), highlight: true });
                cursor = range.end;
            }

            if (cursor < text.length) {
                segments.push({ text: text.slice(cursor), highlight: false });
            }

            if (segments.length === 0) {
                segments.push({ text: text || " ", highlight: false });
            }

            return segments;
        });

        function syncHighlightScroll() {
            if (!contentsInputRef) return;
            setHighlightScroll({
                top: contentsInputRef.scrollTop,
                left: contentsInputRef.scrollLeft
            });
        }

        function toggleWrap(prefix: string, suffix = prefix, opts: { trimEdges?: boolean } = {}) {
            const el = contentsInputRef;
            if (!el) return;

            const { selectionStart, selectionEnd, value } = el;
            if (selectionStart === null || selectionEnd === null) return;
            if (selectionStart === selectionEnd) return; // do nothing without a selection

            let selStart = selectionStart;
            let selEnd = selectionEnd;

            if (opts.trimEdges) {
                while (selStart < selEnd && /\s/.test(value[selStart])) selStart++;
                while (selEnd > selStart && /\s/.test(value[selEnd - 1])) selEnd--;
            }

            if (selStart === selEnd) return; // selection was only whitespace

            const selected = value.slice(selStart, selEnd);
            const before = value.slice(0, selStart);
            const after = value.slice(selEnd);

            const adjacentWrapped =
                selStart >= prefix.length &&
                selEnd + suffix.length <= value.length &&
                value.slice(selStart - prefix.length, selStart) === prefix &&
                value.slice(selEnd, selEnd + suffix.length) === suffix;

            const enclosingWrapped = (() => {
                const open = value.lastIndexOf(prefix, Math.max(0, selStart - prefix.length));
                if (open < 0) return null;
                const close = value.indexOf(suffix, Math.max(selEnd, open + prefix.length));
                if (close < 0) return null;
                if (open <= selStart && close >= selEnd) {
                    return { open, close };
                }
                return null;
            })();

            const innerWrapped =
                selected.startsWith(prefix) &&
                selected.endsWith(suffix) &&
                selected.length >= prefix.length + suffix.length;

            let nextValue = value;
            let nextStart = selectionStart;
            let nextEnd = selectionEnd;

            if (adjacentWrapped || enclosingWrapped) {
                // Remove wrapper that surrounds the selection (adjacent or enclosing)
                const wrapStart = adjacentWrapped ? selStart - prefix.length : enclosingWrapped!.open;
                const wrapEnd = adjacentWrapped ? selEnd + suffix.length : enclosingWrapped!.close + suffix.length;
                nextValue = value.slice(0, wrapStart) + value.slice(wrapStart + prefix.length, wrapEnd - suffix.length) + value.slice(wrapEnd);
                const offset = prefix.length;
                nextStart = selectionStart - offset;
                nextEnd = selectionEnd - offset;
            } else if (innerWrapped) {
                // Remove wrapper included in selection
                const inner = selected.slice(prefix.length, selected.length - suffix.length);
                nextValue = before + inner + after;
                nextStart = selStart;
                nextEnd = selStart + inner.length;
            } else {
                // Add wrapper
                nextValue = before + prefix + selected + suffix + after;
                nextStart = selStart + prefix.length;
                nextEnd = nextStart + selected.length;
            }

            setForm("contents", nextValue);

            queueMicrotask(() => {
                el.focus();
                el.setSelectionRange(nextStart, nextEnd);
                recomputeTagHighlights();
            });
        }

        createEffect(() => {
            form.contents;
            queueMicrotask(recomputeTagHighlights);
        });

        return (
            <div
                class="recipe-text"
                classList={{ "md-wide": viewMode() === "split" }}
            >
                <div class="md-header-row">
                    <p>Markdown Editor</p>
                    <div class="md-controls">
                        <div class="md-mode-toggle">
                            <button
                                type="button"
                                classList={{ active: viewMode() === "plain" }}
                                onClick={() => setViewMode("plain")}
                            >
                                Plain
                            </button>
                            <button
                                type="button"
                                classList={{ active: viewMode() === "preview" }}
                                onClick={() => setViewMode("preview")}
                            >
                                Preview
                            </button>
                            <button
                                type="button"
                                classList={{ active: viewMode() === "split" }}
                                onClick={() => setViewMode("split")}
                            >
                                Both
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    class="md-editor"
                    classList={{
                        "mode-plain": viewMode() === "plain",
                        "mode-preview": viewMode() === "preview"
                    }}
                >
                    <Show when={viewMode() !== "preview"}>
                        <div class="md-input">
                            <div class="md-input-row">
                                <div class="md-textarea-stack">
                                    <div class="md-highlights" aria-hidden="true">
                                        <div
                                            class="md-highlights-content"
                                            style={{
                                                transform: `translate(${-highlightScroll().left}px, ${-highlightScroll().top}px)`
                                            }}
                                        >
                                            <For each={highlightSegments()}>
                                                {(segment) =>
                                                    segment.highlight ? (
                                                        <mark class="md-tag-highlight">
                                                            {segment.text || "\u00A0"}
                                                        </mark>
                                                    ) : (
                                                        segment.text || "\u00A0"
                                                    )
                                                }
                                            </For>
                                        </div>
                                    </div>
                                    <textarea
                                        id="contents"
                                        name="contents"
                                        ref={(el) => {
                                            contentsInputRef = el;
                                            queueMicrotask(() => {
                                                syncHighlightScroll();
                                                recomputeTagHighlights();
                                            });
                                        }}
                                        class="recipe-text-textarea"
                                        classList={{ "dirty-input": isDirty(["contents"]) }}
                                        value={form.contents}
                                        onInput={(e) => {
                                            setForm("contents", e.currentTarget.value);
                                            queueMicrotask(recomputeTagHighlights);
                                        }}
                                        onSelect={recomputeTagHighlights}
                                        onKeyUp={recomputeTagHighlights}
                                        onClick={recomputeTagHighlights}
                                        onScroll={syncHighlightScroll}
                                        placeholder="Write your recipe here using markdown..."
                                    />
                                </div>
                                <Show when={viewMode() === "split"}>
                                    <div class="md-toolbar">
                                        <button type="button" onClick={() => toggleWrap("**", "**", { trimEdges: true })}>
                                            Bold
                                        </button>
                                        <button type="button" onClick={() => toggleWrap("_", "_", { trimEdges: true })}>
                                            Italic
                                        </button>
                                        <button type="button" onClick={() => toggleWrap("- ", "")}>
                                            Bullet
                                        </button>
                                        <button type="button" onClick={() => toggleWrap("[", "](url)")}>
                                            Link
                                        </button>
                                    </div>
                                </Show>
                            </div>
                        </div>
                    </Show>
                    <Show when={viewMode() !== "plain"}>
                        <div class="md-preview" innerHTML={previewHtml()} />
                    </Show>
                </div>
            </div>
        );
    }

    return (
        <div class="recipe-viewer">
            <div class="recipe-content">
                <TitleSection />
                <ThumbnailSection />
                <RecipeCardSection />
                <MarkdownEditorSection />
                <button onClick={submitRecipe}>Save Recipe</button>
            </div>
        </div>
    );
}
