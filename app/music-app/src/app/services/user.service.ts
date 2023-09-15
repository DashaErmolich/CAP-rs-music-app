import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) { }

  setUserFavourites(id: number, type: 'radio' | 'song' | 'playlist' ): Observable<any> {
    return this.http.post('user/Favourites', { id: id, type: type })
  }
}
