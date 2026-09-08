"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/site/FullPageLoader";

/**
 * Client-side auth gate for the admin console.
 *
 * The check has to wait for the browser: there is no localStorage during the
 * server pass, so redirecting from render would bounce every logged-in admin
 * straight back to /login.
 */
const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const router = useRouter();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let stored = token;

    if (!stored) {
      try {
        stored = window.localStorage.getItem("token");
      } catch {
        stored = null;
      }
    }

    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage only exists after mount
      setStatus("allowed");
    } else {
      setStatus("denied");
      router.replace("/login");
    }
  }, [token, router]);

  if (status !== "allowed") {
    return (
      <FullPageLoader
        background="bg-gray-100"
        label={status === "denied" ? "Redirecting to login" : "Loading"}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
