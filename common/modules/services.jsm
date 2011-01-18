// Copyright (c) 2008-2010 by Kris Maglione <maglione.k at Gmail>
//
// This work is licensed for reuse under an MIT license. Details are
// given in the LICENSE.txt file included with this file.
"use strict";

try {

var global = this;
Components.utils.import("resource://dactyl/bootstrap.jsm");
defineModule("services", {
    exports: ["AddonManager", "services"],
    use: ["util"]
}, this);

/**
 * A lazily-instantiated XPCOM class and service cache.
 */
var Services = Module("Services", {
    init: function () {
        this.classes = {};
        this.services = {};

        this.add("annotation",          "@mozilla.org/browser/annotation-service;1",        Ci.nsIAnnotationService);
        this.add("appShell",            "@mozilla.org/appshell/appShellService;1",          Ci.nsIAppShellService);
        this.add("appStartup",          "@mozilla.org/toolkit/app-startup;1",               Ci.nsIAppStartup);
        this.add("autoCompleteSearch",  "@mozilla.org/autocomplete/search;1?name=history",  Ci.nsIAutoCompleteSearch);
        this.add("bookmarks",           "@mozilla.org/browser/nav-bookmarks-service;1",     Ci.nsINavBookmarksService);
        this.add("browserSearch",       "@mozilla.org/browser/search-service;1",            Ci.nsIBrowserSearchService);
        this.add("cache",               "@mozilla.org/network/cache-service;1",             Ci.nsICacheService);
        this.add("charset",             "@mozilla.org/charset-converter-manager;1",         Ci.nsICharsetConverterManager);
        this.add("chromeRegistry",      "@mozilla.org/chrome/chrome-registry;1",            Ci.nsIXULChromeRegistry);
        this.add("commandLineHandler",  "@mozilla.org/commandlinehandler/general-startup;1?type=dactyl");
        this.add("console",             "@mozilla.org/consoleservice;1",                    Ci.nsIConsoleService);
        this.add("dactyl:",             "@mozilla.org/network/protocol;1?name=dactyl");
        this.add("debugger",            "@mozilla.org/js/jsd/debugger-service;1",           Ci.jsdIDebuggerService);
        this.add("directory",           "@mozilla.org/file/directory_service;1",            Ci.nsIProperties);
        this.add("downloadManager",     "@mozilla.org/download-manager;1",                  Ci.nsIDownloadManager);
        this.add("environment",         "@mozilla.org/process/environment;1",               Ci.nsIEnvironment);
        this.add("extensionManager",    "@mozilla.org/extensions/manager;1",                Ci.nsIExtensionManager);
        this.add("externalProtocol",    "@mozilla.org/uriloader/external-protocol-service;1", Ci.nsIExternalProtocolService);
        this.add("favicon",             "@mozilla.org/browser/favicon-service;1",           Ci.nsIFaviconService);
        this.add("focus",               "@mozilla.org/focus-manager;1",                     Ci.nsIFocusManager);
        this.add("fuel",                "@mozilla.org/fuel/application;1",                  Ci.extIApplication);
        this.add("history",             "@mozilla.org/browser/global-history;2",
                 [Ci.nsIBrowserHistory, Ci.nsIGlobalHistory3, Ci.nsINavHistoryService, Ci.nsPIPlacesDatabase]);
        this.add("io",                  "@mozilla.org/network/io-service;1",                Ci.nsIIOService);
        this.add("json",                "@mozilla.org/dom/json;1",                          Ci.nsIJSON, "createInstance");
        this.add("livemark",            "@mozilla.org/browser/livemark-service;2",          Ci.nsILivemarkService);
        this.add("mime",                "@mozilla.org/mime;1",                              Ci.nsIMIMEService);
        this.add("observer",            "@mozilla.org/observer-service;1",                  Ci.nsIObserverService);
        this.add("pref",                "@mozilla.org/preferences-service;1",               [Ci.nsIPrefBranch2, Ci.nsIPrefService]);
        this.add("privateBrowsing",     "@mozilla.org/privatebrowsing;1",                   Ci.nsIPrivateBrowsingService);
        this.add("profile",             "@mozilla.org/toolkit/profile-service;1",           Ci.nsIToolkitProfileService);
        this.add("runtime",             "@mozilla.org/xre/runtime;1",                       [Ci.nsIXULAppInfo, Ci.nsIXULRuntime]);
        this.add("rdf",                 "@mozilla.org/rdf/rdf-service;1",                   Ci.nsIRDFService);
        this.add("sessionStore",        "@mozilla.org/browser/sessionstore;1",              Ci.nsISessionStore);
        this.add("stringBundle",        "@mozilla.org/intl/stringbundle;1",                 Ci.nsIStringBundleService);
        this.add("stylesheet",          "@mozilla.org/content/style-sheet-service;1",       Ci.nsIStyleSheetService);
        this.add("subscriptLoader",     "@mozilla.org/moz/jssubscript-loader;1",            Ci.mozIJSSubScriptLoader);
        this.add("tagging",             "@mozilla.org/browser/tagging-service;1",           Ci.nsITaggingService);
        this.add("threading",           "@mozilla.org/thread-manager;1",                    Ci.nsIThreadManager);
        this.add("urifixup",            "@mozilla.org/docshell/urifixup;1",                 Ci.nsIURIFixup);
        this.add("versionCompare",      "@mozilla.org/xpcom/version-comparator;1",          Ci.nsIVersionComparator);
        this.add("windowMediator",      "@mozilla.org/appshell/window-mediator;1",          Ci.nsIWindowMediator);
        this.add("windowWatcher",       "@mozilla.org/embedcomp/window-watcher;1",          Ci.nsIWindowWatcher);
        this.add("zipReader",           "@mozilla.org/libjar/zip-reader-cache;1",           Ci.nsIZipReaderCache);

        this.addClass("CharsetConv",  "@mozilla.org/intl/scriptableunicodeconverter", Ci.nsIScriptableUnicodeConverter, "charset");
        this.addClass("File",         "@mozilla.org/file/local;1",                 Ci.nsILocalFile);
        this.addClass("file:",        "@mozilla.org/network/protocol;1?name=file", Ci.nsIFileProtocolHandler);
        this.addClass("Find",         "@mozilla.org/embedcomp/rangefind;1",        Ci.nsIFind);
        this.addClass("HtmlConverter","@mozilla.org/widget/htmlformatconverter;1", Ci.nsIFormatConverter);
        this.addClass("HtmlEncoder",  "@mozilla.org/layout/htmlCopyEncoder;1",     Ci.nsIDocumentEncoder);
        this.addClass("InputStream",  "@mozilla.org/scriptableinputstream;1",      Ci.nsIScriptableInputStream, "init");
        this.addClass("Persist",      "@mozilla.org/embedding/browser/nsWebBrowserPersist;1", Ci.nsIWebBrowserPersist);
        this.addClass("Pipe",         "@mozilla.org/pipe;1",                       Ci.nsIPipe, "init");
        this.addClass("Process",      "@mozilla.org/process/util;1",               Ci.nsIProcess, "init");
        this.addClass("StreamChannel","@mozilla.org/network/input-stream-channel;1",
                      [Ci.nsIChannel, Ci.nsIInputStreamChannel, Ci.nsIRequest], "setURI");
        this.addClass("String",       "@mozilla.org/supports-string;1",            Ci.nsISupportsString, "data");
        this.addClass("StringStream", "@mozilla.org/io/string-input-stream;1",     Ci.nsIStringInputStream, "data");
        this.addClass("Transfer",     "@mozilla.org/transfer;1",                   Ci.nsITransfer, "init");
        this.addClass("Timer",        "@mozilla.org/timer;1",                      Ci.nsITimer, "initWithCallback");
        this.addClass("StreamCopier", "@mozilla.org/network/async-stream-copier;1",Ci.nsIAsyncStreamCopier, "init");
        this.addClass("Xmlhttp",      "@mozilla.org/xmlextras/xmlhttprequest;1",   Ci.nsIXMLHttpRequest);
        this.addClass("ZipReader",    "@mozilla.org/libjar/zip-reader;1",          Ci.nsIZipReader, "open");
        this.addClass("ZipWriter",    "@mozilla.org/zipwriter;1",                  Ci.nsIZipWriter);

        if (!Ci.nsIExtensionManager || !this.extensionManager)
            Components.utils.import("resource://gre/modules/AddonManager.jsm");
        else
            global.AddonManager = {
                getAddonByID: function (id, callback) {
                    callback = callback || util.identity;
                    let addon = id;
                    if (!isObject(addon))
                        addon = services.extensionManager.getItemForID(id);
                    if (!addon)
                        return callback(null);
                    addon = Object.create(addon);

                    function getRdfProperty(item, property) {
                        let resource = services.rdf.GetResource("urn:mozilla:item:" + item.id);
                        let value = "";

                        if (resource) {
                            let target = services.extensionManager.datasource.GetTarget(resource,
                                services.rdf.GetResource("http://www.mozilla.org/2004/em-rdf#" + property), true);
                            if (target && target instanceof Ci.nsIRDFLiteral)
                                value = target.Value;
                        }

                        return value;
                    }

                    ["aboutURL", "creator", "description", "developers",
                     "homepageURL", "installDate", "optionsURL",
                     "releaseNotesURI", "updateDate"].forEach(function (item) {
                        memoize(addon, item, function (item) getRdfProperty(this, item));
                    });

                    update(addon, {

                        appDisabled: false,

                        installLocation: Class.memoize(function () services.extensionManager.getInstallLocation(this.id)),
                        getResourceURI: function getResourceURI(path) {
                            let file = this.installLocation.getItemFile(this.id, path);
                            return services.io.newFileURI(file);
                        },

                        isActive: getRdfProperty(addon, "isDisabled") != "true",

                        uninstall: function uninstall() {
                            services.extensionManager.uninstallItem(this.id);
                        },

                        get userDisabled() getRdfProperty(addon, "userDisabled") === "true",
                        set userDisabled(val) {
                            services.extensionManager[val ? "disableItem" : "enableItem"](this.id);
                        }
                    });

                    return callback(addon);
                },
                getAddonsByTypes: function (types, callback) {
                    let res = [];
                    for (let [, type] in Iterator(types))
                        for (let [, item] in Iterator(services.extensionManager
                                    .getItemList(Ci.nsIUpdateItem["TYPE_" + type.toUpperCase()], {})))
                            res.push(this.getAddonByID(item));
                    return (callback || util.identity)(res);
                },
                getInstallForFile: function (file, callback, mimetype) {
                    callback({
                        addListener: function () {},
                        install: function () {
                            services.extensionManager.installItemFromFile(file, "app-profile");
                        }
                    });
                },
                getInstallForURL: function (url, callback, mimetype) {
                    dactyl.assert(false, "Install by URL not implemented");
                },
            };
    },
    reinit: function () {},

    _create: function (classes, ifaces, meth, init, args) {
        try {
            let res = Cc[classes][meth || "getService"]();
            if (!ifaces)
                return res["wrapped" + "JSObject"]; // Kill stupid validator warning
            Array.concat(ifaces).forEach(function (iface) res.QueryInterface(iface));
            if (init && args.length) {
                try {
                    var isCallable = callable(res[init]);
                }
                catch (e) {} // Ugh.

                if (isCallable)
                    res[init].apply(res, args);
                else
                    res[init] = args[0];
            }
            return res;
        }
        catch (e) {
            if (typeof util !== "undefined")
                util.reportError(e);
            else
                dump("dactyl: Service creation failed for '" + classes + "': " + e + "\n" + (e.stack || Error(e).stack));
            return null;
        }
    },

    /**
     * Adds a new XPCOM service to the cache.
     *
     * @param {string} name The service's cache key.
     * @param {string} class The class's contract ID.
     * @param {nsISupports|nsISupports[]} ifaces The interface or array of
     *     interfaces implemented by this service.
     * @param {string} meth The name of the function used to instanciate
     *     the service.
     */
    add: function (name, class_, ifaces, meth) {
        const self = this;
        if (name in this && ifaces && !this.__lookupGetter__(name) && !(this[name] instanceof Ci.nsISupports))
            throw TypeError();
        memoize(this, name, function () self._create(class_, ifaces, meth));
    },

    /**
     * Adds a new XPCOM class to the cache.
     *
     * @param {string} name The class's cache key.
     * @param {string} class The class's contract ID.
     * @param {nsISupports|nsISupports[]} ifaces The interface or array of
     *     interfaces implemented by this class.
     */
    addClass: function (name, class_, ifaces, init) {
        const self = this;
        this[name] = function () self._create(class_, ifaces, "createInstance", init, arguments);
        update.apply(null, [this[name]].concat(ifaces));
        return this[name];
    },

    /**
     * Returns a new instance of the cached class with the specified name.
     *
     * @param {string} name The class's cache key.
     */
    create: function (name) this[name[0].toUpperCase() + name.substr(1)],

    /**
     * Returns the cached service with the specified name.
     *
     * @param {string} name The service's cache key.
     */
    get: function (name) this[name],
}, {
}, {
    javascript: function (dactyl, modules) {
        modules.JavaScript.setCompleter(this.get, [function () [[k, v] for ([k, v] in Iterator(services)) if (v instanceof Ci.nsISupports)]]);
        modules.JavaScript.setCompleter(this.create, [function () [[c, ""] for (c in services.classes)]]);
    }
});

endModule();

} catch(e){dump(e.fileName+":"+e.lineNumber+": "+e+"\n" + e.stack);}

// vim: set fdm=marker sw=4 sts=4 et ft=javascript:
