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

        // Fix: Use Mindustry's Jval system parser directly on the file object
        // Jval handles internal ZipFi conversion natively in Java, avoiding JS layer bugs
        var jvalObj = arc.util.serialization.Jval.read(myMod.file.child("othermodbundle.json").readString());
        var properties = Core.bundle.getProperties();

        // Use Jval's native keys iterator instead of JS loops
        var keys = jvalObj.keys();
        while(keys.hasNext()) {
            var key = keys.next() + "";
            var value = jvalObj.getString(key, "") + "";
            properties.put(key, value);
        }

        Log.info("[MyMod] Bundle strings successfully loaded via Jval!");
    } catch (e) {
        Log.err("[MyMod] Jval Loader caught an exception: " + e);
    }
});
