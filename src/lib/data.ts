import rawData from "../../public/data.json";

export interface Service {
  service_id: string;
  ministry_id: string;
  agency_id: string;
  รายชื่อกระทรวง: string;
  รายชื่อหน่วยงาน: string;
  ประเภทหน่วยงาน: string;
  ชื่องานบริการ: string;
  สถานะ: string;
  ชื่อโครงการ: string | null;
}

export interface Project {
  project_id: string;
  ministry_id: string;
  agency_id: string;
  รายชื่อกระทรวง: string;
  รายชื่อหน่วยงาน: string;
  ประเภทหน่วยงาน: string;
  ชื่อโครงการ: string;
  กรอบงบประมาณ: number | null;
}

export interface DataPayload {
  services: Service[];
  projects: Project[];
}

export const db = rawData as DataPayload;

export function getOverallStats() {
  const linked = db.services.filter(s => s.สถานะ === 'เชื่อมโยงแล้ว').length;
  const inProgress = db.services.filter(s => s.สถานะ === 'อยู่ระหว่างการดำเนินการ').length;
  const pendingFunding = db.services.filter(s => s.สถานะ === 'to-be-funded').length;
  const totalServices = linked + inProgress + pendingFunding;
  
  const projectsCount = db.projects.length;
  const budget = db.projects.reduce((acc, p) => acc + (p.กรอบงบประมาณ || 0), 0);
  
  return {
    linked, inProgress, pendingFunding, totalServices, projectsCount, budget
  };
}

export function getMinistryStats(ministryId: string) {
  const mServices = db.services.filter(s => s.ministry_id === ministryId);
  const mProjects = db.projects.filter(p => p.ministry_id === ministryId);
  
  const linked = mServices.filter(s => s.สถานะ === 'เชื่อมโยงแล้ว').length;
  const inProgress = mServices.filter(s => s.สถานะ === 'อยู่ระหว่างการดำเนินการ').length;
  const pendingFunding = mServices.filter(s => s.สถานะ === 'to-be-funded').length;
  const totalServices = linked + inProgress + pendingFunding;
  
  const projectsCount = mProjects.length;
  const budget = mProjects.reduce((acc, p) => acc + (p.กรอบงบประมาณ || 0), 0);
  const name = mServices.length > 0 ? mServices[0].รายชื่อกระทรวง : mProjects[0]?.รายชื่อกระทรวง || '';
  
  return {
    name, linked, inProgress, pendingFunding, totalServices, projectsCount, budget
  };
}

export function getAgencyStats(ministryId: string, agencyId: string) {
  const aServices = db.services.filter(s => s.ministry_id === ministryId && s.agency_id === agencyId);
  const aProjects = db.projects.filter(p => p.ministry_id === ministryId && p.agency_id === agencyId);
  
  const linked = aServices.filter(s => s.สถานะ === 'เชื่อมโยงแล้ว').length;
  const inProgress = aServices.filter(s => s.สถานะ === 'อยู่ระหว่างการดำเนินการ').length;
  const pendingFunding = aServices.filter(s => s.สถานะ === 'to-be-funded').length;
  const totalServices = linked + inProgress + pendingFunding;
  
  const projectsCount = aProjects.length;
  const budget = aProjects.reduce((acc, p) => acc + (p.กรอบงบประมาณ || 0), 0);
  const name = aServices.length > 0 ? aServices[0].รายชื่อหน่วยงาน : aProjects[0]?.รายชื่อหน่วยงาน || '';
  
  return {
    name, linked, inProgress, pendingFunding, totalServices, projectsCount, budget
  };
}

export function getMinistries() {
  const map = new Map<string, string>();
  db.services.forEach(s => map.set(s.ministry_id, s.รายชื่อกระทรวง));
  db.projects.forEach(p => map.set(p.ministry_id, p.รายชื่อกระทรวง));
  return Array.from(map.entries()).map(([id, name]) => {
    return { id, ...getMinistryStats(id) };
  });
}

export function getAgencies(ministryId: string) {
  const map = new Map<string, string>();
  db.services.filter(s => s.ministry_id === ministryId).forEach(s => map.set(s.agency_id, s.รายชื่อหน่วยงาน));
  db.projects.filter(p => p.ministry_id === ministryId).forEach(p => map.set(p.agency_id, p.รายชื่อหน่วยงาน));
  return Array.from(map.entries()).map(([id, name]) => {
    return { id, ...getAgencyStats(ministryId, id) };
  });
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(amount);
}
