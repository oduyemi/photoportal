import { ProfileCard } from "@/components/ProfileCard";
import { useUser } from "@/context/UserContext";
import { Heading, Text, Box } from "@chakra-ui/react";

export default function Dashboard() {
  const { user } = useUser();
  return (
    <Box>
      <Heading size="lg" mb={4}>
        Welcome to Your Dashboard
      </Heading>
      <Text>
        You can upload photos, view your profile, or manage your account from the sidebar.
      </Text>
      <Box>
        <ProfileCard user={user} />
      </Box>
    </Box>
  );
}
