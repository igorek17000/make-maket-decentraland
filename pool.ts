import configData from './config.js'
import ethers from 'ethers';
import { getABIToPath } from './utils';
async function addPool({ tokenA, tokenB, amountA, amountB, privateKey, publicKey }: any) {
    try {
        const provider = new ethers.providers.JsonRpcProvider(configData.RPC_URL);
        const wallet = new ethers.Wallet(privateKey);
        const account = wallet.connect(provider);
        // init smart contract factory
        const routerContract = new ethers.Contract(
            configData.ROUTER_ADDRESS,
            getABIToPath('IUniswapV2Router02.json'),
            account
        );
        // get amount tokenB to public key

        // addLiquidity(address tokenA, address tokenB, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline)
        const tx = await routerContract.addLiquidity(
            tokenA,
            tokenB,

            amountA * 10 ** 9,
            ethers.utils.parseEther(`${amountA}`),

            amountA * 10 ** 9,
            ethers.utils.parseEther(`${amountA}`),

            account.address,
            (Date.now() + 1000 * 60 * 5),
            {

                gasPrice: ethers.utils.parseUnits('10', 'gwei'),
                gasLimit: 1000000,
                'value': 0
            })
        // log trancsaction link  in rinkeby 
        console.log('txid', tx);
    } catch (err) {
        console.log(err)
    }


}
addPool({ tokenA: configData.HECTA_ADDRESS, tokenB: configData.BUSD_ADDRESS, amountA: '32.9189', amountB: '203', privateKey: configData.PRIVATE_KEY, publicKey: configData.MAIN_ACCOUNT_ADDRESS })