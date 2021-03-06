import ethers from "ethers";
import chalk from "chalk";
import inquirer from "inquirer";
import configData from "./config.js";

import { getABIToPath, alreadyApprovedToken } from "./utils.js";
// args private key , address recipient , amount  , addredss out , address in
const run = async () => {
  // use inquirer to get input
  inquirer
    .prompt([
      {
        type: "input",
        name: "amount",
        message: "Enter the amount to swap:",

        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter the amount to send";
          }
        },
      },
    ])
    .then(async (answers) => {
      const { amount } = answers;
      const tokenIn = configData.BUSD_ADDRESS;
      const tokenOut = configData.HECTA_ADDRESS;
      const amountSwapToken0 = amount;
      await swap({
        recipient: configData.PUBLIC_KEY,
        privateKey: configData.PRIVATE_KEY,
        tokenIn,
        tokenOut,
        amountSwapToken0,
      });
    });
};
export const getPriceV2 = async (pairAddress) => {
  const provider = new ethers.providers.JsonRpcProvider(configData.RPC_URL);
  const wallet = new ethers.Wallet(configData.PRIVATE_KEY);
  const account = wallet.connect(provider);

  const pairContract = new ethers.Contract(
    pairAddress,
    getABIToPath("UniswapPair.json"),
    account
  );

  const reverse = await pairContract.getReserves();

  const busdBalanceInPool = reverse[0] / 1e18;
  const hectaBalanceInPool = reverse[1] / 1e9;
  return {
    busdBalanceInPool,
    hectaBalanceInPool,
    price: busdBalanceInPool / hectaBalanceInPool,
  };
};
export const getPrice = async (
  tokenInContract,
  tokenOutContract,
  pairAddress
) => {
  const decimal0 = await tokenInContract.decimals();
  const decimal1 = await tokenOutContract.decimals();
  const balanceToken0InPool = await tokenInContract.balanceOf(pairAddress);
  const balanceToken1InPool = await tokenOutContract.balanceOf(pairAddress);
  const formatbalanceToken0InPool = await ethers.utils.formatUnits(
    balanceToken0InPool,
    decimal0
  );
  const formatbalanceToken1InPool = await ethers.utils.formatUnits(
    balanceToken1InPool,
    decimal1
  );
  const busdBalance =
    decimal0 === 18 ? formatbalanceToken0InPool : formatbalanceToken1InPool;
  const hectaBalance =
    decimal1 === 9 ? formatbalanceToken1InPool : formatbalanceToken0InPool;
  console.log(`balance BUSD pool in AMM : ${busdBalance}`);
  console.log(`balance HECTA pool in AMM: ${hectaBalance}`);

  let price = 0;
  if (decimal1 === 9) {
    price =
      parseFloat(formatbalanceToken0InPool) /
      parseFloat(formatbalanceToken1InPool);
  } else {
    price =
      parseFloat(formatbalanceToken1InPool) /
      parseFloat(formatbalanceToken0InPool);
  }

  return {
    price: price + (price * configData.SLIPPAGE) / 100,
    busdBalance,
    hectaBalance,
  };
};

export const swap = async ({
  recipient,
  privateKey,
  tokenIn,
  tokenOut,
  amountSwapToken0,
}) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(configData.RPC_URL);
    const wallet = new ethers.Wallet(privateKey);
    const account = wallet.connect(provider);

    // init smart contract
    const factoryContract = new ethers.Contract(
      configData.FACTORY_ADDRESS,
      getABIToPath("IUniswapV2Factory.json"),
      account
    );

    const routerContract = new ethers.Contract(
      configData.ROUTER_ADDRESS,
      getABIToPath("IUniswapV2Router02.json"),
      account
    );

    const tokenInContract = new ethers.Contract(
      tokenIn,
      getABIToPath("ecr20abi.json"),
      account
    );
    const tokenOutContract = new ethers.Contract(
      tokenOut,
      getABIToPath("ecr20abi.json"),
      account
    );
    const decimal0 = await tokenInContract.decimals();
    const pairAddress = await factoryContract.getPair(tokenIn, tokenOut);
    if (pairAddress !== null && pairAddress !== undefined) {
      if (pairAddress.toString().indexOf("0x0000000000000") > -1) {
        console.log(
          chalk.cyan(`pairAddress ${pairAddress} not detected. Auto restart`)
        );
        return await run();
      }
    }

    const pairContract = new ethers.Contract(
      pairAddress,
      getABIToPath("UniswapPair.json"),
      account
    );
    const { price } = await getPrice(
      tokenInContract,
      tokenOutContract,
      pairAddress
    );
    console.log("Current price: ", price);
    // args : Slippage ,  AMOUNT_OF_BNB, recipient , gasLimit, gasPrice
    let amountOutMin = 0;

    //We buy x amount of the new token for our bnb
    const amountIn = ethers.utils.parseUnits(`${amountSwapToken0}`, decimal0);
    // console.log("amountIn", amountIn);
    if (parseInt(configData.SLIPPAGE) !== 0) {
      const amounts = await routerContract.getAmountsOut(amountIn, [
        tokenIn,
        tokenOut,
      ]);
      //Our execution price will be a bit different, we need some flexibility

      amountOutMin = amounts[1].sub(
        amounts[1].mul(`${configData.SLIPPAGE}`).div(`100`)
      );
    }
    // check if approved

    const allowanceToken0 = await tokenInContract.allowance(
      account.address,
      tokenIn
    );
    const allowanceToken1 = await tokenOutContract.allowance(
      account.address,
      tokenOut
    );
    console.log(
      "allowanceToken1",
      tokenIn,
      Number(allowanceToken0),
      Number(allowanceToken1)
    );

    // approve router contract call to busd
    // if (!alreadyApprovedToken() || true) {
    //   const approveTx = await tokenInContract.approve(
    //     tokenIn,
    //     "100000000000000000000000000",
    //     {
    //       gasPrice: ethers.utils.parseUnits(`${100}`, "gwei").toString(),
    //       gasLimit: 1000000,
    //     }
    //   );
    // }
    // approve

    // if (!alreadyApprovedToken(allowanceToken1) || true) {
    //   const approveTx = await tokenOutContract.approve(
    //     tokenOut,
    //     "100000000000000000000000000",
    //     {
    //       gasPrice: ethers.utils.parseUnits(`${100}`, "gwei").toString(),
    //       gasLimit: 1000000,
    //     }
    //   );
    // }

    console.log("Proccecing swap...");
    console.log("amountOutMin", amountOutMin);
    // call router smart contract to buy token
    const tx = await routerContract.swapExactTokensForTokens(
      //uncomment here if you want to buy token
      amountIn,
      amountOutMin,
      [tokenIn, tokenOut],
      recipient,
      Date.now() + 1000 * 60 * 5, //5 minutes
      {
        gasLimit: "2000000",
        gasPrice: ethers.utils.parseUnits(`100`, "gwei"),
        nonce: null,
        value: 0,
      }
    );
    const receipt = await tx.wait();
    console.log(
      `Transaction receipt : https://testnet.bscscan.com/tx/${receipt.logs[1].transactionHash}`
    );
    const {
      price: newPrice,
      busdBalance: newBusdBalance,
      hectaBalance: newHectaBalance,
    } = await getPrice(tokenInContract, tokenOutContract, pairAddress);

    return {
      price,
      token0Symbol: configData.BUSD_HECTA_ADDESS === tokenIn ? "BUSD" : "HECTA",
      newBusdBalance,
      newHectaBalance,
      slip: configData.SLIPPAGE,
      amountSwapToken0,
      gasUsed: Number(receipt.gasUsed),
      newPrice,
    };
  } catch (err) {
    console.log("err", err);
  }
};
