import ethers from "ethers";
import fs from "fs";
import configData from "./config.js";
import { getABIToPath } from "./utils.js";
import { getBalanceErc20 } from "./getBalanceErc20.js";
const PRIVATE_KEY_MAIN_ACCOUNT = process.env.PRIVATE_KEY;

export const transferMainAcccountToOtherAccount = async (
  publicKey,
  ecr20Address,
  account,
  amount
) => {
  const ecr20Contract = new ethers.Contract(
    ecr20Address,
    getABIToPath("ecr20abi.json"),
    account
  );
  const decimal = await ecr20Contract.decimals();

  const parseAmount = ethers.utils.parseUnits(amount, Number(decimal));
  const tx = await ecr20Contract.transfer(publicKey, parseAmount, {
    gasPrice: ethers.utils.parseUnits("100", "gwei"),
    gasLimit: 1000000,
  });
  console.log(
    `transfer ${amount} ${
      configData.BUSD_ADDRESS === ecr20Address ? "BUSD" : "HECTA"
    } `
  );
  tx.wait();
};

const runAutoTranfer = async () => {
  const rawData = fs.readFileSync("./account.json", "utf-8");
  const listAccount = JSON.parse(rawData);
  const providerMainAccount = new ethers.providers.JsonRpcProvider(
    configData.RPC_URL
  );
  const wallet = new ethers.Wallet(
    PRIVATE_KEY_MAIN_ACCOUNT,
    providerMainAccount
  );

  const account = wallet.connect(providerMainAccount);

  getBalanceErc20(PRIVATE_KEY_MAIN_ACCOUNT, configData.BUSD_ADDRESS);
  getBalanceErc20(PRIVATE_KEY_MAIN_ACCOUNT, configData.HECTA_ADDRESS);
  for (let index = 0; index < 4; index++) {
    const currentAccount = listAccount[index];
    // await getBalanceErc20(currentAccount.privateKey, configData.BUSD_ADDRESS);
    // await getBalanceErc20(currentAccount.privateKey, configData.HECTA_ADDRESS);
    const bnbRemaining = await wallet.getBalanceErc20();
    console.log("bnb remaining ", Number(bnbRemaining));
    const txid = await transferMainAcccountToOtherAccount(
      currentAccount.publicKey,
      configData.HECTA_ADDRESS,
      account,
      "80"
    );

    //  main account transfer bnb to other acccount
    await wallet
      .sendTransaction({
        to: currentAccount.publicKey,
        value: ethers.utils.parseEther("0.5"),
      })
      .then((tx) => {
        console.log("txid ", tx.hash);
      });
    // transfer bnb
    await transferMainAcccountToOtherAccount(
      currentAccount.publicKey,
      configData.BUSD_ADDRESS,
      account,
      "3000"
    );

    // await tranferMainAcccountToOtherAccount(currentAccount.publicKey);
  }
};
runAutoTranfer();
