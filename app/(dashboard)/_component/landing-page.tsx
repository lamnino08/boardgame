'use client'

import { Card, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/common/button/button";
import { useRouter } from "next/navigation";

export const LandingPage = () => {
    const router = useRouter();

    return (
        <div className="h-[calc(100vh-154px)] flex flex-col items-center justify-center">
            <div className="max-w-3xl text-center animate-fade-in-up opacity-0 animate-delay-200">
                <h1 className="text-4xl font-bold tracking-tight text-text-primary">
                    Personal Finance Management
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Track your <span className="text-success">income</span> and <span className="text-danger">expenses</span>, create spending plans, and manage your finances effortlessly and intelligently.
                </p>

                <div className="mt-8 flex justify-center gap-4">
                    <Button onClick={() => router.push("/auth/sign-up")}>Get Started</Button>
                    <Button variant="outline">See Features</Button>
                </div>
            </div>

            {/* Feature Highlights Section */}
            <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
                {[
                    {
                        title: "Income & Expenses",
                        desc: "Easily record your daily income and spending in a visual format.",
                    },
                    {
                        title: "Financial Analysis",
                        desc: "View charts and reports to gain insights into your financial trends.",
                    },
                    {
                        title: "Set Goals",
                        desc: "Create savings goals and monitor your progress toward achieving them.",
                    },
                ].map((item, i) => (
                    <div
                        key={i}
                        className={`animate-fade-in-up animate-delay-${i * 200}`}
                    >
                        <Card>
                            <CardTitle title={item.title} />
                            <p className="text-muted-foreground text-sm">{item.desc}</p>
                        </Card>
                    </div>
                ))}
            </section>
        </div>
    );
};