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
        <ul>
            {Array.isArray(items) && items.map((item) => (
                <li key={item.id}>
                    <Link href={`${basePath}/${item.id}`} legacyBehavior>
                        <a className="text-blue-500 hover:underline">{item.name}</a>
                    </Link>
                </li>
            ))}
        </ul>
    );
}