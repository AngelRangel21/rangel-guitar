import { HomeClient } from "@/components/home-client";
import { getSongs } from "@/services/songs-service";

export default async function Home() {
  // This is a Server Component. It will get the most up-to-date
  // version of the `songs` array from the server's memory.
  const allSongs = await getSongs();

  // It then passes this data as a prop to the client component.
  // The client will receive this exact snapshot of data, preventing
  // any hydration mismatch.
  return <HomeClient initialSongs={allSongs} />;
}
