"use client";
import ImageUpload from "@/components/ImageUpload";
import { useUser } from "@/context/UserContext";
import { Sidebar } from "@/navigation/Sidebar";
import { Box, Flex } from "@chakra-ui/react";

export default function UploadLayout({ children }: { children: React.ReactNode }) {
    const { user, setUser } = useUser();
    
      if (!user) return null;
    
    return (
        <Flex>
            <Sidebar />
            <Box ml={{ base: 0, md: 64 }} p={6} w="full">
                <ImageUpload 
                    userId={user._id}
                    currentImages={user.images}
                    onUploadSuccess={(newImages) => {
                    setUser({ ...user, images: newImages });
        }}
                />
            </Box>
        </Flex>

  );
}
