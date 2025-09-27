import React, { useState } from "react";

import { usePage, Head, router, Link } from "@inertiajs/react";

import Dashboard from "@/layout/Dashboard";
import CustomDataTable from "@components/custom/CustomDataTable";
import CustomPagination from "@components/custom/CustomPagination";
import CustomTableSearch from "@components/custom/CustomTableSearch";

import { Plus, Users, UserCheck } from "lucide-react";
import { Card } from "@components/ui/card";
import { Button } from "@/components/ui/button";

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
    key: "created_at",
    label: "Created At",
    type: "time",
    sort: true,
  },
];

// Kolom untuk tabel karyawan yang baru ditambahkan
const karyawanColumns = [
  {
    key: "nama_karyawan",
    label: "Nama Karyawan",
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
  router.visit(`/pekerja/${item.id}`);
};

const onKaryawanRowClick = (item) => {
  router.visit(`/pekerja/${item.id}`);
};

function PekerjaIndex() {
  const { pekerja, filters, karyawan } = usePage().props;

  const [search, setSearch] = useState(filters.search || "");
  const [karyawanSearch, setKaryawanSearch] = useState(filters.karyawan_search || "");

  const sortBy = filters.sort_by || "";
  const sortDirection = filters.sort_direction || "";

  const karyawanSortBy = filters.karyawan_sort_by || "";
  const karyawanSortDirection = filters.karyawan_sort_direction || "";

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
        karyawan_search: karyawanSearch,
        karyawan_sort_by: karyawanSortBy,
        karyawan_sort_direction: karyawanSortDirection,
      },
      { preserveScroll: true }
    );
  };

  const handleKaryawanSort = (column) => {
    let direction = "asc";
    if (karyawanSortBy === column && karyawanSortDirection === "asc") {
      direction = "desc";
    }

    router.get(
      "/pekerja",
      {
        per_page: pekerja.per_page,
        search,
        sort_by: sortBy,
        sort_direction: sortDirection,
        karyawan_search: karyawanSearch,
        karyawan_sort_by: column,
        karyawan_sort_direction: direction,
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
        karyawan_search: karyawanSearch,
        karyawan_sort_by: karyawanSortBy,
        karyawan_sort_direction: karyawanSortDirection,
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
        karyawan_search: karyawanSearch,
        karyawan_sort_by: karyawanSortBy,
        karyawan_sort_direction: karyawanSortDirection,
      },
      { preserveScroll: true }
    );
  };

  const onKaryawanSearch = () => {
    router.get(
      "/pekerja",
      {
        per_page: pekerja.per_page,
        search,
        sort_by: sortBy,
        sort_direction: sortDirection,
        karyawan_search: karyawanSearch,
        karyawan_sort_by: karyawanSortBy,
        karyawan_sort_direction: karyawanSortDirection,
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
            <div className="flex justify-between items-center gap-2 px-4">
              <Link href="/pekerja/add">
              <Button className="cursor-pointer font-bold text-[16px] px-6 py-3 rounded-[10px]">
              <Plus className="w-4 h-4 ml-2" />
                  Tambah Karyawan
                </Button>
              </Link>
            </div>

            {/* Tabel Pertama - Data User */}
            <div className="px-4 space-y-4">
              <Card className="border-border">
                <div className="flex justify-between items-center px-6 py-4">
                  <h2 className="flex items-center font-bold text-xl text-gray-800">
                    <Users className="w-6 h-6 mr-2 text-blue-600" />
                    Data Users
                  </h2>

                  <CustomTableSearch
                    search={search}
                    setSearch={setSearch}
                    onSearch={onSearch}
                    placeholder="Cari user"
                  />
                </div>
              </Card>

              <CustomDataTable
                columns={columns}
                data={pekerja.data}
                onRowClick={onRowClick}
                onSort={handleSort}
                filters={filters}
                noItem="User"
              />
              <CustomPagination
                data={pekerja}
                onPaginationChange={onPaginationChange}
              />
            </div>


          {/* Tabel Kedua - Data Karyawan */}
          <div className="px-4 space-y-4">
            <Card className="border-border">
              <div className="flex justify-between items-center px-6 py-4">
              <h2 className="flex items-center font-bold text-[24px] text-gray-900">
                  <UserCheck className="w-6 h-6 mr-2 text-green-600" />
                  Data Karyawan
                </h2>
                
                <CustomTableSearch
                  search={karyawanSearch}
                  setSearch={setKaryawanSearch}
                  onSearch={onKaryawanSearch}
                  placeholder="Cari karyawan"
                />
              </div>
            </Card>
            
            <CustomDataTable
              columns={karyawanColumns}
              data={karyawan?.data || []}
              onRowClick={onKaryawanRowClick}
              onSort={handleKaryawanSort}
              filters={{
                sort_by: karyawanSortBy,
                sort_direction: karyawanSortDirection,
              }}
              noItem="Karyawan"
            />
            {karyawan && (
              <CustomPagination
                data={karyawan}
                onPaginationChange={onPaginationChange}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

PekerjaIndex.layout = (page) => <Dashboard children={page} title={"Karyawan"} />;
export default PekerjaIndex;