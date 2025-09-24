import React from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import Dashboard from "@/layout/Dashboard";
import { Save, ChevronLeft, Users, UserStar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function DosenEdit() {
  const { dosen } = usePage().props;

  const { data, setData, put, processing, errors } = useForm({
    nip: dosen.nip || "",
    nama: dosen.nama || "",
    alamat: dosen.alamat || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/mysql/dosen/edit/${dosen.id}`);
  };

  return (
    <>
      <Head title="Edit Dosen" />
      <div className="space-y-4">
        <Card className="border-border">
          <div className="grid grid-cols-1 sm:flex sm:justify-between items-center px-6 py-2 gap-4">
            <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
              <UserStar className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
              Edit Dosen
            </h1>
            <div className="grid grid-cols-1 gap-2 sm:flex">
              <Link href="/mysql/dosen">
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
                <Label htmlFor="nip">NIP</Label>
                <Input
                  type="text"
                  id="nip"
                  value={data.nip}
                  className="border-border"
                  disabled
                />
                {errors.nip && (
                  <p className="text-sm text-red-500">{errors.nip}</p>
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

              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Textarea
                  id="alamat"
                  value={data.alamat}
                  className="border-border"
                  onChange={(e) => setData("alamat", e.target.value)}
                />
                {errors.alamat && (
                  <p className="text-sm text-red-500">{errors.alamat}</p>
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

DosenEdit.layout = (page) => <Dashboard children={page} />;

export default DosenEdit;
