import Head from "next/head";
import Link from "next/link";
import fs from "fs";
import path from "path";

interface Location {
    city: string;
    state?: string;
    country: string;
}

interface Beer {
    id: string;
    name: string;
    description: string;
    rating: number;
    canImage: string;
    pouredImage: string;
    brewery: string;
    location: Location;
    abv: number;
    style?: string;
}

interface BeerProps {
    beers: Beer[];
}

export default function Beer({ beers }: BeerProps) {
    return (
        <div>
            <Head>
                <title>Beer</title>
            </Head>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">Beer</h1>
                <ul>
                    {beers.map((beer) => (
                        <li key={beer.id}>
                            <Link href={`/beer/${beer.id}`} legacyBehavior>
                                <a className="text-blue-500 hover:underline">{beer.name}</a>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export const getStaticProps = async () => {
    const filePath = path.join(process.cwd(), 'beer.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const beers: Beer[] = JSON.parse(jsonData);

    return {
        props: {
            beers,
        },
    };
};