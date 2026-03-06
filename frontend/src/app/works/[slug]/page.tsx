import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getWorkBySlug, getWorks, getStrapiMediaUrl } from '@/lib/cms';

export async function generateStaticParams() {
  try {
    const res = await getWorks({ 'pagination[pageSize]': '100' });
    return (res.data || []).map((w) => ({ slug: w.attributes.slug }));
  } catch {
    return [];
  }
}

export default async function WorkDetailPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  let data: { data: Array<{ id: number; attributes: Record<string, unknown> }> };
  try {
    data = await getWorkBySlug(slug);
  } catch {
    notFound();
  }

  const work = data?.data?.[0];
  if (!work) notFound();

  const attrs = work.attributes as {
    title: string;
    description?: string;
    content?: string;
    link?: string;
    year?: string;
    cover?: { data?: { attributes?: { url: string } } | null };
    images?: { data?: Array<{ attributes: { url: string } }> };
    category?: { data?: { attributes?: { name: string } } | null };
  };

  const coverUrl = attrs.cover?.data?.attributes?.url;
  const imagesRaw = attrs.images?.data;
  const images = Array.isArray(imagesRaw)
    ? imagesRaw
    : imagesRaw
      ? [imagesRaw]
      : [];
  const categoryName = attrs.category?.data?.attributes?.name;

  return (
    <div className="container">
      <p style={{ marginBottom: '1rem' }}>
        <Link href="/works">← 返回作品列表</Link>
      </p>
      <article className="work-detail">
        {coverUrl && (
          <Image
            src={getStrapiMediaUrl(coverUrl)}
            alt={attrs.title}
            width={1120}
            height={420}
            className="cover"
            priority
          />
        )}
        <h1>{attrs.title}</h1>
        <div className="meta">
          {categoryName && <span>{categoryName}</span>}
          {attrs.year && <span> · {attrs.year}</span>}
        </div>
        {attrs.description && (
          <div className="description">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {attrs.description}
            </ReactMarkdown>
          </div>
        )}
        {attrs.content && (
          <div className="content" style={{ marginTop: '1.5rem' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {attrs.content}
            </ReactMarkdown>
          </div>
        )}
        {attrs.link && (
          <p>
            <a
              href={attrs.link.startsWith('http://') || attrs.link.startsWith('https://') ? attrs.link : `https://${attrs.link}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              查看项目 →
            </a>
          </p>
        )}
        {images.length > 0 && (
          <section style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#374151' }}>项目图片</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {images.map((img, i) => {
                const url = img?.attributes?.url ?? (img as { url?: string })?.url;
                if (!url) return null;
                return (
                  <Image
                    key={(img as { id?: number })?.id ?? i}
                    src={getStrapiMediaUrl(url)}
                    alt={`${attrs.title} - 图片 ${i + 1}`}
                    width={1120}
                    height={560}
                    style={{ borderRadius: 8 }}
                  />
                );
              })}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
