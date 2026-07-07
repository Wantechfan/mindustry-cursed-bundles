Events.on(ClientLoadEvent, function() {
    try {
        var myMod = Vars.mods.getMod("cursed-bundles");

        if (myMod == null) {
            Log.err("[MyMod] Could not find mod by ID.");
            return;
        }

        var zipFilePath = myMod.file.absolutePath();
        var zipFile = new java.util.zip.ZipFile(zipFilePath);
        var targetEntry = null;

        // 1. Scan the archive to find the file regardless of the GitHub folder name
        var entries = zipFile.entries();
        while (entries.hasMoreElements()) {
            var entry = entries.nextElement();
            var entryName = entry.getName() + "";
            
            if (entryName.indexOf("othermodbundle.json") !== -1) {
                targetEntry = entry;
                break;
            }
        }

        if (targetEntry == null) {
            Log.err("[MyMod] Could not find 'othermodbundle.json' anywhere inside the zip file.");
            zipFile.close();
            return;
        }

        // 2. Extract and stream the text content
        var inputStream = zipFile.getInputStream(targetEntry);
        var scanner = new java.util.Scanner(inputStream, "UTF-8").useDelimiter("\\A");
        var jsonString = scanner.hasNext() ? scanner.next() : "";
        
        inputStream.close();
        zipFile.close();

        // 3. Inject keys into the live game database
        var json = JSON.parse(jsonString + "");
        var properties = Core.bundle.getProperties();

        for (var key in json) {
            if (Object.prototype.hasOwnProperty.call(json, key)) {
                properties.put(key + "", json[key] + "");
            }
        }

        Log.info("[MyMod] Success! Bundle strings safely extracted from nested GitHub folder.");
    } catch (e) {
        Log.err("[MyMod] Dynamic Zip Loader caught an exception: " + e);
    }
});
