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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';

type ImageItem = {
  img: string;
  department: string;
  birthMonth: string;
  name: string;
  firstName?: string;
  lastName?: string;
  jobRole?: string;
  birthday?: string;
};

function formatBirthday(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = date.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31
      ? 'st'
      : day === 2 || day === 22
      ? 'nd'
      : day === 3 || day === 23
      ? 'rd'
      : 'th';
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
  return `${month} ${day}${suffix}`;
}

export default function GalleryGrid() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const handleClick = (img: ImageItem) => {
    setSelectedImage(img);
    onOpen();
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

  const renderCard = (item: ImageItem, idx: number) => (
    <VStack
      key={idx}
      bg={cardBg}
      p={3}
      rounded="xl"
      boxShadow="md"
      align="center"
      cursor="pointer"
      _hover={{ transform: 'scale(1.05)', transition: '0.3s' }}
      onClick={() => handleClick(item)}
    >
      <Image
        src={item.img}
        alt={item.name}
        borderRadius="md"
        boxSize="120px"
        objectFit="cover"
      />
      <Text fontSize="sm" fontWeight="medium">{item.name}</Text>
      <Text fontSize="xs" color="gray.500">{item.department} • {item.birthMonth}</Text>
    </VStack>
  );

  return (
    <>
      <Tabs isFitted variant="enclosed" colorScheme="blue" mt={4}>
        <TabList>
          <Tab>All</Tab>
          <Tab>By Department</Tab>
          <Tab>By Birth Month</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={[2, 3, 4]} spacing={4}>
              {images.map(renderCard)}
            </SimpleGrid>
          </TabPanel>

          <TabPanel>
            {Object.entries(deptGroups).map(([dept, imgs]) => (
              <Box key={dept} mb={6}>
                <Heading size="md" mb={2}>{dept}</Heading>
                <SimpleGrid columns={[2, 3, 4]} spacing={4}>
                  {imgs.map(renderCard)}
                </SimpleGrid>
              </Box>
            ))}
          </TabPanel>

          <TabPanel>
            {Object.entries(monthGroups).map(([month, imgs]) => (
              <Box key={month} mb={6}>
                <Heading size="md" mb={2}>{month}</Heading>
                <SimpleGrid columns={[2, 3, 4]} spacing={4}>
                  {imgs.map(renderCard)}
                </SimpleGrid>
              </Box>
            ))}
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Full Image Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="2xl" p={4}>
          <ModalCloseButton />
          <ModalBody p={6}>
            {selectedImage && (
              <VStack spacing={4} textAlign="center">
                <Image
                  src={selectedImage.img}
                  alt={selectedImage.name}
                  borderRadius="lg"
                  objectFit="cover"
                  maxH="400px"
                  w="100%"
                  boxShadow="lg"
                />

                <Box>
                  <Text fontSize="xl" fontWeight="bold">
                    {selectedImage.firstName} {selectedImage.lastName}
                  </Text>
                  {selectedImage.jobRole && (
                    <Text fontSize="md" color="gray.600">
                      🧰 {selectedImage.jobRole}
                    </Text>
                  )}
                  <Text fontSize="sm" color="gray.500">
                    🏢 {selectedImage.department}
                  </Text>
                  {selectedImage.birthday && (
                    <Text fontSize="sm" color="gray.500">
                      🎂 {formatBirthday(selectedImage.birthday)}
                    </Text>
                  )}
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
