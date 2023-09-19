import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';

export enum FavouritesTypes {
  Track = 1,
  Playlist = 2,
  Radio = 3,
}

export interface UserPersonalization {
  id: string;
  username: string;
  isActivated: boolean;
  iconID: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  personalization!: UserPersonalization;

  constructor(
    private http: HttpClient,
  ) {
    this.setPersonalization();
  }

  setPersonalization() {
    this.http.get(`${environment.apiUrl}app/Personalizations`).subscribe((res) => {
      const response = (res as { value: UserPersonalization[] });
      if (response.value.length) {
        this.personalization = response.value[0];
        console.log(this.personalization);
      } else {
        this.http.post(`${environment.apiUrl}app/Personalizations`, {}).pipe(
          switchMap(() => this.http.get(`${environment.apiUrl}app/Personalizations`)),
        ).subscribe((res1) => {
          const response = (res1 as { value: UserPersonalization[] });
          this.personalization = response.value[0];
        });
      }
    });
  }

  addToFavourites(id: number, typeID: FavouritesTypes) {
    this.http.post(`${environment.apiUrl}app/Favourites`, { itemID: id, itemType_id: typeID }).subscribe();
  }

  removeFromFavourites(id: number, typeID: FavouritesTypes) {
    this.http.delete(`${environment.apiUrl}app/Favourites(itemID=${id},itemType_id=${typeID},parent_id=${this.personalization.id}`).subscribe();
  }
}
