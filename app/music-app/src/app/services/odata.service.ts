import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable, iif, map, of, switchMap,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { API_PATHS } from '../enums/srv-paths.enum';
import {
  CommonResponse, CustomPlaylistsResponse, FavoritesResponse, PersonalizationsResponse,
} from '../models/srv-response.models';

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
export class ODataService {
  constructor(
    private http: HttpClient,
  ) {}

  getPersonalizationsResponse(): Observable<CommonResponse> {
    return this.http.get<CommonResponse>(`${environment.apiUrl}${API_PATHS.PERSONALIZATIONS}`);
  }

  setInitPersonalizations(): Observable<CommonResponse> {
    return this.http.post(`${environment.apiUrl}${API_PATHS.PERSONALIZATIONS}`, {}).pipe(
      switchMap(() => this.getPersonalizationsResponse()),
    );
  }

  getPersonalizations(): Observable<PersonalizationsResponse> {
    const url = `${environment.apiUrl}${API_PATHS.PERSONALIZATIONS}`;
    return this.http
      .get<CommonResponse>(url)
      .pipe(
        // eslint-disable-next-line max-len
        switchMap((res: CommonResponse) => iif(() => !res.value[0], this.setInitPersonalizations(), of(res))),
        map((res) => res.value[0] as PersonalizationsResponse),
      );
  }

  getFavorites(): Observable<FavoritesResponse[]> {
    const url = `${environment.apiUrl}${API_PATHS.FAVORITES}`;
    return this.http
      .get<CommonResponse>(url)
      .pipe(
        map((res: CommonResponse) => res.value as FavoritesResponse[]),
      );
  }

  addToFavorites(id: number, typeID: FavoritesTypes) {
    this.http.post(`${environment.apiUrl}${API_PATHS.FAVORITES}`, { itemID: id, itemType_id: typeID }).subscribe();
  }

  removeFromFavorites(itemID: number, typeID: FavoritesTypes, userID: string) {
    this.http.delete(`${environment.apiUrl}${API_PATHS.FAVORITES}(itemID=${itemID},itemType_id=${typeID},parent_id='${userID}')`).subscribe();
  }

  getCustomPlaylistsFull(): Observable<CustomPlaylistsResponse[]> {
    return this.http.get<CommonResponse>(`${environment.apiUrl}${API_PATHS.CUSTOM_PLAYLISTS}?$expand=${API_PATHS.CUSTOM_PLAYLISTS_TRACKS}`)
      .pipe(map((res: CommonResponse) => res.value as CustomPlaylistsResponse[]));
  }

  // eslint-disable-next-line max-len
  createCustomPlaylist(playlistTitle: string, tracks: number[]): Observable<CustomPlaylistsResponse> {
    const playlistTracks = tracks.map((item) => ({ trackID: item }));
    return this.http.post<CustomPlaylistsResponse>(`${environment.apiUrl}${API_PATHS.CUSTOM_PLAYLISTS}`, { title: playlistTitle, tracks: playlistTracks });
  }

  deleteCustomPlaylist(id: string) {
    this.http.delete(`${environment.apiUrl}${API_PATHS.CUSTOM_PLAYLISTS}(${id})`).subscribe();
  }

  setPersonalization(newUsername: string, userIconId: number, userID: string): void {
    this.http.patch(`${environment.apiUrl}${API_PATHS.PERSONALIZATIONS}('${userID}')`, {
      username: newUsername,
      iconID: userIconId,
    }).subscribe();
  }
}
