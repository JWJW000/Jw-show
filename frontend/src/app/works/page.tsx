import Link from 'next/link';
import Image from 'next/image';
import { getWorks, getCategories, getStrapiMediaUrl } from '@/lib/cms';

export default async function WorksPage() {
  let works: { id: number; attributes: Record<string, unknown> }[] = [];
  let categories: { id: number; attributes: { name: string; slug: string } }[] = [];
  try {
    const [worksRes, categoriesRes] = await Promise.all([getWorks(), getCategories()]);
    works = worksRes.data || [];
    categories = categoriesRes.data || [];
  } catch {
    // CMS 未就绪
  }

  return (
    <div className="container">
      <h1 className="page-title">全部作品</h1>
      {categories.length > 0 && (
        <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
          分类：{categories.map((c) => c.attributes.name).join('、')}
        </p>
      )}
      <div className="work-grid">
        {works.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', color: '#6b7280' }}>暂无作品。</p>
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
