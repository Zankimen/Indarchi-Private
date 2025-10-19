import React from "react";
import { Head } from "@inertiajs/react";
import Navbar from "@/layout/NavBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function PekerjaProjectDetail({ project, pekerja, posisi }) {
  return (
    <>
      <Head title={`Detail ${pekerja.name} - ${project.nama}`} />
      <div className="space-y-6">
        <Card className="p-6 border-border">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              Detail Pekerja di Project {project.nama}
            </h1>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
            >
              Kembali
            </Button>
          </div>
        </Card>

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
              <p className="text-muted-foreground text-sm">Posisi</p>
              <p className="text-base font-medium">{posisi}</p>
            </div>

            <div>
              <p className="text-muted-foreground text-sm">Tanggal Bergabung</p>
              <p className="text-base font-medium">
                {new Date(pekerja.created_at).toLocaleDateString("id-ID")}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border space-y-4">
          <h2 className="text-xl font-semibold mb-2">Informasi Project</h2>
          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-sm">Nama Project</p>
              <p className="text-base font-medium">{project.nama}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Lokasi</p>
              <p className="text-base font-medium">{project.lokasi}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Tanggal Mulai</p>
              <p className="text-base font-medium">{project.tanggal_mulai}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Tanggal Selesai</p>
              <p className="text-base font-medium">{project.tanggal_selesai}</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

PekerjaProjectDetail.layout = (page) => <Navbar children={page} />;
export default PekerjaProjectDetail;
