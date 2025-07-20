"use client";
import ImageUpload from "@/components/ImageUpload";
import { useUser } from "@/context/UserContext";

export default function Gallery() {
  const { user, setUser } = useUser();

  if (!user) return null;

  return <ImageUpload 
            userId={user._id}
            currentImages={user.images}
            onUploadSuccess={(newImages) => {
            setUser({ ...user, images: newImages });
          }}
        />;
}
