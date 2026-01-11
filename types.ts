
export interface AngleImage {
  label: string;
  url: string;
}

export interface Figure {
  id: string;
  name: string;
  character: string;
  source: string;
  sourceUrl?: string; // Link to the original source
  category: string; // Dynamic category name
  description: string;
  angles: AngleImage[];
  thumbnail: string;
  isUserAdded?: boolean;
  isLocked?: boolean;
}

export interface BookmarkFolder {
  id: string;
  name: string;
  figureIds: string[];
}
