import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import fs from "fs";
import path from "path";
import Image from "next/image";

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
    return (
        <div>
            <Head>
                <title>{recipe.name}</title>
            </Head>
            <div className="max-w-4xl mx-auto p-4">
                <h1 className="text-3xl font-bold mb-1">{recipe.name}</h1>
                <p className="text-gray-500 mb-2">Cooked on: {new Date(recipe.timeCooked).toLocaleDateString()}</p>
                <div className="flex mb-2">
                    <div className="w-1/2 pr-2">
                        <p className="text-gray-500">{recipe.description}</p>
                    </div>
                    <div className="w-1/2 flex justify-center">
                        <Image src={recipe.picture} alt={`${recipe.name}`} width={192} height={192}
                               className="object-cover"/>
                    </div>
                </div>
                <div className="flex mb-2">
                    <div className="w-1/2 pr-2">
                        <h3 className="text-xl font-semibold mb-1">Steps</h3>
                        <ol className="list-decimal list-inside mb-1">
                            {recipe.steps.map((step, index) => (
                                <li key={index} className="mb-1">{step}</li>
                            ))}
                        </ol>
                    </div>
                    <div className="w-1/2 flex flex-col items-center">
                        <h3 className="text-xl font-semibold mb-1">Ingredients</h3>
                        <ul className="list-disc list-inside">
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const filePath = path.join(process.cwd(), 'src/data/recipe.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
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
    const recipes: Recipe[] = JSON.parse(jsonData);
    const recipe = recipes.find(recipe => recipe.id === id);

    return {
        props: {
            recipe,
        },
    };
};