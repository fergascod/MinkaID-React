"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link'

function get_taxon_name_and_image(json, setData) {
    const taxon_name = json["results"][0]["name"];
    console.log(json);
    setData({
        "taxon_name": taxon_name,
        "parent_id": json["results"][0]["parent_id"],
        "image": json["results"][0]["default_photo"]
    });
}

function get_desc(json, setDesc) {
    const desc = [];
    const n = json["total_results"];
    for (let i = 0; i < n; i++) {
        desc.push(
            <div key={i} className="mb-3">
                <Link
                    className="text-md font-medium text-blue-500 hover:text-blue-700 transition-colors duration-200"
                    href={`/explore/${json["results"][i]["id"]}`}
                >
                    {json["results"][i]["name"]} <span className="text-gray-400">({json["results"][i]["id"]})</span>
                </Link>
            </div>
        );
    }
    setDesc(desc);
}
function Taxa(taxonId, data, desc) {
    return (
        <div className="flex justify-center w-full px-4 py-8 bg-gray-50 min-h-screen">
            {data ? (
                <div className="flex flex-col items-center w-full max-w-md bg-white rounded-lg shadow-md p-6 h-full">
                    <h1 className="text-xl font-bold text-gray-800 text-center mb-2">
                        {data["taxon_name"]}
                    </h1>

                    {data["parent_id"] && (
                        <Link
                            href={`/explore/${data["parent_id"]}`}
                            className="text-sm font-medium text-blue-500 hover:text-blue-700 mb-2 transition-colors duration-200"
                        >
                            &larr; Go to Parent Taxon
                        </Link>
                    )}

                    <Link
                        href={`/test?taxon_id=${taxonId}&num_questions=5`}
                        className="inline-block bg-blue-600 text-white rounded-md py-2 px-4 font-semibold my-4 hover:bg-blue-700 transition-colors duration-200"
                    >
                        Take a Quiz on This Taxon!
                    </Link>

                    <figure className="w-full">
                        {data["image"] ? (
                            <div className="rounded-lg overflow-hidden shadow mb-4">
                                <img
                                    className="w-full h-64 object-cover"
                                    src={data["image"]["url"]}
                                    alt={`${data["taxon_name"]} image`}
                                />
                                <figcaption className="text-sm text-gray-500 text-center mt-2">
                                    {data["image"]["attribution"]}
                                </figcaption>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 italic">No image available</p>
                        )}
                    </figure>
                </div>
            ) : (
                <p className="text-gray-500 text-lg">Loading...</p>
            )}

            {/* Scrollable Sidebar for Child Taxons */}
            <div className="w-64 h-full overflow-y-auto bg-white rounded-lg shadow-md p-4 ml-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Child Taxons</h2>
                {desc ? desc : <p className="text-gray-500">Loading descriptions...</p>}
            </div>
        </div>
    );
}

export default function Taxonomy({ params }: { params: Promise<{ taxon_id: string }> }) {
    const [taxonId, setTaxonId] = useState<string | null>(null);
    const [data, setData] = useState(null);
    const [desc, setDesc] = useState(null);

    useEffect(() => {
        // Unwrap the params Promise and set taxonId
        const fetchParams = async () => {
            const resolvedParams = await params;

            setTaxonId(/^\+?(0|[1-9]\d*)$/.test(resolvedParams.taxon_id) ? resolvedParams.taxon_id : "1");
        };
        fetchParams();
    }, [params]);

    useEffect(() => {
        if (taxonId) {
            const apiUrl = `https://minka-sdg.org:4000/v1/taxa/${taxonId}`;
            console.log(apiUrl);

            // Fetch data from the API once taxonId is available
            fetch(apiUrl)
                .then(response => response.json())
                .then(json => get_taxon_name_and_image(json, setData))
                .catch(error => console.error(error));
        }
    }, [taxonId]);

    useEffect(() => {
        if (taxonId) {
            const apiUrl = `https://minka-sdg.org:4000/v1/taxa?parent_id=${taxonId}&per_page=200`;
            console.log(apiUrl);

            // Fetch data from the API once taxonId is available
            fetch(apiUrl)
                .then(response => response.json())
                .then(json => get_desc(json, setDesc))
                .catch(error => console.error(error));
        }
    }, [taxonId]);


    return Taxa(taxonId, data, desc);
}
