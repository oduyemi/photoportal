/* eslint-disable */
"use client";
import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  Text,
  VStack,
  Image,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import "animate.css";

const MotionBox = motion(Box);

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUser();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();
      setUser(data.user);
        router.push("/dashboard");
      } catch (error) {
      setError("Invalid email or password");
    }
  };
  return (
    <Flex
      minH="78vh"
      align="center"
      justify="center"
      className="animate__animated animate__fadeIn"
      px={{ base: 4, md: 8 }}
      bg="white"
    >
      <Flex
        w={{ base: "100%", md: "90%", lg: "80%" }}
        maxW="1200px"
        boxShadow="none"
        rounded="md"
        overflow="hidden"
      >
        {/* Left Image Section */}
        <Box flex="1" bg="white" display={{ base: "none", md: "flex" }} alignItems="center" justifyContent="center" p={6}>
          <Image
            src="/images/loginimg.png"
            alt="Login Illustration"
            maxH="500px"
            objectFit="contain"
          />
        </Box>

        {/* Right Form Section */}
        <Box
          flex="1"
          p={8}
          bg="white"
        >
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <VStack spacing={6} align="stretch">
              {error && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  <AlertTitle mr={2}>Login Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <FormControl id="email">
                <FormLabel>Work Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter your work email address"
                  borderColor="gray.300"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter password"
                  borderColor="gray.300"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>

              <Flex justify="space-between" align="center">
                <Checkbox colorScheme="blue">Remember me</Checkbox>
                <Link fontSize="sm" color="blue.500">
                  Forgot Password?
                </Link>
              </Flex>

              <Button
                colorScheme="facebook"
                bgColor="#010156"
                _hover={{ bg: "#E65D0f", color: "#fff" }}
                width="full"
                py={6}
                rounded="full"
                fontWeight="bold"
                fontSize="md"
                onClick={handleLogin}
              >
                Login
              </Button>
              <Text fontSize="sm" textAlign="center">
                First time here?{" "}
                <Link href="/get-started" color="orange.500" fontWeight="bold">
                  Get Started
                </Link>
              </Text>
            </VStack>
          </MotionBox>
        </Box>
      </Flex>
    </Flex>
  );
};