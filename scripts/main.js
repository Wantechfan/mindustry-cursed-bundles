Events.on(ClientLoadEvent, function() {
    try {
        // 1. Fetch the mod directly by its internal ID string.
        // No loops, no .size(), no .get(i) to confuse the engine!
        var myMod = Vars.mods.getMod("cursed-bundles");

        if (myMod == null) {
            Log.err("[MyMod] Could not find mod by ID.");
            return;
        }

        // 2. Read the file string cleanly using an all-Java approach
        var jsonFile = myMod.file.child("othermodbundle.json");
        var jsonString = jsonFile.readString() + "";

        // 3. Parse the JSON using a clean standard loop
        var json = JSON.parse(jsonString);
        var properties = Core.bundle.getProperties();

        for (var key in json) {
            if (Object.prototype.hasOwnProperty.call(json, key)) {
                properties.put(key + "", json[key] + "");
            }
        }

        Log.info("[MyMod] Bundle strings successfully loaded!");
    } catch (e) {
        Log.err("[MyMod] Loader caught a runtime exception: " + e);
    }
});
