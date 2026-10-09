export interface AuthUser {
	id: number;
	fullName: string | null;
	nickname: string | null;
	email: string;
	role: "user" | "admin";
	status: "active" | "blocked";
	cpf: string | null;
	phone: string | null;
	pixKey: string | null;
	avatarUrl: string | null;
	lastLoginAt: string | null;
	createdAt: string;
	updatedAt: string | null;
	initials: string;
}

export interface MatchStats {
	tickets: number;
	revenue: number;
	participants: number;
	consensus: {
		homeScore: number;
		awayScore: number;
		tickets: number;
	} | null;
}

export interface MatchItem {
	id: number;
	homeTeam: string;
	awayTeam: string;
	homeTeamLogoUrl: string | null;
	awayTeamLogoUrl: string | null;
	competition: string;
	scheduledAt: string;
	bettingDeadlineAt: string;
	ticketPrice: number;
	status: string;
	notes: string | null;
	result: {
		homeScore: number;
		awayScore: number;
		registeredAt: string | null;
	} | null;
	stats: MatchStats;
	createdAt: string;
	updatedAt: string | null;
}

export interface PaymentItem {
	id: number;
	method: string;
	status: string;
	amount: number;
	pixCode: string | null;
	pixQrCodeBase64: string | null;
	reference: string | null;
	notes: string | null;
	confirmedAt: string | null;
	createdAt: string;
	updatedAt: string | null;
}

export interface PaymentStatusResponse {
	id: number;
	status: string;
	confirmedAt: string | null;
}

export interface PrizeItem {
	id: number;
	betId: number;
	matchId: number;
	userId: number;
	grossAmount: number;
	status: string;
	paymentReference: string | null;
	notes: string | null;
	approvedAt: string | null;
	paidAt: string | null;
	createdAt: string;
	updatedAt: string | null;
}

export interface BetItem {
	id: number;
	matchId: number;
	paymentId: number | null;
	homeScorePrediction: number;
	awayScorePrediction: number;
	tickets: number;
	ticketPrice: number;
	totalAmount: number;
	status: string;
	resultStatus: "exact" | "partial" | "miss" | null;
	points: number;
	snapshot: {
		name: string;
		email: string;
		cpf: string;
		phone: string;
		pixKey: string;
	};
	paidAt: string | null;
	settledAt: string | null;
	match: MatchItem;
	payment: PaymentItem | null;
	prize: PrizeItem | null;
	createdAt: string;
	updatedAt: string | null;
}

export interface BetOrderResponse {
	bets: BetItem[];
	payment: PaymentItem;
	match: MatchItem;
}

export interface LeaderboardRow {
	rank: number;
	userId: number;
	name: string;
	avatarUrl: string | null;
	points: number;
	accuracy: number;
	exactHits: number;
}

export interface ActivityFeedItem {
	id: number;
	type: string;
	title: string;
	description: string;
	metadata: Record<string, unknown> | null;
	createdAt: string;
}

export interface HomeResponse {
	nextMatch: MatchItem | null;
	activePoolAmount: number;
	participantsCount: number;
	poolDistribution?: { winners: number; base: number };
	topPredictors: LeaderboardRow[];
	activityFeed: ActivityFeedItem[];
}

export interface DashboardResponse {
	metrics: {
		grossRevenue: number;
		ticketsSold: number;
		prizesReserved: number;
		margin: number;
		pendingPayments: number;
	};
	recentPayments: Array<{
		id: number;
		status: string;
		amount: number;
		reference: string | null;
		userName: string;
		matchLabel: string;
		createdAt: string;
	}>;
}

export interface AdminPaymentItem extends PaymentItem {
	bet: {
		id: number;
		userId: number;
		snapshotName: string;
		prediction: string;
		tickets: number;
		status: string;
	} | null;
	match: MatchItem | null;
}

export interface AdminPrizeItem extends PrizeItem {
	bet: {
		id: number;
		snapshotName: string;
		prediction: string;
		tickets: number;
	};
	match: MatchItem;
}

export interface AdminUserItem extends AuthUser {
	stats: {
		bets: number;
		payments: number;
		prizes: number;
	};
}

export interface Team {
	id: number;
	name: string;
	slug: string;
	shortName: string;
	state: string | null;
	logoUrl: string | null;
}

export interface AppSettings {
	id: number;
	exactPoints: number;
	partialPoints: number;
	winnerPoolPercentage: number;
	basePoolPercentage: number;
	defaultTicketPrice: number;
	createdAt: string;
	updatedAt: string | null;
}
