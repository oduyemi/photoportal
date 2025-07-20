"use client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";

export interface FirstLoginDialogProps {
  onClose: () => void;
}

export const FirstLoginDialog = ({ onClose }: FirstLoginDialogProps) => {
  const { isOpen, onOpen, onClose: chakraClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, []);

  const handleProceed = () => {
    chakraClose(); 
    onClose();    
  };

  return (
    <Modal isOpen={isOpen} onClose={handleProceed} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Welcome to LinkOrgNet 🎉</ModalHeader>
        <ModalBody>
          <Text>This is your first login. Let&apos;s set up your profile to get started!</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleProceed}>
            Get Started
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
