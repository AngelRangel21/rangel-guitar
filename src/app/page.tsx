import { HomeClient } from "@/components/home-client";
import { songs } from "@/lib/data";

export default function Home() {
  // This is a Server Component. It will get the most up-to-date
  // version of the `songs` array from the server's memory.
  const allSongs = songs;

  // It then passes this data as a prop to the client component.
  // The client will receive this exact snapshot of data, preventing
  // any hydration mismatch.
  return <HomeClient initialSongs={allSongs} />;
}
