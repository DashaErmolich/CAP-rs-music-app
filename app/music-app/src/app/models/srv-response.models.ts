export interface CommonResponse {
  value: any[];
}

export interface PersonalizationsResponseFull {
  id: string;
  username: string;
  isActivated: boolean;
  iconID: number;
  favorites: FavoritesResponse[];
  customPlaylists: CustomPlaylistsResponse[];
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
}
