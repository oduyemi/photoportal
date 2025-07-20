"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export const VerifyEmailForm = ({ email }: { email: string }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const toast = useToast();

  // Countdown timer for resend button
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/verify", { email, code });
      toast({
        title: "Verification successful!",
        description: "You're now logged in.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      // Redirect to dashboard or home
      window.location.href = "/dashboard";
    } catch (err: any) {
      toast({
        title: "Verification failed",
        description: err.response?.data?.error || "Invalid code",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await axios.post("/api/auth/resend", { email });
      setResendCooldown(60);
      toast({
        title: "Verification code resent",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (err: any) {
      toast({
        title: "Failed to resend code",
        description: err.response?.data?.error || "Try again later",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" py={10}>
      <VStack spacing={6}>
        <Text fontSize="lg" fontWeight="bold">
          Enter the 6-digit verification code sent to {email}
        </Text>

        <FormControl>
          <FormLabel>Verification Code</FormLabel>
          <Input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </FormControl>

        <Button
          colorScheme="blue"
          isLoading={loading}
          onClick={handleVerify}
          width="full"
        >
          Verify Email
        </Button>

        <Button
          onClick={handleResend}
          isDisabled={resendCooldown > 0}
          variant="ghost"
          fontSize="sm"
        >
          {resendCooldown > 0
            ? `Resend in ${resendCooldown}s`
            : "Resend Code"}
        </Button>
      </VStack>
    </Box>
  );
};
