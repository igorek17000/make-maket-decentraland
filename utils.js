import fs from "fs";
import ethers from "ethers";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
export const getABIToPath = (path) => {
  const rawData = fs.readFileSync("./abi/" + path, "utf-8");

  return JSON.parse(rawData);
};
export function Contract(address, path, account) {
  const contract = new ethers.Contract(address, getABIToPath(path), account);
  return contract;
}
export function alreadyApprovedToken(allowance) {
  // set defaults
  let bigZero = ethers.BigNumber.from("0");
  let applicableAllowance = bigZero;

  // determine which allowance to check

  applicableAllowance = allowance;

  // check if allowance exists
  if (applicableAllowance.gt(bigZero)) return true;

  return false;
}

export const getBondCalculator = (provider) => {
  return new ethers.Contract(
    configData.BONDINGCALC_ADDRESS,
    getABIToPath("BondingCalculator.json"),
    provider
  );
};
