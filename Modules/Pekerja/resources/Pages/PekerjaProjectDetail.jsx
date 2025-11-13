import React from "react";
import { Head, useForm } from "@inertiajs/react";
import Navbar from "@/layout/NavBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

function PekerjaProjectDetail({ project, pekerja, posisi, roles }) {
  const { data, setData, put, processing } = useForm({
    posisi: posisi || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/projects/${project.id}/pekerja/${pekerja.id}/update`);
  };

  return (
    <>
      <Head title={`Detail ${pekerja.name} - ${project.nama}`} />
      <div className="space-y-6">
        <Card className="p-6 border-border flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Detail Pekerja di Project {project.nama}
          </h1>
          <Button variant="outline" onClick={() => window.history.back()}>
            Kembali
          </Button>
        </Card>

        {/* Informasi Pekerja */}
        <Card className="p-6 border-border space-y-4">
          <h2 className="text-xl font-semibold mb-2">Informasi Pekerja</h2>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-sm">Nama</p>
              <p className="text-base font-medium">{pekerja.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Email</p>
              <p className="text-base font-medium">{pekerja.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Posisi Saat Ini</p>
              <p className="text-base font-medium">{pekerja.roles[0].name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Tanggal Bergabung</p>
              <p className="text-base font-medium">
                {new Date(pekerja.created_at).toLocaleDateString("id-ID")}
              </p>
            </div>
          </div>
        </Card>

        {/* Form Edit Role */}
        <Card className="p-6 border-border space-y-4">
          <h2 className="text-xl font-semibold mb-2">Edit Posisi Pekerja</h2>
          <Separator />

          <form onSubmit={handleSubmit} className="flex items-center gap-4">
            <Select
              value={data.posisi}
              onValueChange={(value) => setData("posisi", value)}
            >
              <SelectTrigger className="w-64 border-border">
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

            <Button type="submit" disabled={processing}>
              {processing ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}

PekerjaProjectDetail.layout = (page) => <Navbar>{page}</Navbar>;
export default PekerjaProjectDetail;
