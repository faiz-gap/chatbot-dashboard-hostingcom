import type { LogEntry } from '../types';

const now = Date.now();

export const mockActivityLogs: LogEntry[] = [
  {
    logId: 'evt-orch-001',
    timestamp: new Date(now - 17 * 60 * 1000 - 30 * 1000).toISOString(), // Approx 17m 30s ago
    sourceComponent: 'Orchestrator',
    type: 'webhook_received',
    status: 'success',
    description: 'Chatwoot webhook received for new incoming message',
    conversationId: 'conv-12345',
    accountId: 'acc-whg',
    details: {
      webhookEvent: 'message_created',
      userQuery: 'Hi, I want to transfer my domain example.com to you.',
      internal_note: '`Orchestrator`: Received new message event from Chatwoot.'
    },
    consolidatedRawEventData: {
      logId: 'evt-orch-001',
      timestamp: new Date(now - 17 * 60 * 1000 - 30 * 1000).toISOString(),
      sourceComponent: 'Orchestrator',
      type: 'webhook_received',
      status: 'success',
      description: 'Chatwoot webhook received for new incoming message',
      conversationId: 'conv-12345',
      accountId: 'acc-whg',
      coreEventDetails: {
        webhookEvent: 'message_created',
        userQuery: 'Hi, I want to transfer my domain example.com to you.',
      },
      orchestrator_received_webhook_payload: { 
        event: 'message_created',
        data: { id: 123, content: 'Hi, I want to transfer my domain example.com to you.', user_id: 'user-abc' }
      }
    }
  },
  {
    logId: 'evt-orch-002-lambda-invoke',
    timestamp: new Date(now - 16 * 60 * 1000).toISOString(), // Approx 16m ago
    sourceComponent: 'Orchestrator',
    type: 'lambda_invocation',
    status: 'success',
    description: 'Invoked IntentRecognitionBot for intent analysis',
    conversationId: 'conv-12345',
    accountId: 'acc-whg',
    details: {
      invokedLambda: 'IntentRecognitionBot',
      internal_note: '`Orchestrator`: Invoking `IntentRecognitionBot` for message from `conv-12345`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-orch-002-lambda-invoke',
      timestamp: new Date(now - 16 * 60 * 1000).toISOString(),
      sourceComponent: 'Orchestrator',
      type: 'lambda_invocation',
      status: 'success',
      description: 'Invoked IntentRecognitionBot for intent analysis',
      conversationId: 'conv-12345',
      accountId: 'acc-whg',
      coreEventDetails: {
        invokedLambda: 'IntentRecognitionBot',
      },
      bot_sent_lambda_response: { // This might be more of a request payload from orchestrator's perspective
        source: 'Orchestrator',
        target: 'IntentRecognitionBot',
        payload: { conversationId: 'conv-12345', message: 'Hi, I want to transfer my domain example.com to you.' }
      }
    }
  },
  {
    logId: 'evt-intent-001',
    timestamp: new Date(now - 15 * 60 * 1000 - 45 * 1000).toISOString(), // Approx 15m 45s ago
    sourceComponent: 'IntentRecognitionBot',
    type: 'intent_recognition',
    status: 'success',
    description: 'Domain transfer intent detected for example.com',
    conversationId: 'conv-12345',
    accountId: 'acc-whg',
    details: {
      userQuery: 'Hi, I want to transfer my domain example.com to you.',
      confidence: 0.92,
      actionName: 'domain_transfer_bot', // Action Identified
      processingTimeMs: 1200,
      internal_note: '**[Intent Recognition Bot]** Detected domain transfer intent for `example.com`. Routing to *Domain Transfer Bot* to explain the process.'
    },
    consolidatedRawEventData: {
      logId: 'evt-intent-001',
      timestamp: new Date(now - 15 * 60 * 1000 - 45 * 1000).toISOString(),
      sourceComponent: 'IntentRecognitionBot',
      type: 'intent_recognition',
      status: 'success',
      description: 'Domain transfer intent detected for example.com',
      conversationId: 'conv-12345',
      accountId: 'acc-whg',
      coreEventDetails: {
        userQuery: 'Hi, I want to transfer my domain example.com to you.',
        confidence: 0.92,
        actionName: 'domain_transfer_bot',
        processingTimeMs: 1200
      },
      bot_received_lambda_payload: {
        message: 'Hi, I want to transfer my domain example.com to you.',
        userId: 'user-abc'
      },
      bot_gemini_interaction: {
        modelUsed: 'gemini-1.5-flash',
        functionCallDetails: {
          name: 'domain_transfer_bot',
          args: { domainName: 'example.com', query: 'transfer domain' },
          internal_note: 'Detected domain transfer intent for `example.com`. Routing to *Domain Transfer Bot* to explain the process.'
        }
      },
      bot_sent_lambda_response: {
        type: 'domain_query',
        intent: 'domain_transfer',
        entities: { domain: 'example.com' },
        confidence: 0.92
      }
    }
  },
  {
    logId: 'evt-domain-002',
    timestamp: new Date(now - 5 * 60 * 1000).toISOString(), // Approx 5m ago
    sourceComponent: 'DomainTransferBot',
    type: 'action_execution',
    status: 'failure',
    description: 'Failed to validate EPP code for example.com',
    conversationId: 'conv-12345',
    accountId: 'acc-whg',
    details: {
      actionName: 'validate_epp_code',
      errorMessage: 'External registrar API unavailable. Service temporarily down.',
      errorType: 'external_api_error',
      aiResponseToUser: 'I\'m currently unable to validate the EPP code due to a temporary issue with our registrar partner. Please try again in a few minutes.',
      internal_note: '`DomainTransferBot`: EPP code validation failed for `example.com`. External API error.'
    },
    consolidatedRawEventData: {
      logId: 'evt-domain-002',
      timestamp: new Date(now - 5 * 60 * 1000).toISOString(),
      sourceComponent: 'DomainTransferBot',
      type: 'action_execution',
      status: 'failure',
      description: 'Failed to validate EPP code for example.com',
      conversationId: 'conv-12345',
      accountId: 'acc-whg',
      coreEventDetails: {
        actionName: 'validate_epp_code',
        errorMessage: 'External registrar API unavailable. Service temporarily down.',
        errorType: 'external_api_error',
        aiResponseToUser: 'I\'m currently unable to validate the EPP code due to a temporary issue with our registrar partner. Please try again in a few minutes.'
      },
      bot_gemini_interaction: {
        modelUsed: 'gemini-1.5-pro',
        prompt: 'User provided EPP code XXXX for domain example.com. Validate it.',
        response: 'Function call to external_registrar_api.validate_epp failed.' 
      }
    }
  },
  {
    logId: 'evt-handoff-001',
    timestamp: new Date(now - 2 * 60 * 1000).toISOString(), // Approx 2m ago
    sourceComponent: 'HandoffBot',
    type: 'handoff_initiated',
    status: 'success',
    description: 'Handoff to Technical Support initiated for EPP validation failure',
    conversationId: 'conv-12345',
    accountId: 'acc-whg',
    details: {
      targetTeam: 'Technical Support',
      handoffReason: 'EPP validation API failure',
      internal_note: '`HandoffBot`: Initiated handoff to `Technical Support` for `conv-12345` due to EPP validation failure.'
    },
    consolidatedRawEventData: {
      logId: 'evt-handoff-001',
      timestamp: new Date(now - 2 * 60 * 1000).toISOString(),
      sourceComponent: 'HandoffBot',
      type: 'handoff_initiated',
      status: 'success',
      description: 'Handoff to Technical Support initiated for EPP validation failure',
      conversationId: 'conv-12345',
      accountId: 'acc-whg',
      coreEventDetails: {
        targetTeam: 'Technical Support',
        handoffReason: 'EPP validation API failure'
      },
      bot_sent_lambda_response: {
        handoff_status: 'initiated',
        target_team_id: 'team-tech-support',
        context_summary: 'User example.com EPP validation failed due to external API error.'
      }
    }
  },
  {
    logId: 'evt-knowledge-001',
    timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    sourceComponent: 'KnowledgeBot',
    type: 'knowledge_retrieval',
    status: 'success',
    description: 'Retrieved article on DNS propagation times',
    conversationId: 'conv-67890',
    accountId: 'acc-whg',
    details: {
      userQuery: 'how long does dns take to update',
      retrievedArticleId: 'dns-prop-001',
      confidence: 0.98
    },
    consolidatedRawEventData: {
      logId: 'evt-knowledge-001',
      timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
      sourceComponent: 'KnowledgeBot',
      type: 'knowledge_retrieval',
      status: 'success',
      description: 'Retrieved article on DNS propagation times',
      conversationId: 'conv-67890',
      accountId: 'acc-whg',
      coreEventDetails: {
        userQuery: 'how long does dns take to update',
        retrievedArticleId: 'dns-prop-001',
        confidence: 0.98
      }
    }
  },
  {
    logId: 'evt-general-001',
    timestamp: new Date(now - 30 * 1000).toISOString(), // 30s ago
    sourceComponent: 'Orchestrator',
    type: 'system_message',
    status: 'warning',
    description: 'High load detected on IntentRecognitionBot instances.',
    details: {
      metric: 'CPUUtilization',
      value: '85%',
      threshold: '80%'
    },
    consolidatedRawEventData: {
      logId: 'evt-general-001',
      timestamp: new Date(now - 30 * 1000).toISOString(),
      sourceComponent: 'Orchestrator',
      type: 'system_message',
      status: 'warning',
      description: 'High load detected on IntentRecognitionBot instances.',
      coreEventDetails: {
        metric: 'CPUUtilization',
        value: '85%',
        threshold: '80%'
      }
    }
  },
  {
    logId: 'evt-system-warn-001',
    timestamp: new Date(now - 30 * 60 * 1000).toISOString(), // 30 mins ago
    sourceComponent: 'GlobalMonitor',
    type: 'system_health_check',
    status: 'warning',
    description: 'High CPU usage detected on worker node cluster-b-node-3',
    accountId: 'acc-whg',
    details: {
      metric: 'CPUUtilization',
      value: '92%',
      threshold: '90%',
      affectedResource: 'cluster-b-node-3',
      internal_note: '`GlobalMonitor`: CPU usage at 92% on `cluster-b-node-3`. Investigate.'
    },
    consolidatedRawEventData: {
      logId: 'evt-system-warn-001',
      timestamp: new Date(now - 30 * 60 * 1000).toISOString(),
      sourceComponent: 'GlobalMonitor',
      type: 'system_health_check',
      status: 'warning',
      description: 'High CPU usage detected on worker node cluster-b-node-3',
      accountId: 'acc-whg',
      coreEventDetails: {
        metric: 'CPUUtilization',
        value: '92%',
        threshold: '90%',
        affectedResource: 'cluster-b-node-3'
      }
    }
  },
  {
    logId: 'evt-dns-002-check',
    timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(), // Yesterday + 5 mins
    sourceComponent: 'DNSInfoBot',
    type: 'action_execution',
    status: 'success',
    description: 'Checked current DNS records for user query.',
    conversationId: 'conv-67890',
    accountId: 'acc-whg',
    details: {
      actionName: 'check_dns_records',
      domainQueried: 'user-domain.com',
      recordsFound: ['A: 1.2.3.4', 'MX: mail.user-domain.com'],
      internal_note: '`DNSInfoBot`: Successfully checked DNS records for `user-domain.com`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-dns-002-check',
      timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
      sourceComponent: 'DNSInfoBot',
      type: 'action_execution',
      status: 'success',
      description: 'Checked current DNS records for user query.',
      conversationId: 'conv-67890',
      accountId: 'acc-whg',
      coreEventDetails: {
        actionName: 'check_dns_records',
        domainQueried: 'user-domain.com',
        recordsFound: ['A: 1.2.3.4', 'MX: mail.user-domain.com']
      }
    }
  },
  {
    logId: 'evt-msg-001-dns-info',
    timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000 + 6 * 60 * 1000).toISOString(), // Yesterday + 6 mins
    sourceComponent: 'CorePlatform',
    type: 'message_sent_to_user',
    status: 'success',
    description: 'Sent DNS propagation information to user.',
    conversationId: 'conv-67890',
    accountId: 'acc-whg',
    details: {
      messageContent: 'DNS propagation can take up to 48 hours. Your current A record is 1.2.3.4.',
      channel: 'chatwoot',
      internal_note: '`CorePlatform`: Sent DNS info message to user in `conv-67890`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-msg-001-dns-info',
      timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000 + 6 * 60 * 1000).toISOString(),
      sourceComponent: 'CorePlatform',
      type: 'message_sent_to_user',
      status: 'success',
      description: 'Sent DNS propagation information to user.',
      conversationId: 'conv-67890',
      accountId: 'acc-whg',
      coreEventDetails: {
        messageContent: 'DNS propagation can take up to 48 hours. Your current A record is 1.2.3.4.',
        channel: 'chatwoot'
      }
    }
  },
  {
    logId: 'evt-orch-003-followup',
    timestamp: new Date(now - 10 * 60 * 1000).toISOString(), // 10 mins ago (today)
    sourceComponent: 'Orchestrator',
    type: 'webhook_received',
    status: 'success',
    description: 'Chatwoot webhook for follow-up on DNS.',
    conversationId: 'conv-67890',
    accountId: 'acc-whg',
    details: {
      webhookEvent: 'message_created',
      userQuery: 'It has been more than 48 hours, still not working.',
      internal_note: '`Orchestrator`: Received follow-up message for `conv-67890`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-orch-003-followup',
      timestamp: new Date(now - 10 * 60 * 1000).toISOString(),
      sourceComponent: 'Orchestrator',
      type: 'webhook_received',
      status: 'success',
      description: 'Chatwoot webhook for follow-up on DNS.',
      conversationId: 'conv-67890',
      accountId: 'acc-whg',
      coreEventDetails: {
        webhookEvent: 'message_created',
        userQuery: 'It has been more than 48 hours, still not working.'
      }
    }
  },
  {
    logId: 'evt-intent-002-dns-advanced',
    timestamp: new Date(now - 9 * 60 * 1000).toISOString(), // 9 mins ago
    sourceComponent: 'IntentRecognitionBot',
    type: 'intent_recognition',
    status: 'success',
    description: 'Advanced DNS troubleshooting intent recognized.',
    conversationId: 'conv-67890',
    accountId: 'acc-whg',
    details: {
      userQuery: 'It has been more than 48 hours, still not working.',
      confidence: 0.88,
      actionName: 'advanced_dns_info_bot',
      internal_note: '`IntentRecognitionBot`: Recognized advanced DNS troubleshooting intent for `conv-67890`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-intent-002-dns-advanced',
      timestamp: new Date(now - 9 * 60 * 1000).toISOString(),
      sourceComponent: 'IntentRecognitionBot',
      type: 'intent_recognition',
      status: 'success',
      description: 'Advanced DNS troubleshooting intent recognized.',
      conversationId: 'conv-67890',
      accountId: 'acc-whg',
      coreEventDetails: {
        userQuery: 'It has been more than 48 hours, still not working.',
        confidence: 0.88,
        actionName: 'advanced_dns_info_bot'
      }
    }
  },
  {
    logId: 'evt-dns-003-advanced-info',
    timestamp: new Date(now - 8 * 60 * 1000).toISOString(), // 8 mins ago
    sourceComponent: 'AdvancedDNSInfoBot',
    type: 'action_execution',
    status: 'warning',
    description: 'Provided advanced DNS info, but some tools timed out.',
    conversationId: 'conv-67890',
    accountId: 'acc-whg',
    details: {
      actionName: 'provide_advanced_dns_info',
      infoProvided: ['Traceroute results (partial)', 'WHOIS lookup (success)'],
      warningMessage: 'DNS propagation checker tool timed out.',
      aiResponseToUser: 'I was able to get some diagnostic information, but one of our tools is a bit slow. It seems like...', 
      internal_note: '`AdvancedDNSInfoBot`: Provided partial advanced DNS info for `conv-67890`. Propagation checker timed out.'
    },
    consolidatedRawEventData: {
      logId: 'evt-dns-003-advanced-info',
      timestamp: new Date(now - 8 * 60 * 1000).toISOString(),
      sourceComponent: 'AdvancedDNSInfoBot',
      type: 'action_execution',
      status: 'warning',
      description: 'Provided advanced DNS info, but some tools timed out.',
      conversationId: 'conv-67890',
      accountId: 'acc-whg',
      coreEventDetails: {
        actionName: 'provide_advanced_dns_info',
        infoProvided: ['Traceroute results (partial)', 'WHOIS lookup (success)'],
        warningMessage: 'DNS propagation checker tool timed out.',
        aiResponseToUser: 'I was able to get some diagnostic information, but one of our tools is a bit slow. It seems like...'
      }
    }
  },
  {
    logId: 'evt-handoff-002-dns-specialist',
    timestamp: new Date(now - 7 * 60 * 1000).toISOString(), // 7 mins ago
    sourceComponent: 'HandoffBot',
    type: 'handoff_initiated',
    status: 'success',
    description: 'Handoff to DNS Specialist team.',
    conversationId: 'conv-67890',
    accountId: 'acc-whg',
    details: {
      targetTeam: 'DNS Specialists',
      handoffReason: 'Persistent DNS issue, advanced tools inconclusive.',
      internal_note: '`HandoffBot`: Initiated handoff to `DNS Specialists` for `conv-67890`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-handoff-002-dns-specialist',
      timestamp: new Date(now - 7 * 60 * 1000).toISOString(),
      sourceComponent: 'HandoffBot',
      type: 'handoff_initiated',
      status: 'success',
      description: 'Handoff to DNS Specialist team.',
      conversationId: 'conv-67890',
      accountId: 'acc-whg',
      coreEventDetails: {
        targetTeam: 'DNS Specialists',
        handoffReason: 'Persistent DNS issue, advanced tools inconclusive.'
      }
    }
  },
  {
    logId: 'evt-orch-billing-001',
    timestamp: new Date(now - 25 * 60 * 1000).toISOString(), // 25 mins ago
    sourceComponent: 'Orchestrator',
    type: 'webhook_received',
    status: 'success',
    description: 'Webhook for new billing inquiry.',
    conversationId: 'conv-abcde',
    accountId: 'acc-whg',
    details: {
      webhookEvent: 'message_created',
      userQuery: 'I have a question about my last invoice.',
      internal_note: '`Orchestrator`: New billing inquiry `conv-abcde`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-orch-billing-001',
      timestamp: new Date(now - 25 * 60 * 1000).toISOString(),
      sourceComponent: 'Orchestrator',
      type: 'webhook_received',
      status: 'success',
      description: 'Webhook for new billing inquiry.',
      conversationId: 'conv-abcde',
      accountId: 'acc-whg',
      coreEventDetails: {
        webhookEvent: 'message_created',
        userQuery: 'I have a question about my last invoice.'
      }
    }
  },
  {
    logId: 'evt-intent-billing-001',
    timestamp: new Date(now - 24 * 60 * 1000).toISOString(), // 24 mins ago
    sourceComponent: 'IntentRecognitionBot',
    type: 'intent_recognition',
    status: 'success',
    description: 'Billing question intent recognized.',
    conversationId: 'conv-abcde',
    accountId: 'acc-whg',
    details: {
      userQuery: 'I have a question about my last invoice.',
      confidence: 0.95,
      actionName: 'billing_info_bot',
      internal_note: '`IntentRecognitionBot`: Recognized billing question for `conv-abcde`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-intent-billing-001',
      timestamp: new Date(now - 24 * 60 * 1000).toISOString(),
      sourceComponent: 'IntentRecognitionBot',
      type: 'intent_recognition',
      status: 'success',
      description: 'Billing question intent recognized.',
      conversationId: 'conv-abcde',
      accountId: 'acc-whg',
      coreEventDetails: {
        userQuery: 'I have a question about my last invoice.',
        confidence: 0.95,
        actionName: 'billing_info_bot'
      }
    }
  },
  {
    logId: 'evt-billing-001-fetch-invoice',
    timestamp: new Date(now - 23 * 60 * 1000).toISOString(), // 23 mins ago
    sourceComponent: 'BillingInfoBot',
    type: 'action_execution',
    status: 'success',
    description: 'Fetched latest invoice for user.',
    conversationId: 'conv-abcde',
    accountId: 'acc-whg',
    details: {
      actionName: 'fetch_invoice',
      invoiceId: 'INV-2024-07-00123',
      internal_note: '`BillingInfoBot`: Fetched invoice `INV-2024-07-00123` for `conv-abcde`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-billing-001-fetch-invoice',
      timestamp: new Date(now - 23 * 60 * 1000).toISOString(),
      sourceComponent: 'BillingInfoBot',
      type: 'action_execution',
      status: 'success',
      description: 'Fetched latest invoice for user.',
      conversationId: 'conv-abcde',
      accountId: 'acc-whg',
      coreEventDetails: {
        actionName: 'fetch_invoice',
        invoiceId: 'INV-2024-07-00123'
      }
    }
  },
  {
    logId: 'evt-billing-002-explain-charges',
    timestamp: new Date(now - 22 * 60 * 1000).toISOString(), // 22 mins ago
    sourceComponent: 'BillingInfoBot',
    type: 'action_execution',
    status: 'success',
    description: 'Explained charges on the invoice.',
    conversationId: 'conv-abcde',
    accountId: 'acc-whg',
    details: {
      actionName: 'explain_charges',
      keyChargesExplained: ['Subscription Fee', 'Domain Renewal'],
      aiResponseToUser: 'Your latest invoice includes your monthly subscription and the renewal for example.net. Would you like a more detailed breakdown?',
      internal_note: '`BillingInfoBot`: Explained charges for `conv-abcde`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-billing-002-explain-charges',
      timestamp: new Date(now - 22 * 60 * 1000).toISOString(),
      sourceComponent: 'BillingInfoBot',
      type: 'action_execution',
      status: 'success',
      description: 'Explained charges on the invoice.',
      conversationId: 'conv-abcde',
      accountId: 'acc-whg',
      coreEventDetails: {
        actionName: 'explain_charges',
        keyChargesExplained: ['Subscription Fee', 'Domain Renewal'],
        aiResponseToUser: 'Your latest invoice includes your monthly subscription and the renewal for example.net. Would you like a more detailed breakdown?'
      }
    }
  },
  {
    logId: 'evt-msg-002-billing-explained',
    timestamp: new Date(now - 21 * 60 * 1000).toISOString(), // 21 mins ago
    sourceComponent: 'CorePlatform',
    type: 'message_sent_to_user',
    status: 'success',
    description: 'Sent explanation of charges to user.',
    conversationId: 'conv-abcde',
    accountId: 'acc-whg',
    details: {
      messageContent: 'Your latest invoice includes your monthly subscription and the renewal for example.net. Would you like a more detailed breakdown?',
      channel: 'chatwoot',
      internal_note: '`CorePlatform`: Sent billing explanation to user in `conv-abcde`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-msg-002-billing-explained',
      timestamp: new Date(now - 21 * 60 * 1000).toISOString(),
      sourceComponent: 'CorePlatform',
      type: 'message_sent_to_user',
      status: 'success',
      description: 'Sent explanation of charges to user.',
      conversationId: 'conv-abcde',
      accountId: 'acc-whg',
      coreEventDetails: {
        messageContent: 'Your latest invoice includes your monthly subscription and the renewal for example.net. Would you like a more detailed breakdown?',
        channel: 'chatwoot'
      }
    }
  },
  {
    logId: 'evt-feedback-001-billing',
    timestamp: new Date(now - 20 * 60 * 1000).toISOString(), // 20 mins ago
    sourceComponent: 'FeedbackCollectorBot',
    type: 'user_feedback_received',
    status: 'success',
    description: 'Positive feedback received for billing assistance.',
    conversationId: 'conv-abcde',
    accountId: 'acc-whg',
    details: {
      rating: 5,
      comment: 'Very clear, thank you!',
      internal_note: '`FeedbackCollectorBot`: Received 5-star feedback for `conv-abcde`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-feedback-001-billing',
      timestamp: new Date(now - 20 * 60 * 1000).toISOString(),
      sourceComponent: 'FeedbackCollectorBot',
      type: 'user_feedback_received',
      status: 'success',
      description: 'Positive feedback received for billing assistance.',
      conversationId: 'conv-abcde',
      accountId: 'acc-whg',
      coreEventDetails: {
        rating: 5,
        comment: 'Very clear, thank you!'
      }
    }
  }
];
