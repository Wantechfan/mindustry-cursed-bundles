Events.on(ClientLoadEvent, function() {
    try {
        var myMod = Vars.mods.getMod("cursed-bundles");

        if (myMod == null) {
            Log.err("[MyMod] Could not find mod by ID.");
            return;
        }

        // Fix: Navigate relative to mainFile (scripts/main.js) to stay inside the virtual zip system
        // mainFile points to "scripts/main.js", so parent().parent() drops us perfectly in the root next to your JSON
        var jsonFile = myMod.mainFile.parent().parent().child("othermodbundle.json");
        var jsonString = jsonFile.readString() + "";

        var json = JSON.parse(jsonString);
        var properties = Core.bundle.getProperties();

        for (var key in json) {
            if (Object.prototype.hasOwnProperty.call(json, key)) {
                properties.put(key + "", json[key] + "");
            }
        }

        Log.info("[MyMod] Bundle strings successfully loaded from ZipFi!");
    } catch (e) {
        Log.err("[MyMod] Loader caught a runtime exception: " + e);
    }
});
