import { createFileRoute } from "@tanstack/react-router";
import { SleepApp } from "@/components/sleep-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <SleepApp />;
}
