"use client";
import { ProfileCard } from "@/components/ProfileCard";
import { useUser } from "@/context/UserContext";
import { Sidebar } from "@/navigation/Sidebar";
import {
  Box,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const bg = useColorModeValue("gray.50", "gray.900");

  if (!user) return null;

  return (
    <Flex bg={bg} minH="100vh">
      <Sidebar />

      <Box ml={{ base: 0, md: 64 }} p={6} w="full">
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          mb={6}
        >
          <VStack align="start" spacing={4}>
            <Heading
              size="lg"
              bgGradient="linear(to-r, teal.500, #010156)"
              bgClip="text"
            >
              Hello, {user.firstName} 👋
            </Heading>

            <Text fontSize="md" color="gray.600">
              From the sidebar, you can upload your photo, view your profile, or browse the gallery.
            </Text>
          </VStack>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <ProfileCard user={user} />
        </MotionBox>

        {/* Optional additional content slot */}
        {children && (
          <MotionBox mt={8}>{children}</MotionBox>
        )}
      </Box>
    </Flex>
  );
}
