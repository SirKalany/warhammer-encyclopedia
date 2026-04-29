import GameVersionForm from "@/components/admin/forms/GameVersionForm";
interface Props {
  params: { id: string };
}
export default function EditVersionPage({ params }: Props) {
  return <GameVersionForm id={Number(params.id)} />;
}
