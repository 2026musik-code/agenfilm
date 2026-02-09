export interface Drama {
  bookId: string;
  bookName: string;
  coverWap: string;
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
