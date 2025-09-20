import React from "react";
import { Head, useForm } from "@inertiajs/react";
import Dashboard from "@/layout/Dashboard";

function ProjectCreate() {
  const { data, setData, post, processing, errors } = useForm({
    nama: "",
    deskripsi: "", // <-- tambahkan ini
    lokasi: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    radius: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/projects"); // langsung pakai URL tanpa ziggy
  };

  return (
    <>
      <Head title="Tambah Project" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Nama</label>
          <input
            type="text"
            value={data.nama}
            onChange={(e) => setData("nama", e.target.value)}
            className="border p-2 w-full"
          />
          {errors.nama && <div className="text-red-500">{errors.nama}</div>}
        </div>

        <div>
          <label className="block">Deskripsi</label>
          <textarea
            value={data.deskripsi}
            onChange={(e) => setData("deskripsi", e.target.value)}
            className="border p-2 w-full"
          />
          {errors.deskripsi && (
            <div className="text-red-500">{errors.deskripsi}</div>
          )}
        </div>

        <div>
          <label className="block">Lokasi</label>
          <input
            type="text"
            value={data.lokasi}
            onChange={(e) => setData("lokasi", e.target.value)}
            className="border p-2 w-full"
          />
          {errors.lokasi && <div className="text-red-500">{errors.lokasi}</div>}
        </div>

        <div>
          <label className="block">Tanggal Mulai</label>
          <input
            type="date"
            value={data.tanggal_mulai}
            onChange={(e) => setData("tanggal_mulai", e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block">Tanggal Selesai</label>
          <input
            type="date"
            value={data.tanggal_selesai}
            onChange={(e) => setData("tanggal_selesai", e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block">Radius</label>
          <input
            type="number"
            value={data.radius}
            onChange={(e) => setData("radius", e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <button
          type="submit"
          disabled={processing}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {processing ? "Menyimpan..." : "Save"}
        </button>
      </form>
    </>
  );
}

ProjectCreate.layout = (page) => <Dashboard children={page} />;
export default ProjectCreate;
