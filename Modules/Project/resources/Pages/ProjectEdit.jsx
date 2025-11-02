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

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Upload, Trash, Trash2, Save } from "lucide-react"; // ✅ tambahkan Trash2 & Save

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

export default function ProjectEdit({ project }) {
  const { data, setData, put, processing } = useForm({
    nama: project.nama || "",
    deskripsi: project.deskripsi || "",
    klien: project.klien || "",
    tanggal_mulai: project.tanggal_mulai || "",
    tanggal_selesai: project.tanggal_selesai || "",
    lokasi: project.lokasi || "",
    alamat: project.alamat || "",
    radius: project.radius || 150,
    gambar: null,
  });

  const extractLatLng = (lokasi) => {
    const match = lokasi?.match(/Lat:\s*(-?\d+\.\d+),\s*Lng:\s*(-?\d+\.\d+)/);
    return match
      ? [parseFloat(match[1]), parseFloat(match[2])]
      : [-7.5553, 110.859];
  };

  const [mapCenter, setMapCenter] = useState(extractLatLng(project.lokasi));
  const [selectedImage, setSelectedImage] = useState(
    project.gambar_url || null
  );
  const [loadingAlamat, setLoadingAlamat] = useState(false);

  // === Handle upload gambar ===
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setData("gambar", file);
      const reader = new FileReader();
      reader.onload = (event) => setSelectedImage(event.target?.result);
      reader.readAsDataURL(file);
    }
  };

  // === Handler lokasi dari peta ===
  const handlePickLocation = async ({ lat, lng }) => {
    const lokasiText = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
    setData("lokasi", lokasiText);
    setLoadingAlamat(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const result = await res.json();
      setData("alamat", result.display_name || "Alamat tidak ditemukan");
    } catch (error) {
      console.error("Gagal mengambil alamat:", error);
    } finally {
      setLoadingAlamat(false);
    }
  };

  // === Handler submit edit ===
  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/projects/${project.id}`);
  };

  // === Handler hapus proyek ===
  const handleDelete = () => {
    if (confirm("Apakah kamu yakin ingin menghapus proyek ini?")) {
      router.delete(`/projects/${project.id}`);
    }
  };

  return (
    <>
      <Head title={`Edit Project - ${project.nama}`} />
      <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-700 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">Edit Project</h1>
            <Link href={`/projects/${project.id}/informasi`}>
              <Button
                variant="outline"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6"
              >
                Kembali
              </Button>
            </Link>
          </div>

          {/* Card Form */}
          <Card className="p-8 bg-white rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nama Project */}
              <div>
                <Label
                  htmlFor="nama"
                  className="text-gray-700 font-semibold mb-2"
                >
                  Nama Project
                </Label>
                <Input
                  id="nama"
                  value={data.nama}
                  onChange={(e) => setData("nama", e.target.value)}
                  placeholder="Masukkan nama project"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <Label
                  htmlFor="deskripsi"
                  className="text-gray-700 font-semibold mb-2"
                >
                  Deskripsi
                </Label>
                <Textarea
                  id="deskripsi"
                  value={data.deskripsi}
                  onChange={(e) => setData("deskripsi", e.target.value)}
                  placeholder="Masukkan deskripsi project"
                  rows={3}
                />
              </div>

              {/* Klien */}
              <div>
                <Label
                  htmlFor="klien"
                  className="text-gray-700 font-semibold mb-2"
                >
                  Klien
                </Label>
                <Input
                  id="klien"
                  value={data.klien}
                  onChange={(e) => setData("klien", e.target.value)}
                  placeholder="Masukkan nama klien"
                />
              </div>

              {/* Tanggal */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="tanggal_mulai"
                    className="text-gray-700 font-semibold mb-2"
                  >
                    Tanggal Mulai
                  </Label>
                  <div className="relative">
                    <Input
                      type="date"
                      id="tanggal_mulai"
                      value={data.tanggal_mulai}
                      onChange={(e) => setData("tanggal_mulai", e.target.value)}
                    />
                    <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="tanggal_selesai"
                    className="text-gray-700 font-semibold mb-2"
                  >
                    Tanggal Selesai
                  </Label>
                  <div className="relative">
                    <Input
                      type="date"
                      id="tanggal_selesai"
                      value={data.tanggal_selesai}
                      onChange={(e) =>
                        setData("tanggal_selesai", e.target.value)
                      }
                    />
                    <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Lokasi */}
              <div>
                <Label
                  htmlFor="lokasi"
                  className="text-gray-700 font-semibold mb-2"
                >
                  Lokasi
                </Label>
                <Input
                  id="lokasi"
                  value={data.lokasi}
                  onChange={(e) => setData("lokasi", e.target.value)}
                  placeholder="Klik lokasi di peta"
                />
              </div>

              {/* Peta */}
              <div className="mt-6">
                <Label className="text-gray-700 font-semibold mb-2 block">
                  Peta Lokasi
                </Label>
                <div className="rounded-lg overflow-hidden border border-gray-300">
                  <MapContainer
                    center={mapCenter}
                    zoom={16}
                    style={{ height: "300px", width: "100%" }}
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

              {/* Upload Gambar */}
              <div className="mt-6">
                <Label className="text-gray-700 font-semibold mb-2 block">
                  Gambar Project
                </Label>
                {selectedImage ? (
                  <div className="space-y-3">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() =>
                          document.getElementById("image-upload")?.click()
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                      >
                        <Upload className="w-4 h-4 mr-2" /> Ganti Gambar
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => setSelectedImage(null)}
                      >
                        <Trash className="w-4 h-4 mr-2" /> Hapus
                      </Button>
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload"
                    className="block cursor-pointer"
                  >
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 font-medium">
                        Pilih atau drag gambar ke sini
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Format: JPG, PNG, Maks. 3MB
                      </p>
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Hapus
                </Button>
                <Button
                  type="submit"
                  disabled={processing}
                  className="bg-blue-700 text-white hover:bg-blue-800 px-8"
                >
                  <Save className="w-4 h-4 mr-2" />{" "}
                  {processing ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
