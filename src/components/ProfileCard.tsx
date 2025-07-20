"use client";
import React from "react";
import {
  Box,
  Flex,
  Image,
  Text,
  Heading,
  Badge,
  Stack,
  Divider,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

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

// Utility to format birthday as "November 1st"
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
  const fullName = `${user.firstName} ${user.lastName}`;
  const bg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const cardShadow = useColorModeValue("xs", "dark-xs");

  return (
    <MotionBox
      p={6}
      maxW={{ base: "90%", sm: "500px" }}
      mx="auto"
      borderWidth="1px"
      borderRadius="2xl"
      boxShadow={cardShadow}
      bg={bg}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Stack spacing={4} align="center" textAlign="center">
        <Heading size="lg">{fullName}</Heading>
        <Text fontSize="sm" color="gray.500">
          {user.email}
        </Text>

        {user.department && (
          <Badge colorScheme="blue" fontSize="0.8em">
            {user.department}
          </Badge>
        )}
        {user.jobRole && (
          <Text fontWeight="medium" fontSize="md" color={textColor}>
            {user.jobRole}
          </Text>
        )}

        <SimpleGrid columns={{ base: 1, sm: user.images.length === 2 ? 2 : 1 }} spacing={4} pt={4}>
          {user.images.map((imgUrl, i) => (
            <Image
              key={i}
              src={imgUrl}
              alt={`Uploaded image ${i + 1}`}
              boxSize="100px"
              objectFit="cover"
              borderRadius="xl"
              border="1px solid #ddd"
              _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
            />
          ))}
        </SimpleGrid>

        <Divider pt={2} />

        <Stack spacing={2} fontSize="sm" color="gray.600" pt={2}>
          {user.birthday && (
            <Text>🎂 Birthday: {formatBirthday(user.birthday)}</Text>
          )}
          {user.lastLogin && (
            <Text>
              🕒 Last Login:{" "}
              {new Date(user.lastLogin).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Text>
          )}
          <Text>
            📧 Email Verified:{" "}
            <Badge colorScheme={user.emailVerified ? "green" : "red"}>
              {user.emailVerified ? "Yes" : "No"}
            </Badge>
          </Text>
          <Text>
            🧾 Profile Complete:{" "}
            <Badge colorScheme={user.profileCompleted ? "green" : "yellow"}>
              {user.profileCompleted ? "Yes" : "No"}
            </Badge>
          </Text>
        </Stack>
      </Stack>
    </MotionBox>
  );
};
