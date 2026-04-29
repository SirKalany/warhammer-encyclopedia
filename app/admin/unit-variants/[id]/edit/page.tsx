import UnitVariantForm from "@/components/admin/forms/UnitVariantForm";
interface Props {
  params: { id: string };
}
export default function EditUnitVariantPage({ params }: Props) {
  return <UnitVariantForm id={Number(params.id)} />;
}
