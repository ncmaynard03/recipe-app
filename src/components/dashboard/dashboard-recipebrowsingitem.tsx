import WHPhoto from "~/assets/dashboard/waffle-house-allstarspecial.jpg";

export default function RecipeBrowsingItem() {
    return (
        <div class="browsing-item-container">
            <div class="browsing-item-content">
                <img src={WHPhoto} alt="Recipe preview" />
                <div class="browsing-item-text">
                    <h3>WAFFLEHOUSE ALL-STAR SPECIAL</h3>
                    <p>By: Legally Dubious</p>
                </div>
            </div>
        </div>
    );
}