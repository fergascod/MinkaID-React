import Link from 'next/link'

export default function Explore() {
    return (
        <div className="grid place-items-center h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Explora l'arbre taxonòmic de Minka
                </h1>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                >
                    <Link href={`/explore/2`}>Comença pel principi: Animalia!</Link>
                </button>
                <div className='p-5 m-10 mx-auto w-1/2 outline rounded'>
                    <p className='text-justify	'>
                        Amb aquesta funcionalitat pots estudiar les relacions taxonòmiques entre les diferents espècies
                        que trobaràs a Minka. Des dels fongs fins els peixos passant per les aus i les algues, podràs
                        explorar els ordres, regnes, famílies, gèneres i espècies d'animals que hi ha a la plataforma.
                    </p>
                </div>

            </div>
        </div>
    );
}