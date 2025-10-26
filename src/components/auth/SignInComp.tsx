import { GoogleOAuth } from "~/components/auth/GoogleOAuth";

export default function SignInComp() {
  return (
    <div class="signin-pane">
        <p>We've simplified the signing up and login experience for you!</p>
        <p>Click the button below to sign up/in using your Google account</p>
        <GoogleOAuth />
    </div>
  );
}