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
  },
  
  // SSL Certificate Installation Support Conversation
  {
    logId: 'evt-orch-ssl-001',
    timestamp: new Date(now - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    sourceComponent: 'Orchestrator',
    type: 'webhook_received',
    status: 'success',
    description: 'SSL certificate installation query received',
    conversationId: 'conv-ssl-789',
    accountId: 'acc-whg',
    details: {
      webhookEvent: 'message_created',
      userQuery: 'How do I install SSL certificate on my website?',
      internal_note: '`Orchestrator`: SSL certificate installation query for `conv-ssl-789`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-orch-ssl-001',
      timestamp: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
      sourceComponent: 'Orchestrator',
      type: 'webhook_received',
      status: 'success',
      description: 'SSL certificate installation query received',
      conversationId: 'conv-ssl-789',
      accountId: 'acc-whg',
      coreEventDetails: {
        webhookEvent: 'message_created',
        userQuery: 'How do I install SSL certificate on my website?'
      }
    }
  },
  {
    logId: 'evt-intent-ssl-001',
    timestamp: new Date(now - 3 * 60 * 60 * 1000 + 15 * 1000).toISOString(), // 3 hours ago + 15s
    sourceComponent: 'IntentRecognitionBot',
    type: 'intent_recognition',
    status: 'success',
    description: 'SSL installation support intent detected',
    conversationId: 'conv-ssl-789',
    accountId: 'acc-whg',
    details: {
      userQuery: 'How do I install SSL certificate on my website?',
      confidence: 0.94,
      actionName: 'ssl_support_bot',
      processingTimeMs: 850,
      internal_note: '`IntentRecognitionBot`: SSL installation query detected. Routing to SSL Support Bot.'
    },
    consolidatedRawEventData: {
      logId: 'evt-intent-ssl-001',
      timestamp: new Date(now - 3 * 60 * 60 * 1000 + 15 * 1000).toISOString(),
      sourceComponent: 'IntentRecognitionBot',
      type: 'intent_recognition',
      status: 'success',
      description: 'SSL installation support intent detected',
      conversationId: 'conv-ssl-789',
      accountId: 'acc-whg',
      coreEventDetails: {
        userQuery: 'How do I install SSL certificate on my website?',
        confidence: 0.94,
        actionName: 'ssl_support_bot',
        processingTimeMs: 850
      }
    }
  },
  {
    logId: 'evt-ssl-001-guide',
    timestamp: new Date(now - 3 * 60 * 60 * 1000 + 30 * 1000).toISOString(), // 3 hours ago + 30s
    sourceComponent: 'SSLSupportBot',
    type: 'action_execution',
    status: 'success',
    description: 'Provided SSL installation guide',
    conversationId: 'conv-ssl-789',
    accountId: 'acc-whg',
    details: {
      actionName: 'provide_ssl_guide',
      platform: 'cPanel',
      aiResponseToUser: 'I can help you install an SSL certificate! I see you\'re using cPanel. Here\'s a step-by-step guide: 1) Log into cPanel, 2) Navigate to Security > SSL/TLS, 3) Click "Manage SSL Sites"...',
      internal_note: '`SSLSupportBot`: Provided cPanel SSL installation guide for `conv-ssl-789`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-ssl-001-guide',
      timestamp: new Date(now - 3 * 60 * 60 * 1000 + 30 * 1000).toISOString(),
      sourceComponent: 'SSLSupportBot',
      type: 'action_execution',
      status: 'success',
      description: 'Provided SSL installation guide',
      conversationId: 'conv-ssl-789',
      accountId: 'acc-whg',
      coreEventDetails: {
        actionName: 'provide_ssl_guide',
        platform: 'cPanel',
        aiResponseToUser: 'I can help you install an SSL certificate! I see you\'re using cPanel. Here\'s a step-by-step guide: 1) Log into cPanel, 2) Navigate to Security > SSL/TLS, 3) Click "Manage SSL Sites"...'
      }
    }
  },
  
  // Email Configuration Issue
  {
    logId: 'evt-orch-email-001',
    timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    sourceComponent: 'Orchestrator',
    type: 'webhook_received',
    status: 'success',
    description: 'Email configuration issue reported',
    conversationId: 'conv-email-456',
    accountId: 'acc-whg',
    details: {
      webhookEvent: 'message_created',
      userQuery: 'My emails are not sending. Getting SMTP error 550.',
      internal_note: '`Orchestrator`: Email issue reported in `conv-email-456`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-orch-email-001',
      timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      sourceComponent: 'Orchestrator',
      type: 'webhook_received',
      status: 'success',
      description: 'Email configuration issue reported',
      conversationId: 'conv-email-456',
      accountId: 'acc-whg',
      coreEventDetails: {
        webhookEvent: 'message_created',
        userQuery: 'My emails are not sending. Getting SMTP error 550.'
      }
    }
  },
  {
    logId: 'evt-intent-email-001',
    timestamp: new Date(now - 2 * 60 * 60 * 1000 + 10 * 1000).toISOString(),
    sourceComponent: 'IntentRecognitionBot',
    type: 'intent_recognition',
    status: 'success',
    description: 'Email delivery issue detected - SMTP error',
    conversationId: 'conv-email-456',
    accountId: 'acc-whg',
    details: {
      userQuery: 'My emails are not sending. Getting SMTP error 550.',
      confidence: 0.96,
      actionName: 'email_troubleshooting_bot',
      internal_note: '`IntentRecognitionBot`: SMTP error 550 detected. Routing to Email Troubleshooting Bot.'
    },
    consolidatedRawEventData: {
      logId: 'evt-intent-email-001',
      timestamp: new Date(now - 2 * 60 * 60 * 1000 + 10 * 1000).toISOString(),
      sourceComponent: 'IntentRecognitionBot',
      type: 'intent_recognition',
      status: 'success',
      description: 'Email delivery issue detected - SMTP error',
      conversationId: 'conv-email-456',
      accountId: 'acc-whg',
      coreEventDetails: {
        userQuery: 'My emails are not sending. Getting SMTP error 550.',
        confidence: 0.96,
        actionName: 'email_troubleshooting_bot'
      }
    }
  },
  {
    logId: 'evt-email-001-diagnose',
    timestamp: new Date(now - 2 * 60 * 60 * 1000 + 25 * 1000).toISOString(),
    sourceComponent: 'EmailTroubleshootingBot',
    type: 'action_execution',
    status: 'warning',
    description: 'Diagnosed SMTP authentication issue',
    conversationId: 'conv-email-456',
    accountId: 'acc-whg',
    details: {
      actionName: 'diagnose_smtp_error',
      errorCode: '550',
      diagnosis: 'Authentication required',
      aiResponseToUser: 'Error 550 typically means authentication is required. Please check: 1) SMTP authentication is enabled, 2) Username is your full email address, 3) Password is correct. Would you like me to guide you through the settings?',
      internal_note: '`EmailTroubleshootingBot`: SMTP 550 error diagnosed as authentication issue for `conv-email-456`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-email-001-diagnose',
      timestamp: new Date(now - 2 * 60 * 60 * 1000 + 25 * 1000).toISOString(),
      sourceComponent: 'EmailTroubleshootingBot',
      type: 'action_execution',
      status: 'warning',
      description: 'Diagnosed SMTP authentication issue',
      conversationId: 'conv-email-456',
      accountId: 'acc-whg',
      coreEventDetails: {
        actionName: 'diagnose_smtp_error',
        errorCode: '550',
        diagnosis: 'Authentication required',
        aiResponseToUser: 'Error 550 typically means authentication is required. Please check: 1) SMTP authentication is enabled, 2) Username is your full email address, 3) Password is correct. Would you like me to guide you through the settings?'
      }
    }
  },
  
  // Website Migration Request
  {
    logId: 'evt-orch-migrate-001',
    timestamp: new Date(now - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    sourceComponent: 'Orchestrator',
    type: 'webhook_received',
    status: 'success',
    description: 'Website migration request received',
    conversationId: 'conv-migrate-123',
    accountId: 'acc-whg',
    details: {
      webhookEvent: 'message_created',
      userQuery: 'I want to migrate my WordPress site from GoDaddy to your hosting',
      internal_note: '`Orchestrator`: Migration request from GoDaddy for `conv-migrate-123`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-orch-migrate-001',
      timestamp: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
      sourceComponent: 'Orchestrator',
      type: 'webhook_received',
      status: 'success',
      description: 'Website migration request received',
      conversationId: 'conv-migrate-123',
      accountId: 'acc-whg',
      coreEventDetails: {
        webhookEvent: 'message_created',
        userQuery: 'I want to migrate my WordPress site from GoDaddy to your hosting'
      }
    }
  },
  {
    logId: 'evt-intent-migrate-001',
    timestamp: new Date(now - 5 * 60 * 60 * 1000 + 12 * 1000).toISOString(),
    sourceComponent: 'IntentRecognitionBot',
    type: 'intent_recognition',
    status: 'success',
    description: 'WordPress migration intent recognized',
    conversationId: 'conv-migrate-123',
    accountId: 'acc-whg',
    details: {
      userQuery: 'I want to migrate my WordPress site from GoDaddy to your hosting',
      confidence: 0.97,
      actionName: 'migration_assistant_bot',
      internal_note: '`IntentRecognitionBot`: WordPress migration from GoDaddy detected. Routing to Migration Assistant.'
    },
    consolidatedRawEventData: {
      logId: 'evt-intent-migrate-001',
      timestamp: new Date(now - 5 * 60 * 60 * 1000 + 12 * 1000).toISOString(),
      sourceComponent: 'IntentRecognitionBot',
      type: 'intent_recognition',
      status: 'success',
      description: 'WordPress migration intent recognized',
      conversationId: 'conv-migrate-123',
      accountId: 'acc-whg',
      coreEventDetails: {
        userQuery: 'I want to migrate my WordPress site from GoDaddy to your hosting',
        confidence: 0.97,
        actionName: 'migration_assistant_bot'
      }
    }
  },
  {
    logId: 'evt-migrate-001-assessment',
    timestamp: new Date(now - 5 * 60 * 60 * 1000 + 30 * 1000).toISOString(),
    sourceComponent: 'MigrationAssistantBot',
    type: 'action_execution',
    status: 'success',
    description: 'Migration assessment completed',
    conversationId: 'conv-migrate-123',
    accountId: 'acc-whg',
    details: {
      actionName: 'assess_migration',
      sourceHost: 'GoDaddy',
      platform: 'WordPress',
      estimatedTime: '2-4 hours',
      aiResponseToUser: 'Great! I can help you migrate your WordPress site from GoDaddy. Our free migration service typically takes 2-4 hours. I\'ll need: 1) Your GoDaddy login credentials, 2) Your domain name. Shall we start the process?',
      internal_note: '`MigrationAssistantBot`: WordPress migration assessment completed for `conv-migrate-123`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-migrate-001-assessment',
      timestamp: new Date(now - 5 * 60 * 60 * 1000 + 30 * 1000).toISOString(),
      sourceComponent: 'MigrationAssistantBot',
      type: 'action_execution',
      status: 'success',
      description: 'Migration assessment completed',
      conversationId: 'conv-migrate-123',
      accountId: 'acc-whg',
      coreEventDetails: {
        actionName: 'assess_migration',
        sourceHost: 'GoDaddy',
        platform: 'WordPress',
        estimatedTime: '2-4 hours',
        aiResponseToUser: 'Great! I can help you migrate your WordPress site from GoDaddy. Our free migration service typically takes 2-4 hours. I\'ll need: 1) Your GoDaddy login credentials, 2) Your domain name. Shall we start the process?'
      }
    }
  },
  {
    logId: 'evt-migrate-002-handoff',
    timestamp: new Date(now - 5 * 60 * 60 * 1000 + 2 * 60 * 1000).toISOString(),
    sourceComponent: 'HandoffBot',
    type: 'handoff_initiated',
    status: 'success',
    description: 'Handoff to Migration Specialists for secure credential handling',
    conversationId: 'conv-migrate-123',
    accountId: 'acc-whg',
    details: {
      targetTeam: 'Migration Specialists',
      handoffReason: 'Secure credential collection required',
      internal_note: '`HandoffBot`: Transferred to Migration Specialists for secure credential handling in `conv-migrate-123`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-migrate-002-handoff',
      timestamp: new Date(now - 5 * 60 * 60 * 1000 + 2 * 60 * 1000).toISOString(),
      sourceComponent: 'HandoffBot',
      type: 'handoff_initiated',
      status: 'success',
      description: 'Handoff to Migration Specialists for secure credential handling',
      conversationId: 'conv-migrate-123',
      accountId: 'acc-whg',
      coreEventDetails: {
        targetTeam: 'Migration Specialists',
        handoffReason: 'Secure credential collection required'
      }
    }
  },
  
  // Hosting Performance Issue
  {
    logId: 'evt-orch-perf-001',
    timestamp: new Date(now - 45 * 60 * 1000).toISOString(), // 45 mins ago
    sourceComponent: 'Orchestrator',
    type: 'webhook_received',
    status: 'success',
    description: 'Performance issue reported',
    conversationId: 'conv-perf-999',
    accountId: 'acc-whg',
    details: {
      webhookEvent: 'message_created',
      userQuery: 'My website is loading very slowly today, what\'s wrong?',
      internal_note: '`Orchestrator`: Performance issue reported in `conv-perf-999`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-orch-perf-001',
      timestamp: new Date(now - 45 * 60 * 1000).toISOString(),
      sourceComponent: 'Orchestrator',
      type: 'webhook_received',
      status: 'success',
      description: 'Performance issue reported',
      conversationId: 'conv-perf-999',
      accountId: 'acc-whg',
      coreEventDetails: {
        webhookEvent: 'message_created',
        userQuery: 'My website is loading very slowly today, what\'s wrong?'
      }
    }
  },
  {
    logId: 'evt-intent-perf-001',
    timestamp: new Date(now - 45 * 60 * 1000 + 8 * 1000).toISOString(),
    sourceComponent: 'IntentRecognitionBot',
    type: 'intent_recognition',
    status: 'success',
    description: 'Website performance issue detected',
    conversationId: 'conv-perf-999',
    accountId: 'acc-whg',
    details: {
      userQuery: 'My website is loading very slowly today, what\'s wrong?',
      confidence: 0.91,
      actionName: 'performance_diagnostic_bot',
      internal_note: '`IntentRecognitionBot`: Performance issue detected. Routing to Performance Diagnostic Bot.'
    },
    consolidatedRawEventData: {
      logId: 'evt-intent-perf-001',
      timestamp: new Date(now - 45 * 60 * 1000 + 8 * 1000).toISOString(),
      sourceComponent: 'IntentRecognitionBot',
      type: 'intent_recognition',
      status: 'success',
      description: 'Website performance issue detected',
      conversationId: 'conv-perf-999',
      accountId: 'acc-whg',
      coreEventDetails: {
        userQuery: 'My website is loading very slowly today, what\'s wrong?',
        confidence: 0.91,
        actionName: 'performance_diagnostic_bot'
      }
    }
  },
  {
    logId: 'evt-perf-001-scan',
    timestamp: new Date(now - 45 * 60 * 1000 + 20 * 1000).toISOString(),
    sourceComponent: 'PerformanceDiagnosticBot',
    type: 'action_execution',
    status: 'success',
    description: 'Performance scan completed - high resource usage detected',
    conversationId: 'conv-perf-999',
    accountId: 'acc-whg',
    details: {
      actionName: 'run_performance_scan',
      cpuUsage: '85%',
      memoryUsage: '92%',
      topProcess: 'php-fpm',
      aiResponseToUser: 'I\'ve run a diagnostic scan. Your site is experiencing high resource usage (CPU: 85%, Memory: 92%). The main culprit appears to be PHP processes. This could be due to: 1) High traffic, 2) Unoptimized plugins, or 3) Database queries. Would you like me to investigate further?',
      internal_note: '`PerformanceDiagnosticBot`: High resource usage detected on `conv-perf-999`. PHP-FPM consuming most resources.'
    },
    consolidatedRawEventData: {
      logId: 'evt-perf-001-scan',
      timestamp: new Date(now - 45 * 60 * 1000 + 20 * 1000).toISOString(),
      sourceComponent: 'PerformanceDiagnosticBot',
      type: 'action_execution',
      status: 'success',
      description: 'Performance scan completed - high resource usage detected',
      conversationId: 'conv-perf-999',
      accountId: 'acc-whg',
      coreEventDetails: {
        actionName: 'run_performance_scan',
        cpuUsage: '85%',
        memoryUsage: '92%',
        topProcess: 'php-fpm',
        aiResponseToUser: 'I\'ve run a diagnostic scan. Your site is experiencing high resource usage (CPU: 85%, Memory: 92%). The main culprit appears to be PHP processes. This could be due to: 1) High traffic, 2) Unoptimized plugins, or 3) Database queries. Would you like me to investigate further?'
      }
    }
  },
  
  // Backup Recovery Request
  {
    logId: 'evt-orch-backup-001',
    timestamp: new Date(now - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    sourceComponent: 'Orchestrator',
    type: 'webhook_received',
    status: 'success',
    description: 'Backup recovery request received',
    conversationId: 'conv-backup-777',
    accountId: 'acc-whg',
    details: {
      webhookEvent: 'message_created',
      userQuery: 'I accidentally deleted important files. Can you restore from yesterday\'s backup?',
      internal_note: '`Orchestrator`: Backup recovery request for `conv-backup-777`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-orch-backup-001',
      timestamp: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
      sourceComponent: 'Orchestrator',
      type: 'webhook_received',
      status: 'success',
      description: 'Backup recovery request received',
      conversationId: 'conv-backup-777',
      accountId: 'acc-whg',
      coreEventDetails: {
        webhookEvent: 'message_created',
        userQuery: 'I accidentally deleted important files. Can you restore from yesterday\'s backup?'
      }
    }
  },
  {
    logId: 'evt-intent-backup-001',
    timestamp: new Date(now - 4 * 60 * 60 * 1000 + 10 * 1000).toISOString(),
    sourceComponent: 'IntentRecognitionBot',
    type: 'intent_recognition',
    status: 'success',
    description: 'Backup restoration request identified',
    conversationId: 'conv-backup-777',
    accountId: 'acc-whg',
    details: {
      userQuery: 'I accidentally deleted important files. Can you restore from yesterday\'s backup?',
      confidence: 0.98,
      actionName: 'backup_recovery_bot',
      internal_note: '`IntentRecognitionBot`: Backup restoration request detected. Routing to Backup Recovery Bot.'
    },
    consolidatedRawEventData: {
      logId: 'evt-intent-backup-001',
      timestamp: new Date(now - 4 * 60 * 60 * 1000 + 10 * 1000).toISOString(),
      sourceComponent: 'IntentRecognitionBot',
      type: 'intent_recognition',
      status: 'success',
      description: 'Backup restoration request identified',
      conversationId: 'conv-backup-777',
      accountId: 'acc-whg',
      coreEventDetails: {
        userQuery: 'I accidentally deleted important files. Can you restore from yesterday\'s backup?',
        confidence: 0.98,
        actionName: 'backup_recovery_bot'
      }
    }
  },
  {
    logId: 'evt-backup-001-check',
    timestamp: new Date(now - 4 * 60 * 60 * 1000 + 25 * 1000).toISOString(),
    sourceComponent: 'BackupRecoveryBot',
    type: 'action_execution',
    status: 'success',
    description: 'Located available backups',
    conversationId: 'conv-backup-777',
    accountId: 'acc-whg',
    details: {
      actionName: 'check_available_backups',
      backupsFound: 7,
      latestBackup: 'Yesterday at 03:00 AM',
      aiResponseToUser: 'I found your backups! The most recent one is from yesterday at 3:00 AM. I can restore: 1) Entire account, 2) Specific files/folders, or 3) Database only. What would you like to restore?',
      internal_note: '`BackupRecoveryBot`: Found 7 available backups for `conv-backup-777`. Latest from yesterday.'
    },
    consolidatedRawEventData: {
      logId: 'evt-backup-001-check',
      timestamp: new Date(now - 4 * 60 * 60 * 1000 + 25 * 1000).toISOString(),
      sourceComponent: 'BackupRecoveryBot',
      type: 'action_execution',
      status: 'success',
      description: 'Located available backups',
      conversationId: 'conv-backup-777',
      accountId: 'acc-whg',
      coreEventDetails: {
        actionName: 'check_available_backups',
        backupsFound: 7,
        latestBackup: 'Yesterday at 03:00 AM',
        aiResponseToUser: 'I found your backups! The most recent one is from yesterday at 3:00 AM. I can restore: 1) Entire account, 2) Specific files/folders, or 3) Database only. What would you like to restore?'
      }
    }
  },
  
  // Domain Registration Query
  {
    logId: 'evt-orch-domreg-001',
    timestamp: new Date(now - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    sourceComponent: 'Orchestrator',
    type: 'webhook_received',
    status: 'success',
    description: 'Domain availability check request',
    conversationId: 'conv-domreg-555',
    accountId: 'acc-whg',
    details: {
      webhookEvent: 'message_created',
      userQuery: 'Is techstartup2024.com available? I want to register it.',
      internal_note: '`Orchestrator`: Domain registration query for techstartup2024.com in `conv-domreg-555`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-orch-domreg-001',
      timestamp: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
      sourceComponent: 'Orchestrator',
      type: 'webhook_received',
      status: 'success',
      description: 'Domain availability check request',
      conversationId: 'conv-domreg-555',
      accountId: 'acc-whg',
      coreEventDetails: {
        webhookEvent: 'message_created',
        userQuery: 'Is techstartup2024.com available? I want to register it.'
      }
    }
  },
  {
    logId: 'evt-intent-domreg-001',
    timestamp: new Date(now - 6 * 60 * 60 * 1000 + 8 * 1000).toISOString(),
    sourceComponent: 'IntentRecognitionBot',
    type: 'intent_recognition',
    status: 'success',
    description: 'Domain registration intent detected',
    conversationId: 'conv-domreg-555',
    accountId: 'acc-whg',
    details: {
      userQuery: 'Is techstartup2024.com available? I want to register it.',
      confidence: 0.96,
      actionName: 'domain_registration_bot',
      internal_note: '`IntentRecognitionBot`: Domain registration query for techstartup2024.com. Routing to Domain Registration Bot.'
    },
    consolidatedRawEventData: {
      logId: 'evt-intent-domreg-001',
      timestamp: new Date(now - 6 * 60 * 60 * 1000 + 8 * 1000).toISOString(),
      sourceComponent: 'IntentRecognitionBot',
      type: 'intent_recognition',
      status: 'success',
      description: 'Domain registration intent detected',
      conversationId: 'conv-domreg-555',
      accountId: 'acc-whg',
      coreEventDetails: {
        userQuery: 'Is techstartup2024.com available? I want to register it.',
        confidence: 0.96,
        actionName: 'domain_registration_bot'
      }
    }
  },
  {
    logId: 'evt-domreg-001-check',
    timestamp: new Date(now - 6 * 60 * 60 * 1000 + 15 * 1000).toISOString(),
    sourceComponent: 'DomainRegistrationBot',
    type: 'action_execution',
    status: 'success',
    description: 'Domain availability checked - available',
    conversationId: 'conv-domreg-555',
    accountId: 'acc-whg',
    details: {
      actionName: 'check_domain_availability',
      domain: 'techstartup2024.com',
      available: true,
      price: '$12.99/year',
      aiResponseToUser: 'Great news! techstartup2024.com is available! It\'s $12.99/year. I also checked similar domains: .net ($14.99), .org ($13.99), .io ($39.99). Would you like to register it now?',
      internal_note: '`DomainRegistrationBot`: techstartup2024.com is available for registration in `conv-domreg-555`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-domreg-001-check',
      timestamp: new Date(now - 6 * 60 * 60 * 1000 + 15 * 1000).toISOString(),
      sourceComponent: 'DomainRegistrationBot',
      type: 'action_execution',
      status: 'success',
      description: 'Domain availability checked - available',
      conversationId: 'conv-domreg-555',
      accountId: 'acc-whg',
      coreEventDetails: {
        actionName: 'check_domain_availability',
        domain: 'techstartup2024.com',
        available: true,
        price: '$12.99/year',
        aiResponseToUser: 'Great news! techstartup2024.com is available! It\'s $12.99/year. I also checked similar domains: .net ($14.99), .org ($13.99), .io ($39.99). Would you like to register it now?'
      }
    }
  },
  
  // Database Connection Error
  {
    logId: 'evt-orch-db-001',
    timestamp: new Date(now - 90 * 60 * 1000).toISOString(), // 90 mins ago
    sourceComponent: 'Orchestrator',
    type: 'webhook_received',
    status: 'success',
    description: 'Database connection error reported',
    conversationId: 'conv-db-333',
    accountId: 'acc-whg',
    details: {
      webhookEvent: 'message_created',
      userQuery: 'Error establishing database connection on WordPress',
      internal_note: '`Orchestrator`: Database connection error reported in `conv-db-333`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-orch-db-001',
      timestamp: new Date(now - 90 * 60 * 1000).toISOString(),
      sourceComponent: 'Orchestrator',
      type: 'webhook_received',
      status: 'success',
      description: 'Database connection error reported',
      conversationId: 'conv-db-333',
      accountId: 'acc-whg',
      coreEventDetails: {
        webhookEvent: 'message_created',
        userQuery: 'Error establishing database connection on WordPress'
      }
    }
  },
  {
    logId: 'evt-intent-db-001',
    timestamp: new Date(now - 90 * 60 * 1000 + 9 * 1000).toISOString(),
    sourceComponent: 'IntentRecognitionBot',
    type: 'intent_recognition',
    status: 'success',
    description: 'WordPress database error detected',
    conversationId: 'conv-db-333',
    accountId: 'acc-whg',
    details: {
      userQuery: 'Error establishing database connection on WordPress',
      confidence: 0.99,
      actionName: 'wordpress_db_troubleshoot_bot',
      internal_note: '`IntentRecognitionBot`: WordPress database connection error. Routing to WP DB Troubleshooting Bot.'
    },
    consolidatedRawEventData: {
      logId: 'evt-intent-db-001',
      timestamp: new Date(now - 90 * 60 * 1000 + 9 * 1000).toISOString(),
      sourceComponent: 'IntentRecognitionBot',
      type: 'intent_recognition',
      status: 'success',
      description: 'WordPress database error detected',
      conversationId: 'conv-db-333',
      accountId: 'acc-whg',
      coreEventDetails: {
        userQuery: 'Error establishing database connection on WordPress',
        confidence: 0.99,
        actionName: 'wordpress_db_troubleshoot_bot'
      }
    }
  },
  {
    logId: 'evt-db-001-diagnose',
    timestamp: new Date(now - 90 * 60 * 1000 + 20 * 1000).toISOString(),
    sourceComponent: 'WordPressDBTroubleshootBot',
    type: 'action_execution',
    status: 'failure',
    description: 'Database server unreachable',
    conversationId: 'conv-db-333',
    accountId: 'acc-whg',
    details: {
      actionName: 'test_db_connection',
      errorMessage: 'MySQL server has gone away',
      errorType: 'database_server_down',
      aiResponseToUser: 'I\'ve identified the issue - the MySQL database server is currently down. This is a critical issue that requires immediate attention from our system administrators.',
      internal_note: '`WordPressDBTroubleshootBot`: MySQL server down for `conv-db-333`. Critical escalation needed.'
    },
    consolidatedRawEventData: {
      logId: 'evt-db-001-diagnose',
      timestamp: new Date(now - 90 * 60 * 1000 + 20 * 1000).toISOString(),
      sourceComponent: 'WordPressDBTroubleshootBot',
      type: 'action_execution',
      status: 'failure',
      description: 'Database server unreachable',
      conversationId: 'conv-db-333',
      accountId: 'acc-whg',
      coreEventDetails: {
        actionName: 'test_db_connection',
        errorMessage: 'MySQL server has gone away',
        errorType: 'database_server_down',
        aiResponseToUser: 'I\'ve identified the issue - the MySQL database server is currently down. This is a critical issue that requires immediate attention from our system administrators.'
      }
    }
  },
  {
    logId: 'evt-db-002-escalate',
    timestamp: new Date(now - 90 * 60 * 1000 + 30 * 1000).toISOString(),
    sourceComponent: 'HandoffBot',
    type: 'handoff_initiated',
    status: 'success',
    description: 'Critical escalation to System Administrators',
    conversationId: 'conv-db-333',
    accountId: 'acc-whg',
    details: {
      targetTeam: 'System Administrators',
      handoffReason: 'Critical: MySQL server down',
      priority: 'HIGH',
      internal_note: '`HandoffBot`: CRITICAL escalation to System Administrators for MySQL server down in `conv-db-333`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-db-002-escalate',
      timestamp: new Date(now - 90 * 60 * 1000 + 30 * 1000).toISOString(),
      sourceComponent: 'HandoffBot',
      type: 'handoff_initiated',
      status: 'success',
      description: 'Critical escalation to System Administrators',
      conversationId: 'conv-db-333',
      accountId: 'acc-whg',
      coreEventDetails: {
        targetTeam: 'System Administrators',
        handoffReason: 'Critical: MySQL server down',
        priority: 'HIGH'
      }
    }
  },
  
  // Account Suspension Query
  {
    logId: 'evt-orch-suspend-001',
    timestamp: new Date(now - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    sourceComponent: 'Orchestrator',
    type: 'webhook_received',
    status: 'success',
    description: 'Account suspension query received',
    conversationId: 'conv-suspend-888',
    accountId: 'acc-whg',
    details: {
      webhookEvent: 'message_created',
      userQuery: 'Why is my account suspended? I need urgent access!',
      internal_note: '`Orchestrator`: Account suspension query in `conv-suspend-888`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-orch-suspend-001',
      timestamp: new Date(now - 12 * 60 * 60 * 1000).toISOString(),
      sourceComponent: 'Orchestrator',
      type: 'webhook_received',
      status: 'success',
      description: 'Account suspension query received',
      conversationId: 'conv-suspend-888',
      accountId: 'acc-whg',
      coreEventDetails: {
        webhookEvent: 'message_created',
        userQuery: 'Why is my account suspended? I need urgent access!'
      }
    }
  },
  {
    logId: 'evt-intent-suspend-001',
    timestamp: new Date(now - 12 * 60 * 60 * 1000 + 7 * 1000).toISOString(),
    sourceComponent: 'IntentRecognitionBot',
    type: 'intent_recognition',
    status: 'success',
    description: 'Account suspension issue - urgent',
    conversationId: 'conv-suspend-888',
    accountId: 'acc-whg',
    details: {
      userQuery: 'Why is my account suspended? I need urgent access!',
      confidence: 0.97,
      actionName: 'account_suspension_bot',
      urgency: 'high',
      internal_note: '`IntentRecognitionBot`: Urgent account suspension query. Routing to Account Suspension Bot.'
    },
    consolidatedRawEventData: {
      logId: 'evt-intent-suspend-001',
      timestamp: new Date(now - 12 * 60 * 60 * 1000 + 7 * 1000).toISOString(),
      sourceComponent: 'IntentRecognitionBot',
      type: 'intent_recognition',
      status: 'success',
      description: 'Account suspension issue - urgent',
      conversationId: 'conv-suspend-888',
      accountId: 'acc-whg',
      coreEventDetails: {
        userQuery: 'Why is my account suspended? I need urgent access!',
        confidence: 0.97,
        actionName: 'account_suspension_bot',
        urgency: 'high'
      }
    }
  },
  {
    logId: 'evt-suspend-001-check',
    timestamp: new Date(now - 12 * 60 * 60 * 1000 + 15 * 1000).toISOString(),
    sourceComponent: 'AccountSuspensionBot',
    type: 'action_execution',
    status: 'success',
    description: 'Account suspension reason identified',
    conversationId: 'conv-suspend-888',
    accountId: 'acc-whg',
    details: {
      actionName: 'check_suspension_reason',
      reason: 'Overdue invoice',
      amount: '$89.99',
      daysOverdue: 15,
      aiResponseToUser: 'I found the issue. Your account was suspended due to an overdue invoice of $89.99 (15 days past due). To restore access immediately, you can: 1) Pay online via client portal, 2) Call billing at 1-800-XXX-XXXX. Once paid, your account will be reactivated within 15 minutes.',
      internal_note: '`AccountSuspensionBot`: Account suspended for overdue payment ($89.99, 15 days) in `conv-suspend-888`.'
    },
    consolidatedRawEventData: {
      logId: 'evt-suspend-001-check',
      timestamp: new Date(now - 12 * 60 * 60 * 1000 + 15 * 1000).toISOString(),
      sourceComponent: 'AccountSuspensionBot',
      type: 'action_execution',
      status: 'success',
      description: 'Account suspension reason identified',
      conversationId: 'conv-suspend-888',
      accountId: 'acc-whg',
      coreEventDetails: {
        actionName: 'check_suspension_reason',
        reason: 'Overdue invoice',
        amount: '$89.99',
        daysOverdue: 15,
        aiResponseToUser: 'I found the issue. Your account was suspended due to an overdue invoice of $89.99 (15 days past due). To restore access immediately, you can: 1) Pay online via client portal, 2) Call billing at 1-800-XXX-XXXX. Once paid, your account will be reactivated within 15 minutes.'
      }
    }
  }
];
