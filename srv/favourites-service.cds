using user from '../db/schema';

@path: '/user'
service FavouritesService @(requires: 'authenticated-user') {
    entity Favourites as select from user.Favourites {
        *
    } where userID = $user;
    entity FavouritesTypes as projection on user.FavouritesTypes;
    // entity Info as select from user.Info {
    //     *
    // } where id = $user;
    entity Info as projection on user.Info where id = $user;
    entity CustomPlaylists  as select from user.CustomPlaylist {
        *
    } where creator = $user;
    entity CustomPlayliststTracks as projection on user.CustomPlayliststTracks;
}