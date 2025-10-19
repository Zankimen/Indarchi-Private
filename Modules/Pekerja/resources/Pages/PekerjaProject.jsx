import React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import Navbar from "@/layout/NavBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import DataTable from "@/components/custom/NewCustomDataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Save, ChevronLeft, Users } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";


function PekerjaProject({ pekerja, availableWorkers, project_id, roles }) {
  return (
    <>
      <Head title={`Pekerja Project ${project_id}`} />
        <div className="space-y-6">
        <Card className="p-6 border-border flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pekerja di Project #{project_id}</h1>
        <div className="flex gap-2">
        <AddWorkerModal availableWorkers={availableWorkers} project_id={project_id} />
        <AddNewWorker project_id={project_id} roles={roles} />
        </div>
        </Card>


        <Card className="p-4 border-border">
          {pekerja.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Belum ada pekerja di project ini.</p>
          ) : (
            <DataTable
              data={pekerja}
              onRowClick={(row) => router.visit(`/projects/${project_id}/pekerja/${row.id}`)}
            >
              <DataTable.Column
                accessor="name"
                label="Nama"
                render={(row) => (
                  <span className="text-blue-600">{row.name}</span> // hapus <a> supaya row click bekerja
                )}
              />
              <DataTable.Column accessor="email" label="Email" />
              <DataTable.Column accessor="posisi" label="Posisi" />
            </DataTable>
          )}
        </Card>
      </div>
    </>
  );
}

function AddWorkerModal({ availableWorkers, project_id }) {
  const { data, setData, post, processing } = useForm({ pekerja_id: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(`/projects/${project_id}/pekerja/add`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Tambah Pekerja ke Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-border">
        <DialogHeader>
          <DialogTitle>Pilih Pekerja yang Sudah Ada</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <Select
            onValueChange={(v) => setData("pekerja_id", v)}
            value={data.pekerja_id}
          >
            <SelectTrigger className="w-full border-border">
              <SelectValue placeholder="Pilih pekerja" />
            </SelectTrigger>
            <SelectContent>
              {availableWorkers.map((w) => (
                <SelectItem key={w.id} value={w.id}>
                  {w.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="submit" disabled={processing} className="w-full">
            {processing ? "Menambahkan..." : "Tambah ke Project"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddNewWorker({ project_id, roles }) {
  const { data, setData, post, processing, reset } = useForm({
    email: "",
    password: "",
    nama_karyawan: "",
    alamat: "",
    posisi: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(`/projects/${project_id}/pekerja/create`, {
      onSuccess: () => reset(),
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          Tambah Pekerja Baru <Plus className="ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] border-border">
        <DialogHeader>
          <Card className="border-border">
            <div className="grid grid-cols-1 sm:flex sm:justify-between items-center px-6 py-2 gap-4">
              <DialogTitle>
                <div className="flex items-center font-bold text-2xl md:text-2xl m-0 p-0">
                  <Users className="w-10 h-10 bg-accent text-background rounded-2xl mr-4 p-2" />
                  Tambah Pekerja Baru
                </div>
              </DialogTitle>
              <DialogDescription className="sr-only">
                Form untuk membuat Pekerja baru di project.
              </DialogDescription>
              <DialogClose asChild>
                <Button className="cursor-pointer">
                  <ChevronLeft className="w-4 h-4" />
                  Kembali
                </Button>
              </DialogClose>
            </div>
          </Card>
        </DialogHeader>
        <Card className="px-6 py-8 space-y-2 border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground text-base block">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={data.email}
                placeholder="Masukkan email"
                onChange={(e) => setData("email", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground text-base block">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={data.password}
                placeholder="Masukkan password"
                onChange={(e) => setData("password", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nama_karyawan" className="text-foreground text-base block">
                Nama Karyawan
              </Label>
              <Input
                type="text"
                id="nama_karyawan"
                name="nama_karyawan"
                value={data.nama_karyawan}
                placeholder="Masukkan nama karyawan"
                onChange={(e) => setData("nama_karyawan", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alamat" className="text-foreground text-base block">
                Alamat
              </Label>
              <Textarea
                id="alamat"
                name="alamat"
                value={data.alamat}
                className="border-border"
                placeholder="Masukkan alamat lengkap"
                onChange={(e) => setData("alamat", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="posisi" className="text-foreground text-base block">
                Posisi
              </Label>
              <Select
                name="posisi"
                value={data.posisi}
                onValueChange={(value) => setData("posisi", value)}
              >
                <SelectTrigger
                  id="posisi"
                  className="w-full border-border rounded-lg cursor-pointer text-foreground placeholder:text-border focus:ring-2 focus:ring-muted active:ring-2 active:ring-muted"
                >
                  <SelectValue placeholder="Pilih Posisi" className="text-border" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border bg-background shadow">
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name} className="text-foreground text-base hover:bg-border cursor-pointer">
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="border-border cursor-pointer hover:border-accent">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="cursor-pointer" disabled={processing}>
                <Save className="w-4 h-4" />
                {processing ? "Menyimpan..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
}


PekerjaProject.layout = (page) => <Navbar children={page} />;
export default PekerjaProject;
