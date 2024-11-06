import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';

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
    beer: Beer | null;
}

export default function BeerPage({ beer }: BeerProps) {
    const router = useRouter();

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    if (!beer) {
        return <div>404 - Beer Not Found</div>;
    }

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <svg
                    key={i}
                    className={`h-5 w-5 ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.245 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                </svg>
            );
        }
        return stars;
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{beer.name}</h1>
            <p className="text-lg mb-2">{beer.description}</p>
            <div className="flex items-center mb-2">
                <span className="mr-2">Rating:</span>
                <div className="flex">{renderStars(beer.rating)}</div>
            </div>
            <p className="mb-2">Brewery: {beer.brewery}</p>
            <p className="mb-2">Location: {beer.location.city}, {beer.location.state ? `${beer.location.state}, ` : ''}{beer.location.country}</p>
            <p className="mb-2">ABV: {beer.abv}%</p>
            {beer.style && <p className="mb-2">Style: {beer.style}</p>}
            {beer.timeReviewed && <p className="mb-2">Reviewed on: {new Date(beer.timeReviewed).toLocaleString()}</p>}
            <div className="flex space-x-4">
                <img src={beer.canImage} alt={`${beer.name} can`} className="w-48 h-48 object-cover" />
                <img src={beer.pouredImage} alt={`${beer.name} poured`} className="w-48 h-48 object-cover" />
            </div>
        </div>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const filePath = path.join(process.cwd(), 'beer.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const beers: Beer[] = JSON.parse(jsonData);

    const paths = beers.map((beer) => ({
        params: { id: beer.id },
    }));

    return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context) => {
    const { id } = context.params!;
    const filePath = path.join(process.cwd(), 'beer.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const beers: Beer[] = JSON.parse(jsonData);

    const beer = beers.find((beer) => beer.id === id) || null;

    return {
        props: {
            beer,
        },
        revalidate: 10,
    };
};