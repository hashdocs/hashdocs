import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase.types";
import Login from "./auth/login";
import { cookies } from "next/headers";
import Loader from "@/app/_components/navigation/loader";

export default async function Home() {
  return (
    <section className="flex flex-1 flex-col items-center">
      <Login />
    </section>
  );
}
