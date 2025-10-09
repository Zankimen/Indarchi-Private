import React from "react";

import Navbar from "@/layout/NavBar";

function PekerjaProject() {
  return <div>Pekerja Project Page</div>;
}

PekerjaProject.layout = (page) => <Navbar children={page} />;

export default PekerjaProject;