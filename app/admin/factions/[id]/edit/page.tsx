import FactionForm from "@/components/admin/forms/FactionForm";
interface Props {
  params: { id: string };
}
export default function EditFactionPage({ params }: Props) {
  return <FactionForm id={Number(params.id)} />;
}
