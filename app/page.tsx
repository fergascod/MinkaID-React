import Link from 'next/link'
import '@/app/globals.css'

export default function Home() {
  return (
    <div className="grid place-items-center h-screen text-center">
      <div>
        <h1 className="text-4xl font-bold text-blue-600">Benvingut, estàs preparat?</h1>
        <h2 className="text-2xl mt-4 text-gray-700">Identifica els peixos de les platges de Catalunya!</h2>
        <br />
        <button
          className="px-4 py-2 my-2 bg-blue-500 text-white text-center rounded hover:bg-blue-600 transition-colors duration-200"
        >
          <Link href={`/explore/1`}> Explora la taxonomia dels animals de Minka</Link>
        </button>
        <br />
        <button
          className="px-4 py-2 my-2 bg-blue-500 text-white text-center rounded hover:bg-blue-600 transition-colors duration-200"
        >
          <Link href={`/new_test`}> Posa a prova els teus coneixements!</Link>
        </button>
      </div>

    </div >
  );
}