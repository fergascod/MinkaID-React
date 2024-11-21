"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import { returnName } from '@/app/utils'

function get_taxon_name_and_image(json: any, setData: any) {
    const taxon_name = returnName(json["results"][0]);
    console.log(json);
    setData({
        "taxon_name": taxon_name,
        "parent_id": json["results"][0]["parent_id"],
        "image": json["results"][0]["default_photo"]
    });
}

function get_desc(json: any, setDesc: any) {
    const desc = [];
    const n = Math.min(json["total_results"], json["per_page"]);
    for (let i = 0; i < n; i++) {
        desc.push(
            <div key={i} className="mb-3">
                <Link
                    className="text-md font-medium text-blue-500 hover:text-blue-700 transition-colors duration-200"
                    href={`/explore/${json["results"][i]["id"]}`}
                >
                    {returnName(json["results"][i])} <span className="text-gray-400">({json["results"][i]["id"]})</span>
                </Link>
            </div>
        );
    }
    setDesc(desc);
}
function Taxa(taxonId: string | null, data: any, desc: React.JSX.Element[]) {
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
                            &larr; Ves al taxó pare
                        </Link>
                    )}

                    <Link
                        href={`/new_test/${taxonId}`}
                        className="inline-block bg-blue-600 text-white rounded-md py-2 px-4 font-semibold my-4 hover:bg-blue-700 transition-colors duration-200"
                    >
                        Fes un test d'aquest taxó
                    </Link>

                    <figure className="w-full text-center">
                        {data["image"] ? (
                            <div className="rounded-lg overflow-hidden shadow mb-4">
                                <img
                                    className="w-full h-64 object-cover"
                                    src={data["image"]["url"].replace("square", "original")}
                                    alt={`${data["taxon_name"]} image`}
                                />
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 italic">No image available</p>
                        )}
                        <p className="text-sm text-gray-500 italic mb-6">{data["image"] ? data["image"]["attribution"] : ""}</p>
                    </figure>
                </div>
            ) : (
                <p className="text-gray-500 text-lg">Loading...</p>
            )}

            {/* Scrollable Sidebar for Child Taxons */}
            <div className="w-64 h-full overflow-y-auto bg-white rounded-lg shadow-md p-4 ml-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Subtaxons</h2>
                {desc ? desc : <p className="text-gray-500">Loading descendants...</p>}
            </div>
        </div>
    );
}

export default function Taxonomy({ params }: { params: Promise<{ taxon_id: string }> }) {
    const [taxonId, setTaxonId] = useState<string | null>(null);
    const [data, setData] = useState(null);
    const [desc, setDesc] = useState<React.JSX.Element[]>([]);

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
            const apiUrl = `https://api.minka-sdg.org/v1/taxa?id=${taxonId}&per_page=1&locale=ca`;
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
            const apiUrl = `https://api.minka-sdg.org/v1/taxa?parent_id=${taxonId}&per_page=200&locale=ca`;
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
