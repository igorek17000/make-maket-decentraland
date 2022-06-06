import  Web3 from "web3";
import {Transaction as EthereumTx} from'ethereumjs-tx';
import axios from'axios';
const  ethNetwork = 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
const  web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
// function tranfer main account to other account
// puspose provider transaction fee for fake account can swap , stake and unstake in hectagon and AMM 
async function transferFund(sendersData, recieverData, amountToSend) {
    return new Promise(async (resolve, reject) => {
        var nonce = await web3.eth.getTransactionCount(sendersData.address);
      
        console.log("thaiBalance",thaiBalance)
        web3.eth.getBalance(sendersData.address, async (err, result) => {
            if (err) {
                return reject();
            }
            let balance = web3.utils.fromWei(result, "ether");
            console.log(balance + " ETH");
            if(balance < amountToSend) {
                console.log('insufficient funds');
        return reject();
            }
   
            let gasPrices = await getCurrentGasPrices();
            let details = {
                "to": recieverData.address,
                "value": web3.utils.toHex(web3.utils.toWei(amountToSend.toString(), 'ether')),
                "gas": 21000,
                "gasPrice": gasPrices.low * 1000000000,
                "nonce": nonce,
                "chainId": 4 // EIP 155 chainId - mainnet: 1, rinkeby: 4
            };
           
            const transaction = new EthereumTx(details, {chain: 'rinkeby'});
            let privateKey = sendersData.privateKey.split('0x');
            console.log("privateKey[1",privateKey)
            let privKey = new Buffer.from(privateKey[0],'hex');
            transaction.sign(privKey);
           
            const serializedTransaction = transaction.serialize();
           
            web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'), (err, id) => {
                if(err) {
                    console.log(err);
                    return reject();
                }
                const url = `https://rinkeby.etherscan.io/tx/${id}`;
                console.log(url);
                resolve({id: id, link: url});
            });
        });
    });
}

async function getCurrentGasPrices() {
    let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
    let prices = {
      low: response.data.safeLow / 10,
      medium: response.data.average / 10,
      high: response.data.fast / 10
    };
    return prices;
}

async function getBalance(address) {
    return new Promise((resolve, reject) => {
        web3.eth.getBalance(address, async (err, result) => {
            if(err) {
                return reject(err);
            }
            resolve(web3.utils.fromWei(result, "ether"));
        });
    });
}
getBalance("0x8D706c755eD96D94Dc8999d88aE1Caab53906732").then(console.log)
getCurrentGasPrices().then(console.log)