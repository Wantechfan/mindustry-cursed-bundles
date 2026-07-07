Events.on(ClientLoadEvent, function() {
    try {
        var myMod = Vars.mods.getMod("cursed-bundles");

        if (myMod == null) {
            Log.err("[MyMod] Could not find mod by ID.");
            return;
        }

        // Now that the engine loop bug is gone, ZipFi child reading will work natively
        var jsonFile = myMod.file.child("othermodbundle.json");
        var jsonString = jsonFile.readString() + "";

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
