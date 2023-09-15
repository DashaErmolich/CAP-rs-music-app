namespace user;
using { User } from '@sap/cds/common.cds';
using { cuid } from '@sap/cds/common';

entity Favourites {
    key userID: User @cds.on.insert : $user;
    key id: Integer;
    key type_ID : Int16;
    type: Association to FavouritesTypes on type.ID = type_ID;
}

entity FavouritesTypes {
    key ID: Int16;
    name: String;
}

entity Info {
    key id: User @cds.on.insert : $user;
    username: User @cds.on.insert : $user;
    isActivated: Boolean default true;
    userIconId: Integer;
    userFavorites: Association to many Favourites on userFavorites.userID = $self.id;
    customPlaylists: Association to many CustomPlaylist on customPlaylists.creator = $self.id;
}

entity CustomPlayliststTracks {
    key playlist_ID: UUID;
    key trackID: Integer;
}

entity CustomPlaylist: cuid {
    creator: User @cds.on.insert : $user;
    title: String;
    tracks: Association to many CustomPlayliststTracks on tracks.playlist_ID = $self.ID;
}
