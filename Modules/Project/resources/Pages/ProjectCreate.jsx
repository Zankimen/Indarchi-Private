import React from "react";
import { useForm, Link, Head } from "@inertiajs/react";

import Dashboard from "@/layout/Dashboard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, ChevronLeft, FolderKanban } from "lucide-react";

function ProjectCreate() {
  const { data, setData, post, processing, errors } = useForm({
    nama: "",
    deskripsi: "",
    lokasi: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    radius: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/dashboard/projects");
  };

  return (
    <>
      <Head title="Tambah Project" />
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderKanban className="w-10 h-10 bg-accent text-background rounded-2xl p-2" />
            <h1 className="text-2xl font-bold">Tambah Project</h1>
          </div>

          <Link href="/dashboard/projects">
            <Button variant="outline" className="flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Kembali
            </Button>
          </Link>
        </div>

        {/* Form Section */}
        <Card className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="nama">Nama</Label>
                <Input
                  id="nama"
                  value={data.nama}
                  onChange={(e) => setData("nama", e.target.value)}
                />
                {errors.nama && (
                  <p className="text-sm text-red-500 mt-1">{errors.nama}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lokasi">Lokasi</Label>
                <Input
                  id="lokasi"
                  value={data.lokasi}
                  onChange={(e) => setData("lokasi", e.target.value)}
                />
                {errors.lokasi && (
                  <p className="text-sm text-red-500 mt-1">{errors.lokasi}</p>
                )}
              </div>

              <div>
                <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                <Input
                  id="tanggal_mulai"
                  type="date"
                  value={data.tanggal_mulai}
                  onChange={(e) => setData("tanggal_mulai", e.target.value)}
                />
                {errors.tanggal_mulai && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.tanggal_mulai}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                <Input
                  id="tanggal_selesai"
                  type="date"
                  value={data.tanggal_selesai}
                  onChange={(e) => setData("tanggal_selesai", e.target.value)}
                />
                {errors.tanggal_selesai && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.tanggal_selesai}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="radius">Radius</Label>
                <Input
                  id="radius"
                  type="number"
                  value={data.radius}
                  onChange={(e) => setData("radius", e.target.value)}
                />
                {errors.radius && (
                  <p className="text-sm text-red-500 mt-1">{errors.radius}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Textarea
                  id="deskripsi"
                  value={data.deskripsi}
                  onChange={(e) => setData("deskripsi", e.target.value)}
                />
                {errors.deskripsi && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.deskripsi}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Link href="/dashboard/projects">
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                >
                  Batal
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={processing}
                className="cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {processing ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

ProjectCreate.layout = (page) => (
  <Dashboard children={page} title="Tambah Project" />
);

export default ProjectCreate;
