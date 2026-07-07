Events.on(ClientLoadEvent, () => {
    try {
        // 1. Locate your mod context safely
        let myMod = Vars.mods.list().find(m => m.mainFile && m.mainFile.path().toLowerCase().includes("cursed-bundles"));

        if (!myMod) {
            Log.err("[MyMod] Could not dynamically find the mod folder.");
            return;
        }

        // 2. Open a direct input stream to the file inside the ZIP archive using the mod's classloader
        let stream = myMod.loader.getResourceAsStream("othermodbundle.json");

        if (stream != null) {
            // 3. Convert the stream to a string
            let scanner = new java.util.Scanner(stream, "UTF-8").useDelimiter("\\A");
            let jsonString = scanner.hasNext() ? scanner.next() : "";
            stream.close(); // Clean up memory

            // 4. Parse JSON and inject into game strings
            let json = JSON.parse(jsonString);
            let properties = Core.bundle.getProperties();

            Object.keys(json).forEach(key => {
                properties.put(key, json[key]);
            });

            Log.info("[MyMod] Successfully loaded and injected bundle strings from ZIP stream!");
        } else {
            Log.err("[MyMod] Could not find 'othermodbundle.json' inside the zip asset bundle wrapper.");
        }
    } catch (e) {
        Log.err("[MyMod] Failed to execute zip asset stream loader: " + e);
    }
});
