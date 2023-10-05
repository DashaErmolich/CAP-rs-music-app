using music.app as schema from '../../db/schema.cds';
using from '../../srv/app-service';
using from './annotations';
using from '../../srv/app-service';

annotate schema.Personalizations with {
    id          @title: '{i18n>id}';
    username    @title: '{i18n>username}';
    iconID      @title: '{i18n>iconID}';
    isActivated @title: '{i18n>isActivated}';
};


annotate AdminService.Personalizations with @(UI.Facets: [
    {
        $Type : 'UI.ReferenceFacet',
        ID    : 'GeneratedFacet1',
        Label : 'General Information',
        Target: '@UI.FieldGroup#GeneratedGroup1',
    },
    {
        $Type : 'UI.ReferenceFacet',
        Label : '{i18n>favourites}',
        ID    : 'favourites',
        Target: 'favorites/@UI.LineItem#favourites',
    },
]);


annotate AdminService.Favorites with @(UI.LineItem #favourites: [
    {
        $Type : 'UI.DataField',
        Value : details.image,
        Label : '{i18n>favourutesItemImage}',
        ![@UI.Importance] : #High,
    },
    {
        $Type : 'UI.DataField',
        Value : details.description,
        Label : '{i18n>favourutesItemDescription}',
    },
    {
        $Type: 'UI.DataField',
        Value: itemType.name,
        Label: '{i18n>favourutesItemTypeName}',
    },
]);

annotate AdminService.Personalizations with @(UI.HeaderInfo: {
    Title         : {
        $Type: 'UI.DataField',
        Value: username,
    },
    TypeName      : '',
    TypeNamePlural: '',
    Description   : {
        $Type: 'UI.DataField',
        Value: id,
    },
    ImageUrl      : id,
    Initials      : username,
    TypeImageUrl  : 'sap-icon://person-placeholder',
});

annotate AdminService.Personalizations with @(UI.FieldGroup #GeneratedGroup1: {
    $Type: 'UI.FieldGroupType',
    Data : [
        {
            $Type: 'UI.DataField',
            Value: id,
        },
        {
            $Type: 'UI.DataField',
            Label: '{i18n>username}',
            Value: username,
        },
        {
            $Type: 'UI.DataField',
            Label: '{i18n>iconID}',
            Value: iconID,
        },
        {
            $Type      : 'UI.DataField',
            Label      : '{i18n>isActivated}',
            Value      : isActivated,
            Criticality: {$edmJson: {$If: [
                {$Eq: [
                    {$Path: 'isActivated'},
                    true
                ]},
                3, // Positive
                1, // Negative
            ]}},
        },
    ],
});

annotate AdminService.DeezerDetails with {
    @UI.IsImageURL: true
    image;
};