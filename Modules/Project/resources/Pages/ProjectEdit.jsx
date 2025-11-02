import React, { useState, useEffect } from "react";
import { Head, useForm, Link, router } from "@inertiajs/react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { Save, ChevronLeft, ClipboardList, Trash } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// === Komponen untuk menangkap klik di peta ===
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

function ProjectEdit({ project }) {
  const { data, setData, put, processing, errors } = useForm({
    nama: project.nama || "",
    deskripsi: project.deskripsi || "",
    lokasi: project.lokasi || "",
    alamat: project.alamat || "",
    tanggal_mulai: project.tanggal_mulai || "",
    tanggal_selesai: project.tanggal_selesai || "",
    radius: project.radius || 150,
  });

  // Ambil koordinat awal dari lokasi project (jika ada)
  const extractLatLng = (lokasi) => {
    const match = lokasi?.match(/Lat:\s*(-?\d+\.\d+),\s*Lng:\s*(-?\d+\.\d+)/);
    return match ? [parseFloat(match[1]), parseFloat(match[2])] : [-7.5553, 110.859];
  };

  const [mapCenter, setMapCenter] = useState(extractLatLng(project.lokasi));
  const [circleCenter, setCircleCenter] = useState(mapCenter);

  // === Handler simpan ===
  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/projects/${project.id}`);
  };

  // === Handler hapus ===
  const handleDelete = () => {
    if (confirm("Apakah kamu yakin ingin menghapus proyek ini?")) {
      router.delete(`/projects/${project.id}`);
    }
  };

  // === Ketika user pilih lokasi di peta ===
  const handlePickLocation = async ({ lat, lng }) => {
    const lokasiText = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
    setData("lokasi", lokasiText);
    setCircleCenter([lat, lng]);

    try {
      // Gunakan API OpenStreetMap Nominatim untuk ambil alamat
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const result = await res.json();
      const alamatLengkap = result.display_name || "Alamat tidak ditemukan";
      setData("alamat", alamatLengkap);
    } catch (error) {
      console.error("Gagal mengambil alamat:", error);
      setData("alamat", "Gagal mengambil alamat");
    }
  };

  return (
    <>
      <Head title="Edit Project" />
      <div className="space-y-4">
        {/* Header */}
        <Card className="border-border">
          <div className="flex justify-between items-center px-6 py-2 gap-4">
            <h1 className="flex items-center font-bold text-2xl">
              <ClipboardList className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
              Edit Project
            </h1>
            <Link href={`/projects/${project.id}/informasi`}>
              <Button variant="outline">
                <ChevronLeft className="w-4 h-4 mr-2" /> Kembali
              </Button>
            </Link>
          </div>
        </Card>

        {/* Form */}
        <Card className="px-6 py-8 space-y-6 border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nama */}
              <div>
                <Label htmlFor="nama">Nama</Label>
                <Input
                  id="nama"
                  value={data.nama}
                  onChange={(e) => setData("nama", e.target.value)}
                />
                {errors.nama && <p className="text-sm text-red-500">{errors.nama}</p>}
              </div>

              {/* Lokasi */}
              <div>
                <Label htmlFor="lokasi">Koordinat (Lat/Lng)</Label>
                <Input
                  id="lokasi"
                  placeholder="Klik lokasi di peta"
                  value={data.lokasi}
                  onChange={(e) => setData("lokasi", e.target.value)}
                />
                {errors.lokasi && <p className="text-sm text-red-500">{errors.lokasi}</p>}
              </div>

              {/* Alamat */}
              {/* <div className="sm:col-span-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Textarea
                  id="alamat"
                  placeholder="Alamat otomatis muncul setelah memilih lokasi"
                  value={data.alamat}
                  onChange={(e) => setData("alamat", e.target.value)}
                />
                {errors.alamat && <p className="text-sm text-red-500">{errors.alamat}</p>}
              </div> */}

              {/* Tanggal Mulai */}
              <div>
                <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                <Input
                  id="tanggal_mulai"
                  type="date"
                  value={data.tanggal_mulai}
                  onChange={(e) => setData("tanggal_mulai", e.target.value)}
                />
                {errors.tanggal_mulai && (
                  <p className="text-sm text-red-500">{errors.tanggal_mulai}</p>
                )}
              </div>

              {/* Tanggal Selesai */}
              <div>
                <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                <Input
                  id="tanggal_selesai"
                  type="date"
                  value={data.tanggal_selesai}
                  onChange={(e) => setData("tanggal_selesai", e.target.value)}
                />
                {errors.tanggal_selesai && (
                  <p className="text-sm text-red-500">{errors.tanggal_selesai}</p>
                )}
              </div>

              {/* Radius */}
              <div>
                <Label htmlFor="radius">Radius (meter)</Label>
                <Input
                  id="radius"
                  type="number"
                  value={data.radius}
                  onChange={(e) => setData("radius", e.target.value)}
                />
                {errors.radius && <p className="text-sm text-red-500">{errors.radius}</p>}
              </div>

              {/* Deskripsi */}
              <div className="sm:col-span-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Textarea
                  id="deskripsi"
                  value={data.deskripsi}
                  onChange={(e) => setData("deskripsi", e.target.value)}
                />
                {errors.deskripsi && (
                  <p className="text-sm text-red-500">{errors.deskripsi}</p>
                )}
              </div>
            </div>

            {/* === MAP SECTION === */}
            <div className="space-y-2">
              <Label>Pilih Lokasi di Peta</Label>
              <MapContainer
                center={mapCenter}
                zoom={16}
                style={{ height: "300px", width: "100%", borderRadius: "10px" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />

                <LocationPicker onPick={handlePickLocation} />

                {circleCenter && (
                  <Circle
                    center={circleCenter}
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

            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="destructive" onClick={handleDelete}>
                <Trash className="w-4 h-4 mr-2" /> Hapus
              </Button>
              <Button type="submit" disabled={processing}>
                <Save className="w-4 h-4 mr-2" /> {processing ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

export default ProjectEdit;
