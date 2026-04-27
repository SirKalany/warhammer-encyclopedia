import UnitAttributeForm from "@/components/admin/forms/UnitAttributeForm";
interface Props {
  params: { id: string };
}
export default function EditUnitAttributePage({ params }: Props) {
  return <UnitAttributeForm id={Number(params.id)} />;
}
