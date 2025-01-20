import Image from "next/image";
import { IconLighter } from "@tabler/icons-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-4 p-24">
      <p>Click for more info</p>
      <a href="https://paj.cash">
        <IconLighter stroke={2} />
      </a>
    </main>
  );
}
