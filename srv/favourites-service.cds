using user from '../db/shema';

@path: '/user'
service FavouritesService @(requires: 'authenticated-user') {
    entity Favourites as select from user.Favourites {
        *
    } where userID = $user
}