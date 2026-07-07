Events.on(ClientLoadEvent, function() {
    try {
        var myMod = Vars.mods.getMod("cursed-bundles");

        if (myMod == null) {
            Log.err("[MyMod] Could not find mod by ID.");
            return;
        }

        var zipFilePath = myMod.file.absolutePath();
        var zipFile = new java.util.zip.ZipFile(zipFilePath);
        
        // Let's print out EVERYTHING inside your zip file to see its layout
        Log.info("--- LISTING ZIP CONTENTS ---");
        var entries = zipFile.entries();
        while (entries.hasMoreElements()) {
            var entry = entries.nextElement();
            Log.info("Found file inside ZIP: '" + entry.getName() + "'");
        }
        Log.info("----------------------------");

        // Try reading it again
        var zipEntry = zipFile.getEntry("othermodbundle.json");

        if (zipEntry == null) {
            Log.err("[MyMod] 'othermodbundle.json' not found inside the zip root. Check the 'Found file inside ZIP' list above to see why!");
            zipFile.close();
            return;
        }

        var inputStream = zipFile.getInputStream(zipEntry);
        var scanner = new java.util.Scanner(inputStream, "UTF-8").useDelimiter("\\A");
        var jsonString = scanner.hasNext() ? scanner.next() : "";
        
        inputStream.close();
        zipFile.close();

        var json = JSON.parse(jsonString + "");
        var properties = Core.bundle.getProperties();

        for (var key in json) {
            if (Object.prototype.hasOwnProperty.call(json, key)) {
                properties.put(key + "", json[key] + "");
            }
        }

        Log.info("[MyMod] Bundle strings successfully extracted!");
    } catch (e) {
        Log.err("[MyMod] Native Zip Loader caught an exception: " + e);
    }
});
