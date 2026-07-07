Events.on(ClientLoadEvent, () => {
    try {
        // Find your mod reference securely
        let myMod = Vars.mods.list().find(m => m.mainFile && m.mainFile.path().toLowerCase().includes("cursed-bundles"));

        if (!myMod) {
            Log.err("[MyMod] Could not dynamically find the mod folder.");
            return;
        }

        // Fix: Read the file strictly using Mindustry's global safe asset stream
        // This converts the data directly into a safe String array structure
        let lines = Core.files.internal(myMod.file.path() + "/othermodbundle.json").readString("UTF-8");
        let jsonString = String(lines);

        // Parse and inject
        let json = JSON.parse(jsonString);
        let properties = Core.bundle.getProperties();

        Object.keys(json).forEach(key => {
            properties.put(key, json[key]);
        });

        Log.info("[MyMod] Bundle strings successfully loaded!");
    } catch (e) {
        Log.err("[MyMod] Safe bundle loader caught an exception: " + e);
    }
});
