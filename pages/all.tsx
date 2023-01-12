import type { NextPage } from "next";
import Layout from "components/layout";
import { useContext } from "react";
import AlertContext from "components/context/alertContext";

export const Events: NextPage = () => {
  const alert = useContext(AlertContext);

  return (
    <Layout>
      <div className="header flex items-end justify-between mb-12">
        <div className="title">
          <p className="text-4xl font-bold text-gray-800 mb-4">All NFT</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-12"></div>
    </Layout>
  );
};
export default Events;
