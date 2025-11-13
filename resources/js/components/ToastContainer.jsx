import React, { useState, useRef } from "react";
import { usePage } from "@inertiajs/react";
import Toast from "@/components/ui/toast";

export function ToastContainer() {
  const { props } = usePage();
  const [toasts, setToasts] = useState([]);
  const lastMessageRef = useRef("");

  // Whenever flash message changes, check if it's new
  React.useEffect(() => {
    const currentMessage = JSON.stringify(props.flash);
    if (currentMessage !== lastMessageRef.current) {
      lastMessageRef.current = currentMessage;

      if (props.flash?.success) {
        const id = Date.now();
        setTimeout(() => {
          setToasts((prev) => [...prev, { id, message: props.flash.success, type: "success" }]);
        }, 0);
      }
      if (props.flash?.error) {
        const id = Date.now() + 1;
        setTimeout(() => {
          setToasts((prev) => [...prev, { id, message: props.flash.error, type: "error" }]);
        }, 0);
      }
    }
  }, [props.flash]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}

export default ToastContainer;
