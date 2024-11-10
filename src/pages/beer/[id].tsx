import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import {renderStars} from "~/components/stars";

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
    beer: Beer;
}

export default function BeerPage({ beer }: BeerProps) {

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Head>
                <title>{beer.name}</title>
            </Head>
            <h1 className="text-3xl font-bold mb-4">{beer.name}</h1>
            <p className="text-lg mb-2">{beer.description}</p>
            <div className="flex items-center mb-2">
                <span className="mr-2">Rating:</span>
                <div className="flex">{renderStars(beer.rating)}</div>
            </div>
            <div className="flex space-x-2">
                <div className="flex-1">
                    <p className="mb-2">Brewery: {beer.brewery}</p>
                    <p className="mb-2">Location: {beer.location.city}, {beer.location.state ? `${beer.location.state}, ` : ''}{beer.location.country}</p>
                    <p className="mb-2">ABV: {beer.abv}%</p>
                    {beer.style && <p className="mb-2">Style: {beer.style}</p>}
                    {beer.timeReviewed &&
                        <p className="mb-2">Reviewed on: {new Date(beer.timeReviewed).toDateString()}</p>}
                </div>
                <div className="flex  space-x-2">
                    <Image src={beer.canImage} alt={`${beer.name} can`} width={192} height={192}
                           className="object-cover"/>
                    <Image src={beer.pouredImage} alt={`${beer.name} poured`} width={192} height={192}
                           className="object-cover"/>
                </div>
            </div>
        </div>
)
}
export const getStaticPaths: GetStaticPaths = async () => {
    const filePath = path.join(process.cwd(), 'beer.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const beers: Beer[] = JSON.parse(jsonData);

    const paths = beers.map((beer) => ({
        params: {id: beer.id},
    }));

    return {paths, fallback: 'blocking'};
};

export const getStaticProps: GetStaticProps = async ({params}) => {
    const filePath = path.join(process.cwd(), 'beer.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const beers: Beer[] = JSON.parse(jsonData);
    const beer = beers.find((b) => b.id === params?.id) ?? null;

    if (!beer) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            beer,
        },
    };
};