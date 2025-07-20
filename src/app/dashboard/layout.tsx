"use client";
import { ProfileCard } from "@/components/ProfileCard";
import { useUser } from "@/context/UserContext";
import { Sidebar } from "@/navigation/Sidebar";
import { Box, Flex } from "@chakra-ui/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    
      if (!user) return null;
    
    return (
        <Flex>
            <Sidebar />
            <Box ml={{ base: 0, md: 64 }} p={6} w="full">
                <ProfileCard user={user} />
            </Box>
        </Flex>

  );
}
