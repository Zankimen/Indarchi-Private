import React, { useState } from "react";

import { usePage, Head, router, Link } from "@inertiajs/react";

import Dashboard from "@/layout/Dashboard";

function ProjectIndex() {
  const { users } = usePage().props;

  return (
    <>
      <Head title="Assets" />
      <div className="w-full mx-auto">{users}</div>
    </>
  );
}

ProjectIndex.layout = (page) => <Dashboard children={page} />;
export default ProjectIndex;
