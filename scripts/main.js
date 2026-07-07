Events.on(ClientLoadEvent, function() {
    try {
        var modsList = Vars.mods.list();
        var myMod = null;

        for (var i = 0; i < modsList.size(); i++) {
            var m = modsList.get(i);
            if (m.name != null && (m.name + "").toLowerCase().indexOf("cursed-bundles") !== -1) {
                myMod = m;
                break;
            }
        }

        if (myMod == null) {
            Log.err("[MyMod] Could not find mod entry.");
            return;
        }

        // Fix: Read the entire stream at once using the game's internal Streams utility
        var fileHandle = myMod.file.child("othermodbundle.json");
        var inputStream = fileHandle.read(); 
        var jsonString = arc.util.io.Streams.copyString(inputStream) + ""; 

        // Parse and inject
        var json = JSON.parse(jsonString);
        var properties = Core.bundle.getProperties();

        for (var key in json) {
            if (json.hasOwnProperty(key)) {
                properties.put(key, json[key]);
            }
        }

        Log.info("[MyMod] Bundle strings successfully loaded!");
    } catch (e) {
        Log.err("[MyMod] Loader caught an exception: " + e);
    }
});
