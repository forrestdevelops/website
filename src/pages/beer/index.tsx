import Head from "next/head";
import Link from "next/link";
import fs from "fs";
import path from "path";
import ItemList from "~/components/itemList";

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
    timeReviewed: string | null;
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
                <ItemList items={beers} basePath="/beer" />
            </div>
        </div>
    );
}

export const getStaticProps = async () => {
    const filePath = path.join(process.cwd(), 'src/data/beer.json'), jsonData = fs.readFileSync(filePath, 'utf-8'),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        beers: Beer[] = JSON.parse(jsonData);
    return {
        props: {
            beers,
        },
    };
};