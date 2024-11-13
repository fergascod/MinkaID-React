"use client"

import game_modes from '../game_modes.json'

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'

function get_game_modes() {
    console.log(game_modes)
    const options = []
    for (const mode in game_modes) {
        console.log(mode)
        options.push(<option key={mode} value={mode}>{mode}</option>)
    }
    return options
}

function TestForm() {
    get_game_modes()
    return (
        <div className="w-full max-w-xs text-center flex justify-center ">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Mode de joc
                    </label>
                    <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        {get_game_modes()}
                    </select>
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" >
                        Comença!
                    </button>
                </div>
            </form>
        </div>
    );
}

function returnName(sp) {
    if ("preferred_common_name" in sp) {
        return `${sp["preferred_common_name"]} (${sp["name"]})`
    }
    return sp["name"]
}

function Question({ taxonName, question, onGenerateNewQuestion, setResp, updateScore }) {
    const options = question.species.map((species, i) => (
        <div key={i}>
            <button onClick={() => { setResp(i); console.log(question["correct"] == i); updateScore(question["correct"] == i); onGenerateNewQuestion(); }}>
                {returnName(species)}
            </button>
            <br />
        </div>
    ));

    return (
        <div>
            <h1>Mode de joc: {taxonName}</h1>
            <img src={question.url}></img>
            <ul>{options}</ul>
        </div>
    )
}

function getRandomCombination(arr, k) {
    const tempArr = [...arr];
    const combination = [];
    for (let i = 0; i < k; i++) {
        const randIndex = Math.floor(Math.random() * tempArr.length);
        combination.push(tempArr[randIndex]);
        tempArr.splice(randIndex, 1);
    }
    return combination;
}

export default function Test() {
    const searchParams = useSearchParams()
    const taxon_id = searchParams.get('taxon_id')
    const num_questions = parseInt(searchParams.get('num_questions'))

    const [taxonId, setTaxonId] = useState(null);
    const [taxonName, setTaxonName] = useState(null);
    const [numQuestions, setNumQuestions] = useState(null);
    const [ans, setAns] = useState<number | null>(null);
    const [data, setData] = useState(null);
    const [question, setQuestion] = useState(null);
    const [resp, setResp] = useState(null);
    const [points, setPoints] = useState(0);

    // Set up taxonId and numQuestions from router query parameters
    useEffect(() => {
        if (taxon_id) { // Ensure query param is loaded before setting state
            setTaxonId(/^\+?(0|[1-9]\d*)$/.test(taxon_id) ? taxon_id : "1");
            setNumQuestions(/^\+?(0|[1-9]\d*)$/.test(num_questions) ? num_questions : "1");
        }
    }, [taxon_id, num_questions]);

    // Fetch species data based on taxonId
    useEffect(() => {
        if (taxonId) {
            const apiUrl = `https://minka-sdg.org:4000/v1/taxa?taxon_id=${taxonId}&locale=ca&per_page=1`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(json => setTaxonName(returnName(json["results"][0])))
                .catch(error => console.error(error));
        }
    }, [taxonId]);

    // Fetch species data based on taxonId
    useEffect(() => {
        if (taxonId) {
            const apiUrl = `https://minka-sdg.org:4000/v1/taxa?taxon_id=${taxonId}&rank=species&locale=ca&per_page=10`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(json => setData(json))
                .catch(error => console.error(error));
        }
    }, [taxonId]);

    // Function to generate a new question
    const generateQuestion = () => {
        if (data) {
            if (ans !== null) setAns(ans + 1);
            else setAns(0);
            const species = data["results"];
            const numOptions = 5;
            const options = getRandomCombination(species, numOptions);
            const correctIndx = Math.floor(Math.random() * numOptions);
            const apiUrl = `https://minka-sdg.org:4000/v1/observations?photo_license=cc-by-nc&taxon_id=${options[correctIndx]["id"]}&quality_grade=research&order=desc&order_by=created_at`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(json => setQuestion({
                    url: json["results"][Math.floor(Math.random() * json["results"].length)]["photos"][0]["url"],
                    species: options,
                    correct: correctIndx
                }))
                .catch(error => console.error(error));
        }
    };

    // Call generateQuestion initially when data becomes available
    useEffect(() => {
        if (data) {
            generateQuestion();
        }
    }, [data]);

    useEffect(() => {
        console.log(question)
        console.log(points)
        console.log(ans)
    }, [question])

    if (!taxon_id) { return TestForm(); }

    if (ans < num_questions) {
        return (
            <div>
                {question
                    ? <Question
                        taxonName={taxonName}
                        question={question}
                        onGenerateNewQuestion={generateQuestion}
                        setResp={setResp}
                        updateScore={(b: boolean) => { setPoints(points + (b ? 1 : 0)) }} />
                    : "Loading..."}
            </div>
        )
    }
    return (
        <div>
            <p>{`${points}/${num_questions}`}</p>
        </div>
    )
}