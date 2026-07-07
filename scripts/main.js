Events.on(ClientLoadEvent, () => {
    try {
        // 1. Safely grab your mod context
        let myMod = Vars.mods.list().find(m => m.mainFile && m.mainFile.path().toLowerCase().includes("cursed-bundles"));

        if (!myMod) {
            Log.err("[MyMod] Could not dynamically find the mod folder.");
            return;
        }

        // 2. Read the file data and explicitly force it to a JavaScript String primitive
        let rawJavaString = myMod.file.child("othermodbundle.json").readString();
        let jsonString = String(rawJavaString);

        // 3. Parse and inject into the game bundles
        let json = JSON.parse(jsonString);
        let properties = Core.bundle.getProperties();

        Object.keys(json).forEach(key => {
            properties.put(key, json[key]);
        });

        Log.info("[MyMod] Successfully loaded and injected bundle strings from ZipFi!");
    } catch (e) {
        Log.err("[MyMod] Failed to read internal zip data: " + e);
    }
});
