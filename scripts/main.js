Events.on(ClientLoadEvent, () => {
    try {
        // 1. Get the handle to your mod's directory
        // Replace "your-mod-name" with the actual "name" from your mod.json
        let myMod = Mods.getMod("cursed-bundles");
        
        // 2. Locate your JSON file inside your mod folder
        let jsonFile = myMod.file.child("othermodbundle.json");

        if (jsonFile.exists()) {
            // 3. Read the file content as a string and parse it
            let jsonString = jsonFile.readString();
            let json = JSON.parse(jsonString);

            // 4. Get the internal properties map from Mindustry's bundle
            let properties = Core.bundle.getProperties();

            // 5. Loop through your JSON keys and inject/overwrite them
            Object.keys(json).forEach(key => {
                properties.put(key, json[key]);
            });

            Log.info("[MyMod] Successfully injected external bundle strings.");
        } else {
            Log.err("[MyMod] Could not find othermodbundle.json");
        }
    } catch (e) {
        Log.err("[MyMod] Failed to load external bundle strings: " + e);
    }
});
