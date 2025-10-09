import React from "react";
import { Head, Link } from "@inertiajs/react";
import Dashboard from "@/layout/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Pencil, Users } from "lucide-react";

import { formatDateNoHour } from "@/components/lib/utils";

function ProjectDetail({ pekerja }) {
  return (
    <>
      <Head title={pekerja.nama} />
      <div className="space-y-4">
        <Card className="border-border">
          <div className="grid grid-cols-1 sm:flex sm:justify-between items-center px-6 py-2 gap-4">
            <div className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
              <Users className="w-10 h-10 bg-accent text-background rounded-2xl mr-4 p-2" />
              {pekerja.name}
            </div>
            <div className="grid grid-cols-1 gap-2 sm:flex">
              <Button variant="outline" className="cursor-pointer">
                Edit
                <Pencil className="w-4 h-4" />
              </Button>
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
            <Detail label="Alamat" value={pekerja.alamat} />
            <Detail label="Email" value={pekerja.email} />
            <Detail
              label="Terakhir Di-Update"
              value={formatDateNoHour(pekerja.created_at)}
            />
            <Detail
              label="Dibuat Pada"
              value={formatDateNoHour(pekerja.updated_at)}
            />
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

ProjectDetail.layout = (page) => <Dashboard children={page} />;

export default ProjectDetail;
