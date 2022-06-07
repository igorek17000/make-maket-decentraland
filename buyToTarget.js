import { swap } from "./swap.js";
import configData from "./config.js";
import { getABIToPath, alreadyApprovedToken } from "./utils.js";
import ethers from "ethers";
import { saveData } from "./saveData.js";
const FEE_DEFI = 0.0025;
export async function buyToTarget(targetPrice, privateKey) {
  const provider = new ethers.providers.JsonRpcProvider(configData.RPC_URL);
  const wallet = new ethers.Wallet(privateKey);
  const publicKey = await wallet.getAddress();
  const account = wallet.connect(provider);
  const pairContract = new ethers.Contract(
    configData.BUSD_HECTA_ADDESS,
    getABIToPath("UniswapPair.json"),
    account
  );

  const reverse = await pairContract.getReserves();
  let tokenIn = configData.BUSD_ADDRESS;
  let tokenOut = configData.HECTA_ADDRESS;

  const busdBalance = reverse[0] / 1e18;
  const hectaBalance = reverse[1] / 1e9;
  const nowPrice = busdBalance / hectaBalance;

  let m =
    Math.abs(
      ((busdBalance - targetPrice * hectaBalance) * nowPrice) /
        (targetPrice + nowPrice)
    ) *
    (1 + FEE_DEFI);
  // target giam

  let priceImpact;

  if (targetPrice < nowPrice) {
    tokenIn = configData.HECTA_ADDRESS;
    tokenOut = configData.BUSD_ADDRESS;
    m = m / nowPrice;
    priceImpact = m / (hectaBalance + m);
  } else {
    // target tang
    tokenIn = configData.BUSD_ADDRESS;
    tokenOut = configData.HECTA_ADDRESS;
    priceImpact = m / (busdBalance + m);
  }

  console.log("Amount in Fee and impact ", m, priceImpact);
  const result = await swap({
    recipient: publicKey,
    privateKey,
    tokenIn,
    timeStamp: new Date(),
    tokenOut,
    amountSwapToken0: Math.round(m * (1 + priceImpact)),
  });
  const res = {
    ...result,
    ...{
      priceImpact,
    },
  };
  saveData(res);
  return res;
}
buyToTarget(15, configData.PRIVATE_KEY);
