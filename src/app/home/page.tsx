import HomeFooter from "@/components/home-footer";
import HomeHero from "@/components/home-hero";

export default function Homepage() {
    return (
        <div className="flex h-screen flex-col items-center justify-between">
            <HomeHero />
            <HomeFooter />
        </div>
    );
}
