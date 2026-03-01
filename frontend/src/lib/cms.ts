const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  }
  return process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
};

export interface StrapiImage {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

export interface Category {
  id: number;
  attributes: {
    name: string;
    slug: string;
  };
}

export interface Work {
  id: number;
  attributes: {
    title: string;
    slug: string;
    description?: string;
    link?: string;
    year?: string;
    tags?: string[];
    category?: { data: Category | null };
    cover?: { data: { attributes: { url: string } } | null };
    images?: { data: Array<{ attributes: { url: string } }> };
    createdAt: string;
    updatedAt: string;
  };
}

export interface About {
  id: number;
  attributes: {
    name?: string;
    bio?: string;
    avatar?: { data: { attributes: { url: string } } | null };
    skills?: string;
    email?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

async function fetchApi<T>(path: string, params?: Record<string, string>): Promise<T> {
  const base = getBaseUrl();
  const search = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(`${base}/api${path}${search}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`CMS fetch failed: ${res.status} ${path}`);
  return res.json();
}

export async function getWorks(params?: { category?: string; 'pagination[pageSize]'?: string }): Promise<{ data: Work[] }> {
  const query: Record<string, string> = {
    populate: 'cover,category,images',
    sort: 'createdAt:desc',
    ...(params as Record<string, string>),
  };
  return fetchApi<{ data: Work[] }>('/works', query);
}

export async function getWorkBySlug(slug: string): Promise<{ data: Work[] }> {
  return fetchApi<{ data: Work[] }>('/works', {
    'filters[slug][$eq]': slug,
    populate: 'cover,category,images',
  });
}

export async function getCategories(): Promise<{ data: Category[] }> {
  return fetchApi<{ data: Category[] }>('/categories');
}

export async function getAbout(): Promise<{ data: About | null }> {
  try {
    return await fetchApi<{ data: About | null }>('/about', { populate: 'avatar' });
  } catch {
    return { data: null };
  }
}

export function getStrapiMediaUrl(url: string | undefined): string {
  if (!url) return '';
  const base = getBaseUrl();
  return url.startsWith('http') ? url : `${base}${url}`;
}
