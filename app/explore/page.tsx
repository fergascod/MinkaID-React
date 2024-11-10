import Link from 'next/link'

export default function Explore() {
    return (
        <div>
            <h1>Explora l'arbre taxonòmic de Minka</h1>
            <Link href={`/explore/1`}> Comença pel principi: Animalia!</Link>
        </div>
    );
}