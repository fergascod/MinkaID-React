"use client"

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

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

function returnName(sp) {
    if ("preferred_common_name" in sp) {
        return `${sp["preferred_common_name"]} (${sp["name"]})`
    }
    return sp["name"]
}

function Question({ taxonName, question, onGenerateNewQuestion, setResp, updateScore }) {
    const options = question.species.map((species, i) => (
        <div key={i} className="my-2">
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                onClick={() => {
                    setResp(i);
                    console.log(question["correct"] === i);
                    updateScore(question["correct"] === i);
                    onGenerateNewQuestion();
                }}
            >
                {returnName(species)}
            </button>
        </div>
    ));

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Mode de joc: {taxonName}</h1>
            <img src={question.url["url"]} alt="Species" className="w-full max-w-md mx-auto mb-4 rounded shadow-sm" />
            <p className="text-sm text-gray-500 italic mb-6">{question.url["attribution"]}</p>
            <ul className="space-y-2">{options}</ul>
        </div>
    );
}

function Results(points, numQuestions) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Test completat!</h2>
            <p className="text-lg text-gray-700 mb-6">
                N'has encertat <span className="font-bold text-blue-600">{points}</span> de <span className="font-bold text-blue-600">{numQuestions}</span>
            </p>
            <button
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
                <Link href={`/new_test`}>Fes un altre test!</Link>
            </button>
        </div>
    )
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
                    url: json["results"][Math.floor(Math.random() * json["results"].length)]["photos"][0],
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
    return Results(points, numQuestions);
}