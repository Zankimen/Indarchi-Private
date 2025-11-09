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

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Upload } from "lucide-react";

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

export default function ProjectCreate() {
  const { data, setData, post, processing } = useForm({
    nama: "",
    deskripsi: "",
    klien: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    lokasi: "",
    radius: 150,
    gambar: null,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [mapCenter] = useState([-7.5553, 110.859]);
  const [loadingAlamat, setLoadingAlamat] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setData("gambar", file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePickLocation = async ({ lat, lng }) => {
    const lokasiText = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
    setData("lokasi", lokasiText);

    setLoadingAlamat(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const result = await response.json();
      const alamatLengkap = result.display_name || "Alamat tidak ditemukan";
      // setData("alamat", alamatLengkap);
    } catch (error) {
      console.error("Gagal mengambil alamat:", error);
    } finally {
      setLoadingAlamat(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/dashboard/projects");
  };

  return (
    <>
      <Head title="Tambah Project" />
      <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-700 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">Buat Project Baru</h1>
            <Link href="/dashboard/projects">
              <Button
                variant="outline"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6"
              >
                Batal
              </Button>
            </Link>
          </div>

          <Card className="p-8 bg-white rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nama Project */}
              <div>
                <Label htmlFor="nama" className="text-gray-700 font-semibold mb-2">
                  Nama Project
                </Label>
                <Input
                  id="nama"
                  value={data.nama}
                  onChange={(e) => setData("nama", e.target.value)}
                  placeholder="Masukkan nama project"
                  className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <Label htmlFor="deskripsi" className="text-gray-700 font-semibold mb-2">
                  Deskripsi
                </Label>
                <Textarea
                  id="deskripsi"
                  value={data.deskripsi}
                  onChange={(e) => setData("deskripsi", e.target.value)}
                  placeholder="Masukkan deskripsi project"
                  rows={3}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Klien */}
              <div>
                <Label htmlFor="klien" className="text-gray-700 font-semibold mb-2">
                  Klien
                </Label>
                <Input
                  id="klien"
                  value={data.klien}
                  onChange={(e) => setData("klien", e.target.value)}
                  placeholder="Masukkan nama klien"
                  className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tanggal Mulai */}
              <div>
                <Label htmlFor="tanggal_mulai" className="text-gray-700 font-semibold mb-2">
                  Tanggal Mulai
                </Label>
                <div className="relative">
                  <Input
                    id="tanggal_mulai"
                    type="date"
                    value={data.tanggal_mulai}
                    onChange={(e) => setData("tanggal_mulai", e.target.value)}
                    className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Tanggal Selesai */}
              <div>
                <Label htmlFor="tanggal_selesai" className="text-gray-700 font-semibold mb-2">
                  Tanggal Selesai
                </Label>
                <div className="relative">
                  <Input
                    id="tanggal_selesai"
                    type="date"
                    value={data.tanggal_selesai}
                    onChange={(e) => setData("tanggal_selesai", e.target.value)}
                    className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Lokasi */}
              <div>
                <Label htmlFor="lokasi" className="text-gray-700 font-semibold mb-2">
                  Lokasi
                </Label>
                <Input
                  id="lokasi"
                  value={data.lokasi}
                  onChange={(e) => setData("lokasi", e.target.value)}
                  placeholder="Klik lokasi di peta"
                  className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
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

              {/* Gambar Upload */}
              <div className="mt-6">
                <Label className="text-gray-700 font-semibold mb-2 block">Gambar</Label>

                {selectedImage ? (
                  <div className="space-y-3">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <div className="flex gap-2">
                      <label htmlFor="image-upload" className="w-full">
                        <Button
                          type="button"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer"
                          onClick={() =>
                            document.getElementById("image-upload")?.click()
                          }
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Ganti Gambar
                        </Button>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      Format: JPG, PNG, Maksimal 3MB
                    </p>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <label htmlFor="image-upload" className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 font-medium">
                        Pilih atau drag gambar ke sini
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Format: JPG, PNG, Maksimal 3MB
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

              {/* Tombol Simpan */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  disabled={processing}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg"
                >
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
