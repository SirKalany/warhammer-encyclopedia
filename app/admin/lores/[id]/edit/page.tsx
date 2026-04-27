import LoreForm from "@/components/admin/forms/LoreForm";
interface Props {
  params: { id: string };
}
export default function EditLorePage({ params }: Props) {
  return <LoreForm id={Number(params.id)} />;
}
