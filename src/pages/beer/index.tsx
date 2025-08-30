import Head from "next/head";
import fs from "fs";
import path from "path";
import ItemList from "~/components/itemList";
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
    beers: Beer[];
}

export default function Beer({ beers }: BeerProps) {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Craft Beer Reviews",
        "description": "Personal craft beer reviews and ratings by Forrest Smietanski",
        "url": "https://forrestdevelops.com/beer",
        "numberOfItems": beers.length,
        "itemListElement": beers.map((beer, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Review",
                "name": beer.name,
                "author": {
                    "@type": "Person",
                    "name": "Forrest Smietanski"
                },
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": beer.rating,
                    "bestRating": 5
                },
                "itemReviewed": {
                    "@type": "Product",
                    "name": beer.name,
                    "brand": {
                        "@type": "Brand",
                        "name": beer.brewery
                    }
                },
                "url": `https://forrestdevelops.com/beer/${beer.id}`
            }
        }))
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>Craft Beer Reviews - Forrest Smietanski</title>
                <meta name="description" content="Personal craft beer reviews and ratings by Forrest Smietanski. Discover detailed tasting notes, ratings, and photos of craft beers from around the world." />
                <meta name="keywords" content="craft beer reviews, beer ratings, craft beer, beer tasting, beer enthusiast, Forrest Smietanski" />
                <meta name="author" content="Forrest Smietanski" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://forrestdevelops.com/beer" />
                <meta property="og:title" content="Craft Beer Reviews - Forrest Smietanski" />
                <meta property="og:description" content="Personal craft beer reviews and ratings with detailed tasting notes and photos." />
                        <meta property="og:image" content="https://forrestdevelops.com/og-image.svg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://forrestdevelops.com/beer" />
        <meta property="twitter:title" content="Craft Beer Reviews - Forrest Smietanski" />
        <meta property="twitter:description" content="Personal craft beer reviews and ratings with detailed tasting notes and photos." />
        <meta property="twitter:image" content="https://forrestdevelops.com/og-image.svg" />
                
                <link rel="canonical" href="https://forrestdevelops.com/beer" />
                
                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData),
                    }}
                />
            </Head>
            <div className="container mx-auto p-4 max-w-6xl">
                <Breadcrumb items={[
                    { label: "Home", href: "/" },
                    { label: "Beer Reviews" }
                ]} />
                
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-3xl font-bold mb-2 text-gray-900">Craft Beer Reviews</h1>
                    <p className="text-gray-600 mb-6">Personal reviews and ratings of craft beers I&apos;ve tried, featuring detailed tasting notes and photos</p>
                </div>
                
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