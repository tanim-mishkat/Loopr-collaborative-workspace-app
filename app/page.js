import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h2>mishkat</h2>
      <Link href="/dashboard">
        <Button variant="outline" size="sm">Button</Button>
      </Link>


    </div>
  );
}
