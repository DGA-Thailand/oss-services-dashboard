import DashboardView from "@/components/dashboard/DashboardView"
import { getOverallStats, getMinistries, db } from "@/lib/data"

export default function Home() {
  const stats = getOverallStats();
  const childrenEntities = getMinistries();

  return (
    <DashboardView
      title="ภาพรวมงานบริการและโครงการ"
      subtitle="ระดับประเทศ (ทั้งหมด)"
      description="เว็บไซต์นี้รวบรวมข้อมูลสถานะการนำงานบริการภาครัฐเชื่อมโยงแพลตฟอร์มดิจิทัลกลาง ครอบคลุมทั้งงานบริการที่เปิดใช้งานแล้ว งานบริการที่อยู่ระหว่างดำเนินการในปีงบประมาณ 2569 และงานบริการที่อยู่ระหว่างรอจัดสรรงบประมาณ"
      stats={{
        ...stats,
        servicesList: db.services,
        projectsList: db.projects
      }}
      childrenEntities={childrenEntities}
      basePath="/ministry"
    />
  );
}
