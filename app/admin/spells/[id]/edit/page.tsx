import SpellForm from "@/components/admin/forms/SpellForm";
interface Props {
  params: { id: string };
}
export default function EditSpellPage({ params }: Props) {
  return <SpellForm id={Number(params.id)} />;
}
