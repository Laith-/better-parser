const parseData = (rawData, playerInfo) => {
    // Create a new object without the "steamid" and "name" properties from rawData
    const { steamid, name, ...newData } = rawData;

    // Create a mapping of player names to player IDs
    const nameToIdMap = {};
    Object.values(playerInfo).forEach(team => {
        team.forEach(player => {
            nameToIdMap[player.n] = player.p_id;
        });
    });

    // Replace names in rawData with player IDs
    const modifiedNames = name.map(n => nameToIdMap[n]);

    // Add modified names to newData
    newData.names = modifiedNames;

    // Iterate over teams in playerInfo and add the player information to newData
    Object.keys(playerInfo).forEach(teamKey => {
        newData[teamKey] = playerInfo[teamKey].map(player => ({
            n: player.n,  // Name
            p_id: player.p_id,  // Player ID
            s_id: player.s_id  // Steam ID
        }));
    });

    getStructSize("AFTER", newData);
    console.log(newData);
};
