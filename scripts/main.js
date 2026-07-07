Events.on(ClientLoadEvent, () => {
    try {
        // Find the mod where the mainFile path matches your folder name
        let myMod = Vars.mods.list().find(m => m.mainFile && m.mainFile.path().toLowerCase().includes("cursed-bundles"));

        if (!myMod) {
            Log.err("[MyMod] Could not dynamically find the mod folder.");
            return;
        }

        // ALTERNATIVE TARGETING: Use the main script file's parent directory
        // m.mainFile points to scripts/main.js, so parent().parent() brings us back to the root folder.
        let jsonFile = myMod.mainFile.parent().parent().child("othermodbundle.json");

        if (jsonFile.exists()) {
            let jsonString = jsonFile.readString();
            let json = JSON.parse(jsonString);
            let properties = Core.bundle.getProperties();

            Object.keys(json).forEach(key => {
                properties.put(key, json[key]);
            });

            Log.info("[MyMod] Successfully injected external bundle strings.");
        } else {
            // Debug log to output EXACTLY where it is searching on your phone
            Log.err("[MyMod] Missing file. Searched location: " + jsonFile.absolutePath());
        }
    } catch (e) {
        Log.err("[MyMod] Failed to load external bundle strings: " + e);
    }
});
