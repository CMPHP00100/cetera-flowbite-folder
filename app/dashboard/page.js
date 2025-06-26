import ProtectedPage from "@/components/wrappers/protected-page";
import UserProfile from "@/components/user-sections/user-profile";

export default function Dashboard() {
  return (
    <ProtectedPage>
      <UserProfile />
    </ProtectedPage>
  );
}