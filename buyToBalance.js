import { swap } from "./swap.js";
import { getBalanceErc20 } from "./getBalanceErc20.js";
import configData from "./config.js";
import ethers from "ethers";
export async function buyToBalance(
  privateKey,
  tokenIn,
  tokenOut,
  percent = "0.5"
) {
  const provider = new ethers.providers.JsonRpcProvider(configData.RPC_URL);
  //   console.log("privateKey", privateKey);
  const wallet = new ethers.Wallet(privateKey);
  const publicKey = await wallet.getAddress();
  const account = wallet.connect(provider);
  const { balance, decimal } = await getBalanceErc20(privateKey, tokenIn);
  const formatBalance = ethers.utils.formatUnits(balance, Number(decimal));
  const amountSwapToken0 = (Number(formatBalance) * Number(percent)).toFixed(4);

  const result = await swap({
    recipient: publicKey,
    privateKey,
    tokenIn,
    tokenOut,
    amountSwapToken0,
  });
  console.log("result", result);
}

// buyToBalance(
//   configData.PRIVATE_KEY,
//   configData.HECTA_ADDRESS,
//   configData.BUSD_ADDRESS,
//   "0.001"
// );
