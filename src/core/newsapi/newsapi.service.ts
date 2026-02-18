import { Injectable, BadRequestException } from '@nestjs/common';

interface NewsAPIArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

@Injectable()
export class NewsApiService {
  private readonly apiKey =  '9fad265f80b0457c943c71729d5634af';
  private readonly baseUrl = 'https://newsapi.org/v2';

 
  async getArticles(
    count: number = 10,
    category?: string,
    searchQuery?: string,
  ): Promise<NewsAPIArticle[]> {
    if (count > 100) {
      throw new BadRequestException('Maximum 100 articles per request');
    }

    try {
      let url = `${this.baseUrl}/everything?apiKey=${this.apiKey}&pageSize=${count}&sortBy=publishedAt`;

      if (searchQuery) {
        url += `&q=${encodeURIComponent(searchQuery)}`;
      } else if (category) {
        url = `${this.baseUrl}/top-headlines?apiKey=${this.apiKey}&category=${category}&pageSize=${count}&sortBy=publishedAt`;
      } else {
        url += '&q=news';
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`NewsAPI error: ${response.statusText}`);
      }

      const data: NewsAPIResponse = await response.json();

      if (data.status !== 'ok') {
        throw new BadRequestException(`NewsAPI returned status: ${data.status}`);
      }

      // Filtrage amélioré des articles
      return data.articles.filter(
        (article) =>
          // Titre valide
          article.title &&
          article.title.length > 10 &&
          !article.title.includes('[Removed]') &&
          // Description valide
          article.description &&
          article.description.length > 20 &&
          !article.description.includes('[Removed]') &&
          // Contenu valide
          (article.content && article.content.length > 50) &&
          !article.content.includes('[Removed]') &&
          // Auteur valide (pas null ni vide)
          article.author &&
          article.author.trim().length > 0 &&
          // URL valide
          article.url &&
          article.url.startsWith('http')
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to fetch articles from NewsAPI: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  
  mapArticle(article: NewsAPIArticle): {
    title: string;
    description: string;
    content: string;
    imageUrl: string | null;
    authorName: string;
    sourceCategory: string;
    sourceUrl: string;
  } {
    return {
      title: article.title.substring(0, 255),
      description: (article.description || article.content || 'No description').substring(0, 255),
      content: article.content || article.description || 'Content not available',
      imageUrl: article.urlToImage,
      authorName: article.author || article.source.name || 'Unknown Author',
      sourceCategory: article.source.name || 'News',
      sourceUrl: article.url,
    };
  }
}
