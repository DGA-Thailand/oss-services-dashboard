import DashboardView from "@/components/dashboard/DashboardView"
import { getAgencyStats, db } from "@/lib/data"

export async function generateStaticParams() {
  const params: { ministryId: string; agencyId: string }[] = [];
  
  // Collect unique pairs of ministry_id and agency_id
  const pairSet = new Set<string>();
  
  db.services.forEach(s => {
    pairSet.add(`${s.ministry_id}|${s.agency_id}`);
  });
  
  db.projects.forEach(p => {
    pairSet.add(`${p.ministry_id}|${p.agency_id}`);
  });
  
  Array.from(pairSet).forEach(pair => {
    const [ministryId, agencyId] = pair.split('|');
    params.push({ ministryId: String(ministryId), agencyId: String(agencyId) });
  });
  
  return params;
}

export default function AgencyPage({
  params,
}: {
  params: { ministryId: string; agencyId: string }
}) {
  const { ministryId, agencyId } = params;
  const stats = getAgencyStats(ministryId, agencyId);
  
  return (
    <DashboardView 
      title={stats.name}
      subtitle="ระดับหน่วยงาน"
      stats={{
        ...stats,
        servicesList: db.services.filter(s => s.ministry_id === ministryId && s.agency_id === agencyId),
        projectsList: db.projects.filter(p => p.ministry_id === ministryId && p.agency_id === agencyId)
      }}
      childrenEntities={[]} // No deeper drill-down from agency level
      basePath=""
    />
  );
}
