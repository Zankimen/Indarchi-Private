import React from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";

import Dashboard from "@/layout/Dashboard";
import { Pencil, ChevronLeft, Trash } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateNoHour } from "@/components/lib/utils";

function ProjectDetail() {
  const { project } = usePage().props;

  return (
    <>
      <Head title={project.nama} />
      <div className="space-y-4">
        {/* Header */}
        <Card className="border-border">
          <div className="grid grid-cols-1 sm:flex sm:justify-between items-center px-6 py-2 gap-4">
            {/* Nama project */}
            <div className="flex items-center gap-4 m-0 p-0 w-full justify-center sm:justify-start">
              <h1 className="flex font-bold text-2xl text-primary bg-accent items-center justify-center rounded-2xl w-10 h-10">
                {project.nama?.charAt(0) || "P"}
              </h1>
              <div>
                <h1 className="flex items-center h-full m-0 p-0 font-bold text-2xl md:text-2xl">
                  {project.nama}
                </h1>
              </div>
            </div>

            {/* Tombol aksi */}
            <div className="grid grid-cols-1 gap-2 sm:flex">
              <Link href="/projects">
                <Button className="cursor-pointer">
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <Link href={`/projects/${project.id}/edit`}>
                <Button
                  variant="outline"
                  className="cursor-pointer border-border"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="destructive"
                className="cursor-pointer"
                onClick={() => {
                  if (
                    confirm("Are you sure you want to delete this Project?")
                  ) {
                    router.delete(`/projects/${project.id}`);
                  }
                }}
              >
                <Trash className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </Card>

        {/* Detail Project */}
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

ProjectDetail.layout = (page) => <Dashboard children={page} />;

export default ProjectDetail;
