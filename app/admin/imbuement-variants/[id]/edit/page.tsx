import ImbuementVariantForm from "@/components/admin/forms/ImbuementVariantForm";
interface Props {
  params: { id: string };
}
export default function EditImbuementVariantPage({ params }: Props) {
  return <ImbuementVariantForm id={Number(params.id)} />;
}
