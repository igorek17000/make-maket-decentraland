import express from "express";
import { swap } from "./swap.js";
import bodyParser from "body-parser";
import cors from "cors";
import configData from "./config.js";
import { getBalanceErc20, getHectaMetric } from "./getBalanceErc20.js";
import { getPriceV2 } from "./swap.js";
// Import the functions you need from the SDKs you need

const app = express();
const router = express.Router();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3001;
// respond with "hello world" when a GET request is made to the homepage
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
app.use("/", router);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
