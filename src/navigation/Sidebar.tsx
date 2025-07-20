"use client";
import {
  Box,
  Flex,
  IconButton,
  Text,
  VStack,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Button,
  Link as ChakraLink,
  Heading,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiUpload,
  FiUsers,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import Link from "next/link";
import { IconType } from "react-icons";
import Image from "next/image";
import { logout } from "@/utils/auth";

interface SidebarLinkProps {
  href: string;
  icon: IconType;
  label: string;
}


const MotionBox = motion(Box);

const navLinks = [
  { label: "Dashboard", href: "/dashboard", icon: FiHome },
  { label: "Upload", href: "/upload", icon: FiUpload },
  { label: "Gallery", href: "/gallery", icon: FiUsers },
];



export const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} passHref>
      <Box
        display="flex"
        alignItems="center"
        px={4}
        py={3}
        borderRadius="md"
        fontWeight="medium"
        bg={isActive ? "gray.100" : "transparent"}
        _hover={{ bg: "gray.100", textDecoration: "none" }}
      >
        <Icon style={{ marginRight: "10px" }} />
        {label}
      </Box>
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <Flex
        display={{ base: "flex", md: "none" }}
        p={4}
        justify="space-between"
        align="center"
        bg="white"
        borderBottom="1px solid #eee"
      >
        <Text fontWeight="bold" fontSize="lg">Dashboard</Text>
        <IconButton icon={<FiMenu />} aria-label="Open menu" onClick={onOpen} variant="outline" />
      </Flex>

      {/* Drawer (Mobile Sidebar) */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="white">
          <DrawerCloseButton />
          <DrawerBody>
            <VStack mt={10} spacing={4} align="stretch">
              {navLinks.map((link) => (
                <SidebarLink key={link.href} {...link} />
              ))}
              <Button
                leftIcon={<FiLogOut />}
                colorScheme="red"
                variant="ghost"
                justifyContent="flex-start"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Desktop Sidebar */}
      <MotionBox
        display={{ base: "none", md: "block" }}
        w="64"
        h="100vh"
        bg="white"
        borderRight="1px solid #eee"
        p={6}
        position="fixed"
        top="0"
        left="0"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <VStack align="stretch" spacing={4}>
          <Link href="/dashboard" style={{ textDecoration: "none" }}>
            <Image src="/images/logo/logo.svg" alt="Logo" width={100} height={100} className="pl-5" />
          </Link>
          {navLinks.map((link) => (
            <SidebarLink key={link.href} {...link} />
          ))}
          <Button
            leftIcon={<FiLogOut />}
            colorScheme="red"
            variant="ghost"
            justifyContent="flex-start"
            mt={4}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </VStack>
      </MotionBox>
    </>
  );
};