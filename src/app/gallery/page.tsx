"use client";
import GalleryGrid from "@/components/Gallery";
import { useUser } from "@/context/UserContext";

export default function Gallery() {
  const { user } = useUser();

  if (!user) return null;

  return <GalleryGrid />;
}
