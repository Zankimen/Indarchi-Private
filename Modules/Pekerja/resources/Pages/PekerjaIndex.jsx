import React, { useState } from "react";

import { usePage, Head, router, Link } from "@inertiajs/react";

import Dashboard from "@/layout/Dashboard";
import DataTable from "@/components/custom/NewCustomDataTable";
import CustomPagination from "@components/custom/CustomPagination";
import CustomTableSearch from "@components/custom/CustomTableSearch";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const onRowClick = (item) => {
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
      <div className="">
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-2 px-4">
            <Link href="/pekerja/add">
              <Button className="cursor-pointer">
                Tambah Pekerja
                <Plus className="w-4 h-4" />
              </Button>
            </Link>

            <CustomTableSearch
              search={search}
              setSearch={setSearch}
              onSearch={onSearch}
              placeholder="Cari karyawan"
            />
          </div>
          <div className="px-4 space-y-4">
            <DataTable
              data={pekerja.data}
              filters={filters}
              onSort={handleSort}
              onRowClick={onRowClick}
              noItem="Pekerja"
            >
              <DataTable.Column accessor="name" label="Nama" type="text" sort />
              <DataTable.Column accessor="email" label="Email" type="text" sort />
              <DataTable.Column accessor="role" label="Role" type="text" sort />
              <DataTable.Column
                accessor="created_at"
                label="Created At"
                type="time"
                sort
              />
            </DataTable>

            <CustomPagination
              data={pekerja}
              onPaginationChange={onPaginationChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}

PekerjaIndex.layout = (page) => (
  <Dashboard children={page} title={"Pekerja"} />
);

export default PekerjaIndex;