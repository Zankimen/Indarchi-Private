import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import Dashboard from "@/layout/Dashboard";

import { Save, ChevronLeft, FolderKanban } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function ProjectCreate() {
  const { data, setData, post, processing, errors, reset } = useForm({
    nama: "",
    deskripsi: "",
    client: "",
    status: "draft",
    tanggal_mulai: "",
    tanggal_selesai: "",
    radius: "",
    lokasi: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/projects", {
      onSuccess: () => reset(),
    });
  };

  return (
    <>
      <Head title="Tambah Project" />
      <div className="space-y-4">
        {/* Header */}
        <Card className="border-border">
          <div className="grid grid-cols-1 sm:flex sm:justify-between items-center px-6 py-2 gap-4">
            <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
              <FolderKanban className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
              Tambah Project
            </h1>
            <div className="grid grid-cols-1 gap-2 sm:flex">
              <Link href="/projects">
                <Button className="cursor-pointer">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Form */}
        <Card className="px-6 py-8 space-y-4 border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nama */}
              <div className="space-y-2">
                <Label htmlFor="nama">Nama</Label>
                <Input
                  type="text"
                  id="nama"
                  value={data.nama}
                  onChange={(e) => setData("nama", e.target.value)}
                  className="border-border"
                />
                {errors.nama && (
                  <p className="text-sm text-red-500">{errors.nama}</p>
                )}
              </div>

              {/* Client */}
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Input
                  type="text"
                  id="client"
                  value={data.client}
                  onChange={(e) => setData("client", e.target.value)}
                  className="border-border"
                />
                {errors.client && (
                  <p className="text-sm text-red-500">{errors.client}</p>
                )}
              </div>

              {/* Lokasi */}
              <div className="space-y-2">
                <Label htmlFor="lokasi">Lokasi</Label>
                <Input
                  type="text"
                  id="lokasi"
                  value={data.lokasi}
                  onChange={(e) => setData("lokasi", e.target.value)}
                  className="border-border"
                />
                {errors.lokasi && (
                  <p className="text-sm text-red-500">{errors.lokasi}</p>
                )}
              </div>

              {/* Radius */}
              <div className="space-y-2">
                <Label htmlFor="radius">Radius</Label>
                <Input
                  type="number"
                  id="radius"
                  value={data.radius}
                  onChange={(e) => setData("radius", e.target.value)}
                  className="border-border"
                />
                {errors.radius && (
                  <p className="text-sm text-red-500">{errors.radius}</p>
                )}
              </div>

              {/* Tanggal Mulai */}
              <div className="space-y-2">
                <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                <Input
                  type="date"
                  id="tanggal_mulai"
                  value={data.tanggal_mulai}
                  onChange={(e) => setData("tanggal_mulai", e.target.value)}
                  className="border-border"
                />
                {errors.tanggal_mulai && (
                  <p className="text-sm text-red-500">{errors.tanggal_mulai}</p>
                )}
              </div>

              {/* Tanggal Selesai */}
              <div className="space-y-2">
                <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                <Input
                  type="date"
                  id="tanggal_selesai"
                  value={data.tanggal_selesai}
                  onChange={(e) => setData("tanggal_selesai", e.target.value)}
                  className="border-border"
                />
                {errors.tanggal_selesai && (
                  <p className="text-sm text-red-500">
                    {errors.tanggal_selesai}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={data.status}
                  onValueChange={(value) => setData("status", value)}
                >
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="selesai">Selesai</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-500">{errors.status}</p>
                )}
              </div>

              {/* Deskripsi */}
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Textarea
                  id="deskripsi"
                  value={data.deskripsi}
                  onChange={(e) => setData("deskripsi", e.target.value)}
                  className="border-border"
                />
                {errors.deskripsi && (
                  <p className="text-sm text-red-500">{errors.deskripsi}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end items-center">
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={processing}
              >
                <Save className="w-4 h-4 mr-2" />
                {processing ? "Menyimpan..." : "Save"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

export default ProjectCreate;
