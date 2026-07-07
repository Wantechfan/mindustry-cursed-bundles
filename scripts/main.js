Events.on(ClientLoadEvent, () => {
    try {
        // Safe check: ensure m.mainFile exists before calling .path()
        let myMod = Vars.mods.list().find(m => m.mainFile && m.mainFile.path().includes("cursed-bundles"));

        if (!myMod) {
            Log.err("[MyMod] Could not dynamically find the mod folder.");
            return;
        }

        let jsonFile = myMod.file.child("othermodbundle.json");

        if (jsonFile.exists()) {
            let jsonString = jsonFile.readString();
            let json = JSON.parse(jsonString);
            let properties = Core.bundle.getProperties();

            Object.keys(json).forEach(key => {
                properties.put(key, json[key]);
            });

            Log.info("[MyMod] Successfully injected external bundle strings.");
        } else {
            Log.err("[MyMod] Found mod folder, but othermodbundle.json is missing inside it.");
        }
    } catch (e) {
        Log.err("[MyMod] Failed to load external bundle strings: " + e);
    }
});
