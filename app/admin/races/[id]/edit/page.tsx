import RaceForm from "@/components/admin/forms/RaceForm";
interface Props {
  params: { id: string };
}
export default function EditRacePage({ params }: Props) {
  return <RaceForm id={Number(params.id)} />;
}
