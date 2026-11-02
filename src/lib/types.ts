export interface AuthUser {
	id: number;
	fullName: string | null;
	nickname: string | null;
	email: string;
	role: "user" | "admin" | "operator";
	/** Staff sessions only. */
	twoFactorEnabled?: boolean;
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

export interface MatchRules {
	winnerPoolPercentage: number;
	exactPoints: number;
	partialPoints: number;
}

export interface MatchPool {
	/** Winners' share of this match plus pots carried over from earlier matches. */
	prizePool: number;
	bonus: number;
	carriedOver: number;
	carriedOverToMatchId: number | null;
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
	/** Confirmed tickets that hit the exact score; null until the result exists. */
	winners?: {
		tickets: number;
		participants: number;
	} | null;
}

export interface ExactHit {
	matchId: number;
	homeTeam: string;
	awayTeam: string;
	competition: string;
	scheduledAt: string;
	homeScore: number;
	awayScore: number;
	points: number;
}

export interface MatchItem {
	paymentAvailable?: boolean;
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
	cancelledAt?: string | null;
	cancelReason?: string | null;
	rules?: MatchRules;
	pool?: MatchPool;
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
	userId?: number | null;
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
	/** Only present on the creation response; lets a guest cancel the order. */
	cancelToken?: string | null;
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
	/** Confirmed-feed items are one per score, keyed "event-bet". */
	id: number | string;
	type: string;
	title: string;
	description: string;
	metadata: Record<string, unknown> | null;
	createdAt: string;
}

export interface HomeResponse {
	matches?: MatchItem[];
	nextMatch: MatchItem | null;
	activePoolAmount: number;
	participantsCount: number;
	poolDistribution?: { winners: number; base: number };
	topPredictors: LeaderboardRow[];
	activityFeed: ActivityFeedItem[];
}

export interface DashboardResponse {
	period: { from: string | null; to: string | null };
	metrics: {
		grossRevenue: number;
		orders: number;
		ticketsSold: number;
		providerFees: number;
		netRevenue: number;
		prizesReserved: number;
		prizesPending: number;
		prizesPaid: number;
		margin: number;
		refunded: number;
		pendingPayments: number;
		refundPending: number;
		newUsers: number;
	};
	series: Array<{ day: string; orders: number; revenue: number }>;
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

export interface FinancialMatchRow {
	id: number;
	label: string;
	scheduledAt: string;
	status: string;
	revenue: number;
	providerFees: number;
	prizePool: number;
	bonusReceived: number;
	prizes: number;
	prizesPaid: number;
	carriedOver: number;
	refunded: number;
	refundPending: number;
	houseShare: number;
	net: number;
}

export interface Paginated<T> {
	data: T[];
	meta: { page: number; perPage: number; total: number; lastPage: number };
}

export interface AdminPaymentItem extends PaymentItem {
	providerPaymentId: string | null;
	providerStatus: string | null;
	providerFee: number | null;
	netAmount: number | null;
	expiresAt: string | null;
	refundedAt: string | null;
	refundReference: string | null;
	buyer: {
		name: string;
		email: string;
		cpf: string;
		phone: string;
		userId: number | null;
	} | null;
	match: { id: number; homeTeam: string; awayTeam: string } | null;
	totalTickets: number;
	bets: Array<{ id: number; prediction: string; tickets: number; status: string }>;
}

export interface AdminPrizeItem extends PrizeItem {
	hasReceipt: boolean;
	winner: {
		name: string;
		nickname: string | null;
		email: string;
		cpf: string;
		phone: string;
		pixKey: string;
		guest: boolean;
	};
	bet: { id: number; prediction: string; tickets: number };
	match: { id: number; homeTeam: string; awayTeam: string; scheduledAt: string };
}

export interface AdminUserItem {
	id: number;
	fullName: string | null;
	nickname: string | null;
	email: string;
	cpf: string | null;
	phone: string | null;
	pixKey: string | null;
	status: "active" | "blocked";
	avatarUrl: string | null;
	createdAt: string | null;
	lastLoginAt: string | null;
	stats: { tickets: number; spent: number; prizes: number; points: number };
}

export interface AdminUserDetail {
	user: AuthUser & { stats: AdminUserItem["stats"] | null };
	orders: Array<
		Omit<AdminPaymentItem, "bets"> & {
			bets: Array<{
				id: number;
				prediction: string;
				tickets: number;
				status: string;
				resultStatus: string | null;
				points: number;
			}>;
		}
	>;
	prizes: Array<PrizeItem & { match: { id: number; homeTeam: string; awayTeam: string } }>;
	points: Array<{
		matchId: number;
		label: string;
		scheduledAt: string;
		points: number;
		resultStatus: string | null;
	}>;
}

export interface MatchReport {
	match: MatchItem;
	pool: {
		rules: MatchRules;
		revenue: number;
		bonus: number;
		winnersShare: number;
		prizePool: number;
		houseShare: number;
	};
	result: { homeScore: number; awayScore: number } | null;
	payments: Record<string, { orders: number; amount: number; fees: number; net: number }>;
	distribution: Array<{
		homeScore: number;
		awayScore: number;
		tickets: number;
		bettors: number;
		payoutPerTicket: number;
		isResult: boolean;
	}>;
	bettors: Array<{
		betId: number;
		paymentId: number;
		userId: number | null;
		name: string;
		nickname: string | null;
		email: string;
		phone: string;
		homeScore: number;
		awayScore: number;
		tickets: number;
		amount: number;
		status: string;
		resultStatus: string | null;
		points: number;
		createdAt: string;
	}>;
	prizes: Array<PrizeItem & { hasReceipt: boolean }>;
}

export interface AuditLogItem {
	id: number;
	action: string;
	entityType: string;
	entityId: string | null;
	description: string | null;
	metadata: Record<string, unknown> | null;
	admin: { id: number; name: string } | null;
	createdAt: string;
}

export interface StaffMember {
	id: number;
	fullName: string | null;
	email: string;
	role: "admin" | "operator";
	status: "active" | "blocked";
	twoFactorEnabled: boolean;
	lastLoginAt: string | null;
	createdAt: string;
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
