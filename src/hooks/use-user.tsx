import { useUser } from "@/context/UserContext";

const DashboardHeader = () => {
  const { user, loading } = useUser();

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in.</p>;

  return (
    <div>
      <h1>Welcome {user.firstName} {user.lastName}</h1>
    </div>
  );
};
