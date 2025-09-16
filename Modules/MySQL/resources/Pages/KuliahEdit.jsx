import React from "react";

import { Head, useForm, Link, usePage } from "@inertiajs/react";

import Dashboard from "@/layout/Dashboard";
import { ComboBoxInput } from "@components/custom/ComboBoxInput";

import { Save, ChevronLeft, BookUser } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function KuliahEdit() {
  const { kuliah, options } = usePage().props;

  const { data, setData, put, processing, errors } = useForm({
    dosen: kuliah?.dosen ?? "",
    mahasiswa: kuliah?.mahasiswa ?? "",
    mataKuliah: kuliah?.mata_kuliah ?? kuliah?.mataKuliah ?? "",
    nilai: kuliah?.nilai ?? "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/mysql/kuliah/edit/${kuliah.id}`);
  };

  const opt = {
    dosen: options?.dosen ?? [],
    mahasiswa: options?.mahasiswa ?? [],
    mataKuliah: options?.mataKuliah ?? [],
  };

  return (
    <>
      <Head title="Edit Kuliah" />
      <div className="space-y-4">
        <Card className="border-border">
          <div className="grid grid-cols-1 sm:flex sm:justify-between items-center px-6 py-2 gap-4">
            <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
              <BookUser className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
              Edit Kuliah
            </h1>
            <div className="grid grid-cols-1 gap-2 sm:flex">
              <Link href="/mysql/kuliah">
                <Button className="cursor-pointer">
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="px-6 py-8 space-y-2 border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nilai">Nilai</Label>
                <Input
                  type="number"
                  id="nilai"
                  value={data.nilai}
                  className="border-border"
                  onChange={(e) => setData("nilai", e.target.value)}
                />
                {errors?.nilai && (
                  <p className="text-sm text-red-500">{errors.nilai}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosen">Dosen</Label>
                <ComboBoxInput
                  id="dosen"
                  options={opt.dosen}
                  value={data.dosen}
                  onChange={(value) => setData("dosen", value)}
                  placeholder=""
                />
                {errors?.dosen && (
                  <p className="text-sm text-red-500">{errors.dosen}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mahasiswa">Mahasiswa</Label>
                <ComboBoxInput
                  id="mahasiswa"
                  options={opt.mahasiswa}
                  value={data.mahasiswa}
                  onChange={(value) => setData("mahasiswa", value)}
                  placeholder=""
                />
                {errors?.mahasiswa && (
                  <p className="text-sm text-red-500">{errors.mahasiswa}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mataKuliah">Mata Kuliah</Label>
                <ComboBoxInput
                  id="mataKuliah"
                  options={opt.mataKuliah}
                  value={data.mataKuliah}
                  onChange={(value) => setData("mataKuliah", value)}
                  placeholder=""
                />
                {errors?.mataKuliah && (
                  <p className="text-sm text-red-500">{errors.mataKuliah}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end items-center">
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={processing}
              >
                Save
                <Save className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

KuliahEdit.layout = (page) => <Dashboard children={page} />;

export default KuliahEdit;
