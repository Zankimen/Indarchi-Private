import React from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import Dashboard from "@/layout/Dashboard";
import { Pencil, ChevronLeft, Trash, Shield, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateNoHour } from "@/components/lib/utils";
import PeranEditDialog from "./PeranEditDialog";

function PeranDetails() {
  const { role, permissions } = usePage().props;

  const handleDelete = () => {
    if (confirm("Apakah Anda yakin ingin menghapus peran ini?")) {
      router.delete(`/role/${role.id}`, {
        onSuccess: () => {
          router.visit("/role");
        },
        onError: (errors) => {
          if (errors.error) {
            alert(errors.error);
          }
        },
      });
    }
  };

  const PermissionBadge = ({ children }) => (
    <div className="inline-flex items-center px-3 py-2 rounded-lg bg-accent/50 border border-border text-sm font-medium text-foreground hover:bg-accent/70 transition-colors">
      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
      {children}
    </div>
  );

  return (
    <>
      <Head title={role.name} />
      <div className="space-y-4">
        <Card className="border-border">
          <div className="grid grid-cols-1 sm:flex sm:justify-between items-center px-6 py-2 gap-4">
            <div className="flex items-center gap-4 m-0 p-0 w-full justify-center sm:justify-start">
              <h1 className="flex font-bold text-2xl text-primary bg-accent items-center justify-center rounded-2xl w-10 h-10">
                <Shield className="w-6 h-6" />
              </h1>
              <div>
                <h1 className="flex items-center h-full m-0 p-0 font-bold text-2xl md:text-2xl">
                  {role.name}
                </h1>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:flex">
              <Link href="/role">
                <Button className="cursor-pointer">
                  <ChevronLeft className="w-4 h-4" />
                  Kembali
                </Button>
              </Link>
              <PeranEditDialog
                role={role}
                permissions={permissions}
                trigger={
                  <Button
                    variant="outline"
                    className="cursor-pointer border-border"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Button>
                }
              />
              <Button
                variant="destructive"
                className="cursor-pointer"
                onClick={handleDelete}
              >
                <Trash className="w-4 h-4" />
                Hapus
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 px-8 border-border">
          <div className="w-full space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Detail label="Nama Peran" value={role.name} />
              <Detail
                label="Deskripsi"
                value={role.deskripsi || "Tidak ada deskripsi"}
              />
              <Detail
                label="Jumlah Permission"
                value={role.permissions?.length || 0}
              />
              <Detail label="Guard Name" value={role.guard_name || "web"} />
              <Detail
                label="Dibuat"
                value={formatDateNoHour(role.created_at)}
              />
              <Detail
                label="Terakhir Diperbarui"
                value={formatDateNoHour(role.updated_at)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Permissions</h3>
                <div className="text-sm text-muted-foreground">
                  Total: {role.permissions?.length || 0} permissions
                </div>
              </div>

              {role.permissions && role.permissions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {role.permissions.map((permission) => (
                    <PermissionBadge key={permission.id}>
                      {permission.name}
                    </PermissionBadge>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                  <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Tidak ada permission</p>
                  <p className="text-sm">
                    Peran ini belum memiliki permission yang diberikan
                  </p>
                  <PeranEditDialog
                    role={role}
                    permissions={permissions}
                    trigger={
                      <Button variant="outline" size="sm" className="mt-4">
                        Tambah Permission
                      </Button>
                    }
                  />
                </div>
              )}
            </div>

            {role.permissions && role.permissions.length > 0 && (
              <div className="space-y-4 border-t border-border pt-6">
                <h4 className="text-md font-semibold">Permission Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    ...new Set(
                      role.permissions.map((p) => p.name.split(".")[0])
                    ),
                  ].map((category) => (
                    <div
                      key={category}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

const Detail = ({ label, value }) => (
  <div className="space-y-2">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="text-base font-semibold text-foreground">{value ?? "-"}</p>
  </div>
);

PeranDetails.layout = (page) => <Dashboard children={page} />;

export default PeranDetails;
