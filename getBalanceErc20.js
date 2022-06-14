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

  // parse balance to number to decimal
  const formatBalance = ethers.utils.formatUnits(balance, Number(decimal));

  return {
    balance: balance,
    decimal: decimal,
    formatBalance,
  };
};

export const getHectaMetric = async (address = "") => {
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

  const gHectaContract = new ethers.Contract(
    configData.GHECTA_ADDRESS,
    getABIToPath("gHecta.json"),
    provider
  );
  const totalSupplyHecta = await hectaContract.totalSupply();
  const totalSupplyGHecta = await gHectaContract.totalSupply();
  const balanceGHectaInBondDepository = await gHectaContract.balanceOf(
    configData.BOND_DEPOSITORY
  );
  // in treasury only busd and LP token
  const shectaInStaking = await sHectaContract.balanceOf(
    configData.STAKING_ADDRESS
  );
  const numberSHectaInWallet = await sHectaContract.balanceOf(
    configData.walletMM
  );
  const { formatBalance: hectaInStaking } = await getBalanceErc20ToPublicKey(
    configData.STAKING_ADDRESS,
    configData.HECTA_ADDRESS
  );
  const { formatBalance: hectaInMMwallet } = await getBalanceErc20ToPublicKey(
    configData.PUBLIC_KEY,
    configData.HECTA_ADDRESS
  );

  const { formatBalance: hectaInPool } = await getBalanceErc20ToPublicKey(
    configData.BUSD_HECTA_ADDESS,
    configData.HECTA_ADDRESS
  );
  const { formatBalance: gHectaInStaking } = await getBalanceErc20ToPublicKey(
    configData.STAKING_ADDRESS,
    configData.GHECTA_ADDRESS
  );

  const { formatBalance: gHectaInWalletMM } = await getBalanceErc20ToPublicKey(
    configData.walletMM,
    configData.GHECTA_ADDRESS
  );
  const circulatingSupplySHecta = await sHectaContract.circulatingSupply();

  // hecta, in bond dep
  // hecta in staking /ok/
  // hecta in pool /ok/
  // hecta in MM
  // shecta to Staking and MM wallet  /ok/
  // ghecta in bond dep

  console.log("--------- Ghecta start -------------");
  console.log(
    "Total supply gHecta",
    ethers.utils.formatUnits(totalSupplyGHecta, 18)
  );
  console.log(
    "Ghecta in bond depository ",
    ethers.utils.formatEther(balanceGHectaInBondDepository)
    // ethers.utils.formatEther()
  );

  console.log("Ghecta in Staking", gHectaInStaking);
  console.log("Ghecta in walet MM ", gHectaInWalletMM);
  console.log("--------- Ghecta end -------------");

  console.log("--------- Hecta start -------------");
  console.log(
    "Total supply hecta",
    ethers.utils.formatUnits(totalSupplyHecta, 9)
  );
  console.log("Circulating Supply SHecta", Number(circulatingSupplySHecta));
  console.log(
    "Shecta in Staking",
    ethers.utils.formatUnits(shectaInStaking, 9)
  );
  console.log("Hecta in Staking", hectaInStaking);
  console.log("Hecta in pool ", hectaInPool);
  console.log("Number wallet MM  hecta", hectaInMMwallet);
  console.log(
    "Number wallet MM sHecta",
    ethers.utils.formatUnits(numberSHectaInWallet, 9)
  );

  console.log("--------- Hecta End -------------");

  return {
    hecta: {
      mm: hectaInMMwallet,
      pool: hectaInPool,
      staking: hectaInStaking,
      totalSupply: ethers.utils.formatUnits(totalSupplyHecta, 9),
    },
    sHecta: {
      staking: ethers.utils.formatUnits(shectaInStaking, 9),
      mm: ethers.utils.formatUnits(numberSHectaInWallet, 9),
    },
    gHecta: {
      bd: ethers.utils.formatEther(balanceGHectaInBondDepository),
      staking: gHectaInStaking,
      mm: gHectaInWalletMM,
      totalSupply: ethers.utils.formatUnits(totalSupplyGHecta, 18),
    },
  };
};
// getHectaMetric();
// getBalanceErc20()
