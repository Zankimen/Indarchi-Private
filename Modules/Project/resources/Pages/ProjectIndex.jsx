import React, { useState } from "react";
import { usePage, Head, router, Link } from "@inertiajs/react";

import Dashboard from "@/layout/Dashboard";
import DataTable from "@/components/custom/NewCustomDataTable";
import CustomPagination from "@components/custom/CustomPagination";
import CustomTableSearch from "@components/custom/CustomTableSearch";
import { Plus } from "lucide-react";

function ProjectIndex() {
  const { projects, filters } = usePage().props;

  const [search, setSearch] = useState(filters.search || "");
  const sortBy = filters.sort_by || "";
  const sortDirection = filters.sort_direction || "";

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
      <div className="space-y-4">
        {/* Header section */}
        <div className="flex justify-between items-center gap-2">
          <Link href="/dashboard/projects/create">
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition cursor-pointer">
              Tambah Project
              <Plus className="w-4 h-4" />
            </button>
          </Link>

          <CustomTableSearch
            search={search}
            setSearch={setSearch}
            onSearch={onSearch}
            placeholder="Cari Project"
          />
        </div>

        {/* Data Table */}
        <div className="space-y-4">
          <DataTable
            data={projects.data}
            filters={filters}
            onSort={handleSort}
            onRowClick={onRowClick}
            noItem="Project"
          >
            <DataTable.Column accessor="nama" label="Nama" type="text" sort />
            <DataTable.Column
              accessor="deskripsi"
              label="Deskripsi"
              type="text"
              sort
            />
            <DataTable.Column
              accessor="lokasi"
              label="Lokasi"
              type="text"
              sort
            />
            <DataTable.Column
              accessor="tanggal_mulai"
              label="Tanggal Mulai"
              type="date"
              sort
            />
            <DataTable.Column
              accessor="tanggal_selesai"
              label="Tanggal Selesai"
              type="date"
              sort
            />
            <DataTable.Column
              accessor="radius"
              label="Radius"
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

          {/* Pagination */}
          <CustomPagination
            data={projects}
            onPaginationChange={onPaginationChange}
          />
        </div>
      </div>
    </>
  );
}

ProjectIndex.layout = (page) => (
  <Dashboard children={page} title={"Projects"} />
);

export default ProjectIndex;
