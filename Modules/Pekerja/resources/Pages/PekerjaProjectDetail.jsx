import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (posisi) {
      setData("posisi", posisi);
    }
  }, [posisi]);

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/projects/${project?.id}/pekerja/${pekerja?.id}/update`, {
      preserveScroll: true,
      onSuccess: () => {
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

       
        <Card className="p-6 border-border space-y-4">
          <h2 className="text-xl font-semibold mb-2">Edit Posisi Pekerja</h2>
          <Separator />

          
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
                    window.location.href = `/projects/${project?.id}/peran`;
                  }}
                >
                  Pergi ke Halaman Peran Project
                </Button>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6 border-border space-y-4">
          <h2 className="text-xl font-semibold mb-2">Presensi Pekerja</h2>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground mb-2">Lihat hasil presensi pekerja pada project ini (bulan berjalan).</p>

            <PresensiList projectId={project?.id} pekerjaId={pekerja?.id} />
          </div>
        </Card>
      </div>
    </>
  );
}

function PresensiList({ projectId, pekerjaId }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!projectId || !pekerjaId) return;

    async function fetchPresensi() {
      setLoading(true);
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");

        const res = await window.fetch(`/projects/${projectId}/presensi-pekerja?user_id=${pekerjaId}&year=${year}&month=${month}`, {
          credentials: "same-origin",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal ambil data presensi.");

        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gagal load presensi:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPresensi();
  }, [projectId, pekerjaId]);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Memuat presensi...</p>;
  }

  if (!items || items.length === 0) {
    return <p className="text-center text-muted-foreground py-6">Tidak ada presensi dibuka</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {items.map((it, idx) => {
        const status = (it.status || "").toLowerCase();
        const isHadir = status === "hadir";
        const dateLabel = it.tanggal ? new Date(it.tanggal).toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric' }) : "-";
        const timeLabel = it.jam_masuk || it.jam_keluar ? `${(it.jam_masuk || '-')}` + (it.jam_keluar ? ` - ${it.jam_keluar}` : '') : "-";

        return (
          <div
            key={it.id || idx}
            className={`rounded-lg p-3 min-h-[88px] flex flex-col justify-between ${isHadir ? 'bg-[#2afa5b]/50' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-semibold">Presensi</div>
              <div className="text-xs px-2 py-0.5 rounded-full bg-white text-muted-foreground">{idx + 1}</div>
            </div>

            <div className="text-sm text-black mb-2">{dateLabel} · {timeLabel} WIB</div>


            <div className="flex items-center justify-between mt-2">
              <div className={`text-xs font-medium ${isHadir ? 'text-black' : 'text-gray-800'}`}>Kehadiran anda: {it.status ? String(it.status).toUpperCase() : 'TIDAK TERDATA'}</div>
              <div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const presensiId = it.id || it.schedule_id || `sched_${it.id}`;
                    router.visit(`/projects/${projectId}/presensi/${presensiId}`);
                  }}
                >
                  Detail
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

PekerjaProjectDetail.layout = (page) => <Navbar>{page}</Navbar>;
export default PekerjaProjectDetail;
