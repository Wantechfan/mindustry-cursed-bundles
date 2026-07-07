Events.on(ClientLoadEvent, () => {
    try {
        // 1. Locate your mod context safely
        let myMod = Vars.mods.list().find(m => m.mainFile && m.mainFile.path().toLowerCase().includes("cursed-bundles"));

        if (!myMod) {
            Log.err("[MyMod] Could not dynamically find the mod folder.");
            return;
        }

        // 2. Read the file content directly using the mod's virtual root file pointer
        // Mindustry's ZipFi handles zipped contents seamlessly via readString()
        let jsonString = myMod.file.child("othermodbundle.json").readString();

        if (jsonString && jsonString.trim().length() > 0) {
            // 3. Parse JSON and inject into game strings
            let json = JSON.parse(jsonString);
            let properties = Core.bundle.getProperties();

            Object.keys(json).forEach(key => {
                properties.put(key, json[key]);
            });

            Log.info("[MyMod] Successfully loaded and injected bundle strings from ZipFi!");
        } else {
            Log.err("[MyMod] The bundle file was empty or unreadable.");
        }
    } catch (e) {
        Log.err("[MyMod] Failed to read internal zip data: " + e);
    }
});
