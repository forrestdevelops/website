import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white mt-16">
            <div className="container mx-auto p-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-6 mb-4 md:mb-0">
                        <Link href="/weight-tracker" className="text-gray-300 hover:text-white transition-colors">
                            Weight Tracker
                        </Link>
                        <a 
                            href="https://gitlab.com/forrestdevelops" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            GitLab
                        </a>
                    </div>
                    <div className="text-gray-400 text-sm">
                        © 2025 Forrest Develops. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
