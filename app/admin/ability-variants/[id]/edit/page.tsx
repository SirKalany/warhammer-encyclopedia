import AbilityVariantForm from "@/components/admin/forms/AbilityVariantForm";
interface Props {
  params: { id: string };
}
export default function EditAbilityVariantPage({ params }: Props) {
  return <AbilityVariantForm id={Number(params.id)} />;
}
