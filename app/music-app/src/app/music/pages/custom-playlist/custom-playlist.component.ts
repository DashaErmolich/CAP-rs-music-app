/* eslint-disable import/no-extraneous-dependencies */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { Router } from '@angular/router';
import { DeezerRestApiService } from '../../../services/deezer-api.service';
import { ITrackResponse } from '../../../models/api-response.models';
import { ResponsiveService } from '../../../services/responsive.service';
import { ICustomPlaylistModel } from '../../../models/user-model.models';
import { StateService } from '../../../services/state.service';
import { Limits } from '../../../enums/endpoints';

const DEFAULT_PLAYLIST_NAME = 'My playlist';

@Component({
  selector: 'app-custom-playlist',
  templateUrl: './custom-playlist.component.html',
  styleUrls: ['./custom-playlist.component.scss'],
})
export class CustomPlaylistComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject();

  playListName = DEFAULT_PLAYLIST_NAME;

  tracks: Partial<ITrackResponse>[] = [];

  subscriptions: Subscription[] = [];

  isSmall = false;

  isHandset = false;

  isExtraSmall = false;

  isSmallSubscription = new Subscription();

  isHandsetSubscription = new Subscription();

  isExtraSmallSubscription = new Subscription();

  customPlaylistTracks: number[] = [];

  searchControlSubscription = new Subscription();

  searchControl: FormControl = new FormControl();

  nameControl: FormControl = new FormControl(
    this.playListName,
    [
      Validators.required,
      Validators.maxLength(20),
    ],
  );

  searchValue = '';

  searchSubscription = new Subscription();

  nameSubscription = new Subscription();

  isLoading = true;

  limitTracks: number = Limits.tracks;

  index = 0;

  constructor(
    private myDeezer: DeezerRestApiService,
    private responsive: ResponsiveService,
    private myState: StateService,
    private myRouter: Router,
  ) { }

  ngOnInit(): void {
    this.responsive.isSmall$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.isSmall = data;
      });

    this.responsive.isHandset$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.isHandset = data;
      });

    this.responsive.isExtraSmall$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.isExtraSmall = data;
      });

    this.searchControl.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res) => {
        this.isLoading = true;
        this.searchValue = res;
        this.getSearch();
        this.isLoading = false;
      });

    this.nameControl.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res) => {
        this.playListName = res;
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

  getSearch() {
    this.searchSubscription = this.myDeezer
      .getSearch(this.searchValue, this.index, this.limitTracks).subscribe((response) => {
        this.tracks = [];
        try {
          const foundTracks = response.data.length
            ? response.data.filter((item) => item.id !== undefined)
            : [];
          if (foundTracks.length) {
            this.tracks = foundTracks;
          }
        } catch (error) { /* empty */ }
      });
  }

  saveCustomPlayList() {
    const playlist: ICustomPlaylistModel = {
      id: Guid.create().toString(),
      title: this.playListName,
      creator: {
        name: this.myState.userName$.value,
      },
      tracks: {
        data: this.customPlaylistTracks,
      },
      nb_tracks: this.customPlaylistTracks.length,
    };
    this.myState.setCustomPlaylist(playlist);
    this.playListName = DEFAULT_PLAYLIST_NAME;
    this.searchControl.setValue('');
    this.customPlaylistTracks = [];
    // this.myRouter.navigate([`music/user-play-list/${playlist.id}`]);
  }

  getMore() {
    this.limitTracks += Limits.tracks;
    this.getSearch();
  }
}
