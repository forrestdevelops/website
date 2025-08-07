import Head from "next/head";
import fs from "fs";
import path from "path";
import ItemList from "~/components/itemList";
import Breadcrumb from "~/components/breadcrumb";

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
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Recipes & Cooking",
        "description": "Personal recipes and cooking adventures by Forrest Smietanski",
        "url": "https://forrestdevelops.com/recipe",
        "numberOfItems": recipes.length,
        "itemListElement": recipes.map((recipe, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Recipe",
                "name": recipe.name,
                "author": {
                    "@type": "Person",
                    "name": "Forrest Smietanski"
                },
                "datePublished": recipe.timeCooked,
                "image": `https://forrestdevelops.com${recipe.picture}`,
                "url": `https://forrestdevelops.com/recipe/${recipe.id}`
            }
        }))
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>Recipes & Cooking - Forrest Smietanski</title>
                <meta name="description" content="Personal recipes and cooking adventures by Forrest Smietanski. Discover favorite dishes, cooking tips, and kitchen adventures from quick meals to special occasions." />
                <meta name="keywords" content="recipes, cooking, food, kitchen adventures, home cooking, Forrest Smietanski, personal recipes" />
                <meta name="author" content="Forrest Smietanski" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://forrestdevelops.com/recipe" />
                <meta property="og:title" content="Recipes & Cooking - Forrest Smietanski" />
                <meta property="og:description" content="Personal recipes and cooking adventures with step-by-step instructions and photos." />
                <meta property="og:image" content="https://forrestdevelops.com/og-image.jpg" />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://forrestdevelops.com/recipe" />
                <meta property="twitter:title" content="Recipes & Cooking - Forrest Smietanski" />
                <meta property="twitter:description" content="Personal recipes and cooking adventures with step-by-step instructions and photos." />
                <meta property="twitter:image" content="https://forrestdevelops.com/og-image.jpg" />
                
                <link rel="canonical" href="https://forrestdevelops.com/recipe" />
                
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
                    { label: "Recipes" }
                ]} />
                
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-3xl font-bold mb-2 text-gray-900">Recipes & Cooking</h1>
                    <p className="text-gray-600 mb-6">Personal recipes and cooking adventures from my kitchen, featuring step-by-step instructions and photos</p>
                </div>
                
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