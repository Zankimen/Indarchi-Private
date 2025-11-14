import React, { useState, useEffect, useMemo } from "react";
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

function PeranEditDialog({ peran, permissions, trigger }) {
  const [open, setOpen] = useState(false);

  const { data, setData, put, processing, errors, reset } = useForm({
    name: peran.name || "",
    deskripsi: peran.deskripsi || "",
    permissions: peran.permissions?.map((p) => p.id) || [],
  });

  const dashboardPermissions = useMemo(() => {
    return permissions.filter((permission) => !permission.name.startsWith("project."));
  }, [permissions]);

  useEffect(() => {
    if (open) {
      setData({
        name: peran.name || "",
        deskripsi: peran.deskripsi || "",
        permissions: peran.permissions?.map((p) => p.id) || [],
      });
    }
  }, [open, peran]);

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
    put(`/dashboard/peran/edit/${peran.id}`, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  const handleCancel = () => {
    setData({
      name: peran.name || "",
      deskripsi: peran.deskripsi || "",
      permissions: peran.permissions?.map((p) => p.id) || [],
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} className="z-50">
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
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
              <DialogDescription className="sr-only">Form untuk mengedit Peran.</DialogDescription>
              <div className="grid grid-cols-1 gap-2 sm:flex">
                <DialogPrimitive.Close asChild>
                  <Button onClick={handleCancel}>
                    <ChevronLeft className="w-4 h-4" />
                    Kembali
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
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi" className="text-foreground text-base block">
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
              {errors.deskripsi && <p className="text-sm text-red-500">{errors.deskripsi}</p>}
            </div>

            <div className="space-y-4">
              <Label className="text-foreground text-base block">
                Permissions
                <span className="text-sm text-muted-foreground font-normal ml-2">
                  (Hanya permissions untuk dashboard global)
                </span>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto border border-border rounded-lg p-4">
                {dashboardPermissions.length > 0 ? (
                  dashboardPermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
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
                        title={permission.name}
                      >
                        {permission.display_name || permission.name}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="col-span-3 text-sm text-muted-foreground text-center py-4">
                    Tidak ada permission tersedia
                  </p>
                )}
              </div>
              {errors.permissions && <p className="text-sm text-red-500">{errors.permissions}</p>}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="border-border cursor-pointer hover:border-accent"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button type="submit" className="cursor-pointer" disabled={processing}>
                <Save className="w-4 h-4" />
                {processing ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default PeranEditDialog;
