/* eslint-disable */
"use client";
import React, { useState } from "react";
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
  SimpleGrid,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import "animate.css";

const MotionBox = motion(Box);

export const GetStarted: React.FC = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    jobRole: "",
    birthday: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast({
        title: "Registration successful!",
        description: "Redirecting to dashboard...",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      window.location.href = "/dashboard";

    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minH="76vh"
      mt={5}
      align="center"
      justify="center"
      px={{ base: 4, md: 8 }}
      bg="#f9f9fb"
      className="animate__animated animate__fadeIn"
    >
      <Flex
        w={{ base: "100%", md: "90%", lg: "80%" }}
        maxW="1200px"
        boxShadow="sm"
        rounded="lg"
        overflow="hidden"
        bg="white"
      >
        {/* Illustration */}
        <Box
          flex="1"
          display={{ base: "none", md: "flex" }}
          alignItems="center"
          justifyContent="center"
          p={6}
          bg="#eef1f8"
        >
          <Image
            src="/images/register.png"
            alt="Illustration"
            maxH="500px"
            objectFit="contain"
          />
        </Box>

        {/* Form */}
        <Box flex="1" py={10} px={{ base: 6, md: 10 }}>
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box mb={8} textAlign="center">
              <Heading fontSize="2xl" color="#010156">
                Get Started
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Fill in your details to create an account
              </Text>
            </Box>

            <VStack spacing={6} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl id="fname">
                  <FormLabel>First Name</FormLabel>
                  <Input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    borderRadius="md"
                  />
                </FormControl>

                <FormControl id="lname">
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    borderRadius="md"
                  />
                </FormControl>

                <FormControl id="email">
                  <FormLabel>Work Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    borderRadius="md"
                  />
                </FormControl>

                <FormControl id="dept">
                  <FormLabel>Department</FormLabel>
                  <Input
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="e.g. Software/IT"
                    borderRadius="md"
                  />
                </FormControl>

                <FormControl id="jobRole">
                  <FormLabel>Job Role</FormLabel>
                  <Input
                    name="jobRole"
                    value={form.jobRole}
                    onChange={handleChange}
                    placeholder="e.g. Software Developer"
                    borderRadius="md"
                  />
                </FormControl>

                <FormControl id="birthdate">
                  <FormLabel>Date of Birth</FormLabel>
                  <Input
                    name="birthday"
                    type="date"
                    value={form.birthday}
                    onChange={handleChange}
                    borderRadius="md"
                  />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    borderRadius="md"
                  />
                </FormControl>

                <FormControl id="cpassword">
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    borderRadius="md"
                  />
                </FormControl>
              </SimpleGrid>

              <Flex justify="space-between" align="center" pt={2}>
                <Checkbox colorScheme="blue">Remember me</Checkbox>
                <Link fontSize="sm" color="blue.500">
                  Forgot Password?
                </Link>
              </Flex>

              <Button
                isLoading={loading}
                onClick={handleSubmit}
                colorScheme="facebook"
                bgColor="#010156"
                _hover={{ bg: "#E65D0F", color: "#fff" }}
                width="full"
                py={6}
                rounded="full"
                fontWeight="bold"
                fontSize="md"
              >
                Get Started
              </Button>

              <Text fontSize="sm" textAlign="center">
                Coming back?{" "}
                <Link href="/" color="blue.800" fontWeight="bold">
                  Login
                </Link>
              </Text>
            </VStack>
          </MotionBox>
        </Box>
      </Flex>
    </Flex>
  );
};
