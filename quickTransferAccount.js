import ether from 'ethers'
import fs from 'fs'
import { getABIToPath } from './utils'
const CONTRACT_ADDRESS = '0x24679a003BE66a17af2cDb998E090A7902cA3543'
const PRIVATE_KEY_MAIN_ACCOUNT = 'f5e7d0970b49c1b04ae3aff0664c3e634684e36b9d4a8c8d94c5419782c935bf'
const runAutoTranfer = async() => {
    const rawData  = fs.readFileSync('./account.json', 'utf-8');
    const listAccount =  JSON.parse(rawData);
    for(let index = 0; index < 4; index++) {
        const currentAccount = listAccount[index]
        await tranferMainAcccountToOtherAccount(currentAccount.privateKey, currentAccount.publicKey)
    }
}
const contentABIECR20 =  getABIToPath('ecr20abi.json');
export const tranferMainAcccountToOtherAccount  =async (privateKey  , publicKey  ) => {
    // create transaction rinkeby   
    const provider = new ether.providers.InfuraProvider("rinkeby", '9aa3d95b3bc440fa88ea12eaa4456161')

    const wallet = new ether.Wallet(PRIVATE_KEY_MAIN_ACCOUNT, provider);
    const account = wallet.connect(provider);
    const contract = new ether.Contract(CONTRACT_ADDRESS, contentABIECR20, account);
    const amount = ether.utils.parseEther('10000000');
    const tx = await contract.transfer(publicKey, amount , {gasPrice: ether.utils.parseUnits('100', 'gwei'), gasLimit: 1000000}); 
    const balance   = contract.balance(publicKey)
    console.log('txid' , tx , balance);
}
runAutoTranfer()