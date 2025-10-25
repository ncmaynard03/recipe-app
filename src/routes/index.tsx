import { Meta, Title } from "@solidjs/meta";
import Counter from "~/components/Counter";

export default function Home() {
  return (
    <main>
      <Title>Capstone Cooking</Title>
      <h1>Capstone Cooking!</h1>
      <Counter />
      <p>
        The app should probably open to the sign-in page. I dont know if that means we need to make this file that system or what atm<br />
        List of quick links (remove this later):<br />
        {/* the default would usually be the home page, and if the user isnt logged 
            in (using cookies to check i think?) then you redirect to the login page
            I would build the home page as a separate component and then call that into this page
            */}
        <a href="Sign-In">sign-in page</a><br />
        <a href="/dashboard">dashboard</a><br />
        <a href="/settings">settings</a><br />
      </p>
    </main>
  );
}
