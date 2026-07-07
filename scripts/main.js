Events.on(ClientLoadEvent, () => {
    try {
        // 1. Get the handle to your mod's directory using Vars.mods
        // Replace "cursed-bundles" with your actual mod name if it's different in mod.json
        let myMod = Vars.mods.getMod("cursed-bundles");
        
        if (myMod == null) {
            Log.err("[MyMod] Could not find mod 'cursed-bundles' in mod list.");
            return;
        }

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
            Log.err("[MyMod] Could not find othermodbundle.json inside the mod folder.");
        }
    } catch (e) {
        Log.err("[MyMod] Failed to load external bundle strings: " + e);
    }
});
