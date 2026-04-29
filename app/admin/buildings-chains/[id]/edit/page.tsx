import BuildingChainForm from "@/components/admin/forms/BuildingChainForm";
interface Props {
  params: { id: string };
}
export default function EditBuildingChainPage({ params }: Props) {
  return <BuildingChainForm id={Number(params.id)} />;
}
