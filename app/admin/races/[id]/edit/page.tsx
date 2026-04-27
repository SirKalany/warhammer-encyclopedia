interface Props {
  params: { id: string };
}

import RaceForm from "@/components/admin/forms/RaceForm";

export default function EditRacePage({ params }: Props) {
  return <RaceForm id={Number(params.id)} />;
}
