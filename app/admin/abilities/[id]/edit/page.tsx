import AbilityForm from "@/components/admin/forms/AbilityForm";
interface Props {
  params: { id: string };
}
export default function EditAbilityPage({ params }: Props) {
  return <AbilityForm id={Number(params.id)} />;
}
