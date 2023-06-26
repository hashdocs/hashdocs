"use client";
import Login from "../auth/login";
import Image from "next/image";
import Hero from "./_components/hero";
import Features from "./_components/features";
import Comparison from "./_components/comparison";

export default function Home() {
  return (
    <section className="flex flex-1 flex-col items-center">
      <Hero />
      <Features/>
      <Login />
      <Comparison />
    </section>
  );
}