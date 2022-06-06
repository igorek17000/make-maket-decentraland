import fs from 'fs';
 
// json data
export function saveData(data) {

    const jsonData = fs.readFileSync("./data.json")
    // parse json


    // const data = JSON.parse(rawData)
    
    var jsonObj  = []
    try {
        jsonObj =  JSON.parse(jsonData);
    }
    catch (e) {
        jsonObj = []
    }
    if(!jsonObj || jsonObj?.length === 0 ) {
        jsonObj = []
    }
    // stringify JSON Object
    var jsonContent = JSON.stringify([...jsonObj , ...[data]]);
    console.log(jsonContent);
    
    fs.writeFile("./data.json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    
        console.log("JSON file has been saved.");
    });
}
// saveData([{Duc : "saca"}])