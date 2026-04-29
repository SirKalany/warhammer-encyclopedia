import SpellVariantForm from "@/components/admin/forms/SpellVariantForm";
interface Props {
  params: { id: string };
}
export default function EditSpellVariantPage({ params }: Props) {
  return <SpellVariantForm id={Number(params.id)} />;
}
