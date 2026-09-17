import { University } from '@/components/universities/university';
import { use } from 'react';

const UniversityPage = ({ params }: { params: Promise<{ slug: number }> }) => {
  const { slug } = use(params);
  return <University universityId={slug} />;
};

export default UniversityPage;
