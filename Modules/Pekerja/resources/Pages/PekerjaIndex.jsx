import React, { useState } from "react";

import { Head, router, usePage } from "@inertiajs/react";

import Dashboard from "@/layout/Dashboard";
import DataTable from "@/components/custom/NewCustomDataTable";
import CustomPagination from "@components/custom/CustomPagination";
import CustomTableSearch from "@components/custom/CustomTableSearch";

import PekerjaAddDialog from "./PekerjaAddDialog";

const onRowClick = (item) => {
  router.visit(`/dashboard/pekerja/${item.user_id ?? item.id}`);
};

function PekerjaIndex({ pekerjas, perans, filters }) {
  const {
    props: { auth },
  } = usePage();

  const hasPermission = (permission) => auth.permissions.includes(permission);

  const [search, setSearch] = useState(filters.search || "");

  const sortBy = filters.sort_by || "";
  const sortDirection = filters.sort_direction || "";

  const handleSort = (column) => {
    let direction = "asc";
    if (sortBy === column && sortDirection === "asc") {
      direction = "desc";
    }

    router.get(
      "/dashboard/pekerja",
      {
        per_page: pekerjas.per_page,
        search,
        sort_by: column,
        sort_direction: direction,
      },
      { preserveScroll: true }
    );
  };

  const onPaginationChange = (value) => {
    router.get(
      `/dashboard/pekerja`,
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
      "/dashboard/pekerja",
      {
        per_page: pekerjas.per_page,
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
          <div className="flex justify-between items-center gap-2">
            {hasPermission("dashboard.worker.manage") && <PekerjaAddDialog perans={perans} />}

            <CustomTableSearch
              search={search}
              setSearch={setSearch}
              onSearch={onSearch}
              placeholder="Cari Pekerja"
            />
          </div>
          <div className="space-y-4">
            <DataTable
              data={pekerjas.data}
              filters={filters}
              onSort={handleSort}
              onRowClick={onRowClick}
              noItem="Pekerja"
            >
              <DataTable.Column accessor="name" label="Nama" type="avatar" sort />
              <DataTable.Column accessor="email" label="Email" type="text" sort />
              <DataTable.Column accessor="role" label="Role" type="text" sort />
              <DataTable.Column accessor="created_at" label="Created At" type="time" sort />
            </DataTable>

            <CustomPagination data={pekerjas} onPaginationChange={onPaginationChange} />
          </div>
        </div>
      </div>
    </>
  );
}

PekerjaIndex.layout = (page) => <Dashboard title={"Pekerja"}>{page}</Dashboard>;

export default PekerjaIndex;
