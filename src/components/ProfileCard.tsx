"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Image,
  Text,
  Badge,
  Stack,
  Divider,
  useColorModeValue,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";


const MotionBox = motion(Box);

interface ProfileCardProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    department?: string;
    jobRole?: string;
    images: string[];
    birthday?: string;
    lastLogin?: string;
    emailVerified: boolean;
    profileCompleted: boolean;
  };
}

function formatBirthday(dateStr: string) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
      ? "nd"
      : day === 3 || day === 23
      ? "rd"
      : "th";
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
  return `${month} ${day}${suffix}`;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();
  const bg = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    router.refresh();
  if (!user.emailVerified) {
    router.push("/verify");
  }
}, [user.emailVerified, router]);

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
    onOpen();
  };

  return (
    <>
      <MotionBox
        p={6}
        maxW="md"
        mx="auto"
        borderWidth="1px"
        borderRadius="2xl"
        boxShadow="lg"
        bg={bg}
        borderColor={borderColor}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Stack spacing={4} align="center" textAlign="center">
          {/* <Text fontSize="2xl" fontWeight="bold" color={textColor}>
            {user.firstName} {user.lastName}
          </Text> */}

          <Text fontSize="sm" color="gray.500">
            {user.email}
          </Text>

          {user.department && (
            <Badge colorScheme="purple" variant="subtle" fontSize="0.75em">
              {user.department}
            </Badge>
          )}

          {user.jobRole && (
            <Text fontWeight="semibold" fontSize="md" color={textColor}>
              {user.jobRole}
            </Text>
          )}

          <SimpleGrid columns={user.images.length === 2 ? 2 : 1} spacing={4} pt={4}>
            {user.images.map((imgUrl, i) => (
              <Image
                key={i}
                src={imgUrl}
                alt={`Uploaded image ${i + 1}`}
                boxSize="120px"
                objectFit="cover"
                borderRadius="lg"
                border="2px solid"
                borderColor={borderColor}
                cursor="pointer"
                _hover={{
                  transform: "scale(1.08)",
                  transition: "0.3s ease",
                  boxShadow: "md",
                }}
                onClick={() => handleImageClick(imgUrl)}
              />
            ))}
          </SimpleGrid>

          <Divider pt={2} />

          <Stack spacing={2} fontSize="sm" color={textColor} pt={2} w="full">
            {user.birthday && (
              <Text>
                🎂 <strong>Birthday:</strong> {formatBirthday(user.birthday)}
              </Text>
            )}
            {user.lastLogin && (
              <Text>
                🕒 <strong>Last Login:</strong>{" "}
                {new Date(user.lastLogin).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </Text>
            )}
            <Text>
              📧 <strong>Email Verified:</strong>{" "}
              <Badge colorScheme={user.emailVerified ? "green" : "red"}>
                {user.emailVerified ? "Yes" : "No"}
              </Badge>
            </Text>
            <Text>
              🧾 <strong>Profile Complete:</strong>{" "}
              <Badge colorScheme={user.profileCompleted ? "green" : "yellow"}>
                {user.profileCompleted ? "Yes" : "No"}
              </Badge>
            </Text>
          </Stack>
        </Stack>
      </MotionBox>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="2xl" p={4} boxShadow="2xl">
          <ModalHeader textAlign="center" fontSize="xl">
            {user.firstName} {user.lastName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center" pb={6}>
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Full size"
                borderRadius="xl"
                mb={4}
                maxH="400px"
                mx="auto"
                objectFit="contain"
                boxShadow="md"
              />
            )}
            <Stack spacing={1} fontSize="sm" color="gray.600">
              <Text><strong>Department:</strong> {user.department || "N/A"}</Text>
              <Text><strong>Job Role:</strong> {user.jobRole || "N/A"}</Text>
              {user.birthday && (
                <Text><strong>Birthday:</strong> {formatBirthday(user.birthday)}</Text>
              )}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
