"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Box, Button, Input, Alert, AlertIcon, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import "animate.css";

const MotionBox = motion(Box);

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/api/auth/verify", { code });

      if (res.status === 200) {
        setSuccess("✅ Verification successful! Redirecting...");
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/api/auth/resend");

      if (res.status === 200) {
        setSuccess("📧 Code resent! Check your inbox.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <Box className="container" maxW="lg" mt="16" p="8" bg="white" borderRadius="lg" boxShadow="md">
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Heading as="h2" size="lg" mb="4" className="text-center">
          Verify Your Email
        </Heading>
        <Text fontSize="sm" mb="6" color="gray.600" className="text-center">
          A 6-digit code was sent to your email. Enter it below to continue.
        </Text>

        <Input
          placeholder="Enter 6-digit code"
          size="lg"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          mb="4"
        />

        {error && (
          <Alert status="error" className="animate__animated animate__shakeX" mb="4">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {success && (
          <Alert status="success" className="animate__animated animate__fadeIn" mb="4">
            <AlertIcon />
            {success}
          </Alert>
        )}

        <Button
          colorScheme="blue"
          size="lg"
          width="full"
          isLoading={loading}
          isDisabled={code.length !== 6}
          onClick={handleVerify}
          mb="3"
        >
          Verify
        </Button>

        <Button
          variant="outline"
          size="sm"
          colorScheme="gray"
          isLoading={resending}
          onClick={handleResend}
          width="full"
        >
          Resend Code
        </Button>
      </MotionBox>
    </Box>
  );
}
