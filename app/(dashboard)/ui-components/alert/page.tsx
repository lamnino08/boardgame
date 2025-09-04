'use client';

import Button from "@/components/ui/common/button/button";
import { useAlert } from "@/contexts/alert-context";

export default function AlertPage() {
  const showAlert = useAlert(); // trả về function

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen">
      <Button onClick={() => showAlert("This is an info alert", "success")}>
        Alert Success
      </Button>
      <Button onClick={() => showAlert("This is an info alert", "info")}>
        Alert Info
      </Button>
      <Button onClick={() => showAlert("This is a warning alert", "warning")}>
        Alert Warn
      </Button>
      <Button onClick={() => showAlert("This is an error alert", "error")}>
        Alert Error
      </Button>
    </div>
  );
}
