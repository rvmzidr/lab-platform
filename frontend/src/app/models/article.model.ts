export interface Article {
  id?: number;
  title: string;
  abstract?: string;
  authors: string;
  keywords?: string;
  publicationDate?: string;
  journal?: string;
  doi?: string;
  pdfUrl?: string;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'members_only';
  userId: number;
  projectId?: number | null;
  teamId?: number | null;
  createdAt?: string;
  updatedAt?: string;
  
  // Associations
  author?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  project?: {
    id: number;
    name: string;
    fundingSource?: string;
    budget?: number;
    startDate?: string;
    endDate?: string;
  };
  team?: {
    id: number;
    name: string;
    expertise?: string;
    objectives?: string;
  };
}

export interface ArticleResponse {
  success: boolean;
  message: string;
  data: Article | {
    articles: Article[];
    totalArticles: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface ArticleFilters {
  year?: number;
  teamId?: number;
  projectId?: number;
  search?: string;
  status?: 'draft' | 'published' | 'archived';
  visibility?: 'public' | 'members_only';
  page?: number;
  limit?: number;
}
