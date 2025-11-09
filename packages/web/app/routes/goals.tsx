import { useLoaderData } from "react-router";

interface ApiResponse {
    message: string;
    bucket: string;
}

export async function clientLoader() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/`);
    return res.json() as Promise<ApiResponse>;
}

export default function Goals() {
    const data = useLoaderData<typeof clientLoader>();

    return (
        <>
            <h1>Goals Page</h1>
            <div className="mt-4 p-4 bg-gray-100 rounded">
                <p>
                    <strong>Message:</strong> {data.message}
                </p>
                <p>
                    <strong>Bucket:</strong> {data.bucket}
                </p>
            </div>
        </>
    );
}
