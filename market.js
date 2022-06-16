import ethers from "ethers";
import fs from "fs";
import { swap } from "./swap.js";
import configData from "./config.js";
import { getABIToPath } from "./utils.js";
import { buyToBalance } from "./buyToBalance.js";
const rawData = fs.readFileSync("./account.json", "utf-8");
const listAccount = JSON.parse(rawData);

export function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

const PRIVATE_KEY_MAIN_ACCOUNT = process.env.PRIVATE_KEY;

function accountSwap() {
  for (let index = 0; index < 4; index++) {
    const currentAccount = listAccount[index];
    buyToBalance(
      currentAccount.privateKey,
      configData.BUSD_ADDRESS,
      configData.HECTA_ADDRESS,
      "0.01"
    );
  }
}
accountSwap();
