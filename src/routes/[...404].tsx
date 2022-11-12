import { HttpStatusCode } from "solid-start/server";
import PageTitle from "~/components/PageTitle";

export default function NotFound() {
  return (
    <main>
      <PageTitle content="Not Found"></PageTitle>
      <HttpStatusCode code={404} />
      <h1>Page Not Found</h1>
    </main>
  );
}
