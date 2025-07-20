'use client';
import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  useToast,
  Image,
  Flex,
} from '@chakra-ui/react';
import { FaUpload, FaRedo } from 'react-icons/fa';
import { motion } from 'framer-motion';

type ImageUploadProps = {
  userId: string;
  currentImages: string[];
  onUploadSuccess: (newImages: string[]) => void;
};

const MotionBox = motion(Box);

export default function ImageUpload({ userId, currentImages, onUploadSuccess }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const toast = useToast();

  const handleUpload = async (replaceIndex?: number) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('userId', userId);
    if (replaceIndex !== undefined) {
      formData.append('replaceIndex', String(replaceIndex));
    }

    const res = await fetch('/api/images/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      toast({
        title: 'Image uploaded!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });

      const updatedImages = [...currentImages];
      if (replaceIndex !== undefined) {
        updatedImages[replaceIndex] = data.imageUrl;
      } else {
        updatedImages.push(data.imageUrl);
      }

      onUploadSuccess(updatedImages);
    } else {
      toast({
        title: 'Upload failed',
        description: data.error || 'Something went wrong',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }

    setFile(null);
  };

  return (
    <MotionBox
      p={6}
      borderRadius="2xl"
      boxShadow="lg"
      bg="white"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <VStack spacing={5} align="stretch">
        <Box>
          <Text fontWeight="semibold" mb={2}>
            Choose an image
          </Text>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            size="md"
            variant="flushed"
          />
        </Box>

        {currentImages.length < 2 ? (
          <Button
            leftIcon={<FaUpload />}
            colorScheme="blue"
            size="lg"
            onClick={() => handleUpload()}
            isDisabled={!file}
            rounded="xl"
          >
            Upload Image
          </Button>
        ) : (
          <VStack spacing={4}>
            {currentImages.map((img, index) => (
              <Flex
                key={index}
                align="center"
                gap={4}
                bg="gray.50"
                p={4}
                rounded="xl"
                shadow="sm"
                w="100%"
              >
                <Image
                  src={img}
                  alt={`Uploaded ${index + 1}`}
                  boxSize="64px"
                  objectFit="cover"
                  borderRadius="lg"
                />
                <Box flex="1">
                  <Text fontSize="md" fontWeight="medium">
                    Replace Image {index + 1}
                  </Text>
                </Box>
                <Button
                  leftIcon={<FaRedo />}
                  colorScheme="orange"
                  size="sm"
                  onClick={() => handleUpload(index)}
                  isDisabled={!file}
                  rounded="lg"
                >
                  Replace
                </Button>
              </Flex>
            ))}
          </VStack>
        )}
      </VStack>
    </MotionBox>
  );
}
