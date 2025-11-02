import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import Dashboard from "@/layout/Dashboard";
import DataTable from "@/components/custom/NewCustomDataTable";
import CustomPagination from "@components/custom/CustomPagination";
import CustomTableSearch from "@components/custom/CustomTableSearch";
import PeranAddDialog from "./PeranAddDialog";

function PeranIndex({ perans, filters, permissions }) {

  const { props: { auth } } = usePage();
  
  const [search, setSearch] = useState(filters.search || "");
  
  const sortBy = filters.sort_by || "";
  const sortDirection = filters.sort_direction || "";
  
  const hasPermission = (permission) => auth.permissions.includes(permission);

  const onRowClick = (item) => {
    router.visit(`/dashboard/peran/${item.id}`);
  };

  const handleSort = (column) => {
    let direction = "asc";
    if (sortBy === column && sortDirection === "asc") {
      direction = "desc";
    }

    router.get(
      "/dashboard/peran",
      {
        per_page: perans.per_page,
        search,
        sort_by: column,
        sort_direction: direction,
      },
      { preserveScroll: true }
    );
  };

  const onPaginationChange = (value) => {
    router.get(
      `/dashboard/peran`,
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
      "/dashboard/peran",
      {
        per_page: perans.per_page,
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

            {hasPermission('dashboard.role.manage') && (
              <PeranAddDialog permissions={permissions} />
            )}


            <CustomTableSearch
              search={search}
              setSearch={setSearch}
              onSearch={onSearch}
              placeholder="Cari Peran"
            />
          </div>
          <div className="space-y-4">
            <DataTable
              data={perans.data}
              filters={filters}
              onSort={handleSort}
              onRowClick={onRowClick}
              noItem="Peran"
            >
              <DataTable.Column accessor="name" label="Nama" type="text" sort />
              <DataTable.Column accessor="deskripsi" label="Deskripsi" type="text" sort />
              <DataTable.Column accessor="created_at" label="Created At" type="time" sort />
            </DataTable>

            <CustomPagination data={perans} onPaginationChange={onPaginationChange} />
          </div>
        </div>
      </div>
    </>
  );
}

PeranIndex.layout = (page) => <Dashboard title={"Peran"}>{page}</Dashboard>;
export default PeranIndex;
