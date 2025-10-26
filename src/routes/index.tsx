import { Title } from "@solidjs/meta";
import SignInComp from "~/components/auth/SignInComp";
import MainImg from "~/assets/main-img.jpg"


export default function MainPage() {
  return ( 
    <main class='main-page'>
      <Title>Capstone Cooking</Title>
      <div class='first-section'>
        <div class='main-page-img'>
          <img src={MainImg}/>
        </div>
        <div class='page-name-section'>
          <p id='page-name'>capstone cooking</p>
        </div>
        <SignInComp />
      </div>
    </main>
  );
}
