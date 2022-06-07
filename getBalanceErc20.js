export const getBalanceErc20 = async (privateKey, ecr20Address) => {
  const provider = new ethers.providers.JsonRpcProvider(configData.RPC_URL);
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
  console.log("Balance address : ", publicKey, name, formatBalance);
  return {
    balance: formatBalance,
    decimal: decimal,
  };
};
