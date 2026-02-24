import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Separator } from "@workspace/ui/components/separator";
import { Textarea } from "@workspace/ui/components/textarea";

import { api } from "@workspace/backend/_generated/api";

import { WidgetSettingsType } from "@workspace/backend/types";
import z from "zod";

interface CustomizationFormProps {
  initialData?: WidgetSettingsType | null;
}

const widgetSettingsSchema = z.object({
  greetMessage: z.string().min(1, "Vui lòng nhập lời chào"),
  defaultSuggestions: z.object({
    suggestion1: z.string().optional(),
    suggestion2: z.string().optional(),
    suggestion3: z.string().optional(),
  }),
  theme: z.string(),
  phoneNumber: z.string(),
});

type formSchema = z.infer<typeof widgetSettingsSchema>;

export const CustomizationForm = ({ initialData }: CustomizationFormProps) => {
  const upsertWidgetSettings = useMutation(api.private.widgetSettings.upsert);

  const form = useForm<formSchema>({
    resolver: zodResolver(widgetSettingsSchema),
    defaultValues: {
      greetMessage:
        initialData?.greetingMessage ||
        "Xin chào! Mình có thể giúp gì cho bạn hôm nay?",
      defaultSuggestions: {
        suggestion1: initialData?.defaultSuggestions.suggestion1 || "",
        suggestion2: initialData?.defaultSuggestions.suggestion2 || "",
        suggestion3: initialData?.defaultSuggestions.suggestion3 || "",
      },
      theme: initialData?.theme || "light",
    },
  });

  const onSubmit = async (values: formSchema) => {
    try {
      await upsertWidgetSettings({
        greetingMessage: values.greetMessage,
        defaultSuggestions: values.defaultSuggestions,
        theme: values.theme,
        phoneNumber: values.phoneNumber,
      });

      toast.success("Đã lưu cấu hình giao diện");
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi");
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Cài đặt Chat chung</CardTitle>
            <CardDescription>
              Tùy chỉnh cấu hình cơ bản và tin nhắn trên khung chat
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="greetMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lời chào</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Tin nhắn chào mừng khi mở khung chat"
                      rows={3}
                    />
                  </FormControl>

                  <FormDescription>
                    Tin nhắn đầu tiên khách hàng nhìn thấy khi vừa mở chat
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="space-y-4">
              <div>
                <h3 className="mb-4 text-sm">Tin nhắn gợi ý</h3>
                <p className="mb-4 text-muted-foreground text-sm">
                  Các gợi ý trả lời nhanh cho khách hàng giúp định hướng cuộc
                  hội thoại
                </p>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="defaultSuggestions.suggestion1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gợi ý 1</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="VD: Hướng dẫn tôi cách sử dụng?"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultSuggestions.suggestion2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gợi ý 2</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="VD: Các gói cước bên bạn là gì?"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultSuggestions.suggestion3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gợi ý 3</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="VD: Tôi cần hỗ trợ tài khoản"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="VD: 0123456789" />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giao diện</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn Giao diện" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="light">Sáng (Light)</SelectItem>
                      <SelectItem value="doom-64">Doom-64</SelectItem>
                      <SelectItem value="bubblegum">
                        Kẹo ngọt (Bubblegum)
                      </SelectItem>
                      <SelectItem value="vintage-paper">
                        Giấy cũ (Vintage Paper)
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FormDescription>
                    Màu sắc hiển thị của khung chat
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            Lưu cài đặt
          </Button>
        </div>
      </form>
    </Form>
  );
};
