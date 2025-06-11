import { getApiKey } from './storage';

interface SearchResult {
  title: string;
  description: string;
  url: string;
  source: string;
}

export class WebSearchService {
  private groqBaseUrl = 'https://api.groq.com/openai/v1/chat/completions';
  private searchApiUrl = 'https://api.search.brave.com/res/v1/web/search';

  async searchAndAnswer(query: string): Promise<string> {
    try {
      // First, perform web search
      const searchResults = await this.performWebSearch(query);
      
      if (searchResults.length === 0) {
        return "I couldn't find any relevant information for your query. Please try rephrasing your question.";
      }

      // Then, use Groq to generate an answer based on search results
      return await this.generateAnswerFromResults(query, searchResults);
    } catch (error) {
      console.error('Web search error:', error);
      // Fallback to regular chat if search fails
      return await this.fallbackToChat(query);
    }
  }

  private async performWebSearch(query: string): Promise<SearchResult[]> {
    // For demo purposes, we'll simulate search results
    // In a real implementation, you would integrate with a search API like:
    // - Brave Search API
    // - SerpAPI
    // - Custom search solution
    
    return this.simulateSearchResults(query);
  }

  private simulateSearchResults(query: string): SearchResult[] {
    // This is a simulation - replace with actual search API integration
    const mockResults: SearchResult[] = [
      {
        title: `Information about ${query}`,
        description: `Comprehensive information and details about ${query} from various reliable sources.`,
        url: `https://example.com/search?q=${encodeURIComponent(query)}`,
        source: 'Example Source'
      },
      {
        title: `${query} - Latest Updates`,
        description: `Recent developments and news related to ${query}.`,
        url: `https://news.example.com/${query.replace(/\s+/g, '-')}`,
        source: 'News Source'
      }
    ];

    return mockResults;
  }

  private async generateAnswerFromResults(query: string, results: SearchResult[]): Promise<string> {
    const apiKey = await getApiKey();
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const searchContext = results.map(result => 
      `Title: ${result.title}\nDescription: ${result.description}\nSource: ${result.source}\n`
    ).join('\n---\n');

    const systemPrompt = `You are a helpful AI assistant that provides comprehensive answers based on web search results. 
    Use the provided search results to answer the user's question accurately and thoroughly. 
    If the search results don't contain enough information, acknowledge this limitation.
    Always cite your sources when possible.`;

    const userPrompt = `Question: ${query}

Search Results:
${searchContext}

Please provide a comprehensive answer based on these search results.`;

    const response = await fetch(this.groqBaseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen2.5-72b-instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Unable to generate response from search results.';
  }

  private async fallbackToChat(query: string): Promise<string> {
    const apiKey = await getApiKey();
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const response = await fetch(this.groqBaseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen2.5-72b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant. Provide accurate and helpful responses to user questions.'
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Unable to generate response.';
  }
}