import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import Dashboard from "@/layout/Dashboard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Users } from "lucide-react";
import { formatDateNoHour } from "@/components/lib/utils";
import PekerjaEditDialog from "./PekerjaEditDialog";

function PekerjaDetails({ pekerja, perans }) {
  const {
    props: { auth },
  } = usePage();

  const hasPermission = (permission) => auth.permissions.includes(permission);

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
              <Link href="/dashboard/pekerja">
                <Button>
                  <ChevronLeft className="w-4 h-4" />
                  Kembali
                </Button>
              </Link>
              {hasPermission("dashboard.worker.manage") && (
                <PekerjaEditDialog pekerja={pekerja} perans={perans} />
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 px-8 border-border">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
            <Detail label="Nama" value={pekerja.name} />
            <Detail label="Email" value={pekerja.email} />
            <Detail label="Alamat" value={pekerja.alamat} />
            <Detail label="Posisi/Role" value={pekerja.roles?.[0]?.name || "-"} />
            <Detail label="Dibuat Pada" value={formatDateNoHour(pekerja.created_at)} />
            <Detail label="Terakhir Di-Update" value={formatDateNoHour(pekerja.updated_at)} />
          </div>
        </Card>
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

PekerjaDetails.layout = (page) => <Dashboard title={"Detail Pekerja"}>{page}</Dashboard>;

export default PekerjaDetails;
