import React from "react";

function Sidebar({ sideBarDis, seSideBarDis }) {
  return (
    <>
      <div
        className={`fixed z-20 top-16 h-full ${
          sideBarDis ? "w-54 p-2" : "w-0"
        } bg-[var(--mainCol)] text-white overflow-hidden transition-all duration-300 ease-in-out`}
      >
        <div>Route 1</div>
        <div>Route 2</div>
        <div>Route 3</div>
      </div>
    </>
  );
}

export default Sidebar;
