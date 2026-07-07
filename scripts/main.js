Events.on(ClientLoadEvent, () => {
    try {
        // Find the mod where the mainFile path matches your folder name
        let myMod = Vars.mods.list().find(m => m.mainFile && m.mainFile.path().toLowerCase().includes("cursed-bundles"));

        if (!myMod) {
            Log.err("[MyMod] Could not dynamically find the mod folder.");
            return;
        }

        // Safe zip asset loading method
        let jsonFile = myMod.mainFile.parent().parent().child("othermodbundle.json");

        if (jsonFile.exists()) {
            let jsonString = jsonFile.readString();
            let json = JSON.parse(jsonString);
            let properties = Core.bundle.getProperties();

            Object.keys(json).forEach(key => {
                properties.put(key, json[key]);
            });

            Log.info("[MyMod] Successfully injected external bundle strings from ZIP asset!");
        } else {
            Log.err("[MyMod] File not found inside zip context registry.");
        }
    } catch (e) {
        Log.err("[MyMod] Failed to load external bundle strings: " + e);
    }
});
