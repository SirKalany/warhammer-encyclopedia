import ItemVariantForm from "@/components/admin/forms/ItemVariantForm";
interface Props {
  params: { id: string };
}
export default function EditItemVariantPage({ params }: Props) {
  return <ItemVariantForm id={Number(params.id)} />;
}
