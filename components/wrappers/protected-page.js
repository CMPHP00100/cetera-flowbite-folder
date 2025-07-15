"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProtectedPage = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [router]);

  return <>{children}</>;
};

export default ProtectedPage;
