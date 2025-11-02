import React from "react";
import { Head } from "@inertiajs/react";

import Dashboard from "../layout/Dashboard";

function Welcome() {
  return (
    <>
      <Head title="Home" />
      <div className="flex items-center justify-center h-full">This is Dashboard</div>
    </>
  );
}

Welcome.layout = (page) => <Dashboard title={"Indarchi"}>{page}</Dashboard>;

export default Welcome;
