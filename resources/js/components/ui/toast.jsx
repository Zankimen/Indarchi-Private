import React, { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

function Toast({ message, type = "success", duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const isSuccess = type === "success";
  const bgColor = isSuccess ? "bg-green-500" : "bg-red-500";
  const textColor = "text-white";
  const Icon = isSuccess ? Check : X;

  const toastStyle = {
    position: "fixed",
    bottom: "1rem",
    right: "1rem",
    zIndex: 9999,
    animation: "slideIn 0.3s ease-out",
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
      <div
        style={toastStyle}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${bgColor} ${textColor} max-w-sm`}
        role="alert"
        aria-live="polite"
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-auto flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}

export default Toast;
