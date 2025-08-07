import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import { api } from "~/utils/api";

export default function Home() {
  const info = api.info.hello.useQuery();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Forrest Smietanski",
    "url": "https://forrestdevelops.com",
    "description": "Developer who loves craft beer and cooking",
    "sameAs": [
      "https://gitlab.com/forrestdevelops"
    ],
    "knowsAbout": [
      "Web Development",
      "Craft Beer",
      "Cooking",
      "Recipes"
    ]
  };

  return (
    <>
      <Head>
        <title>Forrest Smietanski - Developer, Beer Enthusiast & Food Lover</title>
        <meta name="description" content="Personal website of Forrest Smietanski - a developer who loves craft beer and cooking. Explore beer reviews and recipes from my kitchen adventures." />
        <meta name="keywords" content="Forrest Smietanski, developer, beer reviews, craft beer, recipes, cooking, personal website" />
        <meta name="author" content="Forrest Smietanski" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://forrestdevelops.com/" />
        <meta property="og:title" content="Forrest Smietanski - Developer, Beer Enthusiast & Food Lover" />
        <meta property="og:description" content="Personal website featuring beer reviews and recipes from a developer who loves craft beer and cooking." />
        <meta property="og:image" content="https://forrestdevelops.com/og-image.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://forrestdevelops.com/" />
        <meta property="twitter:title" content="Forrest Smietanski - Developer, Beer Enthusiast & Food Lover" />
        <meta property="twitter:description" content="Personal website featuring beer reviews and recipes from a developer who loves craft beer and cooking." />
        <meta property="twitter:image" content="https://forrestdevelops.com/og-image.jpg" />
        
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://forrestdevelops.com/" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </Head>
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4 max-w-6xl">
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Forrest Smietanski
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Welcome to my personal corner of the web
            </p>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              I'm a developer who loves craft beer and cooking. Here you'll find my personal beer reviews 
              and favorite recipes from my kitchen adventures.
            </p>
          </div>

          {/* Main Content Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Beer Reviews Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 0v10a2 2 0 002 2h4a2 2 0 002-2V7m-8 0V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Beer Reviews</h2>
                  <p className="text-gray-600">Personal craft beer reviews and ratings</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Explore my personal reviews of craft beers from around the world. 
                Each review includes detailed tasting notes, ratings, and photos.
              </p>
              <Link href="/beer" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Browse Reviews
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Recipes Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Recipes</h2>
                  <p className="text-gray-600">Favorite dishes from my kitchen</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Discover my favorite recipes and cooking adventures. 
                From quick weeknight meals to special occasion dishes.
              </p>
              <Link href="/recipe" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
                View Recipes
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
