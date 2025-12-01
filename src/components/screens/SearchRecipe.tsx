import { createSignal, Show } from "solid-js";
import { Collapsible } from "@kobalte/core/collapsible";
import Arrow from "~/assets/arrow-down.png";
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
                    <div class="search-results-view">
                        <p>[Empty Page Where Results Will Actually Show]</p>
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
                <Collapsible class="collapsible">
                    <Collapsible.Trigger class="sort">
                        <span>Sort By</span>
                        <img src={Arrow}/>
                    </Collapsible.Trigger>
                    <Collapsible.Content class="sort-options">
                        <div class="sort-option">
                            <input type="radio" id="recipe-title-asc" name="sort-option"/>
                            <label for="recipe-title">Title A-Z</label>
                        </div>

                        <div class="sort-option">
                            <input type="radio" id="recipe-title-desc" name="sort-option"/>
                            <label for="recipe-title">Title Z-A</label>
                        </div>

                        <div class="sort-option">
                            <input type="radio" id="author-asc" name="sort-option"/>
                            <label for="recipe-title">Author A-Z</label>
                        </div>

                        <div class="sort-option">
                            <input type="radio" id="author-desc" name="sort-option"/>
                            <label for="recipe-title">Author Z-A</label>
                        </div>

                        <div class="sort-option">
                            <input type="radio" id="recipe-title" name="sort-option"/>
                            <label for="recipe-title">Oldest</label>
                        </div>

                        <div class="sort-option">
                            <input type="radio" id="recipe-title" name="sort-option"/>
                            <label for="recipe-title">Newest</label>
                        </div>
                    </Collapsible.Content>
                </Collapsible>

                <Collapsible class="collapsible">
                    <Collapsible.Trigger class="filter">
                        <span>Filters</span>
                        <img src={Arrow}/>
                    </Collapsible.Trigger>
                    <Collapsible.Content class="search-filters">
                        <div class="filters">
                            <div class="filter-option">
                                <label>Author</label>
                                <input type="text"/>
                            </div>

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
                    </Collapsible.Content>
                </Collapsible>
                
                
            </div>
        </div>
    );
}