'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClientCard } from './client-card';
import { Icon } from './icon';
import { ui } from './constants';
import type { Client, ServiceStats, ClientCategory } from '@/actions/fn-clients';

interface CategorySectionProps {
  title: string;
  subtitle: string;
  icon: string;
  badgeColor: string;
  clients: Client[];
  serviceBreakdown: ServiceStats[];
  naturalPersonsCount?: number;
  category: ClientCategory;
}

// Colors from global.css (recharts needs hex/rgb)
const SERVICE_HEX_COLORS = {
  tech: '#0891b2', // --tech light mode
  infra: '#e11d48', // --infra light mode
  digital: '#ea580c', // --digital light mode
};

export const CategorySection = ({ title, subtitle, icon, badgeColor, clients, serviceBreakdown, naturalPersonsCount }: CategorySectionProps) => {
  const pieData = useMemo(() => {
    return serviceBreakdown.filter((s) => s.count > 0).map((s) => ({ name: s.label, value: s.count, color: SERVICE_HEX_COLORS[s.service as keyof typeof SERVICE_HEX_COLORS] || s.color }));
  }, [serviceBreakdown]);

  const totalServices = serviceBreakdown.reduce((acc, s) => acc + s.count, 0);

  return (
    <section data-anim="fade-up">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`rounded-xl p-2.5 ${badgeColor}`}>
            <Icon name={icon} size="md" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <Badge className={`rounded-full ${badgeColor}`}>{clients.length + (naturalPersonsCount || 0)} clientes</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {clients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}

            {naturalPersonsCount && naturalPersonsCount > 0 && (
              <Card className={`rounded-2xl ${ui.glassCard}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-digital/20 flex items-center justify-center text-digital">
                      <Icon name="user" size="md" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Personas Naturales</h3>
                      <p className="text-[10px] text-muted-foreground">Clientes individuales</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">Clientes individuales que confían en nuestros servicios técnicos y de equipamiento.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-digital">{naturalPersonsCount}+</span>
                    <span className="text-xs text-muted-foreground">clientes atendidos</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <Card className={`rounded-2xl ${ui.glassCard} h-full`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Icon name="pie-chart" size="sm" className="text-muted-foreground" />
                Distribución por Línea
              </CardTitle>
            </CardHeader>
            <CardContent>
              {totalServices > 0 ? (
                <>
                  <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value" strokeWidth={0}>
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2 mt-4">
                    {serviceBreakdown.map((service) => (
                      <div key={service.service} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SERVICE_HEX_COLORS[service.service as keyof typeof SERVICE_HEX_COLORS] }} />
                          <span className="text-muted-foreground">{service.label}</span>
                        </div>
                        <span className="font-semibold text-foreground">{service.count}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">Sin datos disponibles</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
