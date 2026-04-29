import FactionVariantForm from "@/components/admin/forms/FactionVariantForm";
interface Props {
  params: { id: string };
}
export default function EditFactionVariantPage({ params }: Props) {
  return <FactionVariantForm id={Number(params.id)} />;
}
