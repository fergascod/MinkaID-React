"use client"

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { returnName } from '@/app/utils'

function filterZeros(arr: []) {
    //TODO: maybe binary search instead of linear search XD
    console.log(arr.length)
    let n = 1;
    while (n < arr.length && arr[n]['observations_count'] > 0) {
        n++;
    }
    const result: any[] = arr.slice(0, n);
    return result;
}

function getRandomCombination(arr: any[], k: number) {
    const tempArr = [...arr];
    const combination: any[] = [];
    for (let i = 0; i < k; i++) {
        const randIndex = Math.floor(Math.random() * tempArr.length);
        combination.push(tempArr[randIndex]);
        tempArr.splice(randIndex, 1);
    }
    return combination;
}

function Question({ taxonName, question, handleAnswer }: {
    taxonName: string,
    question: any,
    handleAnswer: (userResponse: number) => void
}) {
    const dialogRef = useRef<HTMLDialogElement | null>(null)
    if (!question['url'])
        return <div className="p-6 text-center">
            <p>No data for this taxon: {taxonName}</p>
        </div>;
    const options = question.species.map((species: any, i: number) => (
        <div key={i} className="my-2">
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                onClick={() => { handleAnswer(i) }}
            >
                {returnName(species)}
            </button>
        </div>
    ));

    return (
        <div>
            <dialog ref={dialogRef} onClick={() => dialogRef.current?.close()} className="w-2/3 max-w-none backdrop:bg-black/80">
                <img src={question.url["url"].replace("square", "original")} alt="Species" className="rounded w-full h-auto object-contain" />
            </dialog>
            <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Mode de joc: {taxonName}</h1>
                <button onClick={() => dialogRef.current?.showModal()}>
                    <img src={question.url["url"].replace("square", "original")} alt="Species" className="w-full max-w-md mx-auto mb-4 rounded shadow-sm" />
                </button>
                <p className="text-sm text-gray-500 italic mb-6">{question.url["attribution"]}</p>
                <ul className="space-y-2">{options}</ul>
            </div>
        </div>
    );
}

function Results({ points, numQuestions, answeredQuestions }: {
    points: number,
    numQuestions: number,
    answeredQuestions: { question: any; userResponse: number; isCorrect: boolean }[]
}) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h2 className="mt-8 text-3xl font-semibold text-gray-800 mb-4">Test completat!</h2>
            <p className="text-lg text-gray-700 mb-6">
                N'has encertat <span className="font-bold text-blue-600">{points}</span> de{' '}
                <span className="font-bold text-blue-600">{numQuestions}</span>
            </p>

            <div className="max-w-4xl mx-auto">
                <h3 className="text-center text-xl font-semibold text-gray-700 mb-4">Respostes</h3>
                <ul className="space-y-6">
                    {answeredQuestions.map((item, index) => (
                        <li key={index} className="flex flex-col items-center bg-white shadow-md rounded-lg p-4">
                            <button onClick={() => { setActiveImage(item.question.url.url.replace("square", "original")); dialogRef.current?.showModal() }}>
                                <img
                                    src={item.question.url.url.replace("square", "original")}
                                    alt={`Correct species: ${returnName(item.question.species[item.question.correct])}`}
                                    className="w-32 h-32 object-cover rounded mb-4"
                                />
                            </button>
                            <p className={`text-lg font-medium ${item.isCorrect ? "text-green-600" : "text-red-600"}`}>
                                {returnName(item.question.species[item.question.correct])}
                            </p>
                            {!item.isCorrect ? <p className='text-center'> La teva resposta: <br />{returnName(item.question.species[item.userResponse])}</p> : <></>}
                            <dialog ref={dialogRef} onClick={() => dialogRef.current?.close()} className="w-2/3 max-w-none backdrop:bg-black/80">
                                <img
                                    src={activeImage ? activeImage : "https://inaturalist.org/attachments/sites/1-logo.svg?1688184492"}
                                    alt="Species"
                                    className="rounded w-full h-auto object-contain" />
                            </dialog>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='flex'>
                <button className="mx-1 my-8 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
                    <Link href={`/new_test`}>Fes un altre test!</Link>
                </button>
                <button
                    className="mx-1 my-8 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    onClick={() => { window.location.reload() }}>
                    Torna a fer el test!
                </button>
            </div>


        </div>
    );
}


function TestComponent() {
    const searchParams = useSearchParams()
    const taxon_id = searchParams.get('taxon_id')
    const num_questions = searchParams.get('num_questions')
    const num_species = searchParams.get('num_species')

    const [taxonId, setTaxonId] = useState<string | null>(null);
    const [taxonName, setTaxonName] = useState<string>("null");
    const [numQuestions, setNumQuestions] = useState(5);
    const [numSpecies, setNumSpecies] = useState(10);

    const [ans, setAns] = useState<number | null>(null);
    const [data, setData] = useState(null);
    const [question, setQuestion] = useState<
        {
            url: string | null,
            species: any[] | null,
            correct: number | null
        } | null
    >(null);
    const [points, setPoints] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState<
        { question: any; userResponse: number; isCorrect: boolean }[] // eslint-disable-line @typescript-eslint/no-explicit-any
    >([]);

    // Set up taxonId and numQuestions from router query parameters
    useEffect(() => {
        if (taxon_id) { // Ensure query param is loaded before setting state
            setTaxonId(/^\+?(0|[1-9]\d*)$/.test(taxon_id) ? taxon_id : "1");
            //setNumQuestions(/^\+?(0|[1-9]\d*)$/.test(num_questions) ? num_questions : "1");
            setNumQuestions(num_questions ? parseInt(num_questions) : 5);
            setNumSpecies(num_species ? parseInt(num_species) : 10);
        }
    }, [taxon_id, num_questions, num_species]);

    // Fetch species data based on taxonId
    useEffect(() => {
        if (taxonId) {
            const apiUrl = `https://api.inaturalist.org/v1/taxa?taxon_id=${taxonId}&locale=ca&per_page=1`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(json => setTaxonName(returnName(json["results"][0])))
                .catch(error => console.error(error));
        }
    }, [taxonId]);

    // Fetch species data based on taxonId
    useEffect(() => {
        if (taxonId) {
            const apiUrl = `https://api.inaturalist.org/v1/taxa?taxon_id=${taxonId}&rank=species&locale=ca&per_page=${numSpecies}`;
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
            if (data['total_results'] == 0) {
                setQuestion({
                    url: null,
                    species: null,
                    correct: null
                });
            } else {
                const species = filterZeros(data["results"]);
                const numOptions = Math.min(species.length, 5);
                console.log(numSpecies)
                console.log(species.length)
                console.log(numOptions)
                const options = getRandomCombination(species, numOptions);
                const correctIndx = Math.floor(Math.random() * numOptions);
                console.log(options)
                const apiUrl = `https://api.inaturalist.org/v1/observations?photo_license=cc-by-nc&taxon_id=${options[correctIndx]["id"]}&quality_grade=research&order=desc&order_by=created_at`;

                fetch(apiUrl)
                    .then(response => response.json())
                    .then(json => setQuestion({
                        url: json["results"][Math.floor(Math.random() * json["results"].length)]["photos"][0],
                        species: options,
                        correct: correctIndx
                    }))
                    .catch(error => console.error(error));
            }
        }
    };

    const handleAnswer = (userResponse: number) => {
        console.log(answeredQuestions)
        const isCorrect = question?.correct === userResponse;

        // Update points if correct
        setPoints(points + (isCorrect ? 1 : 0));

        // Track the question and response
        setAnsweredQuestions((prev) => [
            ...prev,
            { question, userResponse, isCorrect },
        ]);

        // Generate a new question
        generateQuestion();
    };
    // Call generateQuestion initially when data becomes available
    useEffect(() => {
        if (data) {
            generateQuestion();
        }
    }, [data]);


    if (ans == null || ans < numQuestions) {
        return (
            <div>
                {question
                    ? <Question
                        taxonName={taxonName}
                        question={question}
                        handleAnswer={handleAnswer} />
                    : "Loading..."}
            </div>
        )
    }
    return <Results
        points={points}
        numQuestions={numQuestions}
        answeredQuestions={answeredQuestions} />;
}

export default function Test() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <TestComponent />
        </Suspense>
    );
}