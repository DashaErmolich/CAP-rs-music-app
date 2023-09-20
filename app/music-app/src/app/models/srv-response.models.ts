export interface CommonResponse {
  value: any[];
}

export interface PersonalizationsResponse {
  id: string;
  username: string;
  isActivated: boolean;
  iconID: number;
}

export interface FavoritesResponse {
  parent_id: string;
  itemID: number;
  itemType_id: number;
}

export interface CustomPlaylistsResponse {
  ID: string;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
  title: string;
  tracks: TracksResponse[];
}

export interface TracksResponse {
  parent_id: string;
  trackID: number;
}
