import React, { useEffect, useState } from "react";

import "./App.css";
import axios from "axios";
import { Input, Button, Typography, Form, Tabs, Spin } from "antd";
import { formatNumber } from "./App";
const FEE_DEFI = 0.0025;
export default function PoolMM({ data, metric }: any) {
  console.log("data metric", metric, data);
  const [targetPrice, setTargetPrice] = useState(0);
  const [amountSwap, setAmountSwap] = useState(0);
  const {
    balanceHecta,
    balanceBusd,
    price,
    busdBalanceInPool,
    hectaBalanceInPool,
  } = data;
  const onTargetPrice = (targetPrice: number) => {
    let m =
      Math.abs(
        ((busdBalanceInPool - targetPrice * hectaBalanceInPool) * price) /
          (targetPrice + price)
      ) *
      (1 + FEE_DEFI);
    console.log("mmm", m);
    setAmountSwap(m);
    setTargetPrice(targetPrice);
  };
  const hectaFloating =
    Number(metric.hecta.user) +
    Number(metric.gHecta.user) * (Number(metric.currentIndex) / 10 ** 9);
  const a = Number(busdBalanceInPool);
  const x = Number(hectaBalanceInPool);
  const m = Number(balanceBusd);
  const n = Number(balanceHecta);
  const priceMax = (a + m) ** 2 / (a * x);
  const priceMin = (a * x) / (n + x) ** 2;
  const priceWhenFloating = (a * x) / (hectaFloating + x) ** 2;

  return (
    <div>
      <Typography>
        Balance HECTA in wallet MM: <b>{formatNumber(data.balanceHecta)}</b>
      </Typography>
      <Typography>
        Balance BUSD in wallet MM: <b>{formatNumber(data.balanceBusd)}</b>
      </Typography>
      <Typography>
        BUSD in Pool: <b>{formatNumber(data.busdBalanceInPool)}</b>
      </Typography>
      <Typography>
        Hecta in Pool:<b> {formatNumber(data.hectaBalanceInPool)}</b>
      </Typography>
      <Typography>
        Current Price:<b> {formatNumber(data.price)}</b>
      </Typography>
      {/* <Button onClick={onTargetPrice}>Submit</Button> */}

      <Typography>
        Price Max : {formatNumber(priceMax)}
        {/* 
          
          */}
        {/* {(Number(data.price) *
        (Number(data.busdBalanceInPool) - Number(data.balanceHecta))) /
        (Number(data.balanceHecta) +
          Number(data.price) * Number(data.hectaBalanceInPool))} */}
      </Typography>
      <Typography>
        Price Min : {formatNumber(priceMin)}
        {(Number(data.busdBalanceInPool) -
          Number(data.balanceHecta) * Number(data.price)) /
          (Number(data.hectaBalanceInPool) + Number(data.balanceHecta))}
      </Typography>
      <Form.Item label="Target Price">
        <Input
          placeholder="Target Price"
          type="number"
          onChange={(e) => {
            onTargetPrice(Number(e.target.value));
            // setTargetPrice(Number(e.target.value));
          }}
        />
      </Form.Item>
      {amountSwap ? (
        <Typography>
          S??? L?????ng<b> {targetPrice < data.price ? "HECTA" : "BUSD"}</b> c???n ?????
          gi?? v??? {targetPrice} l?? {formatNumber(amountSwap)}
          <b> {targetPrice < data.price ? " HECTA" : " BUSD"}</b>
        </Typography>
      ) : (
        0
      )}
      {priceWhenFloating && (
        <Typography>
          Khi user x??? <b>{formatNumber(hectaFloating)}</b> Hecta
          <i style={{ color: "gray" }}>
            (<b> {formatNumber(metric.hecta.user)}</b> HECTA v??{" "}
            <b>{formatNumber(metric.gHecta.user)}</b> Ghecta v???i currentIndex
            b???ng
            <b> {formatNumber(metric.currentIndex / 1e9)}</b> )
          </i>{" "}
          th?? gi?? v??? :<b> {formatNumber(priceWhenFloating)}</b>
        </Typography>
      )}
    </div>
  );
}
