import { createFileRoute } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { LoginScreen } from "@/components/login-screen";
import { StockroomApp } from "@/components/stockroom-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { user } = useCurrentUserState();
  if (user) return <StockroomApp user={user} />;
  return <LoginScreen />;
}
