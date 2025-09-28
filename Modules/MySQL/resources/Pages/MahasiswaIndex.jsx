import React, { useState } from "react";

import { usePage, Head, router, Link } from "@inertiajs/react";

import Dashboard from "@/layout/Dashboard";
import CustomDataTable from "@components/custom/CustomDataTable";
import CustomPagination from "@components/custom/CustomPagination";
import CustomTableSearch from "@components/custom/CustomTableSearch";

import DataTable from "@/components/custom/NewCustomDataTable";

import { Plus, Users } from "lucide-react";
import { Card } from "@components/ui/card";
import { Button } from "@/components/ui/button";

const columns = [
  {
    key: "nama",
    label: "Nama",
    type: "text",
    sort: true,
  },
  {
    key: "nim",
    label: "NIM",
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
    key: "created_at",
    label: "Created At",
    type: "time",
    sort: true,
  },
];

const onRowClick = (item) => {
  router.visit(`/mysql/mahasiswa/${item.id}`);
};

function MahasiswaIndex() {
  const { mahasiswa, filters } = usePage().props;

  const [search, setSearch] = useState(filters.search || "");

  const sortBy = filters.sort_by || "";
  const sortDirection = filters.sort_direction || "";

  const handleSort = (column) => {
    let direction = "asc";
    if (sortBy === column && sortDirection === "asc") {
      direction = "desc";
    }

    router.get(
      "/mysql/mahasiswa",
      {
        per_page: mahasiswa.per_page,
        search,
        sort_by: column,
        sort_direction: direction,
      },
      { preserveScroll: true }
    );
  };

  const onPaginationChange = (value) => {
    router.get(
      `/mysql/mahasiswa/`,
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
      "/mysql/mahasiswa",
      {
        per_page: mahasiswa.per_page,
        search,
        sort_by: sortBy,
        sort_direction: sortDirection,
      },
      { preserveScroll: true }
    );
  };

  {
    console.log(mahasiswa.data);
  }

  return (
    <>
      <Head title="Assets" />
      <div className="w-full mx-auto">
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-2 px-4">
            <Link href="/mysql/mahasiswa/add">
              <Button className="cursor-pointer">
                Add Mahasiswa
                <Plus className="w-4 h-4" />
              </Button>
            </Link>

            <CustomTableSearch
              search={search}
              setSearch={setSearch}
              onSearch={onSearch}
              placeholder="Search Mahasiswa"
            />
          </div>
          <div className="px-4 space-y-4">
            <DataTable
              data={mahasiswa.data}
              filters={filters}
              onSort={handleSort}
              onRowClick={onRowClick}
              noItem="mahasiswa"
            >
              <DataTable.Column accessor="nama" label="Nama" type="text" sort />
              <DataTable.Column accessor="nim" label="NIM" type="text" sort />
              <DataTable.Column
                accessor="alamat"
                label="Alamat"
                type="text"
                sort
              />
              <DataTable.Column
                accessor="created_at"
                label="Created At"
                type="time"
                sort
              />
            </DataTable>

            <CustomPagination
              data={mahasiswa}
              onPaginationChange={onPaginationChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}

MahasiswaIndex.layout = (page) => (
  <Dashboard children={page} title={"Mahasiswa"} />
);
export default MahasiswaIndex;
