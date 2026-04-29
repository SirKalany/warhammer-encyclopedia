import ItemForm from "@/components/admin/forms/ItemForm";
interface Props {
  params: { id: string };
}
export default function EditItemPage({ params }: Props) {
  return <ItemForm id={Number(params.id)} />;
}
