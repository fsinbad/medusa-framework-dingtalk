import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { ProductNotFoundError, getProductById } from "@/lib/catalog-service";
import { parseUpdateProductJson } from "@/lib/catalog-inputs";
import {
  deleteProductWorkflow,
  updateProductWorkflow,
} from "@/workflows/products";
import { getSessionUser } from "@/lib/auth-service";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function toErrorResponse(error: unknown) {
  if (error instanceof ProductNotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "请求参数校验失败",
        issues: error.issues,
      },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : "未知错误",
    },
    { status: 500 },
  );
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const product = getProductById(id);

  if (!product) {
    return NextResponse.json({ error: "商品不存在" }, { status: 404 });
  }

  return NextResponse.json({ data: product });
}

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "未认证" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const changes = parseUpdateProductJson(body);
    const { result } = await updateProductWorkflow().run({
      input: { id, changes },
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "未认证" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const { result } = await deleteProductWorkflow().run({
      input: { id },
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    return toErrorResponse(error);
  }
}
