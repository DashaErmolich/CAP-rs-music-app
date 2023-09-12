namespace user;
using { User } from '@sap/cds/common.cds';

entity Favourites {
    key userID: User @cds.on.insert : $user;
    key id: Integer;
    key type: String;
}