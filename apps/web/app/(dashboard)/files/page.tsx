import { Protect } from "@/modules/auth/ui/components/protect";

import { PremiumFeatureOverlay } from "@/modules/billing/ui/components/premium-feature-overlay";
import { FilesView } from "@/modules/files/ui/views/files-view";

const Page = () => {
  return (
    <Protect
      plan="Pro"
      fallback={
        <PremiumFeatureOverlay>
          <FilesView />
        </PremiumFeatureOverlay>
      }
    >
      <FilesView />
    </Protect>
  );
};

export default Page;
