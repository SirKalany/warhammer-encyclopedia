import BuildingVariantForm from "@/components/admin/forms/BuildingVariantForm";
interface Props {
  params: { id: string };
}
export default function EditBuildingVariantPage({ params }: Props) {
  return <BuildingVariantForm id={Number(params.id)} />;
}
