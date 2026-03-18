import HeroBanner from "@/components/HeroBanner";
import LivePredictions from "@/components/LivePredictions";
import MatchHistory from "@/components/MatchHistory";
import MatchPrediction from "@/components/MatchPrediction";
import TopPredictors from "@/components/TopPredictors";
import ActivePool from "@/components/ActivePool";
import BecomeLegend from "@/components/BecomeLegend";

export default function FeedPage() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
			{/* Main content — 8 cols */}
			<div className="lg:col-span-8 flex flex-col gap-6">
				<HeroBanner />
				<MatchHistory />
				<MatchPrediction />
				<LivePredictions />
			</div>

			{/* Sidebar — 4 cols */}
			<div className="lg:col-span-4 flex flex-col gap-6">
				<TopPredictors />
				<ActivePool />
				<BecomeLegend />
			</div>
		</div>
	);
}
