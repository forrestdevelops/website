import Link from "next/link";

interface Item {
    id: string;
    name: string;
}

interface ItemListProps {
    items: Item[];
    basePath: string;
}

export default function ItemList({ items, basePath }: ItemListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(items) && items.map((item) => (
                <Link href={`${basePath}/${item.id}`} key={item.id} className="block">
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 hover:border-blue-300">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                        <div className="flex items-center text-blue-600">
                            <span className="text-sm">View details</span>
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}