export interface TeamSeason {
  id: string;
  teamId: string;
  name: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamSeasonFormValue {
  name: string;
  startDate: string;
  endDate?: string;
}
