import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

import {
  createProductRecord,
  deleteProductRecord,
  restoreProductRecord,
  updateProductRecord,
} from "@/lib/catalog-service";
import type { CreateProductInput, UpdateProductInput } from "@/lib/catalog-inputs";

type UpdateProductWorkflowInput = {
  id: string;
  changes: UpdateProductInput;
};

type DeleteProductWorkflowInput = {
  id: string;
};

const createProductStep = createStep(
  "create-product-record",
  async (input: CreateProductInput) => {
    const created = createProductRecord(input);
    return new StepResponse(created, { id: created.id });
  },
  async (compensation) => {
    if (compensation?.id) {
      deleteProductRecord(compensation.id);
    }
  },
);

const updateProductStep = createStep(
  "update-product-record",
  async ({ id, changes }: UpdateProductWorkflowInput) => {
    const result = updateProductRecord(id, changes);
    return new StepResponse(result.current, { previous: result.previous });
  },
  async (compensation) => {
    if (compensation?.previous) {
      restoreProductRecord(compensation.previous);
    }
  },
);

const deleteProductStep = createStep(
  "delete-product-record",
  async ({ id }: DeleteProductWorkflowInput) => {
    const removed = deleteProductRecord(id);
    return new StepResponse(removed, { previous: removed });
  },
  async (compensation) => {
    if (compensation?.previous) {
      restoreProductRecord(compensation.previous);
    }
  },
);

export const createProductWorkflow = createWorkflow(
  "create-product-workflow",
  (input: CreateProductInput) => {
    const product = createProductStep(input);
    return new WorkflowResponse(product);
  },
);

export const updateProductWorkflow = createWorkflow(
  "update-product-workflow",
  (input: UpdateProductWorkflowInput) => {
    const product = updateProductStep(input);
    return new WorkflowResponse(product);
  },
);

export const deleteProductWorkflow = createWorkflow(
  "delete-product-workflow",
  (input: DeleteProductWorkflowInput) => {
    const product = deleteProductStep(input);
    return new WorkflowResponse(product);
  },
);
