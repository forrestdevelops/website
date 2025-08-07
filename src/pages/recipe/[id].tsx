import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import fs from "fs";
import path from "path";
import Image from "next/image";
import Breadcrumb from "~/components/breadcrumb";

interface Recipe {
    id: string;
    name: string;
    picture: string;
    description: string;
    ingredients: string[];
    steps: string[];
    timeCooked: string;
}

interface RecipeProps {
    recipe: Recipe;
}

export default function RecipePage({ recipe }: RecipeProps) {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Recipe",
        "name": recipe.name,
        "author": {
            "@type": "Person",
            "name": "Forrest Smietanski"
        },
        "datePublished": recipe.timeCooked,
        "description": recipe.description,
        "image": `https://forrestdevelops.com${recipe.picture}`,
        "recipeInstructions": recipe.steps.map((step, index) => ({
            "@type": "HowToStep",
            "position": index + 1,
            "text": step
        })),
        "recipeIngredient": recipe.ingredients,
        "url": `https://forrestdevelops.com/recipe/${recipe.id}`
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>{recipe.name} - Recipe - Forrest Smietanski</title>
                <meta name="description" content={`Recipe for ${recipe.name}. ${recipe.description.substring(0, 150)}...`} />
                <meta name="keywords" content={`${recipe.name}, recipe, cooking, food, ${recipe.ingredients.slice(0, 3).join(', ')}, Forrest Smietanski`} />
                <meta name="author" content="Forrest Smietanski" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={`https://forrestdevelops.com/recipe/${recipe.id}`} />
                <meta property="og:title" content={`${recipe.name} - Recipe`} />
                <meta property="og:description" content={`Recipe for ${recipe.name} with step-by-step instructions and ingredients.`} />
                <meta property="og:image" content={`https://forrestdevelops.com${recipe.picture}`} />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={`https://forrestdevelops.com/recipe/${recipe.id}`} />
                <meta property="twitter:title" content={`${recipe.name} - Recipe`} />
                <meta property="twitter:description" content={`Recipe for ${recipe.name} with step-by-step instructions and ingredients.`} />
                <meta property="twitter:image" content={`https://forrestdevelops.com${recipe.picture}`} />
                
                <link rel="canonical" href={`https://forrestdevelops.com/recipe/${recipe.id}`} />
                
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
                    { label: "Recipes", href: "/recipe" },
                    { label: recipe.name }
                ]} />
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.name}</h1>
                            <p className="text-gray-600">Cooked on {new Date(recipe.timeCooked).toLocaleDateString()}</p>
                        </div>
                        <Link href="/recipe" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Recipes
                        </Link>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <p className="text-gray-700 leading-relaxed">{recipe.description}</p>
                        </div>
                        <div className="flex justify-center">
                            <Image src={recipe.picture} alt={`${recipe.name}`} width={300} height={300}
                                   className="object-cover rounded-lg"/>
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">Ingredients</h3>
                            <ul className="space-y-2">
                                {recipe.ingredients.map((ingredient, index) => (
                                    <li key={index} className="flex items-center text-gray-700">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                        {ingredient}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">Steps</h3>
                            <ol className="space-y-3">
                                {recipe.steps.map((step, index) => (
                                    <li key={index} className="flex items-start text-gray-700">
                                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                                            {index + 1}
                                        </span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const filePath = path.join(process.cwd(), 'src/data/recipe.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const recipes: Recipe[] = JSON.parse(jsonData);

    const paths = recipes.map(recipe => ({
        params: {id: recipe.id},
    }));

    return {paths, fallback: false};
};

export const getStaticProps: GetStaticProps = async (context) => {
    const {id} = context.params!;
    const filePath = path.join(process.cwd(), 'src/data/recipe.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const recipes: Recipe[] = JSON.parse(jsonData);
    const recipe = recipes.find(recipe => recipe.id === id);

    return {
        props: {
            recipe,
        },
    };
};