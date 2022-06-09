import { Button, Table, DatePicker, Typography } from "antd";
import type { ColumnsType } from "antd/lib/table";
import moment from "moment";
import DoughnutComponent from "./Donut";
import React, { useEffect, useState } from "react";
import { formatNumber } from "./App";
import groupBy from "lodash/groupBy";
interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const configToken: any = {
  "0x055475920a8c93cffb64d039a8205f7acc7722d3": {
    name: "LP",
    decimal: 18,
  },
  "0x853d955acef822db058eb8505911ed77f175b99e": {
    name: "FRAX",
    decimal: 18,
  },
  "0xa693b19d2931d498c5b318df961919bb4aee87a5": {
    name: "UST",
    decimal: 9,
  },
  "0x69b81152c5a8d35a67b32a4d3772795d96cae4da": {
    name: "LP",
    decimal: 18,
  },
  "0x6b175474e89094c44da98b954eedeac495271d0f": {
    name: "DAI",
    decimal: 18,
  },
  "0x46e4d8a1322b9448905225e52f914094dbd6dddf": {
    name: "LP",
    decimal: 18,
  },
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": {
    name: "WBTC",
    decimal: 8,
  }, // decimal 8
};
const columns: ColumnsType<DataType> = [
  {
    title: "Id",
    dataIndex: "id",
  },
  {
    title: "Vesting",
    dataIndex: "vesting",
  },
  {
    title: "Initial Price",
    dataIndex: "initialPrice",
    render: (data, item, index) => {
      return Number(data) / 10 ** 9;
    },
  },
  {
    title: "Amount",
    dataIndex: "amount",
    render: (data, item: any, index) => {
      const decimal = configToken[item.quoteToken].decimal;

      return formatNumber(data / 10 ** decimal, 6);
    },
  },
  {
    title: "Token",
    dataIndex: "quoteToken",
    render: (data, item, index) => {
      if (configToken[data]) {
        return configToken[data].name;
      }
      return data;
    },
  },
  {
    title: "Time Claim",
    dataIndex: "timeClaim",
    render: (data, item, index) => {
      return moment(data * 1000).format("MMMM Do YYYY, h:mm:ss a");
    },
  },
];

const BondOp = ({ listBond }: { listBond: any }) => {
  const [date, setDate] = useState<any>(null);
  const [dataChart, setDataChart] = useState(null);
  const listBondFilter = listBond.filter((bond: any) => {
    if (!date) {
      return true;
    }
    return (
      moment(bond.timeClaim * 1000).format("DD/MM/YYYY") ===
      date.format("DD/MM/YYYY")
    );
  });
  // const averagePrice = listBondFilter.reduce((a , b ) => {
  //   a
  // }) / listBondFilter.length

  const total =
    listBondFilter.reduce((a: any, b: any) => {
      const decimal = configToken[b.quoteToken].decimal;
      console.log("b", a);
      return (b.amount / 10 ** decimal) * (b.initialPrice / 10 ** 9) + a;
    }, 0) / listBondFilter.length;
  // const groupAmount = listBondFilter.
  const groupData: any = groupBy(listBond, (item) => {
    if (configToken[item.quoteToken]) {
      return configToken[item.quoteToken].name;
    }
    return item;
  });

  useEffect(() => {
    let result: any = {};
    for (let item in groupData) {
      console.log("item", item);
      const count = groupData[item].reduce((a: number, b: any) => {
        const decimal = configToken[b.quoteToken].decimal;
        // console.log("b.amount", b.amount);
        return a + b.amount / 10 ** decimal;
      }, 0);
      result[item] = count;
    }
    console.log("cascascas", result);
    setDataChart(result);
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <DatePicker
          value={date || moment()}
          onChange={(date) => setDate(date)}
        />
      </div>
      {/* {JSON.stringify(result)} */}
      <div>
        <Typography>
          {" "}
          Giá trung bình của bond là : {formatNumber(total, 2)}
        </Typography>
      </div>
      <div>{dataChart && <DoughnutComponent data={dataChart} />}</div>
      <Table
        pagination={false}
        loading={!listBond}
        columns={columns}
        dataSource={listBondFilter}
      />
    </div>
  );
};

export default BondOp;
