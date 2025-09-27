import React, { useState } from "react";
import { usePage, Head, router, Link } from "@inertiajs/react";
import Dashboard from "@/layout/Dashboard";
import CustomDataTable from "@components/custom/CustomDataTable";
import CustomPagination from "@components/custom/CustomPagination";
import CustomTableSearch from "@components/custom/CustomTableSearch";
import { Plus, Shield } from "lucide-react";
import { Card } from "@components/ui/card";
import { Button } from "@/components/ui/button";

const columns = [
  {
    key: "name",
    label: "Nama Peran",
    type: "text",
    sort: true,
  },
  {
    key: "deskripsi",
    label: "Deskripsi",
    type: "text",
    render: (item) => item.deskripsi || "Tidak ada deskripsi",
  },
  {
    key: "permissions_count",
    label: "Jumlah Permission",
    type: "text",
    render: (item) => item.permissions?.length || 0,
  },
  {
    key: "created_at",
    label: "Dibuat",
    type: "time",
    sort: true,
  },
];

const onRowClick = (item) => {
  router.visit(`/role/${item.id}`);
};

function PeranIndex() {
  const { roles, filters } = usePage().props;

  const [search, setSearch] = useState(filters.search || "");

  const sortBy = filters.sort_by || "";
  const sortDirection = filters.sort_direction || "";

  const handleSort = (column) => {
    let direction = "asc";
    if (sortBy === column && sortDirection === "asc") {
      direction = "desc";
    }

    router.get(
      "/role",
      {
        per_page: roles.per_page,
        search,
        sort_by: column,
        sort_direction: direction,
      },
      { preserveScroll: true }
    );
  };

  const onPaginationChange = (value) => {
    router.get(
      `/role`,
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
      "/role",
      {
        per_page: roles.per_page,
        search,
        sort_by: sortBy,
        sort_direction: sortDirection,
      },
      { preserveScroll: true }
    );
  };

  return (
    <>
      <Head title="Manajemen Peran" />
      <div className="w-full mx-auto">
        <div className="space-y-4">
          <Card className="border-border">
            <div className="grid grid-cols-1 sm:flex sm:justify-between items-center px-6 py-2 gap-4">
              <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
                <Shield className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
                Manajemen Peran
              </h1>
              <div className="grid grid-cols-1 gap-2 sm:flex">
                <Link href="/role/add">
                  <Button className="cursor-pointer">
                    Tambah Peran
                    <Plus className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <div className="flex justify-between items-center gap-2 px-4">
            <CustomTableSearch
              search={search}
              setSearch={setSearch}
              onSearch={onSearch}
              placeholder="Cari Peran"
            />
          </div>

          <div className="px-4 space-y-4">
            <CustomDataTable
              columns={columns}
              data={roles.data}
              onRowClick={onRowClick}
              onSort={handleSort}
              filters={filters}
              noItem="Peran"
            />
            <CustomPagination
              data={roles}
              onPaginationChange={onPaginationChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}

PeranIndex.layout = (page) => (
  <Dashboard children={page} title={"Manajemen Peran"} />
);
export default PeranIndex;
