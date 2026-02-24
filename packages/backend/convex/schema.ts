import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  widgetSettings: defineTable({
    organizationId: v.string(),
    greetingMessage: v.string(),
    defaultSuggestions: v.object({
      suggestion1: v.optional(v.string()),
      suggestion2: v.optional(v.string()),
      suggestion3: v.optional(v.string()),
    }),
    theme: v.string(),
    phoneNumber: v.string(),
  }).index("by_organization_id", ["organizationId"]),

  subscriptions: defineTable({
    organizationId: v.string(),
    plan: v.string(),

    status: v.union(
      v.literal("active"),
      v.literal("canceled"),
      v.literal("past_due"),
      v.literal("unpaid"),
    ),

    interval: v.union(v.literal("month"), v.literal("year")),

    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),

    cancelAtPeriodEnd: v.boolean(),

    providerSubscriptionId: v.optional(v.string()),
    providerCustomerId: v.optional(v.string()),
  })
    .index("by_organization_id", ["organizationId"])
    .index("by_status", ["status"]),

  payment: defineTable({
    organizationId: v.string(),

    subscriptionId: v.optional(v.id("subscriptions")),

    amount: v.number(),
    currency: v.optional(v.string()),

    code: v.string(),
    plan: v.optional(v.string()),
    interval: v.optional(v.union(v.literal("month"), v.literal("year"))),

    status: v.union(
      v.literal("pending"),
      v.literal("success"),
      v.literal("failed"),
      v.literal("refunded"),
    ),

    type: v.union(
      v.literal("subscription_creation"),
      v.literal("subscription_renewal"),
      v.literal("one_time"),
    ),

    paymentMethod: v.union(v.literal("qr"), v.literal("credit_card")),

    paidAt: v.optional(v.number()),

    providerTransactionId: v.optional(v.string()),
  })
    .index("by_organization_id", ["organizationId"])
    .index("by_subscription_id", ["subscriptionId"])
    .index("by_code", ["code"]),

  conversations: defineTable({
    threadId: v.string(),
    organizationId: v.string(),
    contactSessionId: v.id("contactSessions"),
    status: v.union(
      v.literal("unresolved"),
      v.literal("resolved"),
      v.literal("escalated"),
    ),
    lastMessage: v.optional(
      v.object({
        text: v.string(),
        role: v.union(v.literal("user"), v.literal("assistant")),
        _creationTime: v.number(),
      }),
    ),
  })
    .index("by_organization_id", ["organizationId"])
    .index("by_contact_session_id", ["contactSessionId"])
    .index("by_thread_id", ["threadId"])
    .index("by_status_and_organization_id", ["status", "organizationId"]),

  contactSessions: defineTable({
    name: v.string(),
    email: v.string(),
    organizationId: v.string(),
    expiresAt: v.number(),
    metadata: v.optional(
      v.object({
        userAgent: v.optional(v.string()),
        language: v.optional(v.string()),
        languages: v.optional(v.string()),
        vendor: v.optional(v.string()),
        screenResolution: v.optional(v.string()),
        viewportSize: v.optional(v.string()),
        timezone: v.optional(v.string()),
        timezoneOffset: v.optional(v.number()),
        cookieEnabled: v.optional(v.boolean()),
        referrer: v.optional(v.string()),
        currentUrl: v.optional(v.string()),
      }),
    ),
  })
    .index("by_organization_id", ["organizationId"])
    .index("by_expires_at", ["expiresAt"]),
});
