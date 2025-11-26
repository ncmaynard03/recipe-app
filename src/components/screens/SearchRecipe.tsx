import Arrow from "~/assets/arrow.png";
import "~/styling/screens/search-recipe.css"

export default function SearchRecipe(){
    return(
        <div class="search-page-cont">
            <div class="search-bar-row">
                <input type="text" placeholder="Search All Recipes..."/>
                <div class="submit">
                    <button><img src={Arrow}/></button>
                </div>
            </div>
            <div class="adv-btn">
                <button>Advanced Search</button>
            </div>
        </div>
    );
}