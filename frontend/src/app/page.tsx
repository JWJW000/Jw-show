import Link from 'next/link';
import Image from 'next/image';
import { getWorks, getStrapiMediaUrl } from '@/lib/cms';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let works: { id: number; attributes: Record<string, unknown> }[] = [];
  try {
    const res = await getWorks({ 'pagination[pageSize]': '6' });
    works = res.data || [];
  } catch {
    // CMS 未就绪时显示空列表
  }

  return (
    <div className="container">
      <h1 className="page-title">精选作品</h1>
      <div className="work-grid">
        {works.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', color: '#6b7280', maxWidth: '560px' }}>
            <p style={{ marginBottom: '0.75rem' }}>暂无作品展示。</p>

          </div>
        ) : (
          works.map((work) => {
            const attrs = work.attributes as {
              title: string;
              slug: string;
              cover?: { data?: { attributes?: { url: string } } | null };
              category?: { data?: { attributes?: { name: string } } | null };
            };
            const coverUrl = attrs.cover?.data?.attributes?.url;
            const categoryName = attrs.category?.data?.attributes?.name;
            return (
              <Link key={work.id} href={`/works/${attrs.slug}`} className="work-card">
                {coverUrl && (
                  <Image
                    src={getStrapiMediaUrl(coverUrl)}
                    alt={attrs.title}
                    width={400}
                    height={250}
                    className="cover"
                  />
                )}
                {!coverUrl && <div className="cover" style={{ background: '#e5e7eb' }} />}
                <div className="body">
                  <h2>{attrs.title}</h2>
                  {categoryName && <div className="meta">{categoryName}</div>}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
