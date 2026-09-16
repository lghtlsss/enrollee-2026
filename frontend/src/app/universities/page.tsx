import { UniversitiesList } from '@/components/universities/universities-list';

const UniversitiesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  let page = Number((await searchParams)?.page);
  if (!page) {
    page = 1;
  }
  return <UniversitiesList page={Number(page)} />;
};

export default UniversitiesPage;
