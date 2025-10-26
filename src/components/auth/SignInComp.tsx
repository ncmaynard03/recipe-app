import { GoogleOAuth } from "~/components/auth/GoogleOAuth"
import "../../styling/signincomp.css"

export default function SignInComp() {
  return (
    <main class="signin-pane">
        <p id="welcome">Welcome!</p>
        <p id="simp-lbl">We've simplified the sign up and login experience for you!</p>
        <div class="google-cont">
          <div id='google-btn'>
          <GoogleOAuth/>
          </div>
          <p id="google-lbl">Just click the button above to sign up/in using your Google account!</p>
        </div>
        

    </main>
  );
}