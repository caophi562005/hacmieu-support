"use client";

import { api } from "@workspace/backend/_generated/api";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { cn } from "@workspace/ui/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { CircleCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PaymentDialog } from "../components/payment-dialog";

const plans = [
  {
    name: "Starter",
    price: "Miễn phí",
    description:
      "Giải pháp chat trực tiếp giúp kết nối khách hàng nhanh chóng.",
    features: [
      "Hỗ trợ Live Chat 1-1",
      "Quản lý lịch sử hội thoại cơ bản",
      "Tích hợp mã nhúng vào website dễ dàng",
    ],
  },
  {
    name: "Pro",
    price: "10.000 VNĐ / tháng",
    isRecommended: true,
    description:
      "Tối ưu hóa vận hành với Trợ lý AI thông minh và tùy biến linh hoạt.",
    features: [
      "Tích hợp AI Bot trả lời tự động (Mô hình RAG)",
      "Tùy chỉnh giao diện khung chat theo thương hiệu",
      "Thiết lập kịch bản lời chào & tin nhắn gợi ý",
      "Không giới hạn tính năng của gói Starter",
    ],
    isPopular: true,
  },
];

export const BillingView = () => {
  const [open, setOpen] = useState(false);
  const [selectedPlanName, setSelectedPlanName] = useState<string | null>(null);

  const subscription = useQuery(api.private.subscriptions.getOne);
  const cancelSubscription = useMutation(api.private.subscriptions.cancel);

  const handlePaymentOpen = (planName: string) => {
    setSelectedPlanName(planName);
    setOpen(true);
  };

  const handleCancel = async () => {
    try {
      await cancelSubscription();
      toast.success("Đã hủy gói thành công");
    } catch (error) {
      toast.error("Không thể hủy gói");
    }
  };

  const getPlanButton = (planName: string) => {
    // Dành cho plan Starter
    if (planName === "Starter") {
      if (subscription?.plan === "Pro") {
        return (
          <Button className="mt-6 w-full" variant="outline" disabled>
            Chuyển sang gói này
          </Button>
        );
      }
      return (
        <Button className="mt-6 w-full" variant="outline" disabled>
          Gói hiện tại của bạn
        </Button>
      );
    }

    // Dành cho plan Pro
    if (planName === "Pro") {
      const isPro = subscription?.plan === "Pro";
      const isActive = subscription?.status === "active";
      const isCanceled = subscription?.status === "canceled";
      const hasExpired = subscription?.currentPeriodEnd
        ? subscription.currentPeriodEnd < Date.now()
        : true;

      if (!isPro || (isCanceled && hasExpired)) {
        return (
          <Button
            className="mt-6 w-full"
            size="lg"
            onClick={() => handlePaymentOpen(planName)}
          >
            Đăng ký
          </Button>
        );
      }

      if (isActive && !hasExpired) {
        return (
          <div className="flex flex-col gap-2 mt-6">
            <Button
              className="w-full"
              size="lg"
              onClick={() => handlePaymentOpen(planName)}
            >
              Gia hạn thêm
            </Button>
            <Button
              className="w-full"
              variant="destructive"
              size="lg"
              onClick={handleCancel}
            >
              Huỷ gói
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-1">
              Hết hạn:{" "}
              {format(
                new Date(subscription.currentPeriodEnd!),
                "dd/MM/yyyy HH:mm",
              )}
            </p>
          </div>
        );
      }

      if (isCanceled && !hasExpired) {
        return (
          <div className="flex flex-col gap-2 mt-6">
            <Button
              className="w-full"
              size="lg"
              onClick={() => handlePaymentOpen(planName)}
            >
              Gia hạn lại (Resume)
            </Button>
            <p className="text-xs text-center text-red-500 mt-1">
              Gói sẽ bị hủy vào:{" "}
              {format(new Date(subscription.currentPeriodEnd!), "dd/MM/yyyy")}
            </p>
          </div>
        );
      }
    }

    // Fallback
    return (
      <Button
        className="mt-6 w-full"
        size="lg"
        onClick={() => handlePaymentOpen(planName)}
      >
        Phát sinh lỗi hiển thị
      </Button>
    );
  };

  return (
    <>
      <PaymentDialog
        open={open}
        onOpenChange={setOpen}
        type={
          selectedPlanName === "Starter" || !subscription
            ? "subscription_creation"
            : "subscription_renewal"
        }
      />

      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <h2 className="text-center font-semibold text-5xl tracking-[-0.03em]">
          Gói cước
        </h2>
        <p className="mt-3 text-center text-muted-foreground text-xl">
          Chọn gói cước phù hợp với nhu cầu của bạn và bắt đầu ngay hôm nay
        </p>

        <div className="mx-auto mt-12 grid max-w-(--breakpoint-lg) grid-cols-1 items-start gap-8 sm:mt-16 lg:grid-cols-2">
          {plans.map((plan) => (
            <div
              className={cn(
                "relative rounded-lg border p-6 flex flex-col h-full",
                {
                  "border-2 border-primary py-10 shadow-lg": plan.isPopular,
                },
              )}
              key={plan.name}
            >
              {plan.isPopular && (
                <Badge className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2">
                  Phổ biến nhất
                </Badge>
              )}
              <h3 className="font-medium text-lg">{plan.name}</h3>
              <p className="mt-2 text-4xl font-semibold">{plan.price}</p>
              <p className="mt-4 font-medium text-muted-foreground">
                {plan.description}
              </p>
              <Separator className="my-4" />
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature) => (
                  <li className="flex items-start gap-2 text-sm" key={feature}>
                    <CircleCheck className="mt-1 h-4 w-4 text-green-600 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">{getPlanButton(plan.name)}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
