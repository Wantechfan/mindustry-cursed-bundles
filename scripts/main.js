Events.on(ClientLoadEvent, () => {
    try {
        let myMod = Vars.mods.list().find(m => m.mainFile && m.mainFile.path().toLowerCase().includes("cursed-bundles"));

        if (!myMod) {
            Log.err("[MyMod] Could not dynamically find the mod folder.");
            return;
        }

        let jsonFile = myMod.file.child("othermodbundle.json");

        // Use direct reading safely without the Java/JS string format conflict
        if (jsonFile != null) {
            let jsonString = jsonFile.readString();
            
            // Parse it directly
            let json = JSON.parse(jsonString);
            let properties = Core.bundle.getProperties();

            Object.keys(json).forEach(key => {
                properties.put(key, json[key]);
            });

            Log.info("[MyMod] Successfully loaded and injected bundle strings from ZipFi!");
        }
    } catch (e) {
        Log.err("[MyMod] Failed to read internal zip data: " + e);
    }
});
