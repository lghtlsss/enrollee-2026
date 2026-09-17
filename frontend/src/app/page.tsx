import { Calculator } from '@/components/calculator/calculator';

export default async function Home() {
  const response = await fetch('https://official-joke-api.appspot.com/random_joke');
  const data = await response.json();
  return (
    <main>
      <Calculator />
    </main>
  );
}
