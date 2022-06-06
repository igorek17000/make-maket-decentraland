import ethers from 'ethers';
import fs from 'fs'
import ethWallet from 'ethereumjs-wallet';
const NUMBER_ACCOUNT = 500;
function init() {
    const listAccount = []
    for (let index = 0; index < NUMBER_ACCOUNT; index++) {
        let addressData = ethWallet['default'].generate();
        console.log(`Private key = , ${addressData.getPrivateKeyString()}`);
        console.log(`Address = , ${addressData.getAddressString()}`);
        listAccount.push({ privateKey: addressData.getPrivateKeyString(), publicKey: addressData.getAddressString() })
    }


    fs.writeFileSync('./account.json', JSON.stringify(listAccount), 'utf-8', (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Successfully Written to File.');
    });
}

init()
