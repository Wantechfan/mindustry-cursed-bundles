Events.on(ClientLoadEvent, () => {
    try {
        // 1. Get the mod list array from the game engine
        let modsList = Vars.mods.list();
        let targetMod = null;

        // 2. Loop through using a native Java primitive integer loop to avoid iterator proxy crashes
        for (let i = 0; i < modsList.size(); i++) {
            let m = modsList.get(i);
            // Use standard Java string comparison instead of file paths
            if (m.name != null && String(m.name).toLowerCase().indexOf("cursed-bundles") !== -1) {
                targetMod = m;
                break;
            }
        }

        if (targetMod == null) {
            Log.err("[MyMod] Could not find the mod entry in the system list.");
            return;
        }

        // 3. Force the path to a pure primitive JS string using template literals
        // This avoids touching any underlying file object methods directly
        let jsonPath = `${targetMod.file.path()}/othermodbundle.json`;

        // 4. Safely read the string directly from Mindustry's engine asset manager using a safe hardcoded path string
        let rawContent = Core.files.internal(jsonPath).readString("UTF-8");
        let jsonString = String(rawContent);

        // 5. Parse and push keys into Core.bundle
        let json = JSON.parse(jsonString);
        let properties = Core.bundle.getProperties();

        Object.keys(json).forEach(key => {
            properties.put(key, json[key]);
        });

        Log.info("[MyMod] Bundle strings successfully loaded directly from engine!");
    } catch (e) {
        Log.err("[MyMod] Loader caught a runtime exception: " + e);
    }
});
