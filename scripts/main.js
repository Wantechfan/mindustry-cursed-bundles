Events.on(ClientLoadEvent, () => {
    try {
        // Search by internal name or display name in the mod metadata
        let myMod = Vars.mods.list().find(m => 
            (m.name && m.name.toLowerCase().includes("cursed-bundles")) || 
            (m.meta && m.meta.displayName && m.meta.displayName.toLowerCase().includes("cursed bundles"))
        );

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
