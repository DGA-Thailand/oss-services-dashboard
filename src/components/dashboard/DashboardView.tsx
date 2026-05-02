"use client"
import React, { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/data"
import { TypographyHeader, TypographySubHeader, TypographyTitle } from "@/components/ui/typography"
import { ArrowUpDown, Search } from "lucide-react"

export default function DashboardView({ 
  title, 
  subtitle,
  description,
  stats,
  childrenEntities, // e.g., ministries or agencies
  basePath // e.g. /ministry
}: any) {
  
  const [activeTab, setActiveTab] = useState<'summary' | 'services' | 'projects'>('summary');

  // Services State
  const [serviceSearch, setServiceSearch] = useState("");
  const [serviceStatusFilter, setServiceStatusFilter] = useState("all");
  const [serviceSortConfig, setServiceSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);

  // Projects State
  const [projectSearch, setProjectSearch] = useState("");
  const [projectSortConfig, setProjectSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);

  const requestServiceSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (serviceSortConfig && serviceSortConfig.key === key && serviceSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setServiceSortConfig({ key, direction });
  };

  const requestProjectSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (projectSortConfig && projectSortConfig.key === key && projectSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setProjectSortConfig({ key, direction });
  };

  const filteredServices = useMemo(() => {
    let sortableItems = [...(stats.servicesList || [])];

    if (serviceSearch) {
      const lowerSearch = serviceSearch.toLowerCase();
      sortableItems = sortableItems.filter(s => 
        (s.service_id && s.service_id.toLowerCase().includes(lowerSearch)) ||
        (s.ชื่องานบริการ && s.ชื่องานบริการ.toLowerCase().includes(lowerSearch)) ||
        (s.รายชื่อกระทรวง && s.รายชื่อกระทรวง.toLowerCase().includes(lowerSearch)) ||
        (s.รายชื่อหน่วยงาน && s.รายชื่อหน่วยงาน.toLowerCase().includes(lowerSearch))
      );
    }

    if (serviceStatusFilter !== 'all') {
      sortableItems = sortableItems.filter(s => s.สถานะ === serviceStatusFilter);
    }

    if (serviceSortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[serviceSortConfig.key] < b[serviceSortConfig.key]) {
          return serviceSortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[serviceSortConfig.key] > b[serviceSortConfig.key]) {
          return serviceSortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [stats.servicesList, serviceSearch, serviceStatusFilter, serviceSortConfig]);

  const filteredProjects = useMemo(() => {
    let sortableItems = [...(stats.projectsList || [])];

    if (projectSearch) {
      const lowerSearch = projectSearch.toLowerCase();
      sortableItems = sortableItems.filter(p => 
        (p.project_id && p.project_id.toLowerCase().includes(lowerSearch)) ||
        (p.ชื่อโครงการ && p.ชื่อโครงการ.toLowerCase().includes(lowerSearch)) ||
        (p.รายชื่อกระทรวง && p.รายชื่อกระทรวง.toLowerCase().includes(lowerSearch)) ||
        (p.รายชื่อหน่วยงาน && p.รายชื่อหน่วยงาน.toLowerCase().includes(lowerSearch))
      );
    }

    if (projectSortConfig !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[projectSortConfig.key] || 0;
        const valB = b[projectSortConfig.key] || 0;
        if (valA < valB) {
          return projectSortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
          return projectSortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [stats.projectsList, projectSearch, projectSortConfig]);
  
  return (
    <div className="flex flex-col min-h-screen bg-[var(--canvas-default)]">
      <header className="sticky top-0 z-50 bg-[var(--background-neutral-lighter)] shadow-custom px-[var(--spacing-xl)] lg:px-[var(--spacing-4xl)] py-[var(--spacing-lg)]">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div>
            <TypographyHeader>{title}</TypographyHeader>
            {subtitle && <TypographySubHeader>{subtitle}</TypographySubHeader>}
          </div>
          {basePath !== '' && (
            <Link href="/" className="text-[var(--primary-30-base)] hover:underline font-medium">
              กลับหน้าหลัก
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 px-[var(--spacing-xl)] lg:px-[var(--spacing-4xl)] py-[var(--spacing-3xl)]">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-[var(--spacing-3xl)]">

          {description && (
            <p className="text-[length:var(--font-size-body-l)] leading-[var(--line-height-body-l)] text-[var(--foreground-neutral-default)] max-w-4xl">
              {description}
            </p>
          )}
          
          <div className="flex gap-[var(--spacing-md)] mb-[var(--spacing-lg)] overflow-x-auto pb-2">
             <button onClick={() => setActiveTab('summary')} className={`px-4 py-2 whitespace-nowrap rounded-full font-medium ${activeTab === 'summary' ? 'bg-[var(--primary-30-base)] text-white' : 'bg-white text-[var(--foreground-neutral-default)] shadow-sm hover:bg-neutral-50'}`}>ภาพรวม (Summary)</button>
             <button onClick={() => setActiveTab('services')} className={`px-4 py-2 whitespace-nowrap rounded-full font-medium ${activeTab === 'services' ? 'bg-[var(--primary-30-base)] text-white' : 'bg-white text-[var(--foreground-neutral-default)] shadow-sm hover:bg-neutral-50'}`}>รายชื่องานบริการ</button>
             <button onClick={() => setActiveTab('projects')} className={`px-4 py-2 whitespace-nowrap rounded-full font-medium ${activeTab === 'projects' ? 'bg-[var(--primary-30-base)] text-white' : 'bg-white text-[var(--foreground-neutral-default)] shadow-sm hover:bg-neutral-50'}`}>รายชื่อโครงการ</button>
          </div>

          {activeTab === 'summary' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-xl)]">
                {/* Services Stats */}
                <Card className="hover:border-[var(--primary-30-base)] transition-colors cursor-pointer" onClick={() => {
                  setActiveTab('services');
                  setServiceStatusFilter('all');
                }}>
                  <CardHeader>
                    <CardTitle>งานบริการทั้งหมด</CardTitle>
                    <CardDescription>ข้อมูลสถานะของงานบริการ</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-[var(--spacing-md)]">

                    <div 
                      className="flex justify-between items-center bg-[var(--background-neutral-medium)] p-[var(--spacing-md)] rounded-[var(--radius-md)] hover:bg-[var(--background-neutral-dark)] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('services');
                        setServiceStatusFilter('เชื่อมโยงแล้ว');
                      }}
                    >
                      <span className="text-[var(--foreground-neutral-light)]">เชื่อมโยงแล้ว</span>
                      <Badge variant="success">{stats.linked}</Badge>
                    </div>
                    <div 
                      className="flex justify-between items-center bg-[var(--background-neutral-medium)] p-[var(--spacing-md)] rounded-[var(--radius-md)] hover:bg-[var(--background-neutral-dark)] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('services');
                        setServiceStatusFilter('อยู่ระหว่างการดำเนินการ');
                      }}
                    >
                      <span className="text-[var(--foreground-neutral-light)]">อยู่ระหว่างดำเนินการ</span>
                      <Badge variant="warning">{stats.inProgress}</Badge>
                    </div>
                    <div 
                      className="flex justify-between items-center bg-[var(--background-neutral-medium)] p-[var(--spacing-md)] rounded-[var(--radius-md)] hover:bg-[var(--background-neutral-dark)] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('services');
                        setServiceStatusFilter('to-be-funded');
                      }}
                    >
                      <span className="text-[var(--foreground-neutral-light)]">รอการจัดสรรงบประมาณ</span>
                      <Badge variant="secondary">{stats.pendingFunding}</Badge>
                    </div>
                    <div 
                      className="flex justify-between items-center bg-[var(--background-primary-lighter)] p-[var(--spacing-md)] rounded-[var(--radius-md)] mt-1 border border-[var(--primary-20)] hover:bg-[var(--background-primary-light)] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('services');
                        setServiceStatusFilter('all');
                      }}
                    >
                      <span className="font-semibold text-[var(--foreground-primary-dark)]">รวมทั้งหมด</span>
                      <span className="font-bold text-[var(--primary-40)] text-[length:var(--font-size-title-m)]">{stats.totalServices}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Projects Stats */}
                <Card className="hover:border-[var(--primary-30-base)] transition-colors cursor-pointer" onClick={() => setActiveTab('projects')}>
                  <CardHeader>
                    <CardTitle>โครงการทั้งหมด</CardTitle>
                    <CardDescription>โครงการที่หน่วยงานเสนอ และอยู่ระหว่างการรอจัดสรรงบประมาณ</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-[var(--spacing-md)]">
                    <div className="flex justify-between items-center bg-[var(--background-neutral-medium)] p-[var(--spacing-md)] rounded-[var(--radius-md)]">
                      <span className="text-[var(--foreground-neutral-light)]">จำนวนโครงการ</span>
                      <Badge variant="default">{stats.projectsCount}</Badge>
                    </div>
                    <div className="flex flex-col gap-1 bg-[var(--background-primary-lighter)] p-[var(--spacing-md)] rounded-[var(--radius-md)]">
                      <span className="text-[var(--foreground-primary-default)] text-[length:var(--font-size-label-m)]">กรอบงบประมาณรวม</span>
                      <span className="text-[length:var(--font-size-title-l)] font-semibold text-[var(--foreground-primary-dark)]">{formatCurrency(stats.budget)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {childrenEntities && childrenEntities.length > 0 && (
                <div className="mt-[var(--spacing-xl)]">
                  <TypographyTitle className="mb-[var(--spacing-xl)]">หน่วยงานย่อย (Drill-down)</TypographyTitle>
                  <Card>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[length:var(--font-size-body-m)]">
                          <thead className="bg-[var(--background-neutral-medium)] text-[var(--foreground-neutral-light)]">
                            <tr>
                              <th className="p-[var(--spacing-md)] rounded-tl-[var(--radius-md)]">หน่วยงาน</th>
                              <th className="p-[var(--spacing-md)] text-center">เชื่อมโยงแล้ว</th>
                              <th className="p-[var(--spacing-md)] text-center">กำลังดำเนินการ</th>
                              <th className="p-[var(--spacing-md)] text-center">รอจัดสรรงบฯ</th>
                              <th className="p-[var(--spacing-md)] text-center">จำนวนโครงการ</th>
                              <th className="p-[var(--spacing-md)] rounded-tr-[var(--radius-md)] text-right">งบประมาณ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {childrenEntities.map((child: any) => (
                              <tr key={child.id} className="border-b border-[var(--stroke-neutral-default)] hover:bg-[var(--background-primary-lighter)] transition-colors cursor-pointer group">
                                <td className="p-[var(--spacing-md)]">
                                  <Link href={`${basePath}/${child.id}`} className="block font-medium text-[var(--primary-40)] group-hover:underline">
                                    {child.name}
                                  </Link>
                                </td>
                                <td className="p-[var(--spacing-md)] text-center"><Badge variant="success">{child.linked}</Badge></td>
                                <td className="p-[var(--spacing-md)] text-center"><Badge variant="warning">{child.inProgress}</Badge></td>
                                <td className="p-[var(--spacing-md)] text-center"><Badge variant="secondary">{child.pendingFunding}</Badge></td>
                                <td className="p-[var(--spacing-md)] text-center"><Badge variant="default">{child.projectsCount}</Badge></td>
                                <td className="p-[var(--spacing-md)] text-right font-medium text-[var(--foreground-primary-dark)]">{formatCurrency(child.budget)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}

          {activeTab === 'services' && (
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle>รายชื่องานบริการ</CardTitle>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-neutral-lighter)] h-4 w-4" />
                    <input 
                      type="text" 
                      placeholder="ค้นหา..." 
                      className="pl-9 pr-4 py-2 rounded-md border border-[var(--stroke-neutral-default)] text-[length:var(--font-size-body-m)] w-full sm:w-64 outline-none focus:border-[var(--primary-40)]"
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                    />
                  </div>
                  <select 
                    className="px-4 py-2 rounded-md border border-[var(--stroke-neutral-default)] text-[length:var(--font-size-body-m)] outline-none focus:border-[var(--primary-40)] bg-white"
                    value={serviceStatusFilter}
                    onChange={(e) => setServiceStatusFilter(e.target.value)}
                  >
                    <option value="all">สถานะทั้งหมด</option>
                    <option value="เชื่อมโยงแล้ว">เชื่อมโยงแล้ว</option>
                    <option value="อยู่ระหว่างการดำเนินการ">อยู่ระหว่างดำเนินการ</option>
                    <option value="to-be-funded">รอการจัดสรรงบประมาณ</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[length:var(--font-size-body-m)]">
                    <thead className="bg-[var(--background-neutral-medium)] text-[var(--foreground-neutral-light)]">
                      <tr>
                        <th className="p-[var(--spacing-md)] rounded-tl-[var(--radius-md)] cursor-pointer hover:bg-[var(--background-neutral-dark)] transition-colors" onClick={() => requestServiceSort('service_id')}>
                          <div className="flex items-center gap-1">รหัสบริการ <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                        <th className="p-[var(--spacing-md)] cursor-pointer hover:bg-[var(--background-neutral-dark)] transition-colors" onClick={() => requestServiceSort('ชื่องานบริการ')}>
                          <div className="flex items-center gap-1">ชื่อบริการ <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                        <th className="p-[var(--spacing-md)] cursor-pointer hover:bg-[var(--background-neutral-dark)] transition-colors" onClick={() => requestServiceSort('รายชื่อกระทรวง')}>
                          <div className="flex items-center gap-1">กระทรวง <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                        <th className="p-[var(--spacing-md)] cursor-pointer hover:bg-[var(--background-neutral-dark)] transition-colors" onClick={() => requestServiceSort('รายชื่อหน่วยงาน')}>
                          <div className="flex items-center gap-1">หน่วยงาน <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                        <th className="p-[var(--spacing-md)] rounded-tr-[var(--radius-md)] cursor-pointer hover:bg-[var(--background-neutral-dark)] transition-colors" onClick={() => requestServiceSort('สถานะ')}>
                          <div className="flex items-center gap-1">สถานะ <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredServices.length === 0 ? (
                        <tr><td colSpan={5} className="text-center p-8 text-neutral-500">ไม่พบข้อมูลที่ค้นหา</td></tr>
                      ) : (
                        filteredServices.map((s: any) => (
                          <tr key={s.service_id} className="border-b border-[var(--stroke-neutral-default)] hover:bg-[var(--background-neutral-light)]">
                            <td className="p-[var(--spacing-md)]">{s.service_id}</td>
                            <td className="p-[var(--spacing-md)]">{s.ชื่องานบริการ}</td>
                            <td className="p-[var(--spacing-md)]">{s.รายชื่อกระทรวง}</td>
                            <td className="p-[var(--spacing-md)]">{s.รายชื่อหน่วยงาน}</td>
                            <td className="p-[var(--spacing-md)]">
                              <Badge variant={s.สถานะ === 'เชื่อมโยงแล้ว' ? 'success' : s.สถานะ === 'อยู่ระหว่างการดำเนินการ' ? 'warning' : 'secondary'}>
                                {s.สถานะ === 'to-be-funded' ? 'รอการจัดสรรงบประมาณ' : s.สถานะ}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'projects' && (
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <CardTitle>รายชื่อโครงการ</CardTitle>
                  <CardDescription className="mt-1">โครงการที่หน่วยงานเสนอ และอยู่ระหว่างการรอจัดสรรงบประมาณ</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-neutral-lighter)] h-4 w-4" />
                  <input 
                    type="text" 
                    placeholder="ค้นหา..." 
                    className="pl-9 pr-4 py-2 rounded-md border border-[var(--stroke-neutral-default)] text-[length:var(--font-size-body-m)] w-full sm:w-64 outline-none focus:border-[var(--primary-40)]"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[length:var(--font-size-body-m)]">
                    <thead className="bg-[var(--background-neutral-medium)] text-[var(--foreground-neutral-light)]">
                      <tr>
                        <th className="p-[var(--spacing-md)] rounded-tl-[var(--radius-md)] cursor-pointer hover:bg-[var(--background-neutral-dark)] transition-colors" onClick={() => requestProjectSort('project_id')}>
                          <div className="flex items-center gap-1">รหัสโครงการ <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                        <th className="p-[var(--spacing-md)] cursor-pointer hover:bg-[var(--background-neutral-dark)] transition-colors" onClick={() => requestProjectSort('ชื่อโครงการ')}>
                          <div className="flex items-center gap-1">ชื่อโครงการ <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                        <th className="p-[var(--spacing-md)] cursor-pointer hover:bg-[var(--background-neutral-dark)] transition-colors" onClick={() => requestProjectSort('รายชื่อกระทรวง')}>
                          <div className="flex items-center gap-1">กระทรวง <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                        <th className="p-[var(--spacing-md)] cursor-pointer hover:bg-[var(--background-neutral-dark)] transition-colors" onClick={() => requestProjectSort('รายชื่อหน่วยงาน')}>
                          <div className="flex items-center gap-1">หน่วยงาน <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                        <th className="p-[var(--spacing-md)] rounded-tr-[var(--radius-md)] text-right cursor-pointer hover:bg-[var(--background-neutral-dark)] transition-colors" onClick={() => requestProjectSort('กรอบงบประมาณ')}>
                          <div className="flex items-center justify-end gap-1"><ArrowUpDown className="h-3 w-3" /> งบประมาณ</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.length === 0 ? (
                        <tr><td colSpan={5} className="text-center p-8 text-neutral-500">ไม่พบข้อมูลที่ค้นหา</td></tr>
                      ) : (
                        filteredProjects.map((p: any) => (
                          <tr key={p.project_id} className="border-b border-[var(--stroke-neutral-default)] hover:bg-[var(--background-neutral-light)]">
                            <td className="p-[var(--spacing-md)]">{p.project_id}</td>
                            <td className="p-[var(--spacing-md)]">{p.ชื่อโครงการ}</td>
                            <td className="p-[var(--spacing-md)]">{p.รายชื่อกระทรวง}</td>
                            <td className="p-[var(--spacing-md)]">{p.รายชื่อหน่วยงาน}</td>
                            <td className="p-[var(--spacing-md)] text-right font-medium">{formatCurrency(p.กรอบงบประมาณ || 0)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </main>
    </div>
  )
}
