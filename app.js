/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'SSJT.Application',

    name: 'SSJT',

    requires: [
        // This will automatically load all classes in the SSJT namespace
        // so that application classes do not need to require each other.
        'SSJT.*'
    ],

    // The name of the initial view to create.
    //mainView: 'SSJT.view.main.Main'
});
