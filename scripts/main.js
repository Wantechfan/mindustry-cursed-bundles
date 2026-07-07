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

        // 1. Locate the JSON file inside the ZIP archive
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
            Log.err("[MyMod] Could not find 'othermodbundle.json' inside the zip file.");
            zipFile.close();
            return;
        }

        // 2. Stream and parse JSON data
        var inputStream = zipFile.getInputStream(targetEntry);
        var scanner = new java.util.Scanner(inputStream, "UTF-8").useDelimiter("\\A");
        var jsonString = scanner.hasNext() ? scanner.next() : "";
        
        inputStream.close();
        zipFile.close();

        var json = JSON.parse(jsonString + "");
        var properties = Core.bundle.getProperties();

        // 3. Dual-Layer Injection (Bundle Override + Live Content Mutator)
        for (var key in json) {
            if (!Object.prototype.hasOwnProperty.call(json, key)) continue;

            // Fix literal '\n' text strings into real line breaks
            var value = (json[key] + "").replace(/\\n/g, "\n");
            
            // Layer A: Push to global bundle
            properties.put(key + "", value);

            // Layer B: Direct Asset Mutation
            var parts = key.split(".");
            if (parts.length < 3) continue;

            var typeStr = parts[0];     
            var contentName = parts[1]; 
            var fieldType = parts[2];
            
            // Format: "mod.target-mod-id.field"
            if (typeStr === "mod") {
                var targetMod = Vars.mods.getMod(contentName); // Finds "Asthosus", "Exoprosopa", etc.
                if (targetMod != null) {
                    if (fieldType === "name") targetMod.meta.displayName = value;
                    if (fieldType === "description") targetMod.meta.description = value;
                    if (fieldType === "author") targetMod.meta.author = value;
                    if (fieldType === "subtitle") targetMod.meta.subtitle = value;
                }
                continue; // Skip standard asset mutation
            }

            if (typeStr === "item") {
                var item = Vars.content.getByName(ContentType.item, contentName);
                if (item != null) {
                    if (fieldType === "name") item.localizedName = value;
                    if (fieldType === "description") item.description = value;
                }
            } else if (typeStr === "block") {
                var block = Vars.content.getByName(ContentType.block, contentName);
                if (block != null) {
                    if (fieldType === "name") block.localizedName = value;
                    if (fieldType === "description") block.description = value;
                }
            } else if (typeStr === "liquid") {
                var liquid = Vars.content.getByName(ContentType.liquid, contentName);
                if (liquid != null) {
                    if (fieldType === "name") liquid.localizedName = value;
                    if (fieldType === "description") liquid.description = value;
                }
            } else if (typeStr === "planet") {
                var planet = Vars.content.getByName(ContentType.planet, contentName);
                if (planet != null) {
                    if (fieldType === "name") planet.localizedName = value;
                    if (fieldType === "description") planet.description = value;
                }
            } else if (typeStr === "sector") {
                var sector = Vars.content.getByName(ContentType.sector, contentName);
                if (sector != null) {
                    if (fieldType === "name") sector.localizedName = value;
                    if (fieldType === "description") sector.description = value;
                }
            } else if (typeStr === "status") {
                var status = Vars.content.getByName(ContentType.status, contentName);
                if (status != null) {
                    if (fieldType === "name") status.localizedName = value;
                    if (fieldType === "description") status.description = value;
                    if (fieldType === "details") status.details = value;
                }
            }
        }
        Log.info("[MyMod] Success! Hijacked text bundles applied directly to live objects.");
    } catch (e) {
        Log.err("[MyMod] Dynamic Zip Loader caught an exception: " + e);
    }
});
