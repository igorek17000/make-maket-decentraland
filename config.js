import ethers from "ethers";
import dotenv from "dotenv";
dotenv.config();
const configData = {
  Slippage: process.env.SLIPPAGE, //in Percentage
  gasPrice: ethers.utils.parseUnits(`${process.env.GWEI}`, "gwei"), //in gwei
  gasLimit: process.env.GAS_LIMIT, //at least 21000
  minBnb: process.env.MIN_LIQUIDITY_ADDED, //min liquidity added,
  rinkeby: {
    PUBLIC_KEY: process.env.PUBLIC_KEY,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    SLIPPAGE: "5",
    RPC_URL: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    // custom for feature swap
    ROUTER_ADDRESS: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
    FACTORY_ADDRESS: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    // bond config
    // custom config for hectagon project

    BUSD_ADDRESS: "0x24679a003BE66a17af2cDb998E090A7902cA3543",
    HECTA_ADDRESS: "0x37AC2d63417ce2A8C0BA915B4272D25EeD487Ce2",
    STAKING_ADDRESS: "0x7BF55F6f0282a410B219F815A18f33e3B6831566",
    STAKING_HELPER_ADDRESS: "0x1e875657388A1a55497F168a5F3ba29d7C8Ce560",
    SHECTA_ADDRESS: "0xcf9A461224B695DEe6Fa4e12390C21f58Db6d55c",
    CIRCULATING_SUPPLY_ADDRESS: "0x964E4737DDB8c5eBc5AfcBb59ed8b1d01cF3bF0d",
    TREASURY_ADDRESS: "0xBa53BF89036B74e2a5057ec3e6b5dd3920eCf1f1",
    REDEEM_HELPER_ADDRESS: "0x326eE33367C020c001479DA963d5bBAA5724A3aa",
  },
  bsc: {},

  bsc_testnet: {
    walletMM: [""],
    SLIPPAGE: "0",
    PUBLIC_KEY: process.env.PUBLIC_KEY,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    // custom for feature swap
    ROUTER_ADDRESS: "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3",
    FACTORY_ADDRESS: "0xB7926C0430Afb07AA7DEfDE6DA862aE0Bde767bc",
    BUSD_HECTA_ADDESS: "0x1A6409fCABcFbA421a5aB47d573CbB23909D0999",
    RPC_URL: "https://data-seed-prebsc-2-s3.binance.org:8545/",
    // custom config for hectagon project

    BUSD_ADDRESS: "0x9e3F47234e72e222348552e028ceEB8f4C428d26", // duplicate
    HECTA_ADDRESS: "0x0B3c486027DB4906C1AAC72f26B792e77aEc0ED3",
    STAKING_ADDRESS: "0x77C6bB4E1132145220207986D9139C46fA87f382",
    GHECTA_ADDRESS: "0xE79f9C8ba7a83aa6a632820a8C216176CA11c6cD",
    SHECTA_ADDRESS: "0x438cBDFdD62b2cCD41960d1067ddBbB3186F5bCC",
    BOND_DEPOSITORY: "0xc93De5039fc6bcf197A32D7D0765CB4F0F32d76a",
    TREASURY_ADDRESS: "0xb0C17FF90b2fC96BCDd154a1FB5E672DDB9522f7",
  },
};

export default configData["bsc_testnet"];
