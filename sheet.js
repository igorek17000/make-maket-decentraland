import axios from "axios";

import { google } from "googleapis";
import cron from "node-cron";
import converter from "json-2-csv";
import { exit } from "process";
import moment from "moment";
const BUSD_ADDRESS = "0xe9e7cea3dedca5984780bafc599bd69add087d56";
const node = "test";
const BASE_URL = "http://18.142.55.57:8000/subgraphs/name/" + node;

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

// Create client instance for auth
const client = await auth.getClient();

// Instance of Google Sheets API
const googleSheets = google.sheets({ version: "v4", auth: client });

const spreadsheetId = "1TIeHY_-jzy54hhalNfy45JVKqeKeDlcI0IHNNebjD6U";

function callBackFilterData(data) {
  return data.map((item) => {
    if (item.price) {
      item.price = Number(item.price) / 1e18;
    }
    if (item.timestamp) {
      item.timestamp = moment(item.timestamp * 1000)
        .local()
        .format("MMMM Do YYYY, h:mm:ss a");
    }
    if (item.currency) {
      item.currency = BUSD_ADDRESS === item.currency ? "BUSD" : "BNB";
    }

    return item;
  });
}
function importDataToSheet({ jsonData, spreadsheetId, sheetId, sheetName }) {
  converter.json2csv(callBackFilterData(jsonData), async (err, csv) => {
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
  });
}
async function run({ query, spreadsheetId, sheetId }) {
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
  console.log("import data for " + key);
  await importDataToSheet({
    jsonData: data[key],
    spreadsheetId,
    sheetId,
    sheetName: key,
  });
}

function runAll() {
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
              currency
              buyer
              id
              nftID
              price
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
  querys.map(async (query) => await run({ ...query, ...{ spreadsheetId } }));
}

function runCronJon() {
  cron.schedule("* * * * *", function () {
    // console.log("run..");
    runAll();
  });
}
// runAll();
runCronJon();
