import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Save, ChevronLeft, Shield, Edit } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";

function PeranEditDialog({ role, permissions, trigger }) {
  const [open, setOpen] = useState(false);
  const { data, setData, put, processing, errors, reset } = useForm({
    name: role.name || "",
    deskripsi: role.deskripsi || "",
    permissions: role.permissions?.map((p) => p.id) || [],
  });

  const handlePermissionChange = (permissionId, checked) => {
    if (checked) {
      setData("permissions", [...data.permissions, permissionId]);
    } else {
      setData(
        "permissions",
        data.permissions.filter((id) => id !== permissionId)
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/role/edit/${role.id}`, {
      onSuccess: () => {
        // Dialog akan tertutup otomatis setelah sukses
      },
    });
  };

  return (
    <Dialog className="z-50">
      <DialogTrigger asChild>
        {trigger || (
          <Button className="cursor-pointer">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[800px] border-border max-h-[90vh] overflow-y-auto"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <Card className="border-border">
            <div className="grid grid-cols-1 sm:flex sm:justify-between items-center px-6 py-2 gap-4">
              <DialogTitle>
                <div className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
                  <Shield className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
                  Edit Peran
                </div>
              </DialogTitle>
              <DialogDescription className="sr-only">
                Form untuk mengedit Peran.
              </DialogDescription>
              <div className="grid grid-cols-1 gap-2 sm:flex">
                <DialogPrimitive.Close asChild>
                  <Button className="cursor-pointer">
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </Button>
                </DialogPrimitive.Close>
              </div>
            </div>
          </Card>
        </DialogHeader>

        <Card className="px-6 py-8 space-y-2 border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground text-base block">
                Nama Peran
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={data.name}
                className="border-border"
                placeholder="Masukkan nama peran"
                onChange={(e) => setData("name", e.target.value)}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="deskripsi"
                className="text-foreground text-base block"
              >
                Deskripsi
              </Label>
              <Textarea
                id="deskripsi"
                name="deskripsi"
                value={data.deskripsi}
                className="border-border"
                placeholder="Masukkan deskripsi peran"
                onChange={(e) => setData("deskripsi", e.target.value)}
              />
              {errors.deskripsi && (
                <p className="text-sm text-red-500">{errors.deskripsi}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label className="text-foreground text-base block">
                Permissions
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto border border-border rounded-lg p-4">
                {permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`permission-${permission.id}`}
                      checked={data.permissions.includes(permission.id)}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(permission.id, checked)
                      }
                    />
                    <Label
                      htmlFor={`permission-${permission.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {permission.name}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.permissions && (
                <p className="text-sm text-red-500">{errors.permissions}</p>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="border-border cursor-pointer hover:border-accent"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={processing}
              >
                <Save className="w-4 h-4" />
                {processing ? "Menyimpan..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default PeranEditDialog;
