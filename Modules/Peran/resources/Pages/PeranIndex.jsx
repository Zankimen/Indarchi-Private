import React, { useState } from "react";
import { usePage, Head, router } from "@inertiajs/react";
import Dashboard from "@/layout/Dashboard";
import DataTable from "@/components/custom/NewCustomDataTable";
import CustomPagination from "@components/custom/CustomPagination";
import CustomTableSearch from "@components/custom/CustomTableSearch";
import PeranAddDialog from "./PeranAddDialog";

const onRowClick = (item) => {
  router.visit(`/role/${item.id}`);
};

function PeranIndex() {
  const { roles, filters, permissions } = usePage().props;

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
      <Head title="Peran" />
      <div className="">
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-2">
            <PeranAddDialog permissions={permissions} />

            <CustomTableSearch
              search={search}
              setSearch={setSearch}
              onSearch={onSearch}
              placeholder="Cari Peran"
            />
          </div>
          <div className="space-y-4">
            <DataTable
              data={roles.data}
              filters={filters}
              onSort={handleSort}
              onRowClick={onRowClick}
              noItem="Peran"
            >
              <DataTable.Column accessor="name" label="Nama" type="text" sort />
              <DataTable.Column
                accessor="deskripsi"
                label="Deskripsi"
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
              data={roles}
              onPaginationChange={onPaginationChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}

PeranIndex.layout = (page) => <Dashboard children={page} title={"Peran"} />;
export default PeranIndex;
