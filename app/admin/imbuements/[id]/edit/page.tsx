import ImbuementForm from "@/components/admin/forms/ImbuementForm";
interface Props {
  params: { id: string };
}
export default function EditImbuementPage({ params }: Props) {
  return <ImbuementForm id={Number(params.id)} />;
}
