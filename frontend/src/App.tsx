import React, { useEffect, useState } from "react";
import Metric from "./Metric";
import "./App.css";
import axios from "axios";
import { Input, Button, Typography, Form, Tabs, Spin } from "antd";
import "antd/dist/antd.css";
import PoolMM from "./PoolMM";
import BondOp from "./BondOp";
import Volumn from "./Volumn";
const { TabPane } = Tabs;
const baseURL =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3001/api";
export function formatNumber(number: number | string, fixed = 2) {
  return Number(number)
    .toFixed(fixed)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,");
}
// Initialize Firebase

function App() {
  const [data, setData] = useState<any>(null);
  const [tab, setTab] = useState(localStorage.getItem("tab") || "1");
  const [listBond, setListBond] = useState<any>(null);
  const [metric, setMetric] = useState<any>(null);
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
    setListBond(result);
  };
  const getBalance = () => {
    axios.get(`${baseURL}/balance`).then(({ data: rawData }) => {
      setData(rawData);
    });
  };
  const getMetric = () => {
    axios.get(`${baseURL}/metric`).then(({ data: rawData }) => {
      setMetric(rawData);
    });
  };
  useEffect(() => {
    // fetchData();
    getBalance();
    getMetric();
  }, []);
  useEffect(() => {
    localStorage.setItem("tab", tab);
  }, [tab]);

  return (
    <div className="wrapper">
      <Tabs defaultActiveKey={tab} onChange={setTab}>
        <TabPane tab="Info Wallet MM " key="1">
          {!data || !metric ? (
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
            <PoolMM data={data} metric={metric} />
          )}
        </TabPane>
        <TabPane tab="Bond" key="2">
          {/* <BondOp listBond={listBond} /> */}
        </TabPane>
        <TabPane tab="Metric" key="3">
          <Metric metric={metric} />
        </TabPane>
        <TabPane tab="Volume" key="4">
          <Volumn />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default App;
