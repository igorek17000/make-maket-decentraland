import React, { useEffect, useState } from "react";

import "./App.css";
import axios from "axios";
import { Input, Button, Typography, Form, Tabs, Spin } from "antd";
import "antd/dist/antd.css";
import PoolMM from "./PoolMM";
import BondOp from "./BondOp";
const { TabPane } = Tabs;
const baseURL = true ? "http://18.141.225.138:3001" : "http://localhost:3001";
export function formatNumber(number: number | string, fixed = 2) {
  return Number(number)
    .toFixed(fixed)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,");
}
// Initialize Firebase

function App() {
  const [data, setData] = useState<any>(null);
  const [listBond, setListBond] = useState<any>(null);
  const fetchData = async () => {
    const rawData = await axios
      .post("http://18.141.225.138:8000/subgraphs/name/test", {
        query: `query MyQuery {
            bondDeposits(skip: 0, first: 1000) {
              amount
              bondId
              id
              price
              timestamp
            }
            bonds {
              vesting
              baseToken
              conclusion
              controlVariable
              id
              fixedTerm
              initialPrice
              maxDebt
              quoteToken
            }
          }`,
      })
      .then((res) => res.data);
    console.log("rawData", rawData);
    const data = rawData.data;
    const bondDeposits = data.bondDeposits;
    const bonds = data.bonds;
    const result = bondDeposits.map((bondDeposit: any) => {
      const infoBond = bonds.find(
        (bond: any) => bondDeposit.bondId === bond.id
      );
      infoBond.timeClaim =
        Number(infoBond.vesting) + Number(bondDeposit.timestamp);
      return { ...bondDeposit, ...infoBond };
    });
    console.log("result", result);
    setListBond(result);
  };
  const getData = () => {
    axios.get(`${baseURL}/balance`).then(({ data: rawData }) => {
      console.log("setData", data);
      setData(rawData);
    });
  };
  useEffect(() => {
    fetchData();
    getData();
  }, []);

  return (
    <div className="wrapper">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Info Wallet MM " key="1">
          {!data ? (
            <div
              style={{
                width: "100%",
                height: "400px",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Spin />
            </div>
          ) : (
            <PoolMM data={data} />
          )}
        </TabPane>
        <TabPane tab="Bond" key="2">
          <BondOp listBond={listBond} />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default App;
