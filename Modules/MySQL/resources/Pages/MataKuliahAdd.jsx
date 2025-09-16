import React from "react";

import { Head, useForm, Link, usePage } from "@inertiajs/react";

import Dashboard from "@/layout/Dashboard";
import { ComboBoxInput } from "@components/custom/ComboBoxInput";

import { Save, ChevronLeft, Users, UserStar, BookUser } from "lucide-react";

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
// import NoAssetType from "../Components/AssetType/NoAssetType";

function MatakuliahAdd() {
  const { data, setData, post, processing, errors, reset } = useForm({
    nip: "",
    nama: "",
    alamat: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/mysql/matakuliah/add", {
      onSuccess: () => reset(),
    });
  };

  return (
    <>
      <Head title="Add Asset" />
      <div className="space-y-4">
        <Card className="border-border">
          <div className="grid grid-cols-1 sm:flex sm:justify-between items-center px-6 py-2 gap-4">
            <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
              <BookUser className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
              Add Mata Kuliah
            </h1>
            <div className="grid grid-cols-1 gap-2 sm:flex">
              <Link href="/mysql/matakuliah">
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
                <Label htmlFor="kode">Kode</Label>
                <Input
                  type="text"
                  id="kode"
                  value={data.kode}
                  className="border-border"
                  onChange={(e) => setData("kode", e.target.value)}
                />
                {errors.kode && (
                  <p className="text-sm text-red-500">{errors.kode}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nama">Nama</Label>
                <Input
                  type="text"
                  id="nama"
                  value={data.nama}
                  className="border-border"
                  onChange={(e) => setData("nama", e.target.value)}
                />
                {errors.nama && (
                  <p className="text-sm text-red-500">{errors.nama}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sks">SKS</Label>
                <Input
                  type="number"
                  id="sks"
                  value={data.sks}
                  className="border-border"
                  onChange={(e) => setData("sks", e.target.value)}
                />
                {errors.sks && (
                  <p className="text-sm text-red-500">{errors.sks}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input
                  type="number"
                  id="semester"
                  value={data.semester}
                  className="border-border"
                  onChange={(e) => setData("semester", e.target.value)}
                />
                {errors.semester && (
                  <p className="text-sm text-red-500">{errors.semester}</p>
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

MatakuliahAdd.layout = (page) => <Dashboard children={page} />;

export default MatakuliahAdd;
