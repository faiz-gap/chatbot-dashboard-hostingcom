// Mock data for Knowledge Sync Section
import type { SyncOperation, SyncEvent } from '../types';
import { subHours, subMinutes, subDays } from 'date-fns';

export const mockSyncOperations: SyncOperation[] = [
  {
    id: 'sync-op-123',
    timestamp: subHours(new Date(), 2).toISOString(),
    status: 'completed',
    triggerType: 'manual',
    duration: 9500, // 9.5 seconds
    stats: { documentsProcessed: 150, pagesCreated: 15, pagesUpdated: 5, pagesDeleted: 2, versionConflicts: 1, errorsEncountered: 0 },
    events: [
      { id: 'evt-1', timestamp: subHours(new Date(), 2).toISOString(), description: 'Sync initiated by user@example.com', status: 'info', type: 'info' },
      { id: 'evt-2', timestamp: subMinutes(subHours(new Date(), 2), -1).toISOString(), description: 'Fetching content from source: Confluence Space X', status: 'info', type: 'info' },
      { id: 'evt-3', timestamp: subMinutes(subHours(new Date(), 2), -3).toISOString(), description: 'Processing 150 documents...', status: 'info', type: 'info' },
      { id: 'evt-4', timestamp: subMinutes(subHours(new Date(), 2), -9).toISOString(), description: '15 new pages created, 5 pages updated.', status: 'success', type: 'success' },
      { id: 'evt-5', timestamp: subMinutes(subHours(new Date(), 2), -9).toISOString(), description: '2 pages marked for deletion.', status: 'warning', type: 'warning' },
      { id: 'evt-6', timestamp: subMinutes(subHours(new Date(), 2), -9).toISOString(), description: 'Version conflict detected for \"API Rate Limits Policy v2\". Manual review suggested.', status: 'warning', type: 'warning' },
      { id: 'evt-7', timestamp: subMinutes(subHours(new Date(), 2), -9).toISOString(), description: 'Sync completed successfully.', status: 'success', type: 'success' },
    ],
    syncedContentPreview: [
      { id: 'doc-001', title: 'Getting Started with Our API', type: 'Guide', status: 'Synced', itemType: 'article', action: 'updated', parentCategory: 'API Documentation' },
      { id: 'doc-002', title: 'Troubleshooting Common Issues', type: 'FAQ', status: 'Synced with warnings', itemType: 'article', action: 'updated', parentCategory: 'Support' },
      { id: 'doc-003', title: 'Advanced Configuration', type: 'Documentation', status: 'Synced', itemType: 'article', action: 'created', parentCategory: 'API Documentation' },
      { id: 'cat-001', title: 'API Documentation', type: 'Category', status: 'No Change', itemType: 'category', action: 'no_change' },
      { id: 'cat-002', title: 'Support', type: 'Category', status: 'Synced', itemType: 'category', action: 'created' },
      { id: 'doc-007', title: 'New Feature X Guide', type: 'Guide', status: 'Synced', itemType: 'article', action: 'created', parentCategory: 'Product Updates' },
      { id: 'cat-003', title: 'Product Updates', type: 'Category', status: 'Synced', itemType: 'category', action: 'created' },
      { id: 'doc-008', title: 'Old Feature Y Deprecated', type: 'Guide', status: 'Synced', itemType: 'article', action: 'deleted', parentCategory: 'Archived Features' },
    ]
  },
  {
    id: 'sync-op-456',
    timestamp: subDays(new Date(), 1).toISOString(),
    status: 'failure',
    triggerType: 'scheduled',
    duration: 120000, // 2 minutes
    stats: { documentsProcessed: 50, pagesCreated: 0, pagesUpdated: 0, pagesDeleted: 0, versionConflicts: 0, errorsEncountered: 3 },
    events: [
      { id: 'evt-fs-1', timestamp: subDays(new Date(), 1).toISOString(), description: 'Scheduled sync started.', status: 'info', type: 'info' },
      { id: 'evt-fs-2', timestamp: subMinutes(subDays(new Date(), 1), -1).toISOString(), description: 'Error connecting to data source: Timeout.', status: 'failure', type: 'failure' },
      { id: 'evt-fs-3', timestamp: subMinutes(subDays(new Date(), 1), -1).toISOString(), description: 'Retrying connection (1/3)...', status: 'warning', type: 'warning' },
      { id: 'evt-fs-4', timestamp: subMinutes(subDays(new Date(), 1), -2).toISOString(), description: 'Error connecting to data source: Timeout.', status: 'failure', type: 'failure' },
      { id: 'evt-fs-5', timestamp: subMinutes(subDays(new Date(), 1), -2).toISOString(), description: 'Sync failed after multiple retries.', status: 'failure', type: 'failure' },
    ],
    syncedContentPreview: [] // No content preview due to failure
  },
  {
    id: 'sync-op-789',
    timestamp: subDays(new Date(), 3).toISOString(),
    status: 'completed_with_errors',
    triggerType: 'webhook',
    duration: 35000, // 35 seconds
    stats: { documentsProcessed: 75, pagesCreated: 5, pagesUpdated: 2, pagesDeleted: 0, versionConflicts: 0, errorsEncountered: 1 },
    events: [
      { id: 'evt-cwe-1', timestamp: subDays(new Date(), 3).toISOString(), description: 'Webhook received: content update from CMS.', status: 'info', type: 'info' },
      { id: 'evt-cwe-2', timestamp: subMinutes(subDays(new Date(), 3), -10).toISOString(), description: 'Processing 75 documents...', status: 'info', type: 'info' },
      { id: 'evt-cwe-3', timestamp: subMinutes(subDays(new Date(), 3), -30).toISOString(), description: 'Failed to process document \"Internal Memo Q3\". Skipping.', status: 'failure', type: 'failure' },
      { id: 'evt-cwe-4', timestamp: subMinutes(subDays(new Date(), 3), -35).toISOString(), description: 'Sync completed with 1 error.', status: 'warning', type: 'warning' },
    ],
    syncedContentPreview: [
      { id: 'doc-004', title: 'Onboarding New Hires', type: 'Policy', status: 'Synced', itemType: 'article', action: 'updated', parentCategory: 'HR Policies' },
      { id: 'doc-005', title: 'Security Best Practices', type: 'Guide', status: 'Synced', itemType: 'article', action: 'created', parentCategory: 'IT Security' },
      { id: 'cat-004', title: 'HR Policies', type: 'Category', status: 'No Change', itemType: 'category', action: 'no_change' },
      { id: 'cat-005', title: 'IT Security', type: 'Category', status: 'Synced', itemType: 'category', action: 'updated' },
      { id: 'doc-006', title: 'Internal Memo Q3', type: 'Memo', status: 'Processing Failed', itemType: 'article', action: 'failed_to_process', parentCategory: 'Internal Memos'}
    ]
  },
  {
    id: 'sync-op-000-empty',
    timestamp: subDays(new Date(), 5).toISOString(),
    status: 'completed',
    triggerType: 'manual',
    duration: 500, // 0.5 seconds
    stats: { documentsProcessed: 0, pagesCreated: 0, pagesUpdated: 0, pagesDeleted: 0, versionConflicts: 0, errorsEncountered: 0 },
    events: [
      { id: 'evt-empty-1', timestamp: subDays(new Date(), 5).toISOString(), description: 'Manual sync triggered for empty source.', status: 'info', type: 'info' },
      { id: 'evt-empty-2', timestamp: subMinutes(subDays(new Date(), 5), -0.5).toISOString(), description: 'No new content found. Sync completed.', status: 'success', type: 'success' },
    ],
    syncedContentPreview: []
  }
];
