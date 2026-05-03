import DashboardView from "@/components/dashboard/DashboardView"
import { getOverallStats, getMinistries, db } from "@/lib/data"

export default function Home() {
  const stats = getOverallStats();
  const childrenEntities = getMinistries();

  return (
    <DashboardView
      title="ภาพรวมงานบริการและโครงการ"
      subtitle="ระดับประเทศ (ทั้งหมด)"
      description="เว็บไซต์นี้รวบรวมสถานะการเชื่อมโยงงานบริการภาครัฐเข้าสู่แพลตฟอร์มดิจิทัลกลาง โดยแบ่งเป็นกลุ่มงานบริการที่เปิดใช้งานแล้ว, อยู่ระหว่างดำเนินการ (ปีงบประมาณ 2569) และรอการจัดสรรงบประมาณ รวมถึงให้ข้อมูลเหตุผลประกอบสำหรับงานบริการรูปแบบ e-Service ที่ยังไม่เชื่อมโยงระบบ และงานบริการที่ไม่มีแผนพัฒนาเป็นระบบดิจิทัล"
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
