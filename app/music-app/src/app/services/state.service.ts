/* eslint-disable default-case */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUserModel } from 'src/app/models/user-model.models';
import { Router } from '@angular/router';
import { ITrackResponse } from '../models/api-response.models';
import { ILikedSearchResults, LikedSearchResults } from '../models/search.models';
import { LocalStorageService } from './local-storage.service';
import { ITrackListInfo } from '../models/audio-player.models';
import { UtilsService } from './utils.service';
import { ICustomPlaylistModel } from '../models/user-model.models';
import { AudioService } from './audio.service';
import { FavoritesTypes, User, ODataService } from './odata.service';
import { CustomPlaylistsResponse, FavoritesResponse, PersonalizationsResponse } from '../models/srv-response.models';

@Injectable({
  providedIn: 'root',
})

export class StateService {
  trackList$ = new BehaviorSubject<Partial<ITrackResponse>[]>([]);

  playingTrackIndex$ = new BehaviorSubject<number | null>(null);

  isEqualizerShown$ = new BehaviorSubject<boolean>(false);

  user!: IUserModel;

  newUser!: User;

  isAuthorized = false;

  userName$ = new BehaviorSubject<string>('');

  userIconId$ = new BehaviorSubject<number>(11);

  searchValue$ = new BehaviorSubject<string>('');

  likedTracks$ = new BehaviorSubject<number[]>([]);

  likedSearchResults$ = new BehaviorSubject<ILikedSearchResults>({
    album: [],
    artist: [],
    playlist: [],
    radio: [],
  });

  isNavigationMenuShown$ = new BehaviorSubject<boolean>(false);

  isSettingsMenuShown$ = new BehaviorSubject<boolean>(false);

  isSearchInputShown$ = new BehaviorSubject<boolean>(false);

  isCurrentTrackListShown$ = new BehaviorSubject<boolean>(false);

  customPlaylists$ = new BehaviorSubject<ICustomPlaylistModel[]>([]);

  isSame$ = new BehaviorSubject<boolean>(false);

  constructor(
    private storage: LocalStorageService,
    private myUtils: UtilsService,
    private myAudio: AudioService,
    private userService: ODataService,
    private myRouter: Router,
  ) {
    const trackListInfo: ITrackListInfo | null = this.storage.getTrackListInfo();

    if (trackListInfo !== null) {
      this.setTrackListInfo(trackListInfo.trackList, trackListInfo.currentTrackIndex);
    }

    userService.getPersonalizations().subscribe((res: PersonalizationsResponse) => {
      this.newUser = res;
      this.userName$.next(res.username);
      this.userIconId$.next(res.iconID);
    });

    userService.getFavorites().subscribe((res: FavoritesResponse[]) => {
      this.likedTracks$.next(res
        .filter((item) => item.itemType_id === FavoritesTypes.Track)
        .map((item) => item.itemID));
      this.likedSearchResults$.next({
        album: res
          .filter((item) => item.itemType_id === FavoritesTypes.Album)
          .map((item) => item.itemID),
        artist: res
          .filter((item) => item.itemType_id === FavoritesTypes.Artist)
          .map((item) => item.itemID),
        playlist: res
          .filter((item) => item.itemType_id === FavoritesTypes.Playlist)
          .map((item) => item.itemID),
        radio: res
          .filter((item) => item.itemType_id === FavoritesTypes.Radio)
          .map((item) => item.itemID),
      });
    });

    this.userService.getCustomPlaylistsFull().subscribe((res: CustomPlaylistsResponse[]) => {
      this.customPlaylists$.next(res.map((item: CustomPlaylistsResponse) => ({
        id: item.ID,
        title: item.title,
        creator: {
          name: item.createdBy,
        },
        tracks: {
          data: item.tracks.map((track) => track.trackID),
        },
        nb_tracks: item.tracks.length,
      })));
    });
  }

  setTrackListInfo(tracks: Partial<ITrackResponse>[], index: number) {
    this.trackList$.next(tracks);
    this.playingTrackIndex$.next(index);
    this.storage.setTrackListInfo(tracks, index);
  }

  setPlayingTrackIndex(index: number) {
    this.playingTrackIndex$.next(index);
    this.storage.setTrackListInfo(this.trackList$.value, index);
  }

  setAuthorized(authStatus: boolean) {
    this.isAuthorized = authStatus;
  }

  setUserToState(user: IUserModel) {
    this.user = user;
  }

  setEqualizerVisibility(isVisible: boolean): void {
    this.isEqualizerShown$.next(isVisible);
  }

  setUserData(userName: string, userIconId: number, isUserUpdateNeeded: boolean = true) {
    this.userName$.next(userName);
    this.userIconId$.next(userIconId);
    if (isUserUpdateNeeded) {
      this.updateUserData();
    }
  }

  setSearchParam(searchValue: string) {
    this.searchValue$.next(searchValue);
  }

  setLikedTrack(trackDeezerId: number): void {
    const likedTracks = this.likedTracks$.value;
    likedTracks.push(trackDeezerId);
    this.likedTracks$.next(likedTracks);
    this.userService.addToFavorites(trackDeezerId, FavoritesTypes.Track);
  }

  removeLikedTrack(trackDeezerId: number): void {
    const likedTracks = this.likedTracks$.value;
    const trackIndex = likedTracks.findIndex((trackId) => trackId === trackDeezerId);
    if (trackIndex >= 0) {
      likedTracks.splice(trackIndex, 1);
    }
    this.likedTracks$.next(likedTracks);
    this.userService.removeFromFavorites(trackDeezerId, FavoritesTypes.Track, this.newUser.id);
  }

  setNavigationMenuVisibility(isVisible: boolean): void {
    this.isNavigationMenuShown$.next(isVisible);
  }

  setSettingsMenuVisibility(isVisible: boolean): void {
    this.isSettingsMenuShown$.next(isVisible);
  }

  setSearchInputVisibility(isVisible: boolean): void {
    this.isSearchInputShown$.next(isVisible);
  }

  setLikedSearchResult(type: LikedSearchResults, id: number): void {
    const likedSearchResults = this.likedSearchResults$.value;
    likedSearchResults[type].push(id);
    this.likedSearchResults$.next(likedSearchResults);
    let typeID: number;

    switch (type) {
      case 'playlist':
        typeID = 2;
        break;
      case 'radio':
        typeID = 3;
        break;
      case 'album':
        typeID = 4;
        break;
      case 'artist':
        typeID = 5;
        break;
    }
    this.userService.addToFavorites(id, typeID);
  }

  removeLikedSearchResult(type: LikedSearchResults, id: number): void {
    const likedSearchResults = this.likedSearchResults$.value;
    const searchResultIndex = likedSearchResults[type]
      .findIndex((searchResultId) => searchResultId === id);

    if (searchResultIndex >= 0) {
      likedSearchResults[type].splice(searchResultIndex, 1);
    }
    this.likedSearchResults$.next(likedSearchResults);
    let typeID: number;

    switch (type) {
      case 'playlist':
        typeID = 2;
        break;
      case 'radio':
        typeID = 3;
        break;
      case 'album':
        typeID = 4;
        break;
      case 'artist':
        typeID = 5;
        break;
    }
    this.userService.removeFromFavorites(id, typeID, this.newUser.id);
  }

  updateUserData(): void {
    const updatedUser: IUserModel = { ...this.user };
    updatedUser.username = this.userName$.value;
    updatedUser.userIconId = this.userIconId$.value;
    updatedUser.userFavorites = {
      tracks: this.likedTracks$.value,
      albums: this.likedSearchResults$.value.album,
      artists: this.likedSearchResults$.value.artist,
      playlists: this.likedSearchResults$.value.playlist,
      radio: this.likedSearchResults$.value.radio,
    };
    updatedUser.customPlaylists = this.customPlaylists$.value;
    // this.authService.setUser(updatedUser).subscribe((res) => {
    //   this.user = res;
    // });
  }

  setUserDataFromService(userData: IUserModel): void {
    this.setUserData(userData.username, userData.userIconId, false);
    this.likedTracks$.next(userData.userFavorites.tracks);
    this.likedSearchResults$.next({
      album: userData.userFavorites.albums,
      artist: userData.userFavorites.artists,
      playlist: userData.userFavorites.playlists,
      radio: userData.userFavorites.radio,
    });
    this.customPlaylists$.next(userData.customPlaylists);
  }

  setCurrentTrackListVisibility(isVisible: boolean) {
    this.isCurrentTrackListShown$.next(isVisible);
  }

  setCustomPlaylist(playlist: ICustomPlaylistModel) {
    const customPlaylists: ICustomPlaylistModel[] = this.customPlaylists$.value;
    this.userService.createCustomPlaylist(playlist.title, playlist.tracks.data).subscribe((res) => {
      customPlaylists.push({
        id: res.ID,
        title: res.title,
        creator: {
          name: res.createdBy,
        },
        tracks: {
          data: res.tracks.map((item) => item.trackID),
        },
        nb_tracks: res.tracks.length,
      });
      this.customPlaylists$.next(customPlaylists);
      this.myRouter.navigate([`music/user-play-list/${res.ID}`]);
    });
  }

  deleteCustomPlaylist(playlistId: string) {
    const customPlaylists: ICustomPlaylistModel[] = this.customPlaylists$.value;
    const searchResultIndex = customPlaylists
      .findIndex((searchResultId) => searchResultId.id === playlistId);

    if (searchResultIndex >= 0) {
      customPlaylists.splice(searchResultIndex, 1);
    }
    this.customPlaylists$.next(customPlaylists);
    this.userService.deleteCustomPlaylist(playlistId);
  }

  resetPlayingTrackList() {
    this.trackList$.next([]);
    this.playingTrackIndex$.next(null);
    this.myAudio.resetState();
  }
}
