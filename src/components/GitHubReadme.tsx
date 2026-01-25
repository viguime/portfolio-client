import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function GitHubReadme() {
  const [readme, setReadme] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your GitHub username
    fetch('https://api.github.com/repos/viguime/viguime/readme')
      .then(res => res.json())
      .then(data => {
        const content = atob(data.content);
        setReadme(content);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>
      </section>
    );
  }

  if (!readme) return null;

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {readme}
        </ReactMarkdown>
      </article>
    </section>
  );
}
