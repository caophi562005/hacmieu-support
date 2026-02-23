export type WidgetSettingsType = {
  imageUrl: string;
  greetingMessage: string;
  defaultSuggestions: {
    suggestion1: string;
    suggestion2: string;
    suggestion3: string;
  };
  theme: string;
};

export type WebhookTransactionType = {
  id: number;
  gateway: string;
  transactionDate: string;
  transferType: "in" | "out";
  transferAmount: number;
  accumulated: number;
  description: string;
  accountNumber?: string | undefined;
  code?: string | undefined;
  content?: string | undefined;
  subAccount?: string | null | undefined;
  referenceCode?: string | undefined;
};
