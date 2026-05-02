import DashboardView from "@/components/dashboard/DashboardView"
import { getMinistryStats, getAgencies, getMinistries, db } from "@/lib/data"

export async function generateStaticParams() {
  const ministries = getMinistries();
  return ministries.map((m) => ({
    ministryId: String(m.id),
  }));
}

export default function MinistryPage({
  params,
}: {
  params: { ministryId: string }
}) {
  const { ministryId } = params;
  const stats = getMinistryStats(ministryId);
  const childrenEntities = getAgencies(ministryId);
  
  return (
    <DashboardView 
      title={stats.name}
      subtitle="ระดับกระทรวง"
      stats={{
        ...stats,
        servicesList: db.services.filter(s => s.ministry_id === ministryId),
        projectsList: db.projects.filter(p => p.ministry_id === ministryId)
      }}
      childrenEntities={childrenEntities}
      basePath={`/ministry/${ministryId}/agency`}
    />
  );
}
