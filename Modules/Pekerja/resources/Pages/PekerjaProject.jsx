import React from "react";
import { Head, useForm } from "@inertiajs/react";
import Navbar from "@/layout/NavBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import DataTable from "@/components/custom/NewCustomDataTable";

function PekerjaProject({ pekerja, availableWorkers, project_id }) {
  return (
    <>
      <Head title={`Pekerja Project ${project_id}`} />
      <div className="space-y-6">
        <Card className="p-6 border-border flex items-center justify-between">
          <h1 className="text-2xl font-bold">Pekerja di Project #{project_id}</h1>
          <AddWorkerModal availableWorkers={availableWorkers} project_id={project_id} />
        </Card>

        <Card className="p-4 border-border">
          {pekerja.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Belum ada pekerja di project ini.</p>
          ) : (
            <DataTable data={pekerja}>
              <DataTable.Column accessor="name" label="Nama" />
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

PekerjaProject.layout = (page) => <Navbar children={page} />;
export default PekerjaProject;
