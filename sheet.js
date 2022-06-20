import axios from "axios";
import { getABIToPath } from "./utils.js";
import { google } from "googleapis";
import cron from "node-cron";
import converter from "json-2-csv";
import { exit } from "process";
import moment from "moment";
import { ethers } from "ethers";
import { getBalanceErc20ToPublicKey } from "./getBalanceErc20.js";
const BUSD_ADDRESS = "0xe9e7cea3dedca5984780bafc599bd69add087d56";
const node = "test";
const RPC_MAINNET = "https://bsc-dataseed1.binance.org/";
const BASE_URL = "http://18.142.55.57:8000/subgraphs/name/" + node;

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});
const API_LINK_MARKETPLACE =
  "https://tigertribe.hectagon.finance/api/listings?limit=1000&offset=0";

// Create client instance for auth
const client = await auth.getClient();

// Instance of Google Sheets API
const googleSheets = google.sheets({ version: "v4", auth: client });

const spreadsheetId = "1TIeHY_-jzy54hhalNfy45JVKqeKeDlcI0IHNNebjD6U";

function callBackFilterData(data, walletList) {
  return data.map((item) => {
    if (item.price) {
      item.price = Number(item.price) / 1e18;
    }
    if (item.buyer) {
      item["MM index Buyer"] = walletList[item.buyer] || 0;
    }
    if (item.seller) {
      item["MM index seller"] = walletList[item.seller] || 0;
    }

    if (item.timestamp) {
      item.timestamp = moment(item.timestamp * 1000)
        .local()
        .add(7, "hours")
        .format("MMMM Do YYYY, h:mm:ss a");
    }
    if (item.currency) {
      item.currency = BUSD_ADDRESS === item.currency ? "BUSD" : "BNB";
    }

    return item;
  });
}
function importDataToSheet({
  jsonData,
  spreadsheetId,
  sheetId,
  sheetName,
  walletList,
}) {
  converter.json2csv(
    callBackFilterData(jsonData, walletList),
    async (err, csv) => {
      if (err) {
        throw err;
      }
      const request = {
        spreadsheetId,
        resource: {
          requests: [
            {
              updateSheetProperties: {
                properties: { title: sheetName, sheetId },
                fields: "title",
              },
            },
            {
              pasteData: {
                data: csv,
                delimiter: ",",
                coordinate: { rowIndex: 0, columnIndex: 0, sheetId },
              },
            },
          ],
        },

        auth: client,
      };

      // print CSV string
      await googleSheets.spreadsheets.batchUpdate(request);
    }
  );
}
async function convertArraytoObject(data) {
  let result = {};
  data.map((item, key) => {
    if (key < 1) {
      return null;
    }
    result[item[1]?.toLowerCase()] = item[0];
    return null;
  });
  return result;
}

async function getDataToSheetId(sheetName) {
  const { data } = await googleSheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetName,
    auth: client,
  });
  let walletMMs = convertArraytoObject(data.values);
  return walletMMs;
}
async function run({ query, spreadsheetId, sheetId, walletList }) {
  const { data } = await axios
    .post(BASE_URL, {
      query,
    })
    .then((raw) => raw.data)
    .catch((e) => {
      console.log(e);
      exit();
    });
  const key = Object.keys(data)[0];
  // console.log("import data for " + key);
  await importDataToSheet({
    jsonData: data[key],
    spreadsheetId,
    sheetId,
    sheetName: key,
    walletList,
  });
}

function runAll(walletList) {
  const querys = [
    {
      query: `{
            changeListings(first: 1000) {
                nftID
                id
                price
                seller
                timestamp
                currency
                    }
                  }`,
      sheetId: 0,
    },
    {
      query: `{
            purchases(first: 1000) {
              id
              currency
              nftID
              price
              buyer
              seller
              timestamp
            }
          }`,
      sheetId: 1358789697,
    },
    {
      query: `{
            listings(first: 1000) {
                    currency
                    id
                    nftID
                    price
                    seller
                    timestamp
                  }
                }`,
      sheetId: 1843265118,
    },
    {
      query: `{
            cancels(first: 1000) {
                    id
                    nftID
                    seller
                    timestamp
                          }
                        }`,
      sheetId: 2131272706,
    },
  ];
  querys.map(
    async (query) => await run({ ...query, ...{ spreadsheetId, walletList } })
  );
}
const getOwnerAddress = async (provider, address) => {
  const NFT_CONTRACT = "0xaf19C47b5Cd0ebe590f5A56cb1418E7A3CD6B3Af";
  const nftContract = new ethers.Contract(
    NFT_CONTRACT,
    getABIToPath("NFT.json"),
    provider
  );
  const balance = await nftContract.balanceOf(address);
  const listId = await nftContract.getTokenIdsPage(address, 0, Number(balance));
  return listId.map((id) => Number(id));
};

async function updateBalance(listAddress) {
  const provider = new ethers.providers.JsonRpcProvider(RPC_MAINNET);
  const BUSD_ADDRESS = "0xe9e7cea3dedca5984780bafc599bd69add087d56";

  const { results: nftMarketplaces } = await axios
    .get(API_LINK_MARKETPLACE)
    .then((raw) => raw.data);

  for (let address in listAddress) {
    const { formatBalance } = await getBalanceErc20ToPublicKey(
      address,
      BUSD_ADDRESS,
      provider
    );
    const listId = await getOwnerAddress(provider, address);
    const arrayNFTId = nftMarketplaces
      .filter((nft) => nft.seller.toLowerCase() === address.toLowerCase())
      .map((nft) => nft.nftId)
      .join(",");
    // console.log("nftMarketplaces", nftMarketplaces);
    // console.log("balance", address, formatBalance);
    // balances.push(formatBalance);
    await googleSheets.spreadsheets.values.update({
      spreadsheetId,
      range: `MMwallet!C${Number(listAddress[address]) + 1}`,

      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[formatBalance]],
      },
    });

    await googleSheets.spreadsheets.values.update({
      spreadsheetId,
      range: `MMwallet!D${Number(listAddress[address]) + 1}`,

      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[arrayNFTId]],
      },
    });
    await googleSheets.spreadsheets.values.update({
      spreadsheetId,
      range: `MMwallet!E${Number(listAddress[address]) + 1}`,

      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[listId.join()]],
      },
    });
  }
}

async function runCronJon() {
  const walletList = await getDataToSheetId("MMwallet");
  cron.schedule("* * * * *", function () {
    console.log(
      "time run",
      moment().local().add(7, "h").format("MMMM Do YYYY, h:mm:ss a")
    );
    runAll(walletList);
  });
  cron.schedule("00 59 * * * *", function () {
    console.log(
      "time update balance",
      moment().local().add(7, "h").format("MMMM Do YYYY, h:mm:ss a")
    );
    updateBalance(walletList);
  });
}
runCronJon();
