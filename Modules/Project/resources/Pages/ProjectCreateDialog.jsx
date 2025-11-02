import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

import { Save, ChevronLeft, FolderKanban, Plus } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DialogTrigger,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";

function ProjectCreate() {
  const [open, setOpen] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    nama: "",
    deskripsi: "",
    lokasi: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    radius: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/dashboard/projects", {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Tambah Project <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] border-border" aria-describedby={undefined}>
        <DialogHeader>
          <Card className="border-border">
            <div className="grid grid-cols-1 sm:flex sm:justify-between items-center px-6 py-2 gap-4">
              <DialogTitle>
                <div className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
                  <FolderKanban className="w-10 h-10 bg-accent text-background rounded-2xl mr-4 p-2" />
                  Tambah Project
                </div>
              </DialogTitle>
              <DialogDescription className="sr-only">
                Form untuk membuat project baru.
              </DialogDescription>
              <div className="grid grid-cols-1 gap-2 sm:flex">
                <DialogPrimitive.Close asChild>
                  <Button>
                    <ChevronLeft className="w-4 h-4" />
                    Kembali
                  </Button>
                </DialogPrimitive.Close>
              </div>
            </div>
          </Card>
        </DialogHeader>
        <div className="space-y-4">
          <Card className="px-6 py-8 space-y-4 border-border">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nama" className="text-foreground text-base block">
                    Nama
                  </Label>
                  <Input
                    type="text"
                    id="nama"
                    value={data.nama}
                    onChange={(e) => setData("nama", e.target.value)}
                  />
                  {errors.nama && <p className="text-sm text-red-500">{errors.nama}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lokasi" className="text-foreground text-base block">
                    Lokasi
                  </Label>
                  <Input
                    type="text"
                    id="lokasi"
                    value={data.lokasi}
                    onChange={(e) => setData("lokasi", e.target.value)}
                  />
                  {errors.lokasi && <p className="text-sm text-red-500">{errors.lokasi}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tanggal_mulai" className="text-foreground text-base block">
                    Tanggal Mulai
                  </Label>
                  <Input
                    type="date"
                    id="tanggal_mulai"
                    value={data.tanggal_mulai}
                    onChange={(e) => setData("tanggal_mulai", e.target.value)}
                  />
                  {errors.tanggal_mulai && (
                    <p className="text-sm text-red-500">{errors.tanggal_mulai}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tanggal_selesai" className="text-foreground text-base block">
                    Tanggal Selesai
                  </Label>
                  <Input
                    type="date"
                    id="tanggal_selesai"
                    value={data.tanggal_selesai}
                    onChange={(e) => setData("tanggal_selesai", e.target.value)}
                  />
                  {errors.tanggal_selesai && (
                    <p className="text-sm text-red-500">{errors.tanggal_selesai}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="radius" className="text-foreground text-base block">
                    Radius
                  </Label>
                  <Input
                    type="number"
                    id="radius"
                    value={data.radius}
                    onChange={(e) => setData("radius", e.target.value)}
                  />
                  {errors.radius && <p className="text-sm text-red-500">{errors.radius}</p>}
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="deskripsi" className="text-foreground text-base block">
                    Deskripsi
                  </Label>
                  <Textarea
                    id="deskripsi"
                    value={data.deskripsi}
                    onChange={(e) => setData("deskripsi", e.target.value)}
                  />
                  {errors.deskripsi && <p className="text-sm text-red-500">{errors.deskripsi}</p>}
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={processing}>
                  <Save className="w-4 h-4" />
                  {processing ? "Menyimpan..." : "Simpan"}
                </Button>
              </DialogFooter>
            </form>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProjectCreate;
