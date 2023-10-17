sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'admin/adminapp/test/integration/FirstJourney',
		'admin/adminapp/test/integration/pages/PersonalizationsList',
		'admin/adminapp/test/integration/pages/PersonalizationsObjectPage',
		'admin/adminapp/test/integration/pages/CustomPlaylistsObjectPage'
    ],
    function(JourneyRunner, opaJourney, PersonalizationsList, PersonalizationsObjectPage, CustomPlaylistsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('admin/adminapp') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThePersonalizationsList: PersonalizationsList,
					onThePersonalizationsObjectPage: PersonalizationsObjectPage,
					onTheCustomPlaylistsObjectPage: CustomPlaylistsObjectPage
                }
            },
            opaJourney.run
        );
    }
);