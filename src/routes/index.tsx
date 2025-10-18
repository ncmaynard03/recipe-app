import { Title } from "@solidjs/meta";
import Counter from "~/components/Counter";

export default function Home() {
  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello world!</h1>
      <Counter />
      <p>
        The app should probably open to the sign-in page. I dont know if that means we need to make this file that system or what atm<br />
        List of quick links (remove this later):<br />
        <a href="Sign-In">sign-in page</a><br />
        <a href="/dashboard">dashboard</a><br />
        <a href="/settings">settings</a><br />
      </p>
    </main>
  );
}
