using AdminService as service from '../../srv/app-service';

annotate service.Personalizations with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : id,
        },
        {
            $Type : 'UI.DataField',
            Value : username,
        },
        {
            $Type : 'UI.DataField',
            Value : isActivated,
            ![@UI.Hidden],
        },
        {
            $Type : 'UI.DataField',
            Value : iconID,
            ![@UI.Hidden],
        },
    ]
);
annotate service.Personalizations with @(
    UI.SelectionVariant : {
        $Type : 'UI.SelectionVariantType',
        SelectOptions : [
            {
                $Type : 'UI.SelectOptionType',
                Ranges : [
                    {
                        $Type : 'UI.SelectionRangeType',
                        Option : #CP,
                        Low : 'dasha',
                        Sign : #I,
                    },
                ],
                PropertyName : id,
            },
        ],
    }
);
annotate service.Personalizations with @(
    UI.SelectionFields : [
        id,
        username,
    ],
);

annotate service.Personalizations with @(
    UI.FieldGroup #GeneratedGroup1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : id,
            },
            {
                $Type : 'UI.DataField',
                Label : 'username',
                Value : username,
            },
            {
                $Type : 'UI.DataField',
                Label : 'isActivated',
                Value : isActivated,
            },
            {
                $Type : 'UI.DataField',
                Label : 'iconID',
                Value : iconID,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup1',
        },
    ]
);
