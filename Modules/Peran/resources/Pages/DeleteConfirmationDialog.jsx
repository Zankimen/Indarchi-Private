import React, { useState } from "react";
import { Trash, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function DeleteConfirmationDialog({
  onConfirm,
  title = "Hapus Data",
  description = "Apakah Anda yakin ingin menghapus data ini?",
  warningText = "Tindakan ini tidak dapat dibatalkan.",
  triggerText = "Hapus",
  variant = "destructive",
  showIcon = true,
}) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={variant}>
          {showIcon && <Trash className="w-4 h-4" />}
          {triggerText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px] border-border">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl font-semibold">{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base text-foreground/80 space-y-2 pt-2">
            <p>{description}</p>
            <p className="text-sm text-destructive font-medium">{warningText}</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2 mt-4">
          <AlertDialogCancel asChild>
            <Button variant="outline" className="border-border">
              Batal
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handleConfirm}>
              <Trash className="w-4 h-4 mr-2" />
              Ya, Hapus
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteConfirmationDialog;
