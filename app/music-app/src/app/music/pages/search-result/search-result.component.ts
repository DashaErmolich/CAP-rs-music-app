import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Subject, Subscription, filter, takeUntil,
} from 'rxjs';
import { DEFAULT_SRC } from 'src/app/constants/constants';
import { SearchType } from 'src/app/enums/endpoints';
import {
  IAlbumResponse,
  IArtistResponse,
  IPlayListResponse,
  IRadioResponse,
  ITrackResponse,
} from 'src/app/models/api-response.models';
import {
  ILikedSearchResults,
  LikedSearchResults,
} from 'src/app/models/search.models';
import { AudioService } from 'src/app/services/audio.service';
import { DeezerRestApiService } from 'src/app/services/deezer-api.service';
import { StateService } from 'src/app/services/state.service';
import { isNotNullOrUndefined } from 'src/app/helpers/helpers';
import { ResponsiveService } from '../../../services/responsive.service';
import { ICustomPlaylistModel } from '../../../models/user-model.models';
import { RandomColorHelper } from '../../../helpers/random-color-helper';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent extends RandomColorHelper implements OnInit, OnDestroy {
  private onDestroy$ = new Subject();

  resultId!: string;

  result!:
  | Partial<IArtistResponse>
  | Partial<IAlbumResponse>
  | Partial<IPlayListResponse>
  | Partial<IRadioResponse>
  | ICustomPlaylistModel;

  result$!: Subscription;

  tracks: Partial<ITrackResponse>[] = [];

  tracks$!: Subscription;

  loading = true;

  tracksOfState: Partial<ITrackResponse>[] = [];

  trackList$!: Subscription;

  isPlay$!: Subscription;

  isPlay!: boolean;

  isPause$!: Subscription;

  routeParams$!: Subscription;

  isPause!: boolean;

  resultType!: string;

  isFirstPlay!: boolean;

  imgSrc!: string;

  title!: string;

  type!: LikedSearchResults;

  descriptionTitle!: string;

  descriptionSubTitle!: string;

  descriptionTitleInfo!: string;

  descriptionSubTitleInfo!: string;

  artistImg!: string;

  artistName!: string;

  albumRelease!: string;

  artistId!: number;

  isLiked!: boolean;

  likedSearchResults!: ILikedSearchResults;

  likedSearchResults$!: Subscription;

  isSmall = false;

  isHandset = false;

  isSmall$ = new Subscription();

  isHandset$ = new Subscription();

  subscriptions: Subscription[] = [];

  typeToShow!: string;

  isLikeButtonShown = true;

  isSame!: boolean;

  isResultNotFound!: boolean;

  constructor(
    private myState: StateService,
    private myAudio: AudioService,
    private deezerRestApiService: DeezerRestApiService,
    private route: ActivatedRoute,
    private responsive: ResponsiveService,
    private myRouter: Router,
    myUtils: UtilsService,
  ) {
    super(myUtils);
  }

  ngOnInit(): void {
    this.isFirstPlay = true;

    this.route.params
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((params) => {
        [this.resultType] = Object.keys(params);
        this.resultId = params[this.resultType];
        switch (this.resultType) {
          case SearchType.artist:
            this.getArtist(Number(this.resultId));
            break;
          case SearchType.album:
            this.getAlbum(Number(this.resultId));
            break;
          case SearchType.playlist:
            this.getPlaylist(Number(this.resultId));
            break;
          case SearchType.radio:
            this.getRadio(Number(this.resultId));
            break;
          case SearchType.userPlaylist:
            this.getUserPlaylist(this.resultId);
            break;
          default:
            break;
        }
      });

    this.myState.trackList$.pipe(takeUntil(this.onDestroy$)).subscribe((tracks) => {
      this.tracksOfState = tracks;
      this.isPlayThisTrackList();
    });
    this.myAudio.isPause$.pipe(takeUntil(this.onDestroy$)).subscribe((res) => {
      this.isPause = res;
    });
    this.myState.likedSearchResults$
      .pipe(takeUntil(this.onDestroy$), filter(isNotNullOrUndefined))
      .subscribe(
        (res) => {
          this.likedSearchResults = res;
          this.isSearchResultLiked();
        },
      );
    this.responsive.isSmall$.pipe(takeUntil(this.onDestroy$)).subscribe((data) => {
      this.isSmall = data;
    });
    this.responsive.isHandset$.pipe(takeUntil(this.onDestroy$)).subscribe((data) => {
      this.isHandset = data;
    });

    this.myAudio.isPlay$
      .pipe(takeUntil(this.onDestroy$)).subscribe((res) => { this.isPlay = res; });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

  getArtist(id: number) {
    this.result$ = this.deezerRestApiService.getArtist(id).subscribe((res) => {
      this.isResultNotFound = false;
      try {
        this.result = res;
        this.type = res.type as LikedSearchResults;
        if (this.type === 'artist') {
          this.typeToShow = 'search.results.artist';
          this.descriptionTitle = 'search.results.description.artist.albums';
          this.descriptionSubTitle = 'search.results.description.artist.fans';
        }
        this.imgSrc = res.picture_medium ? res.picture_medium : DEFAULT_SRC;
        this.title = res.name;
        this.descriptionTitleInfo = `: ${res.nb_album}`;
        this.descriptionSubTitleInfo = `: ${res.nb_fan}`;
        this.loading = false;
        this.isSearchResultLiked();
      } catch (error) {
        this.isResultNotFound = true;
      }
    });

    this.tracks$ = this.deezerRestApiService
      .getTracksByArtist(id)
      .subscribe((res) => {
        this.tracks = res.data;
        this.loading = false;
        this.isPlayThisTrackList();
      });
  }

  getAlbum(id: number) {
    this.result$ = this.deezerRestApiService.getAlbum(id).subscribe((res) => {
      this.isResultNotFound = false;
      try {
        this.result = res;
        this.type = res.type as LikedSearchResults;
        if (this.type === 'album') {
          this.typeToShow = 'search.results.album';
        }
        this.imgSrc = res.cover_medium ? res.cover_medium : DEFAULT_SRC;
        this.title = res.title;
        this.tracks = res.tracks.data;
        this.loading = false;
        this.artistImg = res.artist.picture_small!;
        this.artistName = res.artist.name!;
        this.albumRelease = res.release_date.slice(0, 4);
        this.artistId = Number(res.artist.id);
        this.isSearchResultLiked();
        this.isPlayThisTrackList();
      } catch (error) {
        this.isResultNotFound = true;
      }
    });
  }

  getPlaylist(id: number) {
    this.result$ = this.deezerRestApiService
      .getPlayListTracks(id)
      .subscribe((res) => {
        this.isResultNotFound = false;
        try {
          this.result = res;
          this.type = res.type as LikedSearchResults;
          if (this.type === 'playlist') {
            this.typeToShow = 'search.results.playlist';
            this.descriptionTitle = 'search.results.description.playlist.creator';
            this.descriptionSubTitle = 'search.results.description.playlist.songs';
          }
          this.imgSrc = res.picture_medium ? res.picture_medium : DEFAULT_SRC;
          this.title = res.title;
          this.tracks = res.tracks.data;
          this.descriptionTitleInfo = `: ${res.creator.name}`;
          this.descriptionSubTitleInfo = `: ${res.nb_tracks}`;
          this.loading = false;
          this.isSearchResultLiked();
          this.isPlayThisTrackList();
        } catch (error) {
          this.isResultNotFound = true;
        }
      });
  }

  getRadio(id: number) {
    this.result$ = this.deezerRestApiService.getRadio(id).subscribe((res) => {
      this.isResultNotFound = false;
      try {
        this.result = res;
        this.type = res.type as LikedSearchResults;
        if (this.type === 'radio') {
          this.typeToShow = 'search.results.radio';
        }
        this.imgSrc = res.picture_medium ? res.picture_medium : DEFAULT_SRC;
        this.title = res.title;
        this.loading = false;
        this.isSearchResultLiked();
      } catch (error) {
        this.isResultNotFound = true;
      }
    });

    this.tracks$ = this.deezerRestApiService
      .getTracksByRadio(Number(id))
      .subscribe((res) => {
        this.tracks = res.data;
        this.loading = false;
        this.isPlayThisTrackList();
      });
  }

  playPause() {
    if (this.isSame && this.isPlay) {
      this.myAudio.pause();
    } else if (this.isSame
      && !this.isPlay
      && this.myState.playingTrackIndex$.value !== null) {
      this.myAudio.playTrack(
        String(this.tracksOfState[this.myState.playingTrackIndex$.value!].preview),
      );
    } else if (!this.isSame) {
      this.myState.setTrackListInfo(this.tracks, 0);
      this.myAudio.playTrack(String(this.tracksOfState[0].preview));
    }
  }

  likeSearchResult() {
    this.isLiked = !this.isLiked;
    if (this.isLiked && typeof this.result.id === 'number') {
      this.myState.setLikedSearchResult(this.type, this.result.id);
    } else if (typeof this.result.id === 'number') {
      this.myState.removeLikedSearchResult(this.type, this.result.id);
    }
  }

  isSearchResultLiked() {
    this.isLiked = this.likedSearchResults[this.type]?.includes(Number(this.result.id));
    return this.isLiked;
  }

  getUserPlaylist(id: string) {
    this.isLikeButtonShown = false;
    this.result$ = this.myState.customPlaylists$.subscribe((res) => {
      this.isResultNotFound = false;
      try {
        const playlist = res.find((item) => item.id === id);
        if (playlist) {
          this.result = playlist;
          this.typeToShow = 'search.results.custom-playlist';
          this.descriptionTitle = 'search.results.description.playlist.creator';
          this.descriptionSubTitle = 'search.results.description.playlist.songs';
          this.imgSrc = 'assets/icons/note.svg';
          this.title = playlist.title;
          playlist.tracks.data.forEach((track) => {
            this.tracks$ = this.deezerRestApiService.getTrack(track).subscribe((data) => {
              this.tracks.push(data);
              this.isPlayThisTrackList();
            });
          });
          this.descriptionTitleInfo = `: ${this.myState.userName$.value}`;
          this.descriptionSubTitleInfo = `: ${playlist.nb_tracks}`;
          this.loading = false;
        }
      } catch (error) {
        this.isResultNotFound = true;
      }
    });
  }

  deleteCustomPlayList() {
    if (this.result.id && typeof (this.result.id) === 'string') {
      this.myState.deleteCustomPlaylist(this.result.id);
      this.myRouter.navigate(['music/home']);
    }
  }

  isPlayThisTrackList() {
    const tracks = this.tracks.sort((a, b) => a.id! - b.id!);
    const tracksOfState = this.tracksOfState.sort((a, b) => a.id! - b.id!);
    const isSame = (tracks.length === tracksOfState.length)
    // eslint-disable-next-line array-callback-return, prefer-arrow-callback
     && tracks.every(function (element, index) {
       return element.id === tracksOfState[index].id;
     });
    this.isSame = isSame;
  }
}
