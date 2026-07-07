Events.on(ClientLoadEvent, function() {
    try {
        var modsList = Vars.mods.list();
        var myMod = null;

        // Use a strict classic loop to find the mod
        for (var i = 0; i < modsList.size(); i++) {
            var m = modsList.get(i);
            if (m.name != null && (m.name + "").toLowerCase().indexOf("cursed-bundles") !== -1) {
                myMod = m;
                break;
            }
        }

        if (myMod == null) {
            Log.err("[MyMod] Could not dynamically find the mod folder.");
            return;
        }

        // Read the string directly from the mod's virtual zip file pointer
        var rawContent = myMod.file.child("othermodbundle.json").readString();
        var jsonString = rawContent + ""; // Force it to a pure JS string primitive safely

        // Parse the JSON data
        var json = JSON.parse(jsonString);
        var properties = Core.bundle.getProperties();

        // Use a classic for...in loop (ES5) to inject keys safely without optimization crashes
        for (var key in json) {
            if (json.hasOwnProperty(key)) {
                properties.put(key, json[key]);
            }
        }

        Log.info("[MyMod] Success! Bundle strings loaded safely via ES5 ZipFi.");
    } catch (e) {
        Log.err("[MyMod] ES5 Loader caught an exception: " + e);
    }
});
