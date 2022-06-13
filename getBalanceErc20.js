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

const getSHectaBalance = async (address = "") => {
  const provider = new ethers.providers.JsonRpcProvider(configData.RPC_URL);

  const hectaContract = new ethers.Contract(
    configData.HECTA_ADDRESS,
    getABIToPath("ecr20abi.json"),
    provider
  );

  const sHectaContract = new ethers.Contract(
    configData.SHECTA_ADDRESS,
    getABIToPath("sHecta.json"),
    provider
  );

  const stakingContract = new ethers.Contract(
    configData.STAKING_ADDRESS,
    getABIToPath("staking.json"),
    provider
  );

  const balanceHectaInStaking = await hectaContract.balanceOf(
    configData.STAKING_ADDRESS
  );
  const balanceShecta = await hectaContract.balanceOf(
    configData.SHECTA_ADDRESS
  );
  const gHectaContract = new ethers.Contract(
    configData.GHECTA_ADDRESS,
    getABIToPath("gHecta.json"),
    provider
  );
  const totalSupplyHecta = await hectaContract.totalSupply();
  const balanceGHectaInBondDepository = await gHectaContract.balanceOf(
    configData.BOND_DEPOSITORY
  );

  const sHectaInTreasury = await sHectaContract.balanceOf(
    configData.TREASURY_ADDRESS
  );
  console.log(
    "number hecta in staking contract",
    Number(balanceHectaInStaking)
  );
  console.log("total supply hecta", Number(totalSupplyHecta));
  console.log("sHecta in treasury", Number(sHectaInTreasury));
  console.log("hecta in sHecta", Number(sHectaInTreasury));
  console.log("wallet Shecta");
  console.log(
    "ghecta / sHecta in bond depository ",
    Number(balanceGHectaInBondDepository)
  );
};
getSHectaBalance();
// getBalanceErc20()
