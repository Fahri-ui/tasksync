"use client";
import { useEffect, useState } from "react";

export default function FlashMessage() {

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);


  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(";").shift()!);
    return null;
  };

  useEffect(() => {
  
    const flashError = getCookie("flash_error");
    const flashSuccess = getCookie("flash_success");

    if (flashError) {
      setErrorMessage(flashError);
      setShowError(true);

    
      const timer = setTimeout(() => setShowError(false), 6000);

    
      document.cookie = "flash_error=; path=/; max-age=0";

      return () => clearTimeout(timer);
    }

    if (flashSuccess) {
      setSuccessMessage(flashSuccess);
      setShowSuccess(true);

      const timer = setTimeout(() => setShowSuccess(false), 6000);
      document.cookie = "flash_success=; path=/; max-age=0";

      return () => clearTimeout(timer);
    }
  }, []);

  if (!errorMessage && !successMessage) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {successMessage && (
        <div
          className={`transition-all duration-500 ease-in-out transform p-4 rounded-lg shadow-lg text-white bg-green-500 ${
            showError ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <strong>Sukses! </strong> {successMessage}
        </div>
      )}

      {errorMessage && (
        <div
          className={`transition-all duration-500 ease-in-out transform p-4 rounded-lg shadow-lg text-white bg-red-500 ${
            showError ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <strong>Error! </strong> {errorMessage}
        </div>
      )}
    </div>
  );
}
