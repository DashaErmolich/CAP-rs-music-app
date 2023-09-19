using music.app as my from '../db/schema';

@path: '/app'
service AppService @(requires: 'authenticated-user') {
    entity Favourites as projection on my.Favourites where parent.id = $user;
    entity Personalizations as projection on my.Personalizations where id = $user;
    entity CustomPlaylists as projection on my.CustomPlaylists where createdBy = $user;
    entity CustomPlayliststTracks as projection on my.CustomPlayliststTracks;
    action like(typeID: Int16);
}

@path: '/admin'
service AdminService @(requires: 'admin') {
    entity Favourites as projection on my.Favourites;
    
    entity FavouritesTypes as projection on my.FavouritesTypes;
    
    entity Personalizations as projection on my.Personalizations;
    
    entity CustomPlaylists as projection on my.CustomPlaylists;
    
    entity CustomPlayliststTracks as projection on my.CustomPlayliststTracks;
}