import React from "react";
import { Head, Link } from "@inertiajs/react";
import Dashboard from "@/layout/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PekerjaDetails({ karyawan }) {
  return (
    <Dashboard>
      <Head title="Detail Karyawan" />

      <div className="p-6">
        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>Detail Karyawan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>Nama:</strong> {karyawan.nama_karyawan}
              </div>
              <div>
                <strong>Email:</strong> {karyawan.user?.email ?? "-"}
              </div>
              <div>
                <strong>Alamat:</strong> {karyawan.alamat}
              </div>
              <div>
                <strong>Posisi:</strong> {karyawan.posisi}
              </div>
              <div>
                <strong>Dibuat:</strong>{" "}
                {new Date(karyawan.created_at).toLocaleString()}
              </div>
              <div>
                <strong>Diupdate:</strong>{" "}
                {new Date(karyawan.updated_at).toLocaleString()}
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <Link href={`/pekerja/${karyawan.user_id}/edit`}>
                <Button>Edit</Button>
              </Link>
              <Link href={`/pekerja`}>
                <Button variant="outline">Kembali</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Dashboard>
  );
}
