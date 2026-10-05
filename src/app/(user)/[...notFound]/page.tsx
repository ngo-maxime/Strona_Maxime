import { notFound } from "next/navigation";

// Każdy nieistniejący adres trafia do (user)/not-found.tsx – z menu i stopką strony
export default function CatchAllNotFound() {
  notFound();
}
