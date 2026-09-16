import { use } from 'react';

const UniversityPage = ({ params }: { params: Promise<{ slug: number }> }) => {
  const { slug } = use(params);
  return (
    <div>
      <p>{slug}</p>
    </div>
  );
};

export default UniversityPage;
