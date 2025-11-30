import { createSignal, Show } from "solid-js";
import Arrow from "~/assets/arrow.png";
import Hat from "~/assets/chef_hat.png"
import MGlass from "~/assets/dashboard/magnifying-glass.png"
import "~/styling/screens/search-recipe.css"

export default function SearchRecipe(){
    const [searchText, setSearchText] = createSignal("");
    const clearSearch = () => setSearchText("");

    return(
        <div class="search-page-cont">
            <div class="search-results-section">
                <Show when={searchText() !== ""} fallback = {
                    <div class="default-search-view">
                        <img src={Hat}/>
                        <p>Results Will Display Here</p>
                    </div>}
                >
                    <div class="search-results">
                        <p>Found recipes</p>
                    </div>
                </Show>
            </div>
            <div class="search-options-pane">
                <div class="search-bar-row">
                    <div class="search-field">
                        <img src={MGlass}/>
                        <input type="text" placeholder="Search All Recipes..." value={searchText()} onInput={(query) => setSearchText(query.currentTarget.value)}/>
                        <Show when={searchText().trim() !== ""}>
                            <button class="clear-btn" onClick={clearSearch}>clear</button>
                        </Show>
                    </div>
                </div>
                
                <div class="filters">
                    <div class="filter-option">
                        <label>Include ingredients</label>
                        <input type="text"/>
                    </div>

                    <div class="filter-option">
                        <label>Exclude ingredients</label>
                        <input type="text"/>
                    </div>

                    <div class="filter-option">
                        <label>Tags</label>
                        <input type="text"/>
                    </div>
                </div>
            </div>
        </div>
    );
}