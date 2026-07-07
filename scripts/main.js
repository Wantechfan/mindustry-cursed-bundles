Events.on(ClientLoadEvent, function() {
    try {
        var myMod = Vars.mods.getMod("cursed-bundles");

        if (myMod == null) {
            Log.err("[MyMod] Could not find mod by ID.");
            return;
        }

        // 1. Get the absolute path to the actual .zip file on your phone
        var zipFilePath = myMod.file.absolutePath();
        
        // 2. Open the zip file directly using native Java
        var zipFile = new java.util.zip.ZipFile(zipFilePath);
        var zipEntry = zipFile.getEntry("othermodbundle.json");

        if (zipEntry == null) {
            Log.err("[MyMod] 'othermodbundle.json' not found inside the zip root.");
            zipFile.close();
            return;
        }

        // 3. Read the file stream directly from the zip entry
        var inputStream = zipFile.getInputStream(zipEntry);
        var scanner = new java.util.Scanner(inputStream, "UTF-8").useDelimiter("\\A");
        var jsonString = scanner.hasNext() ? scanner.next() : "";
        
        // Clean up open streams
        inputStream.close();
        zipFile.close();

        // 4. Parse and inject strings
        var json = JSON.parse(jsonString + "");
        var properties = Core.bundle.getProperties();

        for (var key in json) {
            if (Object.prototype.hasOwnProperty.call(json, key)) {
                properties.put(key + "", json[key] + "");
            }
        }

        Log.info("[MyMod] Bundle strings successfully extracted from ZipFile!");
    } catch (e) {
        Log.err("[MyMod] Native Zip Loader caught an exception: " + e);
    }
});
