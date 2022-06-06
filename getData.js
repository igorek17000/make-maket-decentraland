import ethers, { ContractFactory, Wallet } from 'ethers';
import configData from './config.js'
const getListBalance  = async (address ) => {
    const providerToken  = new ethers.providers.JsonRpcProvider(configData.RPC_URL);
    const wallet = new ethers.Wallet(configData.PRIVATE_KEY, providerToken);
    const account =  wallet.connect(providerToken);
    const balance = await providerToken.getBalance(address,9869069   )
    const signer = providerToken.getSigner()
    const block =  await providerToken.getBlockNumber()
    console.log('balance block', block ,  ethers.utils.formatEther(balance))
}
getListBalance(
   '0x38C63126Da87B29570d6A5D5eA833fC80f86F926' 
)