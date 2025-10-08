import React from "react";
import { Head, usePage } from "@inertiajs/react";

import { Card } from "@/components/ui/card";
import { formatDateNoHour } from "@/components/lib/utils";
import Navbar from "@/layout/NavBar";

function ProjectDetail({ project }) {
  return (
    <>
      <Head title={project.nama} />
      <div className="space-y-4">
        <Card className="p-6 px-8 border-border">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
            <Detail label="Nama" value={project.nama} />
            <Detail label="Client" value={project.client} />
            <Detail label="Deskripsi" value={project.deskripsi} />
            <Detail label="Lokasi" value={project.lokasi} />
            <Detail label="Status" value={project.status} />
            <Detail
              label="Tanggal Mulai"
              value={formatDateNoHour(project.tanggal_mulai)}
            />
            <Detail
              label="Tanggal Selesai"
              value={formatDateNoHour(project.tanggal_selesai)}
            />
            <Detail label="Radius" value={project.radius} />
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

ProjectDetail.layout = (page) => <Navbar children={page} />;

export default ProjectDetail;
