'use client';

import { ChangeFeedContainer } from "@/ui-library";

export default function LoadingPage() {
    return (
        <section>
            <div className="mb-8">
                <span className="text-xs text-gray-500 font-semibold">CHANGE FEED</span>
                <h1 className="text-5xl font-semibold mt-2">What's New</h1>
            </div>
            <ChangeFeedContainer sourceData={undefined} />
        </section>
    );
}