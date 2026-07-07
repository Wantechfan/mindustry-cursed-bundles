Events.on(ClientLoadEvent, () => {
    try {
        // 1. Get the game's safe root folder directory path as a pure Java string
        let baseDir = String(Core.settings.getDataDirectory().path());
        
        // 2. Build the exact folder path directly using pure strings
        // This completely skips using targetMod.file and shuts up the R8 optimizer error
        let jsonPath = baseDir + "/mods/cursed-bundles.zip/othermodbundle.json";

        // 3. Read it via the safe internal engine asset manager
        let rawContent = Core.files.internal(jsonPath).readString("UTF-8");
        let jsonString = String(rawContent);

        // 4. Parse and inject
        let json = JSON.parse(jsonString);
        let properties = Core.bundle.getProperties();

        Object.keys(json).forEach(key => {
            properties.put(key, json[key]);
        });

        Log.info("[MyMod] Success! Bundle strings loaded with zero Java object wrappers.");
    } catch (e) {
        Log.err("[MyMod] Safe hardcoded loader caught an exception: " + e);
    }
});
