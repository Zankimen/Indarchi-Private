import React, { useState } from "react";

import { useForm } from "@inertiajs/react";

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

import { ChevronLeft, Plus, Users, Save } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function PekerjaAddDialog({ perans }) {
  const [open, setOpen] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    name: "",
    alamat: "",
    posisi: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/dashboard/pekerja", {
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
          Tambah Pekerja <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[800px] border-border"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <Card className="border-border">
            <div className="grid grid-cols-1 sm:flex sm:justify-between items-center px-6 py-2 gap-4">
              <DialogTitle>
                <div className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
                  <Users className="w-10 h-10 bg-accent text-background rounded-2xl mr-4 p-2" />
                  Tambah Pekerja
                </div>
              </DialogTitle>
              <DialogDescription className="sr-only">
                Form untuk membuat Pekerja baru.
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

        <Card className="px-6 py-8 space-y-2 border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-foreground text-base block"
              >
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={data.email ?? ""}
                placeholder="Masukkan email"
                onChange={(e) => setData("email", e.target.value)}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-foreground text-base block"
              >
                Password
              </Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={data.password ?? ""}
                placeholder="Masukkan password"
                onChange={(e) => setData("password", e.target.value)}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-foreground text-base block"
              >
                Nama Karyawan
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={data.name ?? ""}
                placeholder="Masukkan nama karyawan"
                onChange={(e) => setData("name", e.target.value)}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="alamat"
                className="text-foreground text-base block"
              >
                Alamat
              </Label>
              <Textarea
                id="alamat"
                name="alamat"
                value={data.alamat ?? ""}
                className="border-border"
                placeholder="Masukkan alamat lengkap"
                onChange={(e) => setData("alamat", e.target.value)}
              />
              {errors.alamat && (
                <p className="text-sm text-red-500">{errors.alamat}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="posisi"
                className="text-foreground text-base block"
              >
                Posisi
              </Label>
              <Select
                name="posisi"
                value={data.posisi ?? ""}
                onValueChange={(value) => setData("posisi", value)}
              >
                <SelectTrigger
                  id="posisi"
                  className="w-full border-border rounded-lg cursor-pointer text-foreground placeholder:text-border focus:ring-2 focus:ring-muted active:ring-2 active:ring-muted"
                >
                  <SelectValue
                    placeholder="Pilih Posisi"
                    className="text-border"
                  />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border bg-background shadow">
                  {perans.map((peran) => (
                    <SelectItem
                      value={peran.name ?? ""}
                      className="text-foreground text-base hover:bg-border cursor-pointer"
                      key={peran.id}
                    >
                      {peran.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.posisi && (
                <p className="text-sm text-red-500">{errors.posisi}</p>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={processing}
              >
                <Save className="w-4 h-4" />
                {processing ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default PekerjaAddDialog;
