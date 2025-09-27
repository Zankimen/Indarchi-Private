import React from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import Dashboard from "@/layout/Dashboard";
import { Save, ChevronLeft, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

function PeranEdit() {
  const { role, permissions } = usePage().props;

  const { data, setData, put, processing, errors } = useForm({
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
    put(`/role/edit/${role.id}`);
  };

  return (
    <>
      <Head title={`Edit Peran - ${role.name}`} />
      <div className="space-y-4">
        <Card className="border-border">
          <div className="grid grid-cols-1 sm:flex sm:justify-between items-center px-6 py-2 gap-4">
            <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
              <Shield className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
              Edit Peran
            </h1>
            <div className="grid grid-cols-1 gap-2 sm:flex">
              <Link href="/role">
                <Button className="cursor-pointer">
                  <ChevronLeft className="w-4 h-4" />
                  Kembali
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="px-6 py-8 space-y-2 border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Peran</Label>
                <Input
                  type="text"
                  id="name"
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
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Textarea
                  id="deskripsi"
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
                <Label>Permissions</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
            </div>

            <div className="flex justify-end items-center">
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={processing}
              >
                Simpan Perubahan
                <Save className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

PeranEdit.layout = (page) => <Dashboard children={page} />;

export default PeranEdit;
