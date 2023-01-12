import type { NextPage } from "next";
import NavBar from "./navbar";

// interface LayoutProps {
//   children: React.ReactNode;
// }

const Layout = ({ children }) => {
  return (
    <main className=" rounded-2xl h-screen w-screen relative">
      <div className=" bg-gray-100 dark:bg-gray-800 flex items-start justify-between static">
        <NavBar />
        <div className="flex flex-col w-full pl-0 md:p-4 md:space-y-4">
          <div className="w-full bg-white p-12 rounded-lg">{children}</div>
        </div>
      </div>
    </main>
  );
};
export default Layout;
