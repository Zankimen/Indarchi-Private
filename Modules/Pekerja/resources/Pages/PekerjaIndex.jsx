import React, { useState } from "react";

import { usePage, Head, router, Link } from "@inertiajs/react";

import Dashboard from "@/layout/Dashboard";
import CustomDataTable from "@components/custom/CustomDataTable";
import CustomPagination from "@components/custom/CustomPagination";
import CustomTableSearch from "@components/custom/CustomTableSearch";

import { Plus, Users } from "lucide-react";
import { Card } from "@components/ui/card";
import { Button } from "@/components/ui/button";

// Combined columns for unified table
const columns = [
  {
    key: "name",
    label: "Nama",
    type: "text",
    sort: true,
  },
  {
    key: "email",
    label: "Email",
    type: "text",
    sort: true,
  },
  {
    key: "alamat",
    label: "Alamat",
    type: "text",
    sort: true,
  },
  {
    key: "posisi",
    label: "Posisi/Role",
    type: "text",
    sort: true,
  },
  {
    key: "created_at",
    label: "Tanggal Ditambahkan",
    type: "time",
    sort: true,
  },
];

const onRowClick = (item) => {
  console.log("Row clicked:", item);
  router.visit(`/pekerja/${item.user_id ?? item.id}`);
};

function PekerjaIndex() {
  const { pekerja, filters } = usePage().props;

  const [search, setSearch] = useState(filters.search || "");

  const sortBy = filters.sort_by || "";
  const sortDirection = filters.sort_direction || "";

  const handleSort = (column) => {
    let direction = "asc";
    if (sortBy === column && sortDirection === "asc") {
      direction = "desc";
    }

    router.get(
      "/pekerja",
      {
        per_page: pekerja.per_page,
        search,
        sort_by: column,
        sort_direction: direction,
      },
      { preserveScroll: true }
    );
  };

  const onPaginationChange = (value) => {
    router.get(
      `/pekerja`,
      {
        per_page: value,
        search,
        sort_by: sortBy,
        sort_direction: sortDirection,
      },
      {
        preserveScroll: true,
      }
    );
  };

  const onSearch = () => {
    router.get(
      "/pekerja",
      {
        per_page: pekerja.per_page,
        search,
        sort_by: sortBy,
        sort_direction: sortDirection,
      },
      { preserveScroll: true }
    );
  };

  return (
    <>
      <Head title="Pekerja" />
      <div className="w-full mx-auto">
        <div className="space-y-6">
          {/* Header dengan tombol tambah */}
          <div className="flex flex-row-reverse justify-between items-center gap-2 px-4 mb-6">
            <CustomTableSearch
              search={search}
              setSearch={setSearch}
              onSearch={onSearch}
              placeholder="Cari karyawan"
            />
            <Link href="/pekerja/add">
              <Button className="cursor-pointer font-bold text-[16px] px-6 py-3 rounded-[10px]">
                <Plus className="w-4 h-4 ml-2" />
                Tambah Karyawan
              </Button>
            </Link>
          </div>

          <CustomDataTable
            columns={columns}
            data={pekerja.data}
            onSort={handleSort} // ← tambahkan ini
            onRowClick={(item) => {
              router.get(`/pekerja/${item.id}`);
            }}
            onEdit={(item) => {
              router.get(`/pekerja/${item.id}/edit`);
            }}
            onDelete={(item) => {
              if (confirm("Apakah kamu yakin ingin menghapus karyawan ini?")) {
                router.delete(`/pekerja/${item.id}`);
              }
            }}
            filters={filters}
            noItem="Karyawan"
          />

          <CustomPagination
            data={pekerja}
            onPaginationChange={onPaginationChange}
          />
        </div>
      </div>
    </>
  );
}

PekerjaIndex.layout = (page) => <Dashboard children={page} title={"Karyawan"} />;
export default PekerjaIndex;