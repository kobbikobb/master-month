import { FeatureCard, PageContainer, PageHeader } from "../components";

export default function Home() {
    return (
        <PageContainer>
            <PageHeader
                title="Welcome to Master Month"
                subtitle="Build lasting habits by focusing on one month at a time."
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
                <FeatureCard
                    title="Set Your Goals"
                    description="Define clear, achievable goals for your month-long journey."
                />
                <FeatureCard
                    title="Track Progress"
                    description="Monitor your daily habits and stay accountable throughout the month."
                />
                <FeatureCard
                    title="Build Momentum"
                    description="Create lasting change by mastering one focused month at a time."
                />
            </div>
        </PageContainer>
    );
}
