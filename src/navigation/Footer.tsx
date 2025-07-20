"use client";
import { Box, Text, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export const Footer = () => {
  return (
    <MotionBox
      as="footer"
      bg="gray.50"
      mt={10}
      py={4}
      textAlign="center"
      boxShadow="inner"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Flex justify="center" align="center">
        <Text fontSize="sm" color="gray.600">
          © {new Date().getFullYear()} LinkOrg Networks LTD. All rights reserved.
        </Text>
      </Flex>
    </MotionBox>
  );
};