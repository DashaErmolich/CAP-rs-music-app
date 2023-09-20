using music.app as my from '../db/schema';

@path: '/app'
service AppService @(requires: 'authenticated-user') {
    entity Favorites as projection on my.Favorites where parent.id = $user;
    entity Personalizations as projection on my.Personalizations where id = $user;
    entity CustomPlaylists as projection on my.CustomPlaylists where createdBy = $user;
    entity CustomPlayliststTracks as projection on my.CustomPlayliststTracks;
    action like(typeID: Int16);
}

@path: '/admin'
service AdminService @(requires: 'admin') {
    entity Favorites as projection on my.Favorites;
    
    entity FavoritesTypes as projection on my.FavoritesTypes;
    
    entity Personalizations as projection on my.Personalizations;
    
    entity CustomPlaylists as projection on my.CustomPlaylists;
    
    entity CustomPlayliststTracks as projection on my.CustomPlayliststTracks;
}