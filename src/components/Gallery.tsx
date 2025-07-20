'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Image,
  SimpleGrid,
  Text,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Spinner,
  Center,
} from '@chakra-ui/react';

type ImageItem = {
  img: string;
  department: string;
  birthMonth: string;
  name: string;
};

export default function GalleryGrid() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/images/gallery')
      .then(res => res.json())
      .then(setImages)
      .finally(() => setLoading(false));
  }, []);

  const groupBy = (items: ImageItem[], key: keyof ImageItem) => {
    return items.reduce((acc, item) => {
      const group = item[key] || 'Other';
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    }, {} as Record<string, ImageItem[]>);
  };

  const deptGroups = groupBy(images, 'department');
  const monthGroups = groupBy(images, 'birthMonth');
  const cardBg = useColorModeValue('gray.50', 'gray.800');

  if (loading) {
    return (
      <Center mt={10}>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Tabs isFitted variant="enclosed" colorScheme="blue" mt={4}>
      <TabList>
        <Tab>All</Tab>
        <Tab>By Department</Tab>
        <Tab>By Birth Month</Tab>
      </TabList>

      <TabPanels>
        {/* All Images */}
        <TabPanel>
          <SimpleGrid columns={[2, 3, 4]} spacing={4}>
            {images.map((item, idx) => (
              <VStack
                key={idx}
                bg={cardBg}
                p={3}
                rounded="xl"
                boxShadow="md"
                align="center"
              >
                <Image
                  src={item.img}
                  alt={item.name}
                  borderRadius="md"
                  boxSize="120px"
                  objectFit="cover"
                />
                <Text fontSize="sm" fontWeight="medium">
                  {item.name}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {item.department} • {item.birthMonth}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>
        </TabPanel>

        {/* By Department */}
        <TabPanel>
          {Object.entries(deptGroups).map(([dept, imgs]) => (
            <Box key={dept} mb={6}>
              <Heading size="md" mb={2}>
                {dept}
              </Heading>
              <SimpleGrid columns={[2, 3, 4]} spacing={4}>
                {imgs.map((item, idx) => (
                  <VStack
                    key={idx}
                    bg={cardBg}
                    p={3}
                    rounded="xl"
                    boxShadow="md"
                    align="center"
                  >
                    <Image
                      src={item.img}
                      alt={item.name}
                      borderRadius="md"
                      boxSize="120px"
                      objectFit="cover"
                    />
                    <Text fontSize="sm" fontWeight="medium">
                      {item.name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {item.birthMonth}
                    </Text>
                  </VStack>
                ))}
              </SimpleGrid>
            </Box>
          ))}
        </TabPanel>

        {/* By Birth Month */}
        <TabPanel>
          {Object.entries(monthGroups).map(([month, imgs]) => (
            <Box key={month} mb={6}>
              <Heading size="md" mb={2}>
                {month}
              </Heading>
              <SimpleGrid columns={[2, 3, 4]} spacing={4}>
                {imgs.map((item, idx) => (
                  <VStack
                    key={idx}
                    bg={cardBg}
                    p={3}
                    rounded="xl"
                    boxShadow="md"
                    align="center"
                  >
                    <Image
                      src={item.img}
                      alt={item.name}
                      borderRadius="md"
                      boxSize="120px"
                      objectFit="cover"
                    />
                    <Text fontSize="sm" fontWeight="medium">
                      {item.name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {item.department}
                    </Text>
                  </VStack>
                ))}
              </SimpleGrid>
            </Box>
          ))}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
