import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";

import Dashboard from "@/layout/Dashboard";
import DataTable from "@/components/custom/NewCustomDataTable";
import CustomPagination from "@components/custom/CustomPagination";
import CustomTableSearch from "@components/custom/CustomTableSearch";

import ProjectCreateDialog from "./ProjectCreateDialog";

function ProjectIndex({ projects, filters }) {
  const {
    props: { auth },
  } = usePage();

  const [search, setSearch] = useState(filters.search || "");
  const sortBy = filters.sort_by || "";
  const sortDirection = filters.sort_direction || "";

  const hasPermission = (permission) => auth.permissions.includes(permission);

  const onRowClick = (item) => {
    router.visit(`/projects/${item.id}/informasi`);
  };

  const handleSort = (column) => {
    let direction = "asc";
    if (sortBy === column && sortDirection === "asc") {
      direction = "desc";
    }

    router.get(
      "/dashboard/projects",
      {
        per_page: projects.per_page,
        search,
        sort_by: column,
        sort_direction: direction,
      },
      { preserveScroll: true }
    );
  };

  const onPaginationChange = (value) => {
    router.get(
      "/dashboard/projects",
      {
        per_page: value,
        search,
        sort_by: sortBy,
        sort_direction: sortDirection,
      },
      { preserveScroll: true }
    );
  };

  const onSearch = () => {
    router.get(
      "/dashboard/projects",
      {
        per_page: projects.per_page,
        search,
        sort_by: sortBy,
        sort_direction: sortDirection,
      },
      { preserveScroll: true }
    );
  };

  return (
    <>
      <Head title="Projects" />
      <div className="">
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-2">
            {hasPermission("dashboard.project.manage") && <ProjectCreateDialog />}

            <CustomTableSearch
              search={search}
              setSearch={setSearch}
              onSearch={onSearch}
              placeholder="Cari Project"
            />
          </div>
          <div className="space-y-4">
            <DataTable
              data={projects.data}
              filters={filters}
              onSort={handleSort}
              onRowClick={onRowClick}
              noItem="Project"
            >
              <DataTable.Column accessor="nama" label="Nama" type="text" sort />
              <DataTable.Column accessor="deskripsi" label="Deskripsi" type="text" sort />
              <DataTable.Column accessor="lokasi" label="Lokasi" type="text" sort />
              <DataTable.Column accessor="tanggal_mulai" label="Tanggal Mulai" type="date" sort />
              <DataTable.Column
                accessor="tanggal_selesai"
                label="Tanggal Selesai"
                type="date"
                sort
              />
              <DataTable.Column accessor="radius" label="Radius" type="text" sort />

              <DataTable.Column accessor="created_at" label="Created At" type="time" sort />
            </DataTable>

            <CustomPagination data={projects} onPaginationChange={onPaginationChange} />
          </div>
        </div>
      </div>
    </>
  );
}

ProjectIndex.layout = (page) => <Dashboard title={"Projects"}>{page}</Dashboard>;

export default ProjectIndex;
