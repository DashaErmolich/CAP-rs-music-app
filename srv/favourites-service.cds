using user from '../db/shema';

service FavouritesService @(requires: 'authenticated-user') {
    entity Favourites as select from user.Favourites {
        *
    } where userID = $user
}