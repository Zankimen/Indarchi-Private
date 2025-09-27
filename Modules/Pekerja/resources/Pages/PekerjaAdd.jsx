import React from "react";

import { Head, useForm, Link, usePage } from "@inertiajs/react";

import Dashboard from "@/layout/Dashboard";
import { ComboBoxInput } from "@components/custom/ComboBoxInput";

import { Save, ChevronLeft, UserPlus } from "lucide-react";

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

function PekerjaAdd() {
  const { data, setData, post, processing, errors, reset } = useForm({
    nama_karyawan: "",
    alamat: "",
    posisi: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/pekerja/add", {
      onSuccess: () => reset(),
    });
  };

  return (
    <>
      <Head title="Add Pekerja" />
      <div className="space-y-4">
        {/* Header Card */}
          <div className="grid grid-cols-1 sm:flex sm:justify-between items-center px-6 py-4 gap-4">
            <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
              Tambah Karyawan
            </h1>
            <div className="grid grid-cols-1 gap-2 sm:flex">
              <Link href="/pekerja">
                <Button variant="outline" 
                  className="cursor-pointer rounded-[10px] px-6 py-3 font-bold text-[16px]">
                  <ChevronLeft className="w-4 h-4" />
                  Batal
                </Button>
              </Link>
            </div>
          </div>

        {/* Form Card */}
        <Card className="px-6 py-8 space-y-2 border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama Karyawan */}
            <div className="space-y-3">
              <Label 
                htmlFor="nama_karyawan" 
                className="text-[#000000] font-semibold text-base block"
              >
                Nama Karyawan
              </Label>
              <Input
                type="text"
                id="nama_karyawan"
                name="nama_karyawan"
                value={data.nama_karyawan}
                className="w-full border border-gray-300 rounded-[10px] px-4 py-3 h-12 text-[#000000] placeholder:text-gray-400 focus:ring-2 focus:ring-[#194AC2] focus:border-transparent text-base"
                placeholder="Masukkan nama karyawan"
                onChange={(e) => setData("nama_karyawan", e.target.value)}
              />
              {errors.nama_karyawan && (
                <p className="text-sm text-red-500">{errors.nama_karyawan}</p>
              )}
            </div>

            {/* Alamat */}
            <div className="space-y-3">
              <Label 
                htmlFor="alamat" 
                className="text-[#000000] font-semibold text-base block"
              >
                Alamat
              </Label>
              <Textarea
                id="alamat"
                name="alamat"
                value={data.alamat}
                className="w-full border border-gray-300 rounded-[10px] px-4 py-3 min-h-[100px] text-[#000000] placeholder:text-gray-400 focus:ring-2 focus:ring-[#194AC2] focus:border-transparent text-base resize-none"
                placeholder="Masukkan alamat lengkap"
                onChange={(e) => setData("alamat", e.target.value)}
              />
              {errors.alamat && (
                <p className="text-sm text-red-500">{errors.alamat}</p>
              )}
            </div>

            {/* Posisi */}
            <div className="space-y-3">
              <Label 
                htmlFor="posisi" 
                className="text-[#000000] font-semibold text-base block"
              >
                Posisi
              </Label>
              <Select
                name="posisi"
                value={data.posisi}
                onValueChange={(value) => setData("posisi", value)}
              >
                <SelectTrigger 
                  id="posisi" 
                  className="w-full border border-gray-300 rounded-[10px] px-4 py-3 h-12 text-[#000000] focus:ring-2 focus:ring-[#194AC2] focus:border-transparent text-base"
                >
                  <SelectValue 
                    placeholder="Pilih Posisi" 
                    className="text-gray-400"
                  />
                </SelectTrigger>
                <SelectContent className="rounded-[10px] border border-gray-300 bg-white shadow-lg">
                  <SelectItem 
                    value="supervisor" 
                    className="text-[#000000] py-3 px-4 text-base hover:bg-gray-50 cursor-pointer"
                  >
                    Supervisor
                  </SelectItem>
                  <SelectItem 
                    value="manager" 
                    className="text-[#000000] py-3 px-4 text-base hover:bg-gray-50 cursor-pointer"
                  >
                    Manager
                  </SelectItem>
                  <SelectItem 
                    value="kuli" 
                    className="text-[#000000] py-3 px-4 text-base hover:bg-gray-50 cursor-pointer"
                  >
                    Kuli
                  </SelectItem>
                  <SelectItem 
                    value="mandor" 
                    className="text-[#000000] py-3 px-4 text-base hover:bg-gray-50 cursor-pointer"
                  >
                    Mandor
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.posisi && (
                <p className="text-sm text-red-500">{errors.posisi}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button 
                type="submit"
                className="bg-[#194AC2] text-white hover:bg-[#0f3499] rounded-[10px] px-8 py-3 font-bold text-[16px] disabled:opacity-50"
                disabled={processing}
              >
                {processing ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

PekerjaAdd.layout = (page) => <Dashboard children={page} />;

export default PekerjaAdd;
