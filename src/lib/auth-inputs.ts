import { z } from "zod";

export const dingTalkAuthCodeSchema = z.object({
  code: z.string().trim().min(1, "授权码不能为空"),
  state: z.string().trim().optional(),
});

export type DingTalkAuthCodeInput = z.infer<typeof dingTalkAuthCodeSchema>;
