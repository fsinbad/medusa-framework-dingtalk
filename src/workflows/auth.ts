import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

import type { User } from "@/db/schema";

import {
  createUserRecord,
  deleteUserRecord,
  getUserByUnionId,
  restoreUserRecord,
  updateUserRecord,
} from "@/lib/auth-service";

type DingTalkAuthWorkflowInput = {
  unionId: string;
  openId: string;
  name: string;
  avatar?: string;
  mobile?: string;
  email?: string;
};

const upsertUserStep = createStep<
  DingTalkAuthWorkflowInput,
  User,
  { previous: User | null; id: string }
>(
  "upsert-dingtalk-user",
  async (input) => {
    const existing = getUserByUnionId(input.unionId);

    if (existing) {
      const updated = updateUserRecord(existing.id, {
        name: input.name,
        avatar: input.avatar,
        mobile: input.mobile,
        email: input.email,
      });
      return new StepResponse(updated, { previous: existing, id: updated.id });
    }

    const created = createUserRecord({
      unionId: input.unionId,
      openId: input.openId,
      name: input.name,
      avatar: input.avatar,
      mobile: input.mobile,
      email: input.email,
    });
    return new StepResponse(created, { previous: null, id: created.id });
  },
  async (compensation) => {
    if (compensation?.previous) {
      restoreUserRecord(compensation.previous);
    } else if (compensation?.id) {
      deleteUserRecord(compensation.id);
    }
  },
);

export const dingTalkAuthWorkflow = createWorkflow(
  "dingtalk-auth-workflow",
  (input: DingTalkAuthWorkflowInput) => {
    const user = upsertUserStep(input);
    return new WorkflowResponse(user);
  },
);
