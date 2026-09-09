import { hasCurrentSession } from "@/lib/auth/auth-repository";
import { useEffect, useState } from "react";

type PasswordRecoveryStatus = "checking" | "valid" | "invalid";

export function usePasswordRecoverySession() {
  const [status, setStatus] = useState<PasswordRecoveryStatus>("checking");

  useEffect(() => {
    let isActive = true;

    async function checkRecoverySession() {
      try {
        const hasSession = await hasCurrentSession();

        if (isActive) {
          setStatus(hasSession ? "valid" : "invalid");
        }
      } catch (error) {
        console.error("password recovery session check error", error);

        if (isActive) {
          setStatus("invalid");
        }
      }
    }

    void checkRecoverySession();

    return () => {
      isActive = false;
    };
  }, []);

  return status;
}
