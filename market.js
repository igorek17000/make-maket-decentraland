import ethers from "ethers";
import fs from "fs";
import { buyAction } from "./bot.js";
import configData from "./config.js";
import { buyToTarget } from "./MM_Test.js";
import { getABIToPath } from "./utils.js";
const rawData = fs.readFileSync("./account.json", "utf-8");
const listAccount = JSON.parse(rawData);
// const providerMainAccount = new ethers.providers.JsonRpcProvider(
//   configData.RPC_URL
// );
export function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

const PRIVATE_KEY_MAIN_ACCOUNT = process.env.PRIVATE_KEY;

// getBalance(PRIVATE_KEY_MAIN_ACCOUNT, configData.HECTA_ADDRESS);
// getBalance(PRIVATE_KEY_MAIN_ACCOUNT, configData.BUSD_ADDRESS);
function accountSwap() {
  let priceFifference = getRandomArbitrary(1, 10) + 30;
  for (let index = 0; index < 4; index++) {
    const currentAccount = listAccount[index];
    buyToTarget(priceFifference, currentAccount.privateKey);
  }
}
accountSwap();
