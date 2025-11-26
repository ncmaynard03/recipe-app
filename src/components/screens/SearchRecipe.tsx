import Arrow from "~/assets/arrow.png";
import Hat from "~/assets/chef_hat.png"
import MGlass from "~/assets/dashboard/magnifying-glass.png"
import "~/styling/screens/search-recipe.css"

export default function SearchRecipe(){
    return(
        <div class="search-page-cont">
            <div class="search-results-section">
                <div class="default-search-view">
                    <img src={Hat}/>
                    <p>Results Will Display Here</p>
                </div>
            </div>
            <div class="search-options-pane">
                <div class="search-bar-row">
                    <div class="search-field">
                        <img src={MGlass}/>
                        <input type="text" placeholder="Search All Recipes..."/>
                    </div>
                </div>
            </div>
        </div>
    );
}