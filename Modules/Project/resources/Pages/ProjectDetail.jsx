import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, Pencil } from "lucide-react";
import { formatDateNoHour } from "@/components/lib/utils";
import Navbar from "@/layout/NavBar";

function ProjectDetail({ project }) {
  return (
    <>
      <Head title={project.nama} />
      <div className="max-w-6xl mx-auto py-8 px-6 space-y-8">
        {/* Header Proyek */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Gambar proyek */}
          <img
            src={project.foto_url ?? "/foto.jpg"}
            alt={project.nama}
            className="rounded-2xl w-full h-[300px] object-cover"
          />

          {/* Informasi proyek */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground uppercase">{project.nama}</h1>
                  <p className="text-base font-semibold mt-1">Deskripsi</p>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {project.deskripsi ?? "Belum ada deskripsi proyek untuk saat ini."}
                  </p>
                </div>

                {/* Tombol aksi */}
                <div className="flex flex-col gap-2 items-end">
                  <Link href={`/projects/${project.id}/edit`}>
                    <Button variant="default">
                      <Pencil className="w-4 h-4 mr-2" /> Edit Proyek
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Proyek */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* DETAIL PROYEK */}
          <Card className="bg-secondary border border-border rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-center mb-4 text-lg">DETAIL PROYEK</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-muted-foreground">Client</p>
                  <p className="font-semibold text-foreground">{project.nama ?? "PT. Indarchi"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-muted-foreground">Lokasi</p>
                  <p className="font-semibold text-foreground">{project.lokasi ?? "Klaten"}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* WAKTU */}
          <Card className="bg-secondary border border-border rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-center mb-4 text-lg">WAKTU</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-muted-foreground">Mulai</p>
                  <p className="font-semibold text-foreground">
                    {formatDateNoHour(project.tanggal_mulai) ?? "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-muted-foreground">Selesai</p>
                  <p className="font-semibold text-foreground">
                    {formatDateNoHour(project.tanggal_selesai) ?? "-"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* STATUS */}
          <Card className="bg-secondary border border-border rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-center mb-4 text-lg">STATUS</h2>
            <div className="flex justify-center items-center">
              <Button>{project.status ?? "Dalam Proses"}</Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

ProjectDetail.layout = (page) => <Navbar>{page}</Navbar>;

export default ProjectDetail;
