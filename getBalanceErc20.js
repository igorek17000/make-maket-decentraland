import ethers from "ethers";
import configData from "./config.js";
import { getABIToPath } from "./utils.js";
const provider = new ethers.providers.JsonRpcProvider(configData.RPC_URL);
export const getBalanceErc20 = async (privateKey, ecr20Address) => {
  // const provider = new ethers.providers.JsonRpcProvider(configData.RPC_URL);
  const wallet = new ethers.Wallet(privateKey);
  const account = wallet.connect(provider);
  // get public key
  const publicKey = account.address;

  const ecr20Contract = new ethers.Contract(
    ecr20Address,
    getABIToPath("ecr20abi.json"),
    account
  );
  const decimal = await ecr20Contract.decimals();
  const name = await ecr20Contract.name();

  const balance = await ecr20Contract.balanceOf(publicKey);
  // parse balance to number to decimal
  const formatBalance = ethers.utils.formatUnits(balance, Number(decimal));
  console.log("Balance address : ", name, formatBalance);
  return {
    balance: balance,
    decimal: decimal,
  };
};
export const getBalanceErc20ToPublicKey = async (publicKey, ecr20Address) => {
  const ecr20Contract = new ethers.Contract(
    ecr20Address,
    getABIToPath("ecr20abi.json"),
    provider
  );

  const decimal = await ecr20Contract.decimals();
  const name = await ecr20Contract.name();
  const balance = await ecr20Contract.balanceOf(publicKey);
  const totalSupply = await ecr20Contract.totalSupply();
  console.log("total supply  token" + name + ":", Number(totalSupply));
  // parse balance to number to decimal
  const formatBalance = ethers.utils.formatUnits(balance, Number(decimal));
  console.log("Balance address : ", name, formatBalance);
  return {
    balance: balance,
    decimal: decimal,
  };
};

// getBalanceErc20()
