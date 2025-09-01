import "./App.css";
import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TableComp from "./components/TableComp";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

function App() {
  const [sideBarDis, setSideBarDis] = useState(false);
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Header sideBarDis={sideBarDis} setSideBarDis={setSideBarDis} />
        <Sidebar sideBarDis={sideBarDis} setSideBarDis={setSideBarDis} />
        <TableComp sideBarDis={sideBarDis} />
      </QueryClientProvider>
    </>
  );
}

export default App;
