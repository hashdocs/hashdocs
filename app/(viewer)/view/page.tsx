"use client";
import Loader from "@/app/_components/navigation/loader";
export default async function ViewTestPage({
  params: { link_id },
}: {
  params: { link_id: string };
}) {
  return <Loader />;
}
