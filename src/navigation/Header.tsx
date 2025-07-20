"use client";
import { Box, Flex, Heading, Spacer, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const MotionBox = motion(Box);

export const Header = () => {
  return (
    <MotionBox
      as="header"
      px={6}
      py={4}
      bg="white"
      boxShadow="none"
      position="sticky"
      top={0}
      zIndex={10}
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <Flex align="center">
        <Link href="/" style={{ textDecoration: "none" }}>
            <Image 
                src="/images/logo/logo.svg" 
                alt="Logo" 
                width={100} 
                height={100} 
                className="pl-5" 
            />
        </Link>
        <Spacer />
        <Link href="/dashboard">
          <Button variant="ghost" colorScheme="#010156" size="sm" mr={2}>
            Dashboard
          </Button>
        </Link>
        <Link href="/upload">
          <Button variant="ghost" colorScheme="#010156" size="sm">
            Upload
          </Button>
        </Link>
      </Flex>
    </MotionBox>
  );
};