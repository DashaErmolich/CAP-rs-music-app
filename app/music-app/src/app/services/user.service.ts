import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable, map,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { API_PATHS } from '../enums/srv-paths.enum';
import { CommonResponse, PersonalizationsResponseFull } from '../models/srv-response.models';

export enum FavoritesTypes {
  Track = 1,
  Playlist = 2,
  Radio = 3,
  Album = 4,
  Artist = 5,
}

export interface User {
  id: string;
  username: string;
  isActivated: boolean;
  iconID: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user!: User;

  likedTracks!: number[];

  constructor(
    private http: HttpClient,
  ) {}

  setInitPersonalizations(): void {
    this.http.post(`${environment.apiUrl}${API_PATHS.PERSONALIZATIONS}`, {});
  }

  getPersonalizationsFull(): Observable<PersonalizationsResponseFull> {
    const url = `${environment.apiUrl}${API_PATHS.PERSONALIZATIONS}?$expand=${API_PATHS.PERSONALIZATIONS_FAVORITES},${API_PATHS.PERSONALIZATIONS_CUSTOM_PLAYLISTS}`;
    return this.http
      .get<CommonResponse>(url)
      .pipe(
        map((res: CommonResponse) => res.value[0] as PersonalizationsResponseFull),
      );
  }

  addToFavorites(id: number, typeID: FavoritesTypes) {
    this.http.post(`${environment.apiUrl}${API_PATHS.FAVORITES}`, { itemID: id, itemType_id: typeID }).subscribe();
  }

  removeFromFavorites(itemID: number, typeID: FavoritesTypes, userID: string) {
    this.http.delete(`${environment.apiUrl}${API_PATHS.FAVORITES}(itemID=${itemID},itemType_id=${typeID},parent_id='${userID}')`).subscribe();
  }
}
