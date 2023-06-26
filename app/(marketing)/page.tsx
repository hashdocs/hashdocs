"use client";
import Login from "../auth/login";
import Image from "next/image";
import Hero from "./_components/hero";
import Features from "./_components/features";
import Comparison from "./_components/comparison";
import OSS from "./_components/oss";
import Footer from "./_components/footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Features/>
      <Comparison />
      <OSS />
    </>
  );
}