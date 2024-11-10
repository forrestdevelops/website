import Head from "next/head";
import Link from "next/link";
import fs from "fs";
import path from "path";
import ItemList from "~/components/itemList";

interface Recipe {
    id: string;
    name: string;
    picture: string;
    steps: string[];
    timeCooked: string;
}

interface RecipeProps {
    recipes: Recipe[];
}

export default function Recipe({ recipes }: RecipeProps) {
    return (
        <div>
            <Head>
                <title>Recipes</title>
            </Head>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">Recipe</h1>
                <ItemList items={recipes} basePath="/recipe" />
            </div>
        </div>
    );
}

export const getStaticProps = async () => {
    const filePath = path.join(process.cwd(), 'src/data/recipe.json'), jsonData = fs.readFileSync(filePath, 'utf-8'),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        recipes: Recipe[] = JSON.parse(jsonData);
    return {
        props: {
            recipes,
        },
    };
};