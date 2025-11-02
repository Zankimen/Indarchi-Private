import React from "react";

import Navbar from "@/layout/NavBar";

function PresensiIndex() {
  return <div>Presensi Index Page</div>;
}

PresensiIndex.layout = (page) => <Navbar>{page}</Navbar>;

export default PresensiIndex;
