import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import {renderStars} from "~/components/stars";
import Breadcrumb from "~/components/breadcrumb";

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
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Review",
        "name": `${beer.name} Review`,
        "author": {
            "@type": "Person",
            "name": "Forrest Smietanski"
        },
        "reviewRating": {
            "@type": "Rating",
            "ratingValue": beer.rating,
            "bestRating": 5
        },
        "reviewBody": beer.description,
        "datePublished": beer.timeReviewed,
        "itemReviewed": {
            "@type": "Product",
            "name": beer.name,
            "brand": {
                "@type": "Brand",
                "name": beer.brewery
            },
            "category": beer.style ?? "Craft Beer",
            "description": beer.description
        },
        "image": `https://forrestdevelops.com${beer.pouredImage}`,
        "url": `https://forrestdevelops.com/beer/${beer.id}`
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>{beer.name} by {beer.brewery} - Beer Review - Forrest Smietanski</title>
                <meta name="description" content={`Review of ${beer.name} by ${beer.brewery}. Rating: ${beer.rating}/5 stars. ${beer.description.substring(0, 150)}...`} />
                <meta name="keywords" content={`${beer.name}, ${beer.brewery}, craft beer, beer review, ${beer.style ?? 'beer'}, Forrest Smietanski`} />
                <meta name="author" content="Forrest Smietanski" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={`https://forrestdevelops.com/beer/${beer.id}`} />
                <meta property="og:title" content={`${beer.name} by ${beer.brewery} - Beer Review`} />
                <meta property="og:description" content={`Review of ${beer.name} by ${beer.brewery}. Rating: ${beer.rating}/5 stars.`} />
                <meta property="og:image" content={`https://forrestdevelops.com${beer.pouredImage}`} />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={`https://forrestdevelops.com/beer/${beer.id}`} />
                <meta property="twitter:title" content={`${beer.name} by ${beer.brewery} - Beer Review`} />
                <meta property="twitter:description" content={`Review of ${beer.name} by ${beer.brewery}. Rating: ${beer.rating}/5 stars.`} />
                <meta property="twitter:image" content={`https://forrestdevelops.com${beer.pouredImage}`} />
                
                <link rel="canonical" href={`https://forrestdevelops.com/beer/${beer.id}`} />
                
                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData),
                    }}
                />
            </Head>
            <div className="container mx-auto p-4 max-w-4xl">
                <Breadcrumb items={[
                    { label: "Home", href: "/" },
                    { label: "Beer Reviews", href: "/beer" },
                    { label: beer.name }
                ]} />
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">{beer.name}</h1>
                        <Link href="/beer" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Reviews
                        </Link>
                    </div>
                    
                    <p className="text-lg mb-4 text-gray-700">{beer.description}</p>
                    
                    <div className="flex items-center mb-4">
                        <span className="mr-3 text-gray-700 font-medium">Rating:</span>
                        <div className="flex">{renderStars(beer.rating)}</div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <p className="text-gray-700"><span className="font-medium">Brewery:</span> {beer.brewery}</p>
                            <p className="text-gray-700">
                                <span className="font-medium">Location:</span> {beer.location.city}{beer.location.state ? `, ${beer.location.state}` : ''}, {beer.location.country}
                            </p>
                            <p className="text-gray-700"><span className="font-medium">ABV:</span> {beer.abv}%</p>
                            {beer.style && <p className="text-gray-700"><span className="font-medium">Style:</span> {beer.style}</p>}
                            {beer.timeReviewed && (
                                <p className="text-gray-700">
                                    <span className="font-medium">Reviewed:</span> {new Date(beer.timeReviewed).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                        
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <p className="text-sm text-gray-600 mb-2">Can</p>
                                <Image src={beer.canImage} alt={`${beer.name} can`} width={192} height={192}
                                       className="object-cover rounded-lg"/>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-600 mb-2">Poured</p>
                                <Image src={beer.pouredImage} alt={`${beer.name} poured`} width={192} height={192}
                                       className="object-cover rounded-lg"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const filePath = path.join(process.cwd(), 'src/data/beer.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const beers: Beer[] = JSON.parse(jsonData);

    const paths = beers.map((beer) => ({
        params: {id: beer.id},
    }));

    return {paths, fallback: 'blocking'};
};

export const getStaticProps: GetStaticProps = async ({params}) => {
    const filePath = path.join(process.cwd(), 'src/data/beer.json');
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