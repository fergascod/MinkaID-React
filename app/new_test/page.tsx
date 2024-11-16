"use client"

import game_modes from '../game_modes.json'

import React, { useState, useEffect } from 'react';
import Link from 'next/link'

function get_game_modes() {
    console.log(game_modes);
    const options = [];
    for (const mode of Object.keys(game_modes) as Array<keyof typeof game_modes>) {
        options.push(
            <option key={game_modes[mode]} value={game_modes[mode]}>
                {mode}
            </option>
        );
    }
    return options;
}

export default function TestForm() {
    const [mode, setMode] = useState<string | null>(null);
    const [numQuestions, setNumQuestions] = useState<number | null>(null);

    useEffect(() => {
        console.log(`/test?taxon_id=${mode}&num_questions=${numQuestions}`);
    }, [mode, numQuestions]);

    return (
        <div className="h-screen items-center justify-center text-center">
            <h1 className='text-4xl font-bold text-blue-600 pt-4'> Nou joc</h1>
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
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Mode de joc
                    </label>
                    <select
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={(e) => setMode(e.target.value || null)} // Ensure null when no valid selection
                        value={mode || ""}
                    >
                        <option value="" disabled>
                            Selecciona un mode de joc
                        </option>
                        {get_game_modes()}
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    <Link href={`/test?taxon_id=${mode}&num_questions=${numQuestions}`}>
                        Comença
                    </Link>
                </button>
            </div>

            <div className='p-5 m-5 mx-auto w-1/2 outline outline-1 rounded shadow-md '>
                <p className='text-justify	'>
                    Aquí pots jugar a identificar espècies dels grups taxonòmics que més t'interessin.
                    Al formulari tens una selecció d'alguns grups que et poden semblar interessants. Tots ells contenen
                    <span className='font-bold'> les 10 espècies més comunes a Minka </span> dins del corresponent grup taxonòmic.
                    Si no trobes el que busques utilitza la pàgina <Link href="/explore"><span className='text-blue-500 hover:text-blue-700 font-bold'>Explora </span></Link>
                    per seleccionar un test amb el grup que més t'interessi.
                </p>
            </div>
        </div>
    );
}