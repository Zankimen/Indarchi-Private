import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import Dashboard from "@/layout/Dashboard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Pencil, Users, Save } from "lucide-react";
import { formatDateNoHour } from "@/components/lib/utils";
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function PekerjaDetails({ pekerja, peran }) {
  const [open, setOpen] = React.useState(false);

  const { data, setData, put, processing, errors, reset } = useForm({
    nama_karyawan: pekerja.name || "",
    email: pekerja.email || "",
    alamat: pekerja.alamat || "",
    posisi: pekerja.roles?.[0]?.name || "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/dashboard/pekerja/${pekerja.id}`, {
      onSuccess: () => {
        setOpen(false);
        reset("password");
      },
    });
  };

  return (
    <>
      <Head title={pekerja.name} />
      <div className="space-y-4">
        <Card className="border-border">
          <div className="grid grid-cols-1 sm:flex sm:justify-between items-center px-6 py-2 gap-4">
            <div className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
              <Users className="w-10 h-10 bg-accent text-background rounded-2xl mr-4 p-2" />
              {pekerja.name}
            </div>
            <div className="grid grid-cols-1 gap-2 sm:flex">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="cursor-pointer border-border">
                    <Pencil className="w-4 h-4" />
                    Edit
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
                            Edit Pekerja
                          </div>
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                          Form untuk mengedit data Pekerja.
                        </DialogDescription>
                        <div className="grid grid-cols-1 gap-2 sm:flex">
                          <DialogPrimitive.Close asChild>
                            <Button className="cursor-pointer">
                              <ChevronLeft className="w-4 h-4" />
                              Back
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
                          value={data.email}
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
                          Password (Opsional)
                        </Label>
                        <Input
                          type="password"
                          id="password"
                          name="password"
                          value={data.password}
                          placeholder="Kosongkan jika tidak ingin mengubah password"
                          onChange={(e) => setData("password", e.target.value)}
                        />
                        {errors.password && (
                          <p className="text-sm text-red-500">{errors.password}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="nama_karyawan"
                          className="text-foreground text-base block"
                        >
                          Nama Karyawan
                        </Label>
                        <Input
                          type="text"
                          id="nama_karyawan"
                          name="nama_karyawan"
                          value={data.nama_karyawan}
                          placeholder="Masukkan nama karyawan"
                          onChange={(e) => setData("nama_karyawan", e.target.value)}
                        />
                        {errors.nama_karyawan && (
                          <p className="text-sm text-red-500">{errors.nama_karyawan}</p>
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
                          value={data.alamat}
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
                          value={data.posisi}
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
                            {peran?.map((role) => (
                              <SelectItem
                                key={role.id}
                                value={role.name}
                                className="text-foreground text-base hover:bg-border cursor-pointer"
                              >
                                {role.name}
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
                            type="button"
                            variant="outline"
                            className="border-border cursor-pointer hover:border-accent"
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          className="cursor-pointer"
                          disabled={processing}
                        >
                          <Save className="w-4 h-4" />
                          {processing ? "Menyimpan..." : "Save"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Card>
                </DialogContent>
              </Dialog>

              <Link href="/dashboard/pekerja">
                <Button className="cursor-pointer">
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-6 px-8 border-border">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
            <Detail label="ID" value={pekerja.id} />
            <Detail label="Nama" value={pekerja.name} />
            <Detail label="Email" value={pekerja.email} />
            <Detail label="Alamat" value={pekerja.alamat} />
            <Detail 
              label="Posisi/Role" 
              value={pekerja.roles?.[0]?.name || "-"} 
            />
            <Detail
              label="Email Terverifikasi"
              value={
                pekerja.email_verified_at
                  ? formatDateNoHour(pekerja.email_verified_at)
                  : "Belum diverifikasi"
              }
            />
            <Detail
              label="Dibuat Pada"
              value={formatDateNoHour(pekerja.created_at)}
            />
            <Detail
              label="Terakhir Di-Update"
              value={formatDateNoHour(pekerja.updated_at)}
            />
          </div>
        </Card>

        {/* Permissions Card - if needed */}
        {pekerja.permissions && pekerja.permissions.length > 0 && (
          <Card className="p-6 px-8 border-border">
            <h3 className="text-lg font-semibold mb-4">Permissions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pekerja.permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="inline-flex items-center px-3 py-2 rounded-lg bg-accent/50 border border-border text-sm font-medium"
                >
                  {permission.name}
                </div>
              ))}
            </div>
          </Card>
        )}
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

PekerjaDetails.layout = (page) => <Dashboard children={page} />;

export default PekerjaDetails;