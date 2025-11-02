import React, { useState } from "react";
import { useForm, Link, Head } from "@inertiajs/react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import Dashboard from "@/layout/Dashboard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, ChevronLeft, FolderKanban } from "lucide-react";

// === Komponen LocationPicker untuk menangkap klik di peta ===
function LocationPicker({ onPick }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onPick({ lat, lng });
    },
  });

  return position ? <Marker position={position} /> : null;
}

// === Komponen utama form tambah project ===
function ProjectCreate() {
  const { data, setData, post, processing, errors } = useForm({
    nama: "",
    deskripsi: "",
    lokasi: "",
    alamat: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    radius: 150,
  });

  const [mapCenter] = useState([-7.5553, 110.859]); // default center
  const [loadingAlamat, setLoadingAlamat] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/dashboard/projects");
  };

  const handlePickLocation = async ({ lat, lng }) => {
    // Isi kolom lokasi otomatis dengan format Lat/Lng
    const lokasiText = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
    setData("lokasi", lokasiText);

    // Ambil alamat menggunakan Nominatim API
    setLoadingAlamat(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const result = await response.json();
      const alamatLengkap = result.display_name || "Alamat tidak ditemukan";
      setData("alamat", alamatLengkap);
    } catch (error) {
      console.error("Gagal mengambil alamat:", error);
      setData("alamat", "Gagal mengambil alamat");
    } finally {
      setLoadingAlamat(false);
    }
  };

  return (
    <>
      <Head title="Tambah Project" />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderKanban className="w-10 h-10 bg-accent text-background rounded-2xl p-2" />
            <h1 className="text-2xl font-bold">Tambah Project</h1>
          </div>

          <Link href="/dashboard/projects">
            <Button variant="outline" className="flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Kembali
            </Button>
          </Link>
        </div>

        {/* Form */}
        <Card className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="nama">Nama</Label>
                <Input
                  id="nama"
                  value={data.nama}
                  onChange={(e) => setData("nama", e.target.value)}
                />
                {errors.nama && (
                  <p className="text-sm text-red-500 mt-1">{errors.nama}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lokasi">Koordinat (Lat & Lng)</Label>
                <Input
                  id="lokasi"
                  placeholder="Klik lokasi di peta"
                  value={data.lokasi}
                  onChange={(e) => setData("lokasi", e.target.value)}
                />
                {errors.lokasi && (
                  <p className="text-sm text-red-500 mt-1">{errors.lokasi}</p>
                )}
              </div>

              {/* === Field Alamat === */}
              {/* <div className="sm:col-span-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Textarea
                  id="alamat"
                  placeholder="Alamat otomatis muncul setelah pilih lokasi di peta"
                  value={
                    loadingAlamat
                      ? "Mengambil alamat..."
                      : data.alamat || ""
                  }
                  onChange={(e) => setData("alamat", e.target.value)}
                />
                {errors.alamat && (
                  <p className="text-sm text-red-500 mt-1">{errors.alamat}</p>
                )}
              </div> */}

              <div>
                <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                <Input
                  id="tanggal_mulai"
                  type="date"
                  value={data.tanggal_mulai}
                  onChange={(e) => setData("tanggal_mulai", e.target.value)}
                />
                {errors.tanggal_mulai && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.tanggal_mulai}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                <Input
                  id="tanggal_selesai"
                  type="date"
                  value={data.tanggal_selesai}
                  onChange={(e) => setData("tanggal_selesai", e.target.value)}
                />
                {errors.tanggal_selesai && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.tanggal_selesai}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="radius">Radius (meter)</Label>
                <Input
                  id="radius"
                  type="number"
                  value={data.radius}
                  onChange={(e) => setData("radius", e.target.value)}
                />
                {errors.radius && (
                  <p className="text-sm text-red-500 mt-1">{errors.radius}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Textarea
                  id="deskripsi"
                  value={data.deskripsi}
                  onChange={(e) => setData("deskripsi", e.target.value)}
                />
                {errors.deskripsi && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.deskripsi}
                  </p>
                )}
              </div>
            </div>

            {/* === MAP SECTION === */}
            <div>
              <Label>Pilih Lokasi di Peta</Label>
              <div className="mt-2">
                <MapContainer
                  center={mapCenter}
                  zoom={16}
                  style={{
                    height: "300px",
                    width: "100%",
                    borderRadius: "10px",
                  }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap"
                  />

                  <LocationPicker onPick={handlePickLocation} />

                  {data.lokasi && data.lokasi.includes("Lat") && (
                    <Circle
                      center={data.lokasi
                        .match(/Lat:\s(-?\d+\.\d+),\sLng:\s(-?\d+\.\d+)/)
                        ?.slice(1)
                        .map(Number)}
                      radius={Number(data.radius)}
                      pathOptions={{
                        color: "blue",
                        fillColor: "rgba(0, 0, 255, 0.3)",
                        fillOpacity: 0.3,
                      }}
                    />
                  )}
                </MapContainer>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <Link href="/dashboard/projects">
                <Button type="button" variant="outline" className="cursor-pointer">
                  Batal
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={processing}
                className="cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {processing ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

export default ProjectCreate;
