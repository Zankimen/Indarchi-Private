import React from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import Dashboard from "@/layout/Dashboard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDateNoHour } from "@/components/lib/utils";
import PekerjaEditDialog from "./PekerjaEditDialog";
import DeleteConfirmationDialog from "../../../Peran/resources/Pages/DeleteConfirmationDialog";
import { toast } from "sonner";
import { getPermissionDisplayName } from "@/components/lib/permissionDisplayUtils";

function PekerjaDetails({ pekerja, perans }) {
  const {
    props: { auth },
  } = usePage();

  const hasPermission = (permission) => auth.permissions.includes(permission);
  const isAdmin = pekerja?.roles && Array.isArray(pekerja.roles) && pekerja.roles.some((r) => (r?.name || r)?.toString().toLowerCase() === "admin");

  const handleDelete = () => {
    router.delete(`/dashboard/pekerja/${pekerja.id}`, {
      onError: (errors) => {
        console.error("Delete pekerja error:", errors);
        const errorMessage = errors?.error || "Gagal menghapus pekerja – cek network/console untuk detail.";
        toast.error(errorMessage);
      },
      onSuccess: () => {
        router.visit(`/dashboard/pekerja`);
      },
    });
  };

  return (
    <>
      <Head title={pekerja.name} />
      <div className="space-y-4">
        <Card className="border-border">
          <div className="grid grid-cols-1 sm:flex sm:justify-between items-center px-6 py-2 gap-4">
            <div className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
              <Avatar className="w-10 h-10 mr-4">
                {pekerja.avatar_url || pekerja.avatar ? (
                  <AvatarImage src={pekerja.avatar_url || pekerja.avatar} />
                ) : (
                  <AvatarFallback>{(pekerja.name || "").split(" ").map((s) => s[0]).slice(0,2).join("")}</AvatarFallback>
                )}
              </Avatar>
              {pekerja.name}
            </div>
            <div className="grid grid-cols-1 gap-2 sm:flex">
              <Link href="/dashboard/pekerja">
                <Button>
                  <ChevronLeft className="w-4 h-4" />
                  Kembali
                </Button>
              </Link>
              {hasPermission("dashboard.worker.manage") && (
                <>
                  <PekerjaEditDialog pekerja={pekerja} perans={perans} />

                  {!isAdmin ? (
                    <DeleteConfirmationDialog
                      onConfirm={handleDelete}
                      title="Hapus Pekerja"
                      description={`Apakah Anda yakin ingin menghapus pekerja "${pekerja.name}"?`}
                      warningText="Pekerja yang dihapus tidak dapat dikembalikan."
                    />
                  ) : (
                    <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-sm text-amber-800 dark:text-amber-200">Akun admin tidak dapat dihapus</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 px-8 border-border">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
            <Detail label="Nama" value={pekerja.name} />
            <Detail label="Email" value={pekerja.email} />
            <Detail label="Alamat" value={pekerja.alamat} />
            <Detail label="Posisi/Role" value={pekerja.roles?.[0]?.name || "-"} />
            <Detail label="Dibuat Pada" value={formatDateNoHour(pekerja.created_at)} />
            <Detail label="Terakhir Di-Update" value={formatDateNoHour(pekerja.updated_at)} />
          </div>
        </Card>

        
        {pekerja.permissions && pekerja.permissions.length > 0 && (
          <Card className="p-6 px-8 border-border">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Permissions</h3>
                <div className="text-sm text-muted-foreground">
                  Total: {pekerja.permissions.length} permissions
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pekerja.permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="inline-flex items-center px-3 py-2 rounded-lg bg-accent/50 border border-border text-sm font-medium"
                    title={permission.name}
                  >
                    {getPermissionDisplayName(permission.name)}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
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

PekerjaDetails.layout = (page) => <Dashboard title={"Detail Pekerja"}>{page}</Dashboard>;

export default PekerjaDetails;
