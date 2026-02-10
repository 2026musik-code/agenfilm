export interface Drama {
  bookId: string;
  bookName: string;
  coverWap: string;
  bookCover?: string; // Some endpoints return this instead of coverWap
  chapterCount?: number;
  introduction?: string;
  tags?: string[];
  playCount?: string;
  corner?: {
    cornerType: number;
    name: string;
    color: string;
  };
}

export interface DramaColumn {
  columnId: number;
  title: string;
  subTitle?: string;
  style?: string;
  bookList: Drama[];
}

export interface DramaData {
  bannerList: unknown[];
  watchHistory: unknown[];
  columnVoList: DramaColumn[];
}

export interface DramaResponse {
  status: boolean;
  creator: string;
  data: DramaData;
}

// For endpoints that return a list of dramas directly
export interface DramaListResponse {
  status: boolean;
  creator: string;
  data: Drama[];
}

export interface VideoPath {
  quality: number;
  videoPath: string;
}

export interface CdnItem {
  cdnDomain: string;
  isDefault: number;
  videoPathList: VideoPath[];
}

export interface Episode {
  chapterId: string;
  chapterIndex: number;
  isCharge: number;
  chapterName: string;
  cdnList: CdnItem[];
}

export interface EpisodeResponse {
  status: boolean;
  creator: string;
  data: Episode[];
}
