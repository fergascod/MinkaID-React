import Link from 'next/link'

export default function Explore() {
    return (
        <div className='text-center '>
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Explora l'arbre taxonòmic de Minka</h1>
            <button
                className="px-4 py-2 bg-blue-500 text-white text-center rounded hover:bg-blue-600 transition-colors duration-200"
            >
                <Link href={`/explore/2`}> Comença pel principi: Animalia!</Link>
            </button>

        </div>
    );
}