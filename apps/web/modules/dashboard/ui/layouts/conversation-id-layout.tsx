import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable";

import { ContactPanel } from "@/modules/dashboard/ui/components/contact-panel";

interface Props {
  children: React.ReactNode;
}

export const ConversationIdLayout = ({ children }: Props) => {
  return (
    <ResizablePanelGroup className="h-full flex-1" direction="horizontal">
      <ResizablePanel className="" defaultSize={60}>
        <div className="flex h-full flex-1 flex-col">{children}</div>
      </ResizablePanel>

      <ResizableHandle className="hidden lg:block" />

      <ResizablePanel
        className="hidden lg:block"
        defaultSize={40}
        maxSize={40}
        minSize={20}
      >
        <ContactPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
