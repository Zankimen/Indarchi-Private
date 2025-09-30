import React, { useState } from "react";
import { usePage, Head, router, Link } from "@inertiajs/react";

import Dashboard from "@/layout/Dashboard";
import CustomDataTable from "@components/custom/CustomDataTable";
import DataTable from "@/components/custom/NewCustomDataTable";
import CustomPagination from "@components/custom/CustomPagination";
import CustomTableSearch from "@components/custom/CustomTableSearch";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const columns = [
  {
    key: "nama",
    label: "Nama",
    type: "text",
    sort: true,
  },
  {
    key: "deskripsi",
    label: "Deskripsi",
    type: "text",
    sort: true,
  },
  {
    key: "lokasi",
    label: "Lokasi",
    type: "text",
    sort: true,
  },
  {
    key: "tanggal_mulai",
    label: "Tanggal Mulai",
    type: "date",
    sort: true,
  },
  {
    key: "tanggal_selesai",
    label: "Tanggal Selesai",
    type: "date",
    sort: true,
  },
  {
    key: "radius",
    label: "Radius",
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
  router.visit(`/projects/${item.id}/show`);
};

function ProjectIndex() {
  const { projects, filters } = usePage().props;

  const [search, setSearch] = useState(filters.search || "");
  const sortBy = filters.sort_by || "";
  const sortDirection = filters.sort_direction || "";

  const handleSort = (column) => {
    let direction = "asc";
    if (sortBy === column && sortDirection === "asc") {
      direction = "desc";
    }

    router.get(
      "/projects",
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
      "/projects",
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
      "/projects",
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
          <div className="flex justify-between items-center gap-2 px-4">
            <Link href="/projects/create">
              <Button className="cursor-pointer">
                Tambah Projects
                <Plus className="w-4 h-4" />
              </Button>
            </Link>

            <CustomTableSearch
              search={search}
              setSearch={setSearch}
              onSearch={onSearch}
              placeholder="Cari Project"
            />
          </div>
          <div className="px-4 space-y-4">
            <DataTable
              data={projects.data}
              filters={filters}
              onSort={handleSort}
              onRowClick={onRowClick}
              noItem="Pekerja"
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

            <CustomPagination
              data={projects}
              onPaginationChange={onPaginationChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}

ProjectIndex.layout = (page) => (
  <Dashboard children={page} title={"Projects"} />
);

export default ProjectIndex;
