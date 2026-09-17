import { UniversitiesList } from '@/components/universities/universities-list';

const UniversitiesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const dormitory = Boolean(params.dormitory);
  const isBudget = Boolean(params.isBudget);
  const ratings = params.rating;
  let page = Number(params?.page);
  if (!page) {
    page = 1;
  }
  console.log(typeof dormitory, typeof isBudget, typeof ratings, page);
  return <UniversitiesList page={Number(page)} filters={{ dormitory, isBudget, ratings }} />;
};

export default UniversitiesPage;
