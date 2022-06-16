import express from "express";
import { swap } from "./swap.js";
import configData from "./config.js";
import { getBalanceErc20, getHectaMetric } from "./getBalanceErc20.js";
import { getPriceV2 } from "./swap.js";
const app = express();
const router = express.Router();
router.get("/balance", async (req, res) => {
  const { formatBalance: balanceHecta } = await getBalanceErc20(
    configData.PRIVATE_KEY,
    configData.HECTA_ADDRESS
  );
  const { formatBalance: balanceBusd } = await await getBalanceErc20(
    configData.PRIVATE_KEY,
    configData.BUSD_ADDRESS
  );
  const resultV2 = await getPriceV2(configData.BUSD_HECTA_ADDESS);
  res.send({
    balanceHecta,
    balanceBusd,
    ...resultV2,
  });
});

router.post("/swap", async (req, res) => {
  const data = await swap(req.body.targetPrice);
  return res.json(data);
});
router.get("/metric", async (req, res) => {
  const data = await getHectaMetric();
  return res.json(data);
});

export default router;
