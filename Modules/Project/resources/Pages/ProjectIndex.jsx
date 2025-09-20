import React from "react";
import { Head, usePage, Link, useForm } from "@inertiajs/react";
import Dashboard from "@/layout/Dashboard";

function ProjectIndex() {
  const { projects } = usePage().props;
  const { delete: destroy } = useForm();

  const handleDelete = (id) => {
    if (confirm("Yakin hapus project ini?")) {
      destroy(`/projects/${id}`);
    }
  };

  return (
    <>
      <Head title="Projects" />

      <div className="w-full mx-auto">
        <h1 className="text-2xl font-bold mb-4">Daftar Projects</h1>

        <Link
          href="/projects/create"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Tambah Project
        </Link>

        <table className="w-full mt-4 border border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Deskripsi</th>
              <th className="p-2 border">Lokasi</th>
              <th className="p-2 border">Tanggal</th>
              <th className="p-2 border">Radius</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project) => (
                <tr key={project.id}>
                  <td className="p-2 border">{project.id}</td>
                  <td className="p-2 border">{project.nama}</td>
                  <td className="p-2 border">{project.deskripsi}</td>
                  <td className="p-2 border">{project.lokasi}</td>
                  <td className="p-2 border">
                    {project.tanggal_mulai} s/d {project.tanggal_selesai}
                  </td>
                  <td className="p-2 border">{project.radius}</td>
                  <td className="p-2 border space-x-2">
                    <Link
                      href={`/projects/${project.id}/edit`}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  Belum ada project.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

ProjectIndex.layout = (page) => <Dashboard children={page} />;
export default ProjectIndex;
