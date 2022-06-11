import configData from "./config.js";
import { getABIToPath, alreadyApprovedToken } from "./utils.js";
import { getBalanceErc20ToPublicKey } from "./getBalanceErc20.js";
import ethers from "ethers";

export const hectaBalance = async () => {
  const balanceHectaInBP = await getBalanceErc20ToPublicKey(
    configData.BOND_DEPOSITORY,
    configData.HECTA_ADDRESS
  );

  console.log("hecta in bond depository: ", balanceHectaInBP);
};

hectaBalance();
