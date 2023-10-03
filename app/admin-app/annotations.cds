using AdminService.Personalizations as personalizations from '../../srv/app-service';

annotate personalizations with @(UI.LineItem: [
    {
        $Type: 'UI.DataField',
        Value: id,
    },
    {
        $Type: 'UI.DataField',
        Value: username,
    },
    {
        $Type: 'UI.DataField',
        Value: isActivated,
        ![@UI.Hidden],
    },
    {
        $Type: 'UI.DataField',
        Value: iconID,
        ![@UI.Hidden],
    },
]);

annotate personalizations with @(UI.SelectionFields: [
    id,
    username,
], );

annotate personalizations with {
    isActivated @UI.HiddenFilter;
    iconID      @UI.HiddenFilter;
};


annotate personalizations with @(
    UI.FieldGroup #GeneratedGroup1: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: id,
            },
            {
                $Type: 'UI.DataField',
                Label: 'username',
                Value: username,
            },
            {
                $Type: 'UI.DataField',
                Label: 'isActivated',
                Value: isActivated,
            },
            {
                $Type: 'UI.DataField',
                Label: 'iconID',
                Value: iconID,
            },
        ],
    },
    UI.Facets                     : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'GeneratedFacet1',
        Label : 'General Information',
        Target: '@UI.FieldGroup#GeneratedGroup1',
    }, ]
);
