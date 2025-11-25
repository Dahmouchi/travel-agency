/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Metadata } from "next";
import { ApplicationLayout } from "../application-layout";
import "@/styles/default.css";
export const metadata: Metadata = {
  title: "Home",
  description:
    "Chisfis is a modern and elegant template for Next.js, Tailwind CSS, and TypeScript. It is designed to be simple and easy to use, with a focus on performance and accessibility.",
  keywords: [
    "Next.js",
    "Tailwind CSS",
    "TypeScript",
    "Chisfis",
    "Travel",
    "E-commerce",
    "Booking",
    "Cars",
  ],
};

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return <ApplicationLayout>{children}</ApplicationLayout>;
}
