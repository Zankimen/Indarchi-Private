import React, { useState } from "react";

import { usePage, Head, router, Link } from "@inertiajs/react";

import Dashboard from "@/layout/Dashboard";
import CustomDataTable from "@components/custom/CustomDataTable";
import CustomPagination from "@components/custom/CustomPagination";
import CustomTableSearch from "@components/custom/CustomTableSearch";

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

  return (
    <>
      <Head title="Assets" />
      <div className="w-full mx-auto">
        <div className="space-y-4">
          <Card className="border-border">
            <div className="grid grid-cols-1 sm:flex sm:justify-between items-center px-6 py-2 gap-4">
              <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
                <Users className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
                Mahasiswa
              </h1>
              <div className="grid grid-cols-1 gap-2 sm:flex">
                <Link href="/mysql/mahasiswa/add">
                  <Button className="cursor-pointer">
                    Add Mahasiswa
                    <Plus className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card className="border-border">
            <div className="flex justify-end items-center gap-2 px-6">
              <CustomTableSearch
                search={search}
                setSearch={setSearch}
                onSearch={onSearch}
                placeholder="Search Mahasiswa"
              />
            </div>
            <CustomDataTable
              columns={columns}
              data={mahasiswa.data}
              onRowClick={onRowClick}
              onSort={handleSort}
              filters={filters}
              noItem="Mahasiswa"
            />
          </Card>
          <CustomPagination
            data={mahasiswa}
            onPaginationChange={onPaginationChange}
          />
        </div>
      </div>
    </>
  );
}

MahasiswaIndex.layout = (page) => <Dashboard children={page} />;
export default MahasiswaIndex;
