import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { SalesPageContent, ProductInput } from "@/types";
import EditPageClient from "./edit-page-client";

interface Props {
  params: { id: string };
}

export default async function EditPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const page = await db.salesPage.findUnique({
    where: { id: params.id, userId: session.user.id },
  });

  if (!page) notFound();

  const productInput: ProductInput = {
    productName: page.productName,
    description: page.description,
    features: JSON.parse(page.features) as string[],
    targetAudience: page.targetAudience,
    price: page.price,
    usp: page.usp,
    template: page.template,
  };

  const content = JSON.parse(page.content) as SalesPageContent;

  return (
    <EditPageClient
      pageId={page.id}
      initialInput={productInput}
      initialContent={content}
    />
  );
}
