const fs = require('fs'); ////////
const path = require('path');
const os = require('os');

const desktopPath = path.join(os.homedir(), 'Desktop');


const { parseTicks, parseHeader, parsePlayerInfo } = require('@laihoe/demoparser2')
const pathToDemo = "./backend/demo.dem"

const demoParser = () => {
    console.log("Parsing demo...")

    let demoData = parseTicks(pathToDemo, ["X", "Y", "Z"], null, false) //, "is_alive", "score"

    let players = getPlayersFromDemo(pathToDemo)

    let map = getMapPlayed(pathToDemo)

    let ticks = parseData(demoData, players)

    const combinedData = {
        players,
        map,
        ticks
    };

    exportJSON(combinedData, desktopPath);



    //getStructSize("BEFORE", demoData)//////

    
    console.log("Done parsing demo...")
};


const parseData = (rawData, playerInfo) => {
    // https://en.wikipedia.org/wiki/AoS_and_SoA
    // StructOfArrays is set to true
    // Reduces JSON size by half-ish


    // Delete steamid array as it is redundent and adds size to data set
    //const { steamid, ...newData } = rawData;

    //console.log(newData)
    //getStructSize("AFTER", newData)

    return rawData
    
}

const getStructSize = (text=null , data) => {

    const jsonString = JSON.stringify(data)

    const byteSize = Buffer.from(jsonString).length

    const kiloBytes = byteSize / 1024
    const megaBytes = kiloBytes / 1024

    console.log(`Size of Struct ${text}: ${megaBytes.toFixed(2)} MB`)
}

const getPlayersFromDemo = (pathToDemo) => {
    let playerParser = parsePlayerInfo(pathToDemo);

    // Scuffed way to get rid of bots / ghost players
    let filteredPlayers = playerParser.filter(player => parseInt(player.steamid) >= 1000);

    let teams = filteredPlayers.reduce((result, player, index) => {
        // Create a new object with shorter field names
        let shortPlayer = {
            n: player.name,
            p_id: index, // internal id for me
            s_id: player.steamid,
            team: player.team_number
        };

        // Push the shortPlayer object into the result array
        result.push(shortPlayer);

        return result;
    }, []);



    //console.log(teams)

    return teams
}

const getMapPlayed = (pathToDemo) => {
    let headerParser = parseHeader(pathToDemo)

    //console.log("PLAYED ON", headerParser.map_name)

    return headerParser.map_name
}

const exportJSON = (data, outputDirectory) => {
    try {
        // Create the output directory if it doesn't exist
        if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory, { recursive: true });
        }

        // Construct the full path to the output file
        const outputFile = path.join(outputDirectory, 'output.json');

        // Export all data to a JSON file in the specified directory
        fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));

        console.log(`JSON file exported successfully to ${outputFile}`);
    } catch (error) {
        console.error('Error exporting JSON:', error.message);
    }
}



module.exports = {
    demoParser
};
