// import
import ethers from 'ethers';
import chalk from 'chalk';
import inquirer from 'inquirer';
import configData from './config'
import { getABIToPath , alreadyApprovedToken } from './utils';

const  NetworkID =  {
    Mainnet : 1,
    Testnet : 4,    
    Binance : 56,
    Binance_Testnet : 57,
  }
const bondType = {
    STABLE_ASSET : 'STABLE_ASSET',
    LP : 'LP',
}
const busd = {
     name : 'BUSD',
    abi : getABIToPath('ecr20abi.json') , 
    reverveToken : '0x0000000000000000000000000000000000000000',
    bondToken : '',
    [NetworkID.Mainnet] : {
        reverveToken : '0x0000000000000000000000000000000000000000',
        bondToken : '0x0000000000000000000000000000000000000000'
    },
    [NetworkID.Testnet] : {
        reverveToken : '0x0000000000000000000000000000000000000000',
        bondToken : '0x0000000000000000000000000000000000000000'
    },
}
const lp = {
    name : 'LP',
    abi : getABIToPath('ecr20abi.json') ,
    [NetworkID.Mainnet] : {
        reverveToken : '0x0000000000000000000000000000000000000000',
        bondToken : '0x0000000000000000000000000000000000000000'
    },
    [NetworkID.Testnet] : {
        reverveToken : '0x0000000000000000000000000000000000000000',
        bondToken : '0x0000000000000000000000000000000000000000'
    },
}

export const buyBond = ({privateKey } : {privateKey : string }) => {
    const provider = new ethers.providers.InfuraProvider("rinkeby", '9aa3d95b3bc440fa88ea12eaa4456161')
    const wallet = new ethers.Wallet(privateKey, provider);
    const account =  wallet.connect(provider);
    const contentABIECR20 = getABIToPath('')
    
    const contract = new ethers.Contract(configData.BONDINGCALC_ADDRESS, contentABIECR20, account);
    
}   