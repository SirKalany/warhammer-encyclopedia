import UnitForm from "@/components/admin/forms/UnitForm";
interface Props {
  params: { id: string };
}
export default function EditUnitPage({ params }: Props) {
  return <UnitForm id={Number(params.id)} />;
}
