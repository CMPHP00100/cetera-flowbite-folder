import AccountTabs from "@/components/user-sections/account-tabs";
import "../../components/custom-styles/account.css";

export default function Account() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-[80vw] rounded-lg bg-dark-blue p-6 shadow-2xl">
        {/* <h1 className="mb-4 text-center text-2xl font-bold">My Account</h1> */}
        <AccountTabs />
      </div>
    </div>
  );
}
