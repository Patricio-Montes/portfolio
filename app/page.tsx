import PortfolioShell from "@/components/PortfolioShell";
import { portfolioContent } from "@/content/portfolio";

export default function Home() {
  return <PortfolioShell content={portfolioContent} />;
}
