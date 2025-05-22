// This file will store shared TypeScript interfaces and type definitions

export interface SyncEvent {
  id: string;
  timestamp: string;
  type: string; // e.g., 'start', 'fetch_data', 'processing', 'api_error', 'completion'
  description: string;
  status: 'success' | 'failure' | 'warning' | 'info';
  details?: Record<string, any>;
}

export interface SyncedContentItem {
  id: string;
  title: string;
  type: string; // e.g., 'KB Article', 'FAQ', 'Pricing Info', 'Guide', 'Documentation', 'Category', 'Policy', 'Memo'
  status: string; // e.g., 'Synced', 'Updated', 'Failed', 'Synced with missing image', 'Synced with warnings', 'No Change', 'Processing Failed'
  itemType: string; // e.g., 'article', 'category'
  action: string; // e.g., 'created', 'updated', 'deleted', 'no_change', 'failed_to_process'
  parentCategory?: string; // Optional: for articles, to know which category they belong to
}

export interface SyncOperation {
  id: string; // Changed from syncId
  timestamp: string;
  status: 'completed' | 'failure' | 'completed_with_errors' | 'in_progress'; // Updated status enum
  triggerType: string; // Added
  duration: number; // Added, in milliseconds
  stats: { // Added detailed stats object
    documentsProcessed: number;
    pagesCreated: number;
    pagesUpdated: number;
    pagesDeleted: number;
    versionConflicts: number;
    errorsEncountered: number;
  };
  events: SyncEvent[];
  syncedContentPreview?: SyncedContentItem[];
}


export interface VolumeDataPoint {
  date: string;
  total: number;
  aiResolved: number;
  humanAssisted: number;
}

export interface AIPerformanceDataPoint {
  date: string;
  intentAccuracy: number;
  contextQuality: number;
  actionSuccessRate: number;
  handoffAccuracy: number;
}

export type Timestamp = string | number | Date;

export interface SummaryMetric {
  id: string;
  title: string;
  value: string;
  detail: string;
  icon?: React.ReactNode; // Made icon optional as it might not always be used directly in types
  tooltipText: string;
}

export interface PerformanceMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon?: React.ReactNode;
  tooltipText: string;
}

export type ConversationEventId = "overview" | "intent" | "knowledge" | "action" | "handoff" | "resolution";

export interface ConversationEventBase {
  id: ConversationEventId;
  name: string;
  successRate: number;
  // icon: React.ReactElement<LucideProps>; // Icons are UI specific, better to handle in components
  color: string;
  lightColor: string;
  borderColor: string;
  total: number;
  successful: number;
  avgPerConversation: number;
  avgTime: string;
  totalEvents: number;
}

export interface IntentEvent extends ConversationEventBase {
  id: "intent";
  needsClarification: number;
  failed: number;
}

export interface KnowledgeEvent extends ConversationEventBase {
  id: "knowledge";
  lowRelevance: number;
  failed: number;
}

export interface ActionEvent extends ConversationEventBase {
  id: "action";
  completedWithWarnings: number;
  failed: number;
}

export interface HandoffEvent extends ConversationEventBase {
  id: "handoff";
  routedIncorrectly: number;
  failed: number;
}

export interface ResolutionEvent extends ConversationEventBase {
  id: "resolution";
  humanNeeded: number;
}

export type AnyConversationEvent = IntentEvent | KnowledgeEvent | ActionEvent | HandoffEvent | ResolutionEvent;

export interface CommonIntent {
  name: string;
  percent: number;
  trend: string;
}

export interface Improvement {
  name: string;
  impact: string;
  description: string;
}

export interface KnowledgeGap {
  name: string;
  percent: number;
  trend: string;
}

export interface CommonAction {
  name: string;
  count: number;
  success: number;
}

export interface HandoffReason {
  name: string;
  percent: number;
  trend: string;
}

export interface HandoffByTeam {
  name: string;
  percent: number;
  appropriate: number;
}

export interface ResolutionType {
  name: string;
  percent: number;
  avgTime: number;
}

export interface SatisfactionScore {
  name: string;
  score: number;
}

export interface EventDetailContent {
  title: string;
  description: string;
  improvements: Improvement[];
  commonIntents?: CommonIntent[];
  knowledgeGaps?: KnowledgeGap[];
  commonActions?: CommonAction[];
  handoffReasons?: HandoffReason[];
  handoffByTeam?: HandoffByTeam[];
  resolutionTypes?: ResolutionType[];
  satisfactionScores?: SatisfactionScore[];
}

export type EventDetails = Record<ConversationEventId, EventDetailContent>;

// Recharts generic types
export type RechartsValueType = number | string | Array<number | string>;
export type RechartsNameType = number | string;

export interface ChartTooltipPayload {
  name?: RechartsNameType;
  value?: RechartsValueType;
  color?: string;
  fill?: string;
  stroke?: string;
  dataKey?: string | number;
  payload?: any; 
  [key: string]: any; 
}

// Note: Recharts' TooltipProps can be imported directly in components needing it.
// import type { TooltipProps } from 'recharts';
// interface CustomTooltipProps extends TooltipProps<RechartsValueType, RechartsNameType> {}

export interface EventOutcome {
  name: string;
  successful: number;
  failed?: number;
  needsClarification?: number;
  lowRelevance?: number;
  completedWithWarnings?: number;
  routedIncorrectly?: number;
}

// Props for section components
// --- Existing SectionProps --- 
export interface SectionProps {
  selectedTimePeriod: string;
  setActiveSection: (sectionId: string | null) => void; // Function to set the active/expanded section
  // selectedSection: string; // The section component knows its own identity
  // Add other shared types here as your dashboard grows
}

// --- Processed Conversation Group Type (for Activity Log) ---
export interface ProcessedConversationGroup {
  groupId: string;
  logs: LogEntry[];
  successCount: number;
  failureCount: number;
  warningCount: number;
  eventTypeCounts: Record<string, number>;
  latestTimestamp?: string;
  totalEvents: number;
  currentTeam: string;
  conversationTopic: string;
}

// --- Activity Timeline Types ---

export type LogStatus = 'success' | 'warning' | 'failure';
export type SourceComponentType = 
  | 'Orchestrator'
  | 'IntentRecognitionBot'
  | 'DomainTransferBot'
  | 'HandoffBot'
  | 'KnowledgeBot'
  | string; // To allow for other bot types

export interface CoreEventDetails {
  userQuery?: string;
  confidence?: number;
  processingTimeMs?: number;
  actionName?: string;
  errorMessage?: string;
  errorType?: string;
  aiResponseToUser?: string;
  targetTeam?: string;
  handoffReason?: string;
  invokedLambda?: string;
  webhookEvent?: string;
  // Add other common details here
  [key: string]: any; // For additional, less common fields
}

export interface BotGeminiInteraction {
  modelUsed?: string;
  prompt?: string; // Or structured prompt parts
  response?: string; // Or structured response parts
  functionCallDetails?: {
    name: string;
    args: Record<string, any>;
    internal_note?: string; // Specifically for Gemini function call internal notes
  };
  // ... other interaction details
}

// Specific payload/interaction data examples (can be expanded)
export interface OrchestratorWebhookPayload {
  [key: string]: any;
}
export interface BotLambdaPayload {
  [key: string]: any;
}
export interface BotLambdaResponse {
  [key: string]: any;
}

export interface ConsolidatedRawEventData {
  logId: string;
  timestamp: string; // Full ISO string
  sourceComponent: SourceComponentType;
  type: string;
  status: LogStatus;
  description: string;
  conversationId?: string;
  accountId?: string;
  coreEventDetails?: CoreEventDetails;
  // Component-specific payloads/interactions - these are illustrative
  orchestrator_received_webhook_payload?: OrchestratorWebhookPayload;
  bot_received_lambda_payload?: BotLambdaPayload;
  bot_gemini_interaction?: BotGeminiInteraction;
  bot_sent_lambda_response?: BotLambdaResponse;
  // ... other specific data structures as needed
  [key: string]: any; // Allow for additional top-level raw data fields
}

export interface LogDetails extends CoreEventDetails { // Inherits common fields
  // This can still hold the original, less structured details if needed
  // or more specific structured data not fitting into CoreEventDetails directly.
  internal_note?: string; // General internal note for the event, separate from Gemini's
  // Potentially include the raw payloads here if not pre-transforming to ConsolidatedRawEventData
  raw_webhook_payload?: OrchestratorWebhookPayload;
  raw_lambda_payload?: BotLambdaPayload;
  raw_gemini_interaction?: BotGeminiInteraction;
  raw_lambda_response?: BotLambdaResponse;
}

export interface LogEntry {
  logId: string;
  timestamp: string; // ISO string, e.g., "2024-07-16T10:13:15.000Z"
  sourceComponent: SourceComponentType;
  type: string; // e.g., 'webhook_received', 'intent_recognition', 'action_execution'
  status: LogStatus;
  description: string; // Concise summary for unexpanded view
  conversationId?: string;
  accountId?: string;
  details: LogDetails; // Contains data for "Key Details" and potentially "Internal Note"
  // `consolidatedRawEventData` is what the spec describes for the JSON viewer.
  // It can be pre-calculated or derived by the component if necessary.
  consolidatedRawEventData?: ConsolidatedRawEventData; 
}
