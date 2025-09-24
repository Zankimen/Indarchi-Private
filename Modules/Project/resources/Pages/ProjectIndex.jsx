import React, { useState } from "react";

import { usePage, Head, router, Link } from "@inertiajs/react";

import Dashboard from "@/layout/Dashboard";
import CustomDataTable from "@components/custom/CustomDataTable";
import CustomPagination from "@components/custom/CustomPagination";
import CustomTableSearch from "@components/custom/CustomTableSearch";

import { Plus, Users, UserStar, FolderKanban } from "lucide-react";
import { Card } from "@components/ui/card";
import { Button } from "@/components/ui/button";

const columns = [
  { key: "id", label: "ID", type: "text", sort: true },
  { key: "nama", label: "Nama", type: "text", sort: true },
  { key: "deskripsi", label: "Deskripsi", type: "text", sort: false },
  { key: "lokasi", label: "Lokasi", type: "text", sort: true },
  { key: "tanggal_mulai", label: "Tanggal Mulai", type: "time", sort: true },
  {
    key: "tanggal_selesai",
    label: "Tanggal Selesai",
    type: "time",
    sort: true,
  },
  { key: "radius", label: "Radius", type: "text", sort: true },
];

const onRowClick = (item) => {
  router.visit(`/projects/${item.id}`);
};

function ProjectIndex() {
  const { projects, filters } = usePage().props;
  const { search, setSearch } = useState(filters.search || "");

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
      <div className="w-full mx-auto space-y-4">
        <Card className="border-border">
          <div className="grid grid-cols-1 sm:flex sm:justify-between items-center px-6 py-2 gap-4">
            <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl m-0 p-0">
              <FolderKanban className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
              Daftar Projects
            </h1>
            <div className="grid grid-cols-1 gap-2 sm:flex">
              <Link href="/projects/create">
                <Button className="cursor-pointer">
                  Tambah Project
                  <Plus className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="border-border">
          <div className="flex justify-end items-center gap-2 px-6 py-2">
            <CustomTableSearch
              search={search}
              setSearch={setSearch}
              onSearch={onSearch}
              placeholder="Cari Project"
            />
          </div>
          <CustomDataTable
            columns={columns}
            data={projects.data}
            onRowClick={onRowClick}
            onSort={handleSort}
            filters={filters}
            noItem="Project"
          />
        </Card>

        <CustomPagination
          data={projects}
          onPaginationChange={onPaginationChange}
        />
      </div>
    </>
  );
}

ProjectIndex.layout = (page) => <Dashboard children={page} />;
export default ProjectIndex;
