import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Star } from 'lucide-react';

interface Repo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  html_url: string;
  language: string;
  languages_url: string;
  private?: boolean;
}

interface LanguageData {
  [key: string]: number;
}

export function Projects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [languages, setLanguages] = useState<{ [key: number]: LanguageData }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        // Check cache first
        const cacheKey = 'github_repos_cache';
        const cacheTimeKey = 'github_repos_cache_time';
        const cachedData = localStorage.getItem(cacheKey);
        const cacheTime = localStorage.getItem(cacheTimeKey);
        
        // Cache for 1 hour
        const CACHE_DURATION = 60 * 60 * 1000;
        const now = Date.now();
        
        if (cachedData && cacheTime && (now - parseInt(cacheTime)) < CACHE_DURATION) {
          const cached = JSON.parse(cachedData);
          setRepos(cached.repos);
          setLanguages(cached.languages);
          setLoading(false);
          
          // Trigger staggered fade-in animation for cached data
          cached.repos.forEach((_: Repo, index: number) => {
            setTimeout(() => {
              setVisibleCards(prev => [...prev, index]);
            }, 150 + index * 150);
          });
          return;
        }

        const response = await fetch('https://api.github.com/users/viguime/repos?sort=updated&per_page=3');
        
        // Check for rate limiting
        if (response.status === 403) {
          setError('GitHub API rate limit exceeded. Please try again later.');
          setLoading(false);
          return;
        }

        if (!response.ok) {
          setError('Failed to fetch repositories');
          setLoading(false);
          return;
        }

        const data: Repo[] = await response.json();
        const publicRepos = data.filter(repo => !repo.private).slice(0, 3);
        setRepos(publicRepos);

        // Fetch languages for each repo
        const languagePromises = publicRepos.map(repo =>
          fetch(repo.languages_url)
            .then(res => res.json())
            .then(langData => ({ id: repo.id, data: langData }))
            .catch(() => ({ id: repo.id, data: {} }))
        );

        const languageResults = await Promise.all(languagePromises);
        const languageMap: { [key: number]: LanguageData } = {};
        languageResults.forEach(result => {
          languageMap[result.id] = result.data;
        });
        setLanguages(languageMap);
        
        // Save to cache
        localStorage.setItem(cacheKey, JSON.stringify({ repos: publicRepos, languages: languageMap }));
        localStorage.setItem(cacheTimeKey, now.toString());
        
        setLoading(false);
        
        // Trigger staggered fade-in animation
        publicRepos.forEach((_, index) => {
          setTimeout(() => {
            setVisibleCards(prev => [...prev, index]);
          }, 150 + index * 150);
        });
      } catch (err) {
        console.error('Error fetching repos:', err);
        setError('Failed to load projects');
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const getLanguagePercentages = (repoId: number) => {
    const langData = languages[repoId] || {};
    const total = Object.values(langData).reduce((sum, val) => sum + val, 0);
    if (total === 0) return [];

    return Object.entries(langData)
      .map(([lang, bytes]) => ({
        name: lang,
        percentage: (bytes / total) * 100,
      }))
      .sort((a, b) => b.percentage - a.percentage);
  };

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Recent Projects</h2>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">
            Check the browser console for more details.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8">Recent Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map((repo, index) => {
          const langPercentages = getLanguagePercentages(repo.id);
          const isVisible = visibleCards.includes(index);
          return (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-all duration-500 ease-out hover:scale-105"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
              }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{repo.name}</span>
                    <span className="flex items-center gap-1 text-sm font-normal text-muted-foreground">
                      <Star className="w-4 h-4" />
                      {repo.stargazers_count}
                    </span>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {repo.description || 'No description available'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {langPercentages.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex h-2 rounded-full overflow-hidden bg-muted">
                        {langPercentages.map((lang, index) => (
                          <div
                            key={lang.name}
                            className="h-full"
                            style={{
                              width: `${lang.percentage}%`,
                              backgroundColor: getLanguageColor(lang.name, index),
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {langPercentages.slice(0, 3).map((lang, index) => (
                          <span key={lang.name} className="flex items-center gap-1">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getLanguageColor(lang.name, index) }}
                            />
                            {lang.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function getLanguageColor(language: string, index: number): string {
  const colors: { [key: string]: string } = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
    Ruby: '#701516',
    PHP: '#4F5D95',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    HTML: '#e34c26',
    CSS: '#563d7c',
  };

  return colors[language] || ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'][index % 4];
}
