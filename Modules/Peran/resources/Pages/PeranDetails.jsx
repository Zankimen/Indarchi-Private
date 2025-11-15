import React from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import Dashboard from "@/layout/Dashboard";
import { ChevronLeft, Shield, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateNoHour } from "@/components/lib/utils";
import { toast } from "sonner";
import PeranEditDialog from "./PeranEditDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

function PeranDetails({ peran, permissions }) {
  const {
    props: { auth },
  } = usePage();

  const hasPermission = (permission) => auth.permissions.includes(permission);

  const isProtectedRole = peran.name.toLowerCase() === "admin";

  const handleDelete = () => {
    router.delete(`/dashboard/peran/${peran.id}`, {
      onError: (errors) => {
        console.error("Delete peran error:", errors);
        const errorMessage =
          errors?.error || "Gagal menghapus peran – cek network/console untuk detail.";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <>
      <Head title={peran.name} />
      <div className="space-y-4">
        <Card className="border-border">
          <div className="grid grid-cols-1 sm:flex sm:justify-between items-center px-6 py-2 gap-4">
            <div className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
              <Shield className="w-10 h-10 bg-accent text-background rounded-2xl mr-4 p-2" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="flex items-center h-full m-0 p-0 font-bold text-2xl md:text-2xl">
                    {peran.name}
                  </h1>
                  {isProtectedRole && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md">
                      <Lock className="w-3 h-3 text-amber-600" />
                      <span className="text-xs font-medium text-amber-600">Protected</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:flex">
              <Link href="/dashboard/peran">
                <Button>
                  <ChevronLeft className="w-4 h-4" />
                  Kembali
                </Button>
              </Link>

              {hasPermission("dashboard.role.manage") && !isProtectedRole && (
                <>
                  <PeranEditDialog peran={peran} permissions={permissions} />

                  <DeleteConfirmationDialog
                    onConfirm={handleDelete}
                    title="Hapus Peran"
                    description={`Apakah Anda yakin ingin menghapus peran "${peran.name}"?`}
                    warningText="Peran yang dihapus tidak dapat dikembalikan."
                  />
                </>
              )}

              {isProtectedRole && (
                <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Peran ini dilindungi dan tidak dapat diubah
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 px-8 border-border">
          <div className="w-full space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Detail label="Nama Peran" value={peran.name} />
              <Detail label="Deskripsi" value={peran.deskripsi || "Tidak ada deskripsi"} />
              <Detail label="Jumlah Permission" value={peran.permissions?.length || 0} />
              <Detail label="Guard Name" value={peran.guard_name || "web"} />
              <Detail label="Dibuat" value={formatDateNoHour(peran.created_at)} />
              <Detail label="Terakhir Diperbarui" value={formatDateNoHour(peran.updated_at)} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Permissions</h3>
                <div className="text-sm text-muted-foreground">
                  Total: {peran.permissions?.length || 0} permissions
                </div>
              </div>

              {peran.permissions && peran.permissions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {peran.permissions.map((permission) => (
                    <Button key={permission.id} variant="outline" disabled>
                      {permission.name}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                  <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Tidak ada permission</p>
                  <p className="text-sm">Peran ini belum memiliki permission yang diberikan</p>
                </div>
              )}
            </div>

            {peran.permissions && peran.permissions.length > 0 && (
              <div className="space-y-4 border-t border-border pt-6">
                <h4 className="text-md font-semibold">Permission Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(peran.permissions.map((p) => p.name.split(".")[0]))].map(
                    (category) => (
                      <div
                        key={category}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </div>
                    )
                  )}
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

PeranDetails.layout = (page) => <Dashboard title={"Detail Peran"}>{page}</Dashboard>;

export default PeranDetails;
