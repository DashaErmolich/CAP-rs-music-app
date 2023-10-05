using {User} from '@sap/cds/common.cds';
using {
    cuid,
    managed
} from '@sap/cds/common';

namespace music.app;

entity Personalizations {
    key id              : User    @cds.on.insert: $user;
        username        : String default 'User';
        isActivated     : Boolean default true;
        iconID          : Integer @assert.range : [
            1,
            11
        ];
        favorites       : Composition of many Favorites
                              on favorites.parent = $self;
        customPlaylists : Composition of many CustomPlaylists
                              on customPlaylists.createdBy = $self.id;
}

entity Favorites {
    key parent_id : type of Personalizations : id;
    key itemID    : Integer64;
    key itemType  : Association to FavoritesTypes @assert.range: [
                        1,
                        5
                    ];
        parent    : Association to Personalizations
                        on parent.id = parent_id;
        details   : Association to DeezerDetails
                        on  details.itemID   = itemID
                        and details.itemType = itemType;
}

entity FavoritesTypes {
    key id   : Int16;
        name : String;
}

entity CustomPlaylists : cuid, managed {
    title  : String;
    tracks : Composition of many CustomPlayliststTracks
                 on tracks.parent = $self;
}

entity CustomPlayliststTracks {
    key parent  : Association to CustomPlaylists;
    key trackID : Integer64;
        details : Association to DeezerDetails
                      on  details.itemID      = trackID
                      and details.itemType.id = 1;
}

entity DeezerDetails {
    key itemID      : Integer64;
    key itemType    : Association to FavoritesTypes;
        image       : String;
        description : String;
        title       : String;
        artist      : String;
        releaseDate : String;
}
