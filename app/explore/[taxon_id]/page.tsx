"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import { redirect } from 'next/navigation'


function get_taxon_name_and_image(json, setData) {
    var taxon_name = json["results"][0]["name"];
    setData({
        "taxon_name": taxon_name,
        "image": json["results"][0]["default_photo"]
    });
}

function get_desc(json, setDesc) {
    var desc = [];
    var n = json["total_results"];
    console.log(json)
    console.log(json["results"])
    for (let i = 0; i < n; i++) {
        console.log(json["results"][i]["name"]);
        desc.push(
            <div key={i}>
                <Link href={`/explore/${json["results"][i]["id"]}`}>{json["results"][i]["name"]} ({json["results"][i]["id"]})</Link>
                <br />
            </div>


        );
    }
    setDesc(desc);
}

function Taxa(taxonId, data, desc) {
    return (
        <div className="flex justify-center">
            {data ?
                <div>
                    <h1>{data["taxon_name"]}</h1>
                    <figure className="max-w-lg">
                        {data["image"] ?
                            <div>
                                <img className="h-auto max-w-full rounded-lg" src={data["image"]["url"]} alt="image description" />
                                <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
                                    {data["image"]["attribution"]}
                                </figcaption>
                            </div>
                            :
                            <br />
                        }

                    </figure>
                </div>
                : 'Loading...'}

            <br />

            {desc ?
                <div>
                    {desc}
                </div>
                : 'Loading...'}
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
