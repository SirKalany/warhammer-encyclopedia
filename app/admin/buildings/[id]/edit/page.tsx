import BuildingForm from "@/components/admin/forms/BuildingForm";
interface Props {
  params: { id: string };
}
export default function EditBuildingPage({ params }: Props) {
  return <BuildingForm id={Number(params.id)} />;
}
