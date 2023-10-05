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
        Label : '{i18n>favorites}',
        ID : 'i18nfavorites',
        Target : 'favorites/@UI.LineItem#i18nfavorites',
    },
    {
        $Type : 'UI.ReferenceFacet',
        Label : '{i18n>customPlaylists}',
        ID : 'i18ncustomPlaylists',
        Target : 'customPlaylists/@UI.LineItem#i18ncustomPlaylists',
    },
]);


annotate AdminService.Favorites with @(UI.LineItem #favorites: [
    {
        $Type : 'UI.DataField',
        Value : details.image,
        Label : '{i18n>favoritesItemImage}',
        ![@UI.Importance] : #High,
    },
    {
        $Type : 'UI.DataField',
        Value : details.description,
        Label : '{i18n>favoritesItemDescription}',
    },
    {
        $Type: 'UI.DataField',
        Value: itemType.name,
        Label: '{i18n>favoritesItemTypeName}',
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

annotate AdminService.CustomPlaylists with @(
    UI.LineItem #i18ncustomPlaylists : [
        {
            $Type : 'UI.DataField',
            Value : title,
            Label : '{i18n>title}',
        },{
            $Type : 'UI.DataField',
            Value : createdAt,
            Label : '{i18n>creationDate}',
        },]
);
annotate AdminService.Personalizations with @(
    UI.FieldGroup #i18nfavorites : {
        $Type : 'UI.FieldGroupType',
        Data : [
        ],
    }
);
annotate AdminService.Favorites with @(
    UI.LineItem #i18nfavorites : [
        {
            $Type : 'UI.DataField',
            Value : details.image,
            Label : '{i18n>favoritesItemImage}',
        },
        {
            $Type : 'UI.DataField',
            Value : itemType.name,
            Label : '{i18n>favoritesItemTypeName}',
        },{
            $Type : 'UI.DataField',
            Value : details.description,
            Label : '{i18n>favoritesItemDescription}',
        },]
);
annotate AdminService.CustomPlaylists with @(
    UI.HeaderInfo : {
        TypeName : '',
        TypeNamePlural : '',
        Title : {
            $Type : 'UI.DataField',
            Value : title,
        },
        TypeImageUrl : '',
        Description : {
            $Type : 'UI.DataField',
            Value : ID,
        },
    }
);
annotate AdminService.CustomPlaylists with @(
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>tracklist}',
            ID : 'i18ntracklist',
            Target : 'tracks/@UI.PresentationVariant#i18ntracklist',
        },
    ]
);
annotate AdminService.CustomPlayliststTracks with @(
    UI.LineItem #i18ntracklist : [
        {
            $Type : 'UI.DataField',
            Value : trackID,
            Label : '{i18n>trackID}',
        },
        {
            $Type : 'UI.DataField',
            Value : details.image,
            Label : '{i18n>image}',
        },
        {
            $Type : 'UI.DataField',
            Value : details.title,
            Label : '{i18n>title}',
        },
        {
            $Type : 'UI.DataField',
            Value : details.artist,
            Label : '{i18n>artist}',
        },
        {
            $Type : 'UI.DataField',
            Value : details.releaseDate,
            Label : '{i18n>releaseDate}',
        },]
);
annotate AdminService.CustomPlayliststTracks with @(
    UI.PresentationVariant #i18ntracklist : {
        $Type : 'UI.PresentationVariantType',
        Visualizations : [
            '@UI.LineItem#i18ntracklist',
        ],
    }
);
