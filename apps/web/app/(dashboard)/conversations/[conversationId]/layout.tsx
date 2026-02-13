import { ConversationIdLayout } from "@/modules/dashboard/ui/layouts/conversation-id-layout";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return <ConversationIdLayout>{children}</ConversationIdLayout>;
};

export default Layout;
