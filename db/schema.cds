using {User} from '@sap/cds/common.cds';
using {
    cuid,
    managed
} from '@sap/cds/common';

namespace music.app;

entity Personalizations {
    key id              : User              @cds.on.insert: $user;
        username        : String default 'username';
        isActivated     : Boolean default true;
        iconID          : Integer default 1 @assert.range : [
            1,
            10
        ];
        favorites       : Composition of many Favourites
                              on favorites.parent = $self;
        customPlaylists : Composition of many CustomPlaylists
                              on customPlaylists.createdBy = $self.id;
}

entity Favourites {
    key parent_id : type of Personalizations : id;
    key itemID    : Integer64;
    key itemType  : Association to FavouritesTypes @assert.range: [
                        1,
                        5
                    ];
        parent    : Association to Personalizations
                        on parent.id = parent_id;
}

entity FavouritesTypes {
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
    key trackID : Integer;
}
