import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";

export default function NotFound() {
  return (
    <main class="min-h-screen flex flex-col justify-center items-center text-center bg-amber-50 p-6">
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <Selected404 />
    </main>
  );
}
