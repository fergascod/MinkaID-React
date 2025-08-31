"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link'

import { returnName } from '@/app/utils'

export default function TestForm({ params }: { params: Promise<{ taxon_id: string }> }) {
    const [mode, setMode] = useState<string | null>(null);
    const [taxonName, setTaxonName] = useState<string | null>(null);
    const [numQuestions, setNumQuestions] = useState<number | null>(null);
    const [numSpecies, setNumSpecies] = useState<number | null>(null);

    useEffect(() => {
        const fetchParams = async () => {
            const resolvedParams = await params;

            setMode(/^\+?(0|[1-9]\d*)$/.test(resolvedParams.taxon_id) ? resolvedParams.taxon_id : "1");
        };
        fetchParams();
    }, [params]);

    useEffect(() => {
        if (mode) {
            const apiUrl = `https://api.inaturalist.org/v1/taxa?taxon_id=${mode}&locale=ca&per_page=1`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(json => setTaxonName(returnName(json["results"][0])))
                .catch(error => console.error(error));
        }
    }, [mode]);


    return (
        <div className="grid h-screen items-center justify-center text-center">
            <div>
                <h1 className='text-4xl font-bold text-blue-600 pt-4'> Nou joc: <span>{taxonName ? taxonName : ""}</span></h1>
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-1/2 mt-4 mx-auto">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Número de preguntes
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="num_preg"
                            type="number"
                            min="1"
                            max="20"
                            step="1"
                            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Número d'espècies
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="num_preg"
                            type="number"
                            min="2"
                            max="100"
                            step="1"
                            onChange={(e) => setNumSpecies(parseInt(e.target.value))}
                        />
                    </div>


                    <Link
                        className="inline-block bg-blue-600 text-white rounded-md py-2 px-4 font-semibold my-4 hover:bg-blue-700 transition-colors duration-200"
                        href={`/test?taxon_id=${mode}&num_questions=${numQuestions}&num_species=${numSpecies}`}>
                        Comença
                    </Link>
                </div>

                <div className='p-5 m-5 mx-auto w-1/2 outline outline-1 rounded shadow-md '>
                    <p className='text-justify	'>
                        Aquí pots jugar a identificar espècies del grup taxonòmics que has seleccionat.
                        Només has de seleccionar el nombre de preguntes i el nombre d'espècies que vols incloure al test:
                        quantes més espècies escullis més difícil serà!
                    </p>
                </div>
            </div>
        </div>
    );
}