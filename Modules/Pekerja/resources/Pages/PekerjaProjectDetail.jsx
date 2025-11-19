import React, { useEffect } from "react";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import Navbar from "@/layout/NavBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import DeleteConfirmationDialog from "../../../Peran/resources/Pages/DeleteConfirmationDialog";
import { toast } from "sonner";

function PekerjaProjectDetail({ project, pekerja, posisi, roles }) {
  const { flash } = usePage().props;
  const {
    props: { auth },
  } = usePage();

  const hasPermission = (permission) => auth.permissions.includes(permission);
  
  const { data, setData, put, processing } = useForm({
    posisi: posisi || "",
  });

  // Update form when posisi prop changes
  useEffect(() => {
    if (posisi) {
      setData("posisi", posisi);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posisi]);

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/projects/${project?.id}/pekerja/${pekerja?.id}/update`, {
      preserveScroll: true,
      onSuccess: () => {
        // Form will be reset and page will reload with new data
      },
    });
  };

  const handleRemove = () => {
    router.delete(`/projects/${project?.id}/pekerja/${pekerja?.id}`, {
      onError: (errors) => {
        console.error("Remove pekerja error:", errors);
        const errorMessage = errors?.error || "Gagal mengeluarkan pekerja — cek network/console untuk detail.";
        toast.error(errorMessage);
      },
      onSuccess: () => {
        router.visit(`/projects/${project?.id}/pekerja`);
      },
    });
  };

  // Safety check - if data is missing, show error message
  if (!project || !pekerja) {
    return (
      <>
        <Head title="Detail Pekerja" />
        <div className="space-y-6">
          <Card className="p-6 border-border">
            <p className="text-muted-foreground text-center py-8">
              Data pekerja tidak ditemukan.
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>
              Kembali
            </Button>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Head title={`Detail ${pekerja?.name || "Pekerja"} - ${project?.nama || "Project"}`} />
      <div className="space-y-6">
        <Card className="p-6 border-border flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Detail Pekerja di Project {project?.nama || project?.name || `#${project?.id}`}
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => window.history.back()}>
              Kembali
            </Button>
            {hasPermission && hasPermission("project.worker.manage") && (
              <DeleteConfirmationDialog
                onConfirm={handleRemove}
                title="Keluarkan Pekerja dari Project"
                description={`Apakah Anda yakin ingin mengeluarkan pekerja "${pekerja?.name || "-"}" dari project "${project?.nama || project?.name || "-"}"?`}
                warningText="Aksi ini akan menghapus keanggotaan pekerja di project."
                triggerText="Keluarkan"
                variant="destructive"
              />
            )}
          </div>
        </Card>

        {/* Informasi Pekerja */}
        <Card className="p-6 border-border space-y-4">
          <h2 className="text-xl font-semibold mb-2">Informasi Pekerja</h2>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-sm">Nama</p>
              <p className="text-base font-medium">{pekerja?.name || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Email</p>
              <p className="text-base font-medium">{pekerja?.email || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Posisi Saat Ini</p>
              <p className="text-base font-medium">
                {posisi || pekerja?.roles?.[0]?.name || (pekerja?.roles && pekerja.roles.length > 0 ? pekerja.roles[0].name : "-")}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Tanggal Bergabung</p>
              <p className="text-base font-medium">
                {pekerja?.created_at 
                  ? new Date(pekerja.created_at).toLocaleDateString("id-ID")
                  : "-"}
              </p>
            </div>
          </div>
        </Card>

        {/* Form Edit Role */}
        <Card className="p-6 border-border space-y-4">
          <h2 className="text-xl font-semibold mb-2">Edit Posisi Pekerja</h2>
          <Separator />

          {/* Success/Error Messages */}
          {flash?.success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm">
              {flash.success}
            </div>
          )}
          {flash?.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
              {flash.error}
            </div>
          )}

          {roles && roles.length > 0 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 max-w-xs">
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    Pilih Posisi
                  </div>
                  <Select
                    value={data.posisi}
                    onValueChange={(value) => setData("posisi", value)}
                  >
                    <SelectTrigger className="w-full border-border">
                      <SelectValue placeholder="Pilih Posisi Baru" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.name}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center mt-7">
                  <Button type="submit" disabled={processing || !data.posisi}>
                    {processing ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </div>
              </div>
              {data.posisi && (
                <p className="text-xs text-muted-foreground">
                  Posisi yang dipilih: <span className="font-medium">{data.posisi}</span>
                </p>
              )}
            </form>
          ) : (
            <div className="space-y-3">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800 text-sm font-medium mb-2">
                  Tidak ada posisi tersedia
                </p>
                <p className="text-yellow-700 text-sm mb-3">
                  Silakan buat posisi (peran) terlebih dahulu di halaman Peran Project sebelum dapat mengedit posisi pekerja.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Navigate to peran project page to create roles
                    window.location.href = `/projects/${project?.id}/peran`;
                  }}
                >
                  Pergi ke Halaman Peran Project
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

PekerjaProjectDetail.layout = (page) => <Navbar>{page}</Navbar>;
export default PekerjaProjectDetail;
