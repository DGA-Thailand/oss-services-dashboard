"use client"
import React, { useState, useMemo, useEffect } from "react"
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

  const trackEvent = (action: string, params: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, params);
    }
  };

  useEffect(() => {
    if (serviceSearch) {
      const timeoutId = setTimeout(() => {
        trackEvent('search', { search_type: 'services', search_term: serviceSearch });
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [serviceSearch]);

  useEffect(() => {
    if (projectSearch) {
      const timeoutId = setTimeout(() => {
        trackEvent('search', { search_type: 'projects', search_term: projectSearch });
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [projectSearch]);

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
        (s.รายชื่อหน่วยงาน && s.รายชื่อหน่วยงาน.toLowerCase().includes(lowerSearch)) ||
        (s.เหตุผล && s.เหตุผล.toLowerCase().includes(lowerSearch))
      );
    }

    if (serviceStatusFilter !== 'all') {
      sortableItems = sortableItems.filter(s => s.สถานะ === serviceStatusFilter);
    }

    if (serviceSortConfig !== null) {
      sortableItems.sort((a, b) => {
        // Handle null values
        const valA = a[serviceSortConfig.key] || "";
        const valB = b[serviceSortConfig.key] || "";
        if (valA < valB) {
          return serviceSortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
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
             <button onClick={() => { setActiveTab('summary'); trackEvent('view_tab', { tab_name: 'summary' }); }} className={`px-4 py-2 whitespace-nowrap rounded-full font-medium ${activeTab === 'summary' ? 'bg-[var(--primary-30-base)] text-white' : 'bg-white text-[var(--foreground-neutral-default)] shadow-sm hover:bg-neutral-50'}`}>ภาพรวม (Summary)</button>
             <button onClick={() => { setActiveTab('services'); trackEvent('view_tab', { tab_name: 'services' }); }} className={`px-4 py-2 whitespace-nowrap rounded-full font-medium ${activeTab === 'services' ? 'bg-[var(--primary-30-base)] text-white' : 'bg-white text-[var(--foreground-neutral-default)] shadow-sm hover:bg-neutral-50'}`}>รายชื่องานบริการ</button>
             <button onClick={() => { setActiveTab('projects'); trackEvent('view_tab', { tab_name: 'projects' }); }} className={`px-4 py-2 whitespace-nowrap rounded-full font-medium ${activeTab === 'projects' ? 'bg-[var(--primary-30-base)] text-white' : 'bg-white text-[var(--foreground-neutral-default)] shadow-sm hover:bg-neutral-50'}`}>รายชื่อโครงการ</button>
          </div>

          {activeTab === 'summary' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-xl)]">
                {/* Services Stats */}
                <Card className="hover:border-[var(--primary-30-base)] transition-colors cursor-pointer" onClick={() => {
                  setActiveTab('services');
                  setServiceStatusFilter('all');
                  trackEvent('view_tab', { tab_name: 'services' });
                  trackEvent('filter_status', { status: 'all' });
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
                        trackEvent('view_tab', { tab_name: 'services' });
                        trackEvent('filter_status', { status: 'เชื่อมโยงแล้ว' });
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
                        trackEvent('view_tab', { tab_name: 'services' });
                        trackEvent('filter_status', { status: 'อยู่ระหว่างการดำเนินการ' });
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
                        trackEvent('view_tab', { tab_name: 'services' });
                        trackEvent('filter_status', { status: 'to-be-funded' });
                      }}
                    >
                      <span className="text-[var(--foreground-neutral-light)]">รอการจัดสรรงบประมาณ</span>
                      <Badge variant="secondary">{stats.pendingFunding}</Badge>
                    </div>
                    
                    <div 
                      className="flex justify-between items-center bg-[var(--background-neutral-medium)] p-[var(--spacing-md)] rounded-[var(--radius-md)] hover:bg-[var(--background-neutral-dark)] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('services');
                        setServiceStatusFilter('ไม่พัฒนาเป็น e-Service');
                        trackEvent('view_tab', { tab_name: 'services' });
                        trackEvent('filter_status', { status: 'ไม่พัฒนาเป็น e-Service' });
                      }}
                    >
                      <span className="text-[var(--foreground-neutral-light)]">ไม่พัฒนาเป็น e-Service</span>
                      <Badge variant="destructive">{stats.notDeveloped}</Badge>
                    </div>
                    
                    <div 
                      className="flex justify-between items-center bg-[var(--background-neutral-medium)] p-[var(--spacing-md)] rounded-[var(--radius-md)] hover:bg-[var(--background-neutral-dark)] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('services');
                        setServiceStatusFilter('เป็น e-Service แล้ว ไม่เชื่อมโยงกลาง');
                        trackEvent('view_tab', { tab_name: 'services' });
                        trackEvent('filter_status', { status: 'เป็น e-Service แล้ว ไม่เชื่อมโยงกลาง' });
                      }}
                    >
                      <span className="text-[var(--foreground-neutral-light)] truncate max-w-[70%]">เป็น e-Service แล้ว ไม่เชื่อมโยงกลาง</span>
                      <Badge variant="outline">{stats.existingNotLinked}</Badge>
                    </div>

                    <div 
                      className="flex justify-between items-center bg-[var(--background-primary-lighter)] p-[var(--spacing-md)] rounded-[var(--radius-md)] mt-1 border border-[var(--primary-20)] hover:bg-[var(--background-primary-light)] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('services');
                        setServiceStatusFilter('all');
                        trackEvent('view_tab', { tab_name: 'services' });
                        trackEvent('filter_status', { status: 'all' });
                      }}
                    >
                      <span className="font-semibold text-[var(--foreground-primary-dark)]">รวมทั้งหมด</span>
                      <span className="font-bold text-[var(--primary-40)] text-[length:var(--font-size-title-m)]">{stats.totalServices}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Reason Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>สรุปเหตุผลที่ไม่เชื่อมโยง</CardTitle>
                    <CardDescription>สถิติเหตุผลของงานบริการที่ไม่พัฒนาเป็น e-Service</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-[var(--spacing-md)] max-h-[360px] overflow-y-auto pr-2">
                    {stats.reasonCounts?.length > 0 ? stats.reasonCounts.map((r: any, idx: number) => {
                       const maxCount = stats.reasonCounts[0]?.count || 1;
                       const width = Math.max(2, Math.round((r.count / maxCount) * 100));
                       return (
                         <div key={idx} className="flex flex-col gap-1 text-[length:var(--font-size-label-m)]">
                            <div className="flex justify-between text-[var(--foreground-neutral-light)] items-end">
                               <span className="truncate max-w-[85%] pr-2" title={r.reason}>{r.reason}</span>
                               <span className="font-semibold text-[var(--foreground-primary-dark)]">{r.count}</span>
                            </div>
                            <div className="w-full bg-[var(--background-neutral-medium)] rounded-full h-2">
                               <div className="bg-[var(--primary-30-base)] h-2 rounded-full transition-all duration-500" style={{ width: `${width}%` }}></div>
                            </div>
                         </div>
                       );
                    }) : (
                      <div className="text-center p-4 text-[var(--foreground-neutral-lighter)]">ไม่มีข้อมูลเหตุผล</div>
                    )}
                  </CardContent>
                </Card>

                {/* Projects Stats */}
                <Card className="hover:border-[var(--primary-30-base)] transition-colors cursor-pointer" onClick={() => { setActiveTab('projects'); trackEvent('view_tab', { tab_name: 'projects' }); }}>
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
                              <th className="p-[var(--spacing-md)] rounded-tl-[var(--radius-md)] whitespace-nowrap">หน่วยงาน</th>
                              <th className="p-[var(--spacing-md)] text-center whitespace-nowrap">เชื่อมโยงแล้ว</th>
                              <th className="p-[var(--spacing-md)] text-center whitespace-nowrap">กำลังดำเนินการ</th>
                              <th className="p-[var(--spacing-md)] text-center whitespace-nowrap">รอจัดสรรงบฯ</th>
                              <th className="p-[var(--spacing-md)] text-center whitespace-nowrap">ไม่พัฒนา e-Service</th>
                              <th className="p-[var(--spacing-md)] text-center whitespace-nowrap">e-Service ไม่เชื่อมโยง</th>
                              <th className="p-[var(--spacing-md)] text-center whitespace-nowrap">จำนวนโครงการ</th>
                              <th className="p-[var(--spacing-md)] rounded-tr-[var(--radius-md)] text-right whitespace-nowrap">งบประมาณ</th>
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
                                <td className="p-[var(--spacing-md)] text-center"><Badge variant="destructive">{child.notDeveloped}</Badge></td>
                                <td className="p-[var(--spacing-md)] text-center"><Badge variant="outline">{child.existingNotLinked}</Badge></td>
                                <td className="p-[var(--spacing-md)] text-center"><Badge variant="default">{child.projectsCount}</Badge></td>
                                <td className="p-[var(--spacing-md)] text-right font-medium text-[var(--foreground-primary-dark)] whitespace-nowrap">{formatCurrency(child.budget)}</td>
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
              <CardHeader className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <CardTitle>รายชื่องานบริการ</CardTitle>
                <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-neutral-lighter)] h-4 w-4" />
                    <input 
                      type="text" 
                      placeholder="ค้นหา (รหัส, ชื่อ, เหตุผล)..." 
                      className="pl-9 pr-4 py-2 rounded-md border border-[var(--stroke-neutral-default)] text-[length:var(--font-size-body-m)] w-full outline-none focus:border-[var(--primary-40)]"
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                    />
                  </div>
                  <select 
                    className="px-4 py-2 rounded-md border border-[var(--stroke-neutral-default)] text-[length:var(--font-size-body-m)] outline-none focus:border-[var(--primary-40)] bg-white w-full sm:w-auto max-w-full sm:max-w-xs truncate"
                    value={serviceStatusFilter}
                    onChange={(e) => { setServiceStatusFilter(e.target.value); trackEvent('filter_status', { status: e.target.value }); }}
                  >
                    <option value="all">สถานะทั้งหมด</option>
                    <option value="เชื่อมโยงแล้ว">เชื่อมโยงแล้ว</option>
                    <option value="อยู่ระหว่างการดำเนินการ">อยู่ระหว่างดำเนินการ</option>
                    <option value="to-be-funded">รอการจัดสรรงบประมาณ</option>
                    <option value="ไม่พัฒนาเป็น e-Service">ไม่พัฒนาเป็น e-Service</option>
                    <option value="เป็น e-Service แล้ว ไม่เชื่อมโยงกลาง">เป็น e-Service แล้ว ไม่เชื่อมโยงกลาง</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[length:var(--font-size-body-m)]">
                    <thead className="bg-[var(--background-neutral-medium)] text-[var(--foreground-neutral-light)]">
                      <tr>
                        <th className="p-[var(--spacing-md)] rounded-tl-[var(--radius-md)] cursor-pointer hover:bg-[var(--background-neutral-dark)] transition-colors whitespace-nowrap" onClick={() => requestServiceSort('service_id')}>
                          <div className="flex items-center gap-1">รหัสบริการ <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                        <th className="p-[var(--spacing-md)] cursor-pointer hover:bg-[var(--background-neutral-dark)] transition-colors whitespace-nowrap min-w-[200px]" onClick={() => requestServiceSort('ชื่องานบริการ')}>
                          <div className="flex items-center gap-1">ชื่อบริการ <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                        <th className="p-[var(--spacing-md)] cursor-pointer hover:bg-[var(--background-neutral-dark)] transition-colors whitespace-nowrap" onClick={() => requestServiceSort('รายชื่อกระทรวง')}>
                          <div className="flex items-center gap-1">กระทรวง <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                        <th className="p-[var(--spacing-md)] cursor-pointer hover:bg-[var(--background-neutral-dark)] transition-colors whitespace-nowrap" onClick={() => requestServiceSort('รายชื่อหน่วยงาน')}>
                          <div className="flex items-center gap-1">หน่วยงาน <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                        <th className="p-[var(--spacing-md)] cursor-pointer hover:bg-[var(--background-neutral-dark)] transition-colors whitespace-nowrap" onClick={() => requestServiceSort('สถานะ')}>
                          <div className="flex items-center gap-1">สถานะ <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                        <th className="p-[var(--spacing-md)] rounded-tr-[var(--radius-md)] cursor-pointer hover:bg-[var(--background-neutral-dark)] transition-colors min-w-[200px]" onClick={() => requestServiceSort('เหตุผล')}>
                          <div className="flex items-center gap-1">เหตุผลที่ไม่เชื่อมโยง <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredServices.length === 0 ? (
                        <tr><td colSpan={6} className="text-center p-8 text-neutral-500">ไม่พบข้อมูลที่ค้นหา</td></tr>
                      ) : (
                        filteredServices.map((s: any) => (
                          <tr key={s.service_id} className="border-b border-[var(--stroke-neutral-default)] hover:bg-[var(--background-neutral-light)]">
                            <td className="p-[var(--spacing-md)]">{s.service_id}</td>
                            <td className="p-[var(--spacing-md)]">{s.ชื่องานบริการ}</td>
                            <td className="p-[var(--spacing-md)]">{s.รายชื่อกระทรวง}</td>
                            <td className="p-[var(--spacing-md)]">{s.รายชื่อหน่วยงาน}</td>
                            <td className="p-[var(--spacing-md)]">
                              <Badge variant={
                                s.สถานะ === 'เชื่อมโยงแล้ว' ? 'success' : 
                                s.สถานะ === 'อยู่ระหว่างการดำเนินการ' ? 'warning' : 
                                s.สถานะ === 'ไม่พัฒนาเป็น e-Service' ? 'destructive' : 
                                s.สถานะ === 'เป็น e-Service แล้ว ไม่เชื่อมโยงกลาง' ? 'outline' : 
                                'secondary'
                              }>
                                {s.สถานะ === 'to-be-funded' ? 'รอการจัดสรรงบประมาณ' : s.สถานะ}
                              </Badge>
                            </td>
                            <td className="p-[var(--spacing-md)] text-[var(--foreground-neutral-light)] text-[length:var(--font-size-body-s)]">
                              {s.เหตุผล || "-"}
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
                        <th className="p-[var(--spacing-md)] rounded-tl-[var(--radius-md)] cursor-pointer hover:bg-[var(--background-neutral-dark)] transition-colors whitespace-nowrap" onClick={() => requestProjectSort('project_id')}>
                          <div className="flex items-center gap-1">รหัสโครงการ <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                        <th className="p-[var(--spacing-md)] cursor-pointer hover:bg-[var(--background-neutral-dark)] transition-colors whitespace-nowrap min-w-[200px]" onClick={() => requestProjectSort('ชื่อโครงการ')}>
                          <div className="flex items-center gap-1">ชื่อโครงการ <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                        <th className="p-[var(--spacing-md)] cursor-pointer hover:bg-[var(--background-neutral-dark)] transition-colors whitespace-nowrap" onClick={() => requestProjectSort('รายชื่อกระทรวง')}>
                          <div className="flex items-center gap-1">กระทรวง <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                        <th className="p-[var(--spacing-md)] cursor-pointer hover:bg-[var(--background-neutral-dark)] transition-colors whitespace-nowrap" onClick={() => requestProjectSort('รายชื่อหน่วยงาน')}>
                          <div className="flex items-center gap-1">หน่วยงาน <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                        <th className="p-[var(--spacing-md)] rounded-tr-[var(--radius-md)] text-right cursor-pointer hover:bg-[var(--background-neutral-dark)] transition-colors whitespace-nowrap" onClick={() => requestProjectSort('กรอบงบประมาณ')}>
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
