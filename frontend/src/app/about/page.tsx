import Image from 'next/image';
import { getAbout, getStrapiMediaUrl } from '@/lib/cms';

export default async function AboutPage() {
  let about: { id: number; attributes: Record<string, unknown> } | null = null;
  try {
    const res = await getAbout();
    about = res.data ?? null;
  } catch {
    // CMS 未就绪
  }

  if (!about) {
    return (
      <div className="container about-section">
        <h1 className="page-title">关于</h1>
        <p className="bio">暂无介绍</p>
      </div>
    );
  }

  const attrs = about.attributes as {
    name?: string;
    bio?: string;
    avatar?: { data?: { attributes?: { url: string } } | null };
    skills?: string;
    email?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  const avatarUrl = attrs.avatar?.data?.attributes?.url;

  return (
    <div className="container about-section">
      <h1 className="page-title">关于</h1>
      {avatarUrl && (
        <Image
          src={getStrapiMediaUrl(avatarUrl)}
          alt={attrs.name || '头像'}
          width={120}
          height={120}
          className="avatar"
        />
      )}
      {attrs.name && <h2>{attrs.name}</h2>}
      {attrs.bio && <p className="bio">{attrs.bio}</p>}
      {attrs.skills && (
        <p style={{ marginBottom: '1rem', color: '#6b7280' }}>技能：{attrs.skills}</p>
      )}
      <div className="links">
        {attrs.email && <a href={`mailto:${attrs.email}`}>邮箱</a>}
        {attrs.github && (
          <a href={attrs.github.startsWith('http') ? attrs.github : `https://github.com/${attrs.github}`} target="_blank" rel="noopener noreferrer">GitHub</a>
        )}
        {attrs.twitter && (
          <a href={attrs.twitter.startsWith('http') ? attrs.twitter : `https://twitter.com/${attrs.twitter}`} target="_blank" rel="noopener noreferrer">Twitter</a>
        )}
        {attrs.linkedin && (
          <a href={attrs.linkedin.startsWith('http') ? attrs.linkedin : `https://linkedin.com/in/${attrs.linkedin}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        )}
      </div>
    </div>
  );
}
