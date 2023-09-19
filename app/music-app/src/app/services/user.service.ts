import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export enum FavouritesTypes {
  Track,
  Playlist,
  Radio
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
  ) { }

  setUserFavourites(id: number, typeID: FavouritesTypes): Observable<any> {
    this.http.post('app/like', { typeID: typeID });
    return this.http.post('app/Favourites', { itemID: id, itemType_id: typeID })
  }
}
