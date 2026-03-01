import Link from 'next/link';
import Image from 'next/image';
import { getWorks, getStrapiMediaUrl } from '@/lib/cms';

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
            <p style={{ marginBottom: '0.5rem' }}>若已在后台添加并发布了作品，请检查：</p>
            <ul style={{ marginLeft: '1.25rem', marginBottom: '0.5rem' }}>
              <li>Strapi 后台 → <strong>设置</strong> → <strong>用户与权限插件</strong> → <strong>角色</strong> → <strong>Public</strong></li>
              <li>为 <strong>Work</strong> 勾选 <strong>find</strong>、<strong>findOne</strong></li>
              <li>为 <strong>Category</strong> 勾选 find、findOne，为 <strong>About</strong> 勾选 find</li>
              <li>点击保存</li>
            </ul>
            <p>然后刷新本页。</p>
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
